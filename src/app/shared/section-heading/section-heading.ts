import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { SectionHeading as SectionHeadingContent } from '../../../content/content.model';

/**
 * Eyebrow + h2 + subtitle used at the top of every section.
 * `titleId` lets the parent <section> reference the heading via `aria-labelledby`.
 */
@Component({
  selector: 'app-section-heading',
  template: `
    @let h = heading();
    <div class="section-heading" [class.section-heading--center]="align() === 'center'">
      <p class="section-heading__eyebrow">{{ h.eyebrow }}</p>
      <h2 class="section-heading__title" [id]="titleId()">{{ h.title }}</h2>
      <p class="section-heading__subtitle">{{ h.subtitle }}</p>
    </div>
  `,
  styleUrl: './section-heading.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeading {
  readonly heading = input.required<SectionHeadingContent>();
  readonly titleId = input.required<string>();
  readonly align = input<'start' | 'center'>('start');
}
