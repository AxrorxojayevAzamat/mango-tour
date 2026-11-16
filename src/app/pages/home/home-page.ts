import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/i18n/language.service';
import { LANGS, LANG_META, Lang } from '../../core/i18n/languages';

/**
 * Landing page for one language. Stage 1 placeholder: proves routing, prerender,
 * tokens, font and logo. Sections are composed here in later stages.
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

  protected readonly langs = LANGS;
  protected readonly langMeta = LANG_META;

  constructor() {
    const language = inject(LanguageService);
    effect(() => language.use(this.lang()));
  }
}
