import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import type { SiteContent } from '../../../content/content.model';
import { SITE_CONFIG } from '../../../content/site-config';
import { PUBLIC_ENV } from '../config/public-env.generated';
import { DEFAULT_LANG, LANGS, LANG_META, type Lang } from '../i18n/languages';
import { buildStructuredData, pageUrl, serializeJsonLd } from './structured-data';

/** Every tag this service owns carries this attribute, so a re-apply replaces them cleanly. */
const MARK = 'data-seo';

/**
 * Writes all per-language <head> SEO: title, description, canonical, hreflang alternates,
 * Open Graph, Twitter card and JSON-LD. Runs in the content resolver, so the prerendered
 * HTML of /uz, /en and /ru ships with complete tags (and client navigation updates them).
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);

  apply(lang: Lang, content: SiteContent, siteUrl: string = PUBLIC_ENV.siteUrl): void {
    const { meta } = content;
    const url = pageUrl(siteUrl, lang);
    const image = `${siteUrl}/og-image.png`;
    const head = this.document.head;

    head.querySelectorAll(`[${MARK}]`).forEach((el) => el.remove());
    this.title.setTitle(meta.title);

    const metas: (readonly [attr: 'name' | 'property', key: string, value: string])[] = [
      ['name', 'description', meta.description],
      ['property', 'og:type', 'website'],
      ['property', 'og:site_name', SITE_CONFIG.brandName],
      ['property', 'og:title', meta.ogTitle],
      ['property', 'og:description', meta.ogDescription],
      ['property', 'og:url', url],
      ['property', 'og:image', image],
      ['property', 'og:image:width', '1200'],
      ['property', 'og:image:height', '630'],
      ['property', 'og:image:alt', meta.ogImageAlt],
      ['property', 'og:locale', LANG_META[lang].ogLocale],
      ...LANGS.filter((l) => l !== lang).map(
        (l) => ['property', 'og:locale:alternate', LANG_META[l].ogLocale] as const,
      ),
      ['name', 'twitter:card', 'summary_large_image'],
      ['name', 'twitter:title', meta.ogTitle],
      ['name', 'twitter:description', meta.ogDescription],
      ['name', 'twitter:image', image],
      ['name', 'twitter:image:alt', meta.ogImageAlt],
    ];
    for (const [attr, key, value] of metas) {
      this.append('meta', { [attr]: key, content: value });
    }

    this.append('link', { rel: 'canonical', href: url });
    for (const l of LANGS) {
      this.append('link', {
        rel: 'alternate',
        hreflang: LANG_META[l].hreflang,
        href: pageUrl(siteUrl, l),
      });
    }
    this.append('link', {
      rel: 'alternate',
      hreflang: 'x-default',
      href: pageUrl(siteUrl, DEFAULT_LANG),
    });

    const script = this.append('script', { type: 'application/ld+json' });
    script.textContent = serializeJsonLd(buildStructuredData(siteUrl, lang, content));
  }

  private append(tag: string, attrs: Record<string, string>): HTMLElement {
    const el = this.document.createElement(tag);
    el.setAttribute(MARK, '');
    for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
    this.document.head.appendChild(el);
    return el;
  }
}
