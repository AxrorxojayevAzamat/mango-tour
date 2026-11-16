import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { CardSection } from '../../../content/content.model';
import { REASON_IDS, ReasonId, SECTION_IDS } from '../../../content/ids';
import { SectionHeading } from '../../shared/section-heading/section-heading';

@Component({
  selector: 'app-reasons',
  imports: [SectionHeading],
  templateUrl: './reasons.html',
  styleUrl: './reasons.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Reasons {
  readonly content = input.required<CardSection<ReasonId>>();

  protected readonly ids = REASON_IDS;
  protected readonly anchor = SECTION_IDS.reasons;

  protected number(index: number): string {
    return String(index + 1).padStart(2, '0');
  }
}
