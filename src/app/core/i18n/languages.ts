export const LANGS = ['uz', 'en', 'ru'] as const;

export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = 'uz';

/** BCP 47 tags for <html lang>, hreflang (ISO 639-1, what search engines expect) and og:locale. */
export const LANG_META: Record<
  Lang,
  { htmlLang: string; hreflang: string; ogLocale: string; label: string }
> = {
  uz: { htmlLang: 'uz-Latn', hreflang: 'uz', ogLocale: 'uz_UZ', label: 'O‘zbekcha' },
  en: { htmlLang: 'en', hreflang: 'en', ogLocale: 'en_US', label: 'English' },
  ru: { htmlLang: 'ru', hreflang: 'ru', ogLocale: 'ru_RU', label: 'Русский' },
};

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANGS as readonly string[]).includes(value);
}
