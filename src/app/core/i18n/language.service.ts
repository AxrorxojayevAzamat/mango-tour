import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core';
import { DEFAULT_LANG, LANG_META, Lang } from './languages';

/** Single source of truth for the active site language. Set by the language route. */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly current = signal<Lang>(DEFAULT_LANG);

  readonly lang = this.current.asReadonly();

  constructor() {
    // Runs during prerender too, so the static HTML ships with the right <html lang>.
    effect(() => {
      this.document.documentElement.lang = LANG_META[this.current()].htmlLang;
    });
  }

  use(lang: Lang): void {
    this.current.set(lang);
  }
}
