import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { FloatingContactsContent } from '../../../content/content.model';
import { SITE_CONFIG } from '../../../content/site-config';
import { Icon } from '../../shared/icon/icon';

/** Telegram + WhatsApp shortcuts pinned to the bottom-right corner. */
@Component({
  selector: 'app-floating-contacts',
  imports: [Icon],
  templateUrl: './floating-contacts.html',
  styleUrl: './floating-contacts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingContacts {
  readonly content = input.required<FloatingContactsContent>();
  /** Hidden while the full-screen mobile menu is open. */
  readonly hidden = input(false);

  protected readonly social = SITE_CONFIG.social;
}
