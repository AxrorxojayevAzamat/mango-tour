import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import type { FloatingContactsContent } from '../../../content/content.model';
import { SECTION_IDS } from '../../../content/ids';
import { SITE_CONFIG } from '../../../content/site-config';
import { Icon } from '../../shared/icon/icon';

/**
 * Telegram + WhatsApp shortcuts pinned to the bottom-right corner. They step aside while the
 * lead form is on screen (they would cover its fields on phones, and the visitor is already
 * where they need to be) and while the mobile menu is open.
 */
@Component({
  selector: 'app-floating-contacts',
  imports: [Icon],
  templateUrl: './floating-contacts.html',
  styleUrl: './floating-contacts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingContacts {
  readonly content = input.required<FloatingContactsContent>();
  /** Set by the page while the full-screen mobile menu is open. */
  readonly hidden = input(false);

  protected readonly social = SITE_CONFIG.social;
  private readonly formOnScreen = signal(false);
  protected readonly concealed = computed(() => this.hidden() || this.formOnScreen());

  constructor() {
    const document = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const view = document.defaultView;
      const form = document.getElementById(SECTION_IDS.leadForm);
      if (!view || !form || typeof view.IntersectionObserver !== 'function') return;
      const observer = new view.IntersectionObserver(
        ([entry]) => this.formOnScreen.set(entry.isIntersecting),
        { threshold: 0.1 },
      );
      observer.observe(form);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
