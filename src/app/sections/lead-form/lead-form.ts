import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import type { LeadFormContent, PlaceSection } from '../../../content/content.model';
import {
  CITY_IDS,
  COUNTRY_IDS,
  CityId,
  CountryId,
  DestinationId,
  SECTION_IDS,
} from '../../../content/ids';
import { PUBLIC_ENV } from '../../core/config/public-env.generated';
import { fill } from '../../core/i18n/fill';
import { Lang } from '../../core/i18n/languages';
import { LeadPrefillService } from '../../core/lead/lead-prefill.service';
import {
  LEAD_ENDPOINT,
  LEAD_LIMITS,
  LeadApiResponse,
  LeadField,
  LeadFieldError,
  LeadRequest,
  checkComment,
  checkEmail,
  checkName,
  checkPhone,
} from '../../core/lead/lead-rules';
import { TurnstileApi, TurnstileService } from '../../core/turnstile/turnstile.service';
import { Button } from '../../shared/button/button';
import { Icon } from '../../shared/icon/icon';
import { PhoneMask } from '../../shared/phone-mask/phone-mask';
import { SectionHeading } from '../../shared/section-heading/section-heading';

type Status = 'idle' | 'submitting' | 'success' | 'error';
type FormField = 'name' | 'phone' | 'email' | 'destination' | 'comment';

const FIELD_ORDER: readonly FormField[] = ['name', 'phone', 'email', 'destination', 'comment'];
const MAX_LENGTH: Partial<Record<FormField, number>> = {
  name: LEAD_LIMITS.nameMax,
  email: LEAD_LIMITS.emailMax,
  comment: LEAD_LIMITS.commentMax,
};
const REQUEST_TIMEOUT_MS = 15_000;

/** Adapts a shared rule (`checkName`, …) to an Angular validator: `{ <errorCode>: true }`. */
const rule =
  (check: (value: string) => LeadFieldError | null): ValidatorFn =>
  (control: AbstractControl<string>) => {
    const error = check(control.value);
    return error ? { [error]: true } : null;
  };

