import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import type { PlaceSection, PlaceText } from '../../../content/content.model';
import { CITY_IDS, COUNTRY_IDS, DestinationId, SECTION_IDS } from '../../../content/ids';
import { SITE_CONFIG } from '../../../content/site-config';
import { fill } from '../../core/i18n/fill';
import { Lang } from '../../core/i18n/languages';
import { LeadPrefillService } from '../../core/lead/lead-prefill.service';
import { PlaceCard } from '../../shared/place-card/place-card';
import { SectionHeading } from '../../shared/section-heading/section-heading';

export type DestinationKind = 'cities' | 'countries';

interface DestinationItem {
  readonly id: DestinationId;
  readonly place: PlaceText;
  readonly image: string;
  readonly featured: boolean;
  readonly sizes: string;
}

const SIZES = {
  regular: '(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw',
  featured: '(min-width: 1024px) 50vw, 100vw',
};

/** "Cities of Uzbekistan" and "Central Asian countries": photo cards linking to the lead form. */
@Component({
  selector: 'app-destinations',
  imports: [PlaceCard, SectionHeading],
  templateUrl: './destinations.html',
  styleUrl: './destinations.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Destinations {
  readonly kind = input.required<DestinationKind>();
  readonly lang = input.required<Lang>();
  readonly content = input.required<PlaceSection<string>>();

  private readonly prefill = inject(LeadPrefillService);

  protected readonly anchor = computed(() => SECTION_IDS[this.kind()]);
  protected readonly formHref = computed(() => `/${this.lang()}#${SECTION_IDS.leadForm}`);

  protected readonly items = computed<DestinationItem[]>(() => {
    const kind = this.kind();
    const images: Record<string, string> = SITE_CONFIG.images[kind];
    const ids: readonly DestinationId[] = kind === 'cities' ? CITY_IDS : COUNTRY_IDS;
    return ids.map((id, index) => {
      const featured = kind === 'cities' && index === 0;
      return {
        id,
        place: this.content().items[id],
        image: images[id],
        featured,
        sizes: featured ? SIZES.featured : SIZES.regular,
      };
    });
  });

  protected consult(item: DestinationItem): void {
    this.prefill.request(item.id, fill(this.content().commentTemplate, { name: item.place.name }));
  }
}
