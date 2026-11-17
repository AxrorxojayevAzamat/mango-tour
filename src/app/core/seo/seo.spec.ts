import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { en } from '../../../content/en';
import { ru } from '../../../content/ru';
import { uz } from '../../../content/uz';
import { SeoService } from './seo.service';
import { isPlaceholder } from '../../../content/placeholder';
import { buildStructuredData, serializeJsonLd } from './structured-data';

const SITE = 'https://mango-tour.pages.dev';

type Graph = { '@graph': Record<string, unknown>[] };
const node = (data: object, type: string) =>
  (data as Graph)['@graph'].find((n) => n['@type'] === type)!;

describe('isPlaceholder', () => {
  it.each([
    ['+998 (XX) XXX-XX-XX', true],
    ['info@example.com', true],
    ['https://t.me/', true],
    ['https://www.instagram.com/', true],
    ['https://www.instagram.com/mango_tour', false],
    ['+998901234567', false],
  ])('%s → %s', (value, expected) => {
    expect(isPlaceholder(value)).toBe(expected);
  });
});

describe('buildStructuredData', () => {
  const data = buildStructuredData(SITE, 'en', en);

  it('describes the agency with real registration data only', () => {
    const agency = node(data, 'TravelAgency');
    expect(agency['name']).toBe('mango_tour');
    expect(agency['legalName']).toBe('MANGOTOUR TRAVEL MChJ');
    expect(agency['taxID']).toBe('313479851');
    expect(agency['url']).toBe(`${SITE}/en`);
    expect(agency['address']).toEqual(expect.objectContaining({ addressCountry: 'UZ' }));
    // Phone, e-mail and socials are still placeholders → left out entirely.
    expect(agency).not.toHaveProperty('telephone');
    expect(agency).not.toHaveProperty('email');
    expect(agency).not.toHaveProperty('sameAs');
  });

  it('lists all 8 FAQ entries in the page language', () => {
    const faq = node(buildStructuredData(SITE, 'ru', ru), 'FAQPage');
    const entries = faq['mainEntity'] as { name: string; acceptedAnswer: { text: string } }[];
    expect(entries).toHaveLength(8);
    expect(entries[0].name).toBe(ru.faq.items.visa.question);
    expect(entries[0].acceptedAnswer.text).toBe(ru.faq.items.visa.answer);
    expect(faq['inLanguage']).toBe('ru');
  });

  it('serializes safely for an inline <script>', () => {
    expect(serializeJsonLd({ a: '</script><script>alert(1)' })).not.toContain('</script>');
  });
});

describe('SeoService', () => {
  function apply(lang: 'uz' | 'en' | 'ru', content = { uz, en, ru }[lang]) {
    const doc = TestBed.inject(DOCUMENT);
    TestBed.inject(SeoService).apply(lang, content, SITE);
    const attr = (selector: string, name: string) =>
      doc.head.querySelector(selector)?.getAttribute(name) ?? null;
    return { doc, attr };
  }

  it('sets title, description, canonical and Open Graph for the page', () => {
    const { doc, attr } = apply('uz');
    expect(doc.title).toBe(uz.meta.title);
    expect(attr('meta[name="description"]', 'content')).toBe(uz.meta.description);
    expect(attr('link[rel="canonical"]', 'href')).toBe(`${SITE}/uz`);
    expect(attr('meta[property="og:url"]', 'content')).toBe(`${SITE}/uz`);
    expect(attr('meta[property="og:image"]', 'content')).toBe(`${SITE}/og-image.png`);
    expect(attr('meta[property="og:locale"]', 'content')).toBe('uz_UZ');
    expect(attr('meta[name="twitter:card"]', 'content')).toBe('summary_large_image');
  });

  it('links every language version plus x-default', () => {
    const { doc } = apply('ru');
    const alternates = [...doc.head.querySelectorAll('link[rel="alternate"]')].map(
      (l) => `${l.getAttribute('hreflang')}=${l.getAttribute('href')}`,
    );
    expect(alternates).toEqual([
      `uz=${SITE}/uz`,
      `en=${SITE}/en`,
      `ru=${SITE}/ru`,
      `x-default=${SITE}/uz`,
    ]);
  });

  it('replaces its tags instead of duplicating them on language change', () => {
    apply('uz');
    const { doc, attr } = apply('en');
    expect(doc.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(doc.head.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1);
    expect(doc.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(attr('link[rel="canonical"]', 'href')).toBe(`${SITE}/en`);
  });
});
