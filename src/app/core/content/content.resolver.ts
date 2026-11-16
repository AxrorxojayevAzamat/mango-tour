import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import type { SiteContent } from '../../../content/content.model';
import { LanguageService } from '../i18n/language.service';
import { SeoService } from '../seo/seo.service';
import { DEFAULT_LANG, Lang, isLang } from '../i18n/languages';

/** One lazy chunk per language: a visitor only downloads the text they read. */
export const CONTENT_LOADERS: Readonly<Record<Lang, () => Promise<SiteContent>>> = {
  uz: () => import('../../../content/uz').then((m) => m.uz),
  en: () => import('../../../content/en').then((m) => m.en),
  ru: () => import('../../../content/ru').then((m) => m.ru),
};

/**
 * Resolves the `:lang` route: activates the language and loads its content.
 * The result is bound to `HomePage.content` via `withComponentInputBinding()`.
 */
export const contentResolver: ResolveFn<SiteContent> = (route) => {
  const lang = route.paramMap.get('lang');
  if (!isLang(lang)) {
    const router = inject(Router);
    return new RedirectCommand(router.parseUrl(`/${DEFAULT_LANG}`));
  }
  inject(LanguageService).use(lang);
  const seo = inject(SeoService);
  return CONTENT_LOADERS[lang]().then((content) => {
    seo.apply(lang, content);
    return content;
  });
};
