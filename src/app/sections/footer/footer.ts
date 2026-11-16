import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { FooterContent, NavContent } from '../../../content/content.model';
import { NAV_IDS } from '../../../content/ids';
import { IMAGE_CREDITS } from '../../../content/image-credits';
import { SITE_CONFIG } from '../../../content/site-config';
import { fill } from '../../core/i18n/fill';
import { Lang } from '../../core/i18n/languages';
import { Icon } from '../../shared/icon/icon';
import type { IconName } from '../../shared/icon/icons';

interface SocialLink {
  readonly icon: IconName;
  readonly url: string;
  readonly label: string;
}

@Component({
  selector: 'app-footer',
  imports: [NgOptimizedImage, Icon],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  readonly lang = input.required<Lang>();
  readonly content = input.required<FooterContent>();
  /** Menu labels and the Instagram label are shared with the header. */
  readonly nav = input.required<NavContent>();
  /** Telegram/WhatsApp labels, shared with the floating buttons. */
  readonly messengerLabels = input.required<{ telegram: string; whatsapp: string }>();
  /** Fixed at render time; prerendered pages are rebuilt on every deploy. */
  readonly year = input(new Date().getFullYear());

  protected readonly navIds = NAV_IDS;
  /** Photo attributions in page order (hero, cities, countries, gallery). */
  protected readonly credits = (() => {
    const { hero, cities, countries, gallery } = SITE_CONFIG.images;
    const bases = [
      hero,
      ...Object.values(cities),
      ...Object.values(countries),
      ...Object.values(gallery),
    ];
    return bases.flatMap((base) => (IMAGE_CREDITS[base] ? [IMAGE_CREDITS[base]] : []));
  })();
  protected readonly config = SITE_CONFIG;

  protected readonly copyright = computed(() =>
    fill(this.content().copyright, { year: this.year() }),
  );

  protected readonly socials = computed<SocialLink[]>(() => [
    { icon: 'instagram', url: SITE_CONFIG.social.instagramUrl, label: this.nav().instagramLabel },
    {
      icon: 'telegram',
      url: SITE_CONFIG.social.telegramUrl,
      label: this.messengerLabels().telegram,
    },
    {
      icon: 'whatsapp',
      url: SITE_CONFIG.social.whatsappUrl,
      label: this.messengerLabels().whatsapp,
    },
  ]);

  protected href(anchor: string): string {
    return `/${this.lang()}#${anchor}`;
  }
}