@Component({
  selector: 'app-lead-form',
  imports: [ReactiveFormsModule, Button, Icon, PhoneMask, SectionHeading],
  templateUrl: './lead-form.html',
  styleUrl: './lead-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadForm {
  readonly lang = input.required<Lang>();
  readonly content = input.required<LeadFormContent>();
  /** For destination names in the select. */
  readonly cities = input.required<PlaceSection<CityId>>();
  readonly countries = input.required<PlaceSection<CountryId>>();

  private readonly document = inject(DOCUMENT);
  private readonly turnstile = inject(TurnstileService);

  protected readonly anchor = SECTION_IDS.leadForm;
  protected readonly limits = LEAD_LIMITS;

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', rule(checkName)],
    phone: ['+998 ', rule(checkPhone)],
    email: ['', rule(checkEmail)],
    destination: ['' as DestinationId | ''],
    comment: ['', rule(checkComment)],
    /** Honeypot — hidden from people. */
    website: [''],
  });

  protected readonly status = signal<Status>('idle');
  protected readonly failure = signal<'general' | 'captcha'>('general');
  /** Errors show after a field is touched OR after the first submit attempt. */
  protected readonly submitted = signal(false);
  protected readonly captchaToken = signal('');

  protected readonly cityOptions = computed(() =>
    CITY_IDS.map((id) => ({ id, name: this.cities().items[id].name })),
  );
  protected readonly countryOptions = computed(() =>
    COUNTRY_IDS.map((id) => ({ id, name: this.countries().items[id].name })),
  );

  /** Only after a submit attempt — never shout at a visitor who has not done anything yet. */
  protected readonly showCaptchaError = computed(() => this.submitted() && !this.captchaToken());

  private readonly captchaBox = viewChild.required<ElementRef<HTMLElement>>('captcha');
  private readonly successBox = viewChild<ElementRef<HTMLElement>>('success');
  private captchaApi: TurnstileApi | null = null;
  private widgetId: string | null = null;

  constructor() {
    const destroyRef = inject(DestroyRef);
    const prefill = inject(LeadPrefillService);

    // City/country card → "Get a consultation": pre-select the destination, pre-write the comment.
    effect(() => {
      const request = prefill.pending();
      if (!request) return;
      untracked(() => {
        this.form.patchValue({ destination: request.destination, comment: request.comment });
        if (this.status() === 'success') this.status.set('idle');
        const view = this.document.defaultView;
        // Desktop only: on touch screens focusing would pop the keyboard mid-scroll.
        if (typeof view?.matchMedia === 'function' && view.matchMedia('(pointer: fine)').matches) {
          this.document.getElementById('lead-name')?.focus({ preventScroll: true });
        }
      });
    });

    // Load Turnstile only when the form gets close to the viewport.
    afterNextRender(() => {
      const view = this.document.defaultView;
      const box = this.captchaBox().nativeElement;
      if (!view || typeof view.IntersectionObserver !== 'function') {
        void this.renderCaptcha();
        return;
      }
      const observer = new view.IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          observer.disconnect();
          void this.renderCaptcha();
        },
        { rootMargin: '600px 0px' },
      );
      observer.observe(box);
      destroyRef.onDestroy(() => {
        observer.disconnect();
        if (this.widgetId) this.captchaApi?.remove(this.widgetId);
      });
    });
  }

  /** Localized message for a field, or null while it should not be shown. */
  protected errorFor(field: FormField): string | null {
    const control = this.form.controls[field];
    if (!control.invalid || !(control.touched || this.submitted())) return null;
    const code = Object.keys(control.errors ?? {})[0] as LeadFieldError | undefined;
    const errors = this.content().errors;
    switch (code) {
      case 'required':
        return errors.required;
      case 'tooShort':
        return fill(errors.nameTooShort, { min: LEAD_LIMITS.nameMin });
      case 'tooLong':
        return fill(errors.tooLong, { max: MAX_LENGTH[field] ?? LEAD_LIMITS.commentMax });
      case 'invalid':
        return field === 'phone' ? errors.phoneInvalid : errors.emailInvalid;
      default:
        return null;
    }
  }

  protected async submit(): Promise<void> {
    if (this.status() === 'submitting') return;
    this.submitted.set(true);
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.focusFirstInvalid();
      return;
    }
    if (!this.captchaToken()) return;

    this.status.set('submitting');
    const value = this.form.getRawValue();
    const body: LeadRequest = { ...value, lang: this.lang(), turnstileToken: this.captchaToken() };

    let response: LeadApiResponse;
    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      response = (await res.json()) as LeadApiResponse;
    } catch {
      response = { ok: false, error: 'delivery_failed' };
    }

    // A Turnstile token is single-use: always get a fresh one for the next attempt.
    this.resetCaptcha();

    if (response.ok) {
      this.status.set('success');
      this.submitted.set(false);
      this.form.reset();
      setTimeout(() => this.successBox()?.nativeElement.focus());
      return;
    }
    if (response.error === 'validation' && response.fields) {
      this.applyServerErrors(response.fields);
      this.status.set('idle');
      return;
    }
    this.failure.set(response.error === 'captcha' ? 'captcha' : 'general');
    this.status.set('error');
  }

  protected again(): void {
    this.status.set('idle');
    setTimeout(() => this.document.getElementById('lead-name')?.focus());
  }

  private applyServerErrors(fields: Partial<Record<LeadField, LeadFieldError>>): void {
    for (const field of FIELD_ORDER) {
      const code = fields[field];
      if (code) this.form.controls[field].setErrors({ [code]: true });
    }
    this.focusFirstInvalid();
  }

  private focusFirstInvalid(): void {
    const first = FIELD_ORDER.find((f) => this.form.controls[f].invalid);
    if (first) this.document.getElementById(`lead-${first}`)?.focus();
  }

  private async renderCaptcha(): Promise<void> {
    try {
      const api = await this.turnstile.load();
      this.captchaApi = api;
      const lang = this.lang();
      this.widgetId = api.render(this.captchaBox().nativeElement, {
        sitekey: PUBLIC_ENV.turnstileSiteKey,
        theme: 'dark',
        size: 'flexible',
        language: lang === 'uz' ? 'auto' : lang,
        callback: (token) => this.captchaToken.set(token),
        'expired-callback': () => this.captchaToken.set(''),
        'error-callback': () => this.captchaToken.set(''),
      });
    } catch {
      // Script blocked or offline: the token stays empty, so submitting shows the captcha error.
    }
  }

  private resetCaptcha(): void {
    this.captchaToken.set('');
    if (this.widgetId) this.captchaApi?.reset(this.widgetId);
  }
}
