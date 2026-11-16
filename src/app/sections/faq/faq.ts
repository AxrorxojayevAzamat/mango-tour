import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import type { FaqContent } from '../../../content/content.model';
import { FAQ_IDS, FaqId, SECTION_IDS } from '../../../content/ids';
import { Icon } from '../../shared/icon/icon';
import { SectionHeading } from '../../shared/section-heading/section-heading';

/**
 * Accordion built on native <details>/<summary>: keyboard and screen-reader support for free,
 * works before hydration, and `name` makes it exclusive (one answer open at a time).
 */
@Component({
  selector: 'app-faq',
  imports: [Icon, SectionHeading],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Faq {
  readonly content = input.required<FaqContent>();

  protected readonly ids = FAQ_IDS;
  protected readonly anchor = SECTION_IDS.faq;
  /** Mirrors the open state so the chevron can use a flat BEM modifier. */
  protected readonly openId = signal<FaqId | null>(null);

  protected onToggle(id: FaqId, details: HTMLDetailsElement): void {
    if (details.open) {
      this.openId.set(id);
    } else if (this.openId() === id) {
      this.openId.set(null);
    }
  }
}
