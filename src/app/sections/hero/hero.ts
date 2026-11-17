import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { HeroContent } from '../../../content/content.model';
import { SECTION_IDS, STAT_IDS } from '../../../content/ids';
import { isPlaceholder } from '../../../content/placeholder';
import { SITE_CONFIG } from '../../../content/site-config';
import { Lang } from '../../core/i18n/languages';
import { Button } from '../../shared/button/button';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage, Button, Icon],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  readonly lang = input.required<Lang>();
  readonly content = input.required<HeroContent>();

  protected readonly stats = SITE_CONFIG.stats;
  /** Placeholder numbers (`XX`) stay hidden until the client provides real ones. */
  protected readonly statIds = STAT_IDS.filter((id) => !isPlaceholder(this.stats[id]));
  protected readonly image = SITE_CONFIG.images.hero;
  protected readonly formAnchor = SECTION_IDS.leadForm;
}
