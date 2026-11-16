import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { SiteContent } from '../../../content/content.model';
import { NAV_IDS } from '../../../content/ids';
import { SITE_CONFIG } from '../../../content/site-config';
import { LANGS, LANG_META, Lang } from '../../core/i18n/languages';

/**
 * Landing page for one language. Until stage 3 it renders a content preview that proves
 * routing, prerender and the typed content files; sections replace it stage by stage.
 */
@Component({
  selector: 'app-home-page',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  /** Bound from the `:lang` route param; validated by `langMatchGuard`. */
  readonly lang = input.required<Lang>();
  /** Bound from `contentResolver`. */
  readonly content = input.required<SiteContent>();

  protected readonly langs = LANGS;
  protected readonly langMeta = LANG_META;
  protected readonly navIds = NAV_IDS;
  protected readonly config = SITE_CONFIG;

  protected readonly sectionTitles = computed(() => {
    const c = this.content();
    return [
      c.whyUs.title,
      c.services.title,
      c.reasons.title,
      c.cities.title,
      c.countries.title,
      c.gallery.title,
      c.leadForm.title,
      c.faq.title,
    ];
  });
}
