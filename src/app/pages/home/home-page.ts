import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import type { SiteContent } from '../../../content/content.model';
import { SECTION_IDS } from '../../../content/ids';
import { Lang } from '../../core/i18n/languages';
import { Footer } from '../../sections/footer/footer';
import { Header } from '../../sections/header/header';
import { Hero } from '../../sections/hero/hero';

/** The whole landing page for one language. */
@Component({
  selector: 'app-home-page',
  imports: [Header, Hero, Footer],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  /** Bound from the `:lang` route param; validated by `langMatchGuard`. */
  readonly lang = input.required<Lang>();
  /** Bound from `contentResolver`. */
  readonly content = input.required<SiteContent>();

  /** While the mobile menu is open, everything behind it is `inert`. */
  protected readonly menuOpen = signal(false);

  /** TEMPORARY (stage 4 replaces these with real section components). */
  protected readonly pendingSections = computed(() => {
    const c = this.content();
    return [
      { id: SECTION_IDS.whyUs, heading: c.whyUs },
      { id: SECTION_IDS.services, heading: c.services },
      { id: SECTION_IDS.reasons, heading: c.reasons },
      { id: SECTION_IDS.cities, heading: c.cities },
      { id: SECTION_IDS.countries, heading: c.countries },
      { id: SECTION_IDS.gallery, heading: c.gallery },
      { id: SECTION_IDS.leadForm, heading: c.leadForm },
      { id: SECTION_IDS.faq, heading: c.faq },
    ];
  });
}
