import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { CardSection } from '../../../content/content.model';
import { SECTION_IDS, SERVICE_IDS, ServiceId } from '../../../content/ids';
import { Icon } from '../../shared/icon/icon';
import type { IconName } from '../../shared/icon/icons';
import { Reveal } from '../../shared/reveal/reveal';
import { SectionHeading } from '../../shared/section-heading/section-heading';

const ICON_BY_SERVICE: Record<ServiceId, IconName> = {
  tours: 'suitcase',
  hotels: 'bed',
  insurance: 'shield-plus',
  transfers: 'car',
  tickets: 'ticket',
};

@Component({
  selector: 'app-services',
  imports: [Icon, Reveal, SectionHeading],
  templateUrl: './services.html',
  styleUrl: './services.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Services {
  readonly content = input.required<CardSection<ServiceId>>();

  protected readonly ids = SERVICE_IDS;
  protected readonly icons = ICON_BY_SERVICE;
  protected readonly anchor = SECTION_IDS.services;
}
