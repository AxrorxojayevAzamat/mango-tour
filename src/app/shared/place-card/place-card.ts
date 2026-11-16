import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { PlaceText } from '../../../content/content.model';
import { Icon } from '../icon/icon';

/** Photo card for a city or country with a "get a consultation" link to the lead form. */
@Component({
  selector: 'app-place-card',
  imports: [NgOptimizedImage, Icon],
  templateUrl: './place-card.html',
  styleUrl: './place-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceCard {
  readonly place = input.required<PlaceText>();
  /** Extension-less image base from SITE_CONFIG.images. */
  readonly image = input.required<string>();
  /** `sizes` attribute matching the grid the card sits in. */
  readonly sizes = input.required<string>();
  readonly ctaLabel = input.required<string>();
  /** Lead-form anchor on the current language page, e.g. `/uz#contact`. */
  readonly ctaHref = input.required<string>();
  /** Wider card with a larger photo (first city). */
  readonly featured = input(false);

  /** Fired before the browser follows `ctaHref`, so the form can be pre-filled. */
  readonly consult = output<void>();
}
