import { TestBed } from '@angular/core/testing';
import { en } from '../../../content/en';
import { uz } from '../../../content/uz';
import { LeadPrefillService } from '../../core/lead/lead-prefill.service';
import type { LeadApiResponse } from '../../core/lead/lead-rules';
import { TurnstileService, type TurnstileOptions } from '../../core/turnstile/turnstile.service';
import { LeadForm } from './lead-form';

/** Turnstile stand-in: renders instantly and lets the test "solve" the challenge. */
class FakeTurnstile {
  options: TurnstileOptions | null = null;
  resets = 0;
  load() {
    return Promise.resolve({
      render: (_el: HTMLElement, options: TurnstileOptions) => {
        this.options = options;
        return 'widget-1';
      },
      reset: () => void this.resets++,
      remove: () => undefined,
    });
  }
  solve(token = 'token-1') {
    this.options?.callback?.(token);
  }
}

const tick = () => new Promise((resolve) => setTimeout(resolve));

async function setup(lang: 'uz' | 'en' = 'uz') {
  const turnstile = new FakeTurnstile();
  // jsdom: make the captcha load immediately instead of waiting for intersection.
  vi.stubGlobal('IntersectionObserver', undefined);
  window.turnstile = undefined;
  TestBed.configureTestingModule({
    providers: [{ provide: TurnstileService, useValue: turnstile }],
  });
  const fixture = TestBed.createComponent(LeadForm);
  const content = lang === 'uz' ? uz : en;
  fixture.componentRef.setInput('lang', lang);
  fixture.componentRef.setInput('content', content.leadForm);
  fixture.componentRef.setInput('cities', content.cities);
  fixture.componentRef.setInput('countries', content.countries);
  fixture.detectChanges();
  await fixture.whenStable();
  await tick();
  const el: HTMLElement = fixture.nativeElement;
  const type = (id: string, value: string) => {
    const input = el.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${id}`)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
  };
  const submit = async () => {
    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    await tick();
    await tick();
    fixture.detectChanges();
  };
  return { fixture, el, turnstile, type, submit };
}

function mockFetch(response: LeadApiResponse) {
  const fetch = vi.fn().mockResolvedValue({ json: async () => response });
  vi.stubGlobal('fetch', fetch);
  return fetch;
}

describe('LeadForm', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('lists every city and country plus "Other" in the destination select', async () => {
    const { el } = await setup();
    const values = [...el.querySelectorAll('option')].map((o) => o.value);
    expect(values).toHaveLength(1 + 7 + 4 + 1);
    expect(values[0]).toBe('');
    expect(values).toContain('samarkand');
    expect(values).toContain('tajikistan');
    expect(values.at(-1)).toBe('other');
  });

  it('renders Turnstile with the dark theme and the page language', async () => {
    const { turnstile } = await setup('en');
    expect(turnstile.options?.theme).toBe('dark');
    expect(turnstile.options?.language).toBe('en');
    expect(turnstile.options?.sitekey.length).toBeGreaterThan(0);
  });

  it('shows localized errors only after submit, and does not call the API', async () => {
    const fetch = mockFetch({ ok: true });
    const { el, submit } = await setup();
    expect(el.querySelector('.lead-form__error')).toBeNull();

    await submit();
    const errors = [...el.querySelectorAll('.lead-form__error')].map((e) => e.textContent?.trim());
    expect(errors).toContain(uz.leadForm.errors.required); // name + phone
    expect(errors).toContain(uz.leadForm.errors.captcha);
    expect(el.querySelector('#lead-name')!.getAttribute('aria-invalid')).toBe('true');
    expect(el.querySelector('#lead-name')!.getAttribute('aria-describedby')).toBe(
      'lead-name-error',
    );
    expect(document.activeElement?.id).toBe('lead-name');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('validates the phone number with the shared rules', async () => {
    const { el, fixture, type } = await setup('en');
    type('lead-phone', '+998 90 12');
    fixture.detectChanges();
    expect(el.querySelector('#lead-phone-error')!.textContent).toContain(
      en.leadForm.errors.phoneInvalid,
    );
  });

  it('sends a valid lead with the Turnstile token and shows the success state', async () => {
    const fetch = mockFetch({ ok: true });
    const { el, fixture, turnstile, type, submit } = await setup();
    type('lead-name', 'Aziza');
    type('lead-phone', '+998901234567');
    turnstile.solve('token-abc');
    fixture.detectChanges();

    await submit();
    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe('/api/lead');
    expect(JSON.parse(init.body)).toEqual({
      name: 'Aziza',
      phone: '+998 (90) 123-45-67',
      email: '',
      destination: '',
      comment: '',
      website: '',
      lang: 'uz',
      turnstileToken: 'token-abc',
    });
    expect(el.querySelector('.lead-form__result')!.textContent).toContain(
      uz.leadForm.success.title,
    );
    expect(el.querySelector('form')!.hidden).toBe(true);
    expect(turnstile.resets).toBe(1);
  });

  it('shows the failure alert and a retry label when the API fails', async () => {
    mockFetch({ ok: false, error: 'delivery_failed' });
    const { el, fixture, turnstile, type, submit } = await setup();
    type('lead-name', 'Aziza');
    type('lead-phone', '+998901234567');
    turnstile.solve();
    fixture.detectChanges();

    await submit();
    expect(el.querySelector('.lead-form__alert')!.textContent).toContain(uz.leadForm.failure.title);
    expect(el.querySelector('button[type="submit"]')!.textContent).toContain(
      uz.leadForm.failure.retry,
    );
    // The form keeps what the visitor typed.
    expect(el.querySelector<HTMLInputElement>('#lead-name')!.value).toBe('Aziza');
  });

  it('maps server-side field errors onto the inputs', async () => {
    mockFetch({ ok: false, error: 'validation', fields: { email: 'invalid' } });
    const { el, fixture, turnstile, type, submit } = await setup('en');
    type('lead-name', 'Emma');
    type('lead-phone', '+447700900123');
    type('lead-email', 'emma@example.co'); // passes client rules, server says no
    turnstile.solve();
    fixture.detectChanges();

    await submit();
    expect(el.querySelector('#lead-email-error')!.textContent).toContain(
      en.leadForm.errors.emailInvalid,
    );
  });

  it('applies a city card hand-off: destination + comment', async () => {
    const { el, fixture } = await setup();
    TestBed.inject(LeadPrefillService).request('khiva', 'Xiva bo‘yicha konsultatsiya olmoqchiman.');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(el.querySelector<HTMLSelectElement>('#lead-destination')!.value).toBe('khiva');
    expect(el.querySelector<HTMLTextAreaElement>('#lead-comment')!.value).toBe(
      'Xiva bo‘yicha konsultatsiya olmoqchiman.',
    );
  });

  it('formats the phone as it is typed', async () => {
    const { el, fixture, type } = await setup();
    type('lead-phone', '998901234567');
    fixture.detectChanges();
    expect(el.querySelector<HTMLInputElement>('#lead-phone')!.value).toBe('+998 (90) 123-45-67');
  });
});
