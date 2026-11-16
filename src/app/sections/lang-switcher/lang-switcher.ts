import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LANGS, LANG_META, Lang } from '../../core/i18n/languages';

/** UZ / EN / RU segmented switch. Client-side navigation; each target is a prerendered page. */
@Component({
  selector: 'app-lang-switcher',
  imports: [RouterLink],
  templateUrl: './lang-switcher.html',
  styleUrl: './lang-switcher.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangSwitcher {
  readonly current = input.required<Lang>();
  /** Accessible name of the switcher, from content. */
  readonly label = input.required<string>();

  protected readonly langs = LANGS;
  protected readonly meta = LANG_META;
}
