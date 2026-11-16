import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { CardSection } from '../../../content/content.model';
import { ADVANTAGE_IDS, AdvantageId, SECTION_IDS } from '../../../content/ids';
import { Icon } from '../../shared/icon/icon';
import type { IconName } from '../../shared/icon/icons';
import { Reveal } from '../../shared/reveal/reveal';
import { SectionHeading } from '../../shared/section-heading/section-heading';

const ICON_BY_ADVANTAGE: Record<AdvantageId, IconName> = {
  experience: 'compass',
  personalRoutes: 'route',
  safety: 'shield',
  culture: 'teapot',
};

@Component({
  selector: 'app-why-us',
  imports: [Icon, Reveal, SectionHeading],
  templateUrl: './why-us.html',
  styleUrl: './why-us.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhyUs {
  readonly content = input.required<CardSection<AdvantageId>>();

  protected readonly ids = ADVANTAGE_IDS;
  protected readonly icons = ICON_BY_ADVANTAGE;
  protected readonly anchor = SECTION_IDS.whyUs;
}
