import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import type { SiteContent } from '../../../content/content.model';
import { SECTION_IDS } from '../../../content/ids';
import { Lang } from '../../core/i18n/languages';
import { Destinations } from '../../sections/destinations/destinations';
import { Faq } from '../../sections/faq/faq';
import { FloatingContacts } from '../../sections/floating-contacts/floating-contacts';
import { Footer } from '../../sections/footer/footer';
import { Gallery } from '../../sections/gallery/gallery';
import { Header } from '../../sections/header/header';
import { Hero } from '../../sections/hero/hero';
import { Reasons } from '../../sections/reasons/reasons';
import { Services } from '../../sections/services/services';
import { WhyUs } from '../../sections/why-us/why-us';
import { SectionHeading } from '../../shared/section-heading/section-heading';

/** The whole landing page for one language, top to bottom. */
@Component({
  selector: 'app-home-page',
  imports: [
    Header,
    Hero,
    WhyUs,
    Services,
    Reasons,
    Destinations,
    Gallery,
    Faq,
    Footer,
    FloatingContacts,
    SectionHeading,
  ],
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

  protected readonly formAnchor = SECTION_IDS.leadForm;
}
