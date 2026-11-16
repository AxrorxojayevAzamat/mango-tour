export const LANGS = ['uz', 'en', 'ru'] as const;

export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = 'uz';

/** BCP 47 tags for <html lang>, hreflang and og:locale. */
export const LANG_META: Record<Lang, { htmlLang: string; ogLocale: string; label: string }> = {
  uz: { htmlLang: 'uz-Latn', ogLocale: 'uz_UZ', label: 'O‘zbekcha' },
  en: { htmlLang: 'en', ogLocale: 'en_US', label: 'English' },
  ru: { htmlLang: 'ru', ogLocale: 'ru_RU', label: 'Русский' },
};

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANGS as readonly string[]).includes(value);
}
