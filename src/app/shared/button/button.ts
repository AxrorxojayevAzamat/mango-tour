import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'ghost';
export type ButtonSize = 'md' | 'lg';

/**
 * Styles a native <a> or <button> as the `button` BEM block, so semantics stay native:
 * `<a app-button href="…">`, `<button app-button type="submit">`.
 */
@Component({
  selector: 'a[app-button], button[app-button]',
  template: '<ng-content />',
  styleUrl: './button.scss',
  host: {
    class: 'button',
    '[class.button--ghost]': 'variant() === "ghost"',
    '[class.button--lg]': 'size() === "lg"',
    '[class.button--block]': 'block()',
  },
  // The host element IS the BEM block, so styles must reach it: BEM names keep them scoped.
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  /** Full width (used on mobile forms). */
  readonly block = input(false);
}
