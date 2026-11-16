import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { ICONS, IconName } from './icons';

/**
 * Decorative inline SVG icon. Always `aria-hidden`: the accessible name belongs to the
 * surrounding link/button. Size with `--icon-size` (default 1.5rem) or a class on the host.
 */
@Component({
  selector: 'app-icon',
  template: `
    <svg
      class="icon__svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      @for (d of paths(); track $index) {
        <path [attr.d]="d" />
      }
    </svg>
  `,
  styleUrl: './icon.scss',
  host: { class: 'icon' },
  // The host element IS the BEM block, so styles must reach it: BEM names keep them scoped.
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  readonly name = input.required<IconName>();
  protected readonly paths = computed(() => ICONS[this.name()]);
}
