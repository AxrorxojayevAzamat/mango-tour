import type { SiteContent } from './content.model';
import { en } from './en';
import {
  ADVANTAGE_IDS,
  CITY_IDS,
  COUNTRY_IDS,
  FAQ_IDS,
  GALLERY_IDS,
  NAV_IDS,
  REASON_IDS,
  SERVICE_IDS,
  STAT_IDS,
} from './ids';
import { ru } from './ru';
import { SITE_CONFIG } from './site-config';
import { uz } from './uz';
import { placeholdersOf } from '../app/core/i18n/fill';

const LANGUAGES: Record<string, SiteContent> = { uz, en, ru };

/** Every leaf string with its dotted path. */
function strings(node: unknown, path = ''): [string, string][] {
  if (typeof node === 'string') return [[path, node]];
  if (Array.isArray(node)) return node.flatMap((v, i) => strings(v, `${path}[${i}]`));
  if (node && typeof node === 'object') {
    return Object.entries(node).flatMap(([k, v]) => strings(v, path ? `${path}.${k}` : k));
  }
  return [];
}

/** Structural shape: object keys recursively; arrays and strings collapse to a type tag. */
function shape(node: unknown): unknown {
  if (Array.isArray(node)) return 'array';
  if (node && typeof node === 'object') {
    return Object.fromEntries(
      Object.keys(node)
        .sort()
        .map((k) => [k, shape((node as Record<string, unknown>)[k])]),
    );
  }
  return typeof node;
}

const sorted = (ids: readonly string[]) => [...ids].sort();

describe('site content', () => {
  it('compile-time: an incomplete language object is rejected', () => {
    // @ts-expect-error — `faq` is missing, so this must not type-check as SiteContent.
    const incomplete: SiteContent = { ...uz, faq: undefined };
    expect(incomplete).toBeDefined();
  });

  for (const [lang, content] of Object.entries(LANGUAGES)) {
    describe(lang, () => {
      it('has exactly the same structure as uz', () => {
        expect(shape(content)).toEqual(shape(uz));
      });

      it('has no empty or untrimmed text', () => {
        for (const [path, value] of strings(content)) {
          expect(value.trim(), path).not.toBe('');
          expect(value, path).toBe(value.trim());
        }
      });

      it('contains every item of every fixed list', () => {
        expect(sorted(Object.keys(content.nav.items))).toEqual(sorted(NAV_IDS));
        expect(sorted(Object.keys(content.hero.stats))).toEqual(sorted(STAT_IDS));
        expect(sorted(Object.keys(content.whyUs.items))).toEqual(sorted(ADVANTAGE_IDS));
        expect(sorted(Object.keys(content.services.items))).toEqual(sorted(SERVICE_IDS));
        expect(sorted(Object.keys(content.reasons.items))).toEqual(sorted(REASON_IDS));
        expect(sorted(Object.keys(content.cities.items))).toEqual(sorted(CITY_IDS));
        expect(sorted(Object.keys(content.countries.items))).toEqual(sorted(COUNTRY_IDS));
        expect(sorted(Object.keys(content.gallery.items))).toEqual(sorted(GALLERY_IDS));
        expect(sorted(Object.keys(content.faq.items))).toEqual(sorted(FAQ_IDS));
      });

      it('keeps the counts the brief asks for', () => {
        expect(Object.keys(content.whyUs.items)).toHaveLength(4);
        expect(Object.keys(content.services.items)).toHaveLength(5);
        expect(Object.keys(content.reasons.items)).toHaveLength(6);
        expect(Object.keys(content.cities.items)).toHaveLength(7);
        expect(Object.keys(content.countries.items)).toHaveLength(4);
        expect(Object.keys(content.faq.items)).toHaveLength(8);
      });

      it('uses the placeholders each template needs, and no unknown ones', () => {
        const required: [string, string[]][] = [
          [content.cities.commentTemplate, ['name']],
          [content.countries.commentTemplate, ['name']],
          [content.gallery.lightbox.counter, ['current', 'total']],
          [content.leadForm.errors.nameTooShort, ['min']],
          [content.leadForm.errors.tooLong, ['max']],
          [content.footer.copyright, ['year']],
        ];
        for (const [template, names] of required) {
          expect(sorted(placeholdersOf(template)), template).toEqual(sorted(names));
        }
        const known = new Set(['name', 'current', 'total', 'min', 'max', 'year']);
        for (const [path, value] of strings(content)) {
          for (const name of placeholdersOf(value)) {
            expect(known.has(name), `${path}: {${name}}`).toBe(true);
          }
        }
      });

      it('has SEO-friendly meta lengths', () => {
        expect(content.meta.title.length).toBeLessThanOrEqual(60);
        expect(content.meta.description.length).toBeGreaterThanOrEqual(70);
        expect(content.meta.description.length).toBeLessThanOrEqual(160);
        expect(content.meta.ogDescription.length).toBeLessThanOrEqual(200);
      });

      it('never mixes Latin and Cyrillic letters inside one word', () => {
        for (const [path, value] of strings(content)) {
          for (const word of value.split(/[^\p{L}]+/u)) {
            const mixed = /\p{Script=Latin}/u.test(word) && /\p{Script=Cyrillic}/u.test(word);
            expect(mixed, `${path}: "${word}"`).toBe(false);
          }
        }
      });

      it('avoids apostrophe glyphs the Manrope font does not have', () => {
        for (const [path, value] of strings(content)) {
          expect(value, path).not.toMatch(/[ʻʼ]/);
        }
      });
    });
  }

  describe('uz typography', () => {
    const texts = strings(uz);

    it('writes oʻ/gʻ with U+2018 and the tutuq belgisi with U+2019 — never ASCII', () => {
      for (const [path, value] of texts) {
        expect(value, path).not.toMatch(/['`]/);
      }
    });

    it('uses U+2018 only after o/g', () => {
      for (const [path, value] of texts) {
        expect(value, path).not.toMatch(/[^oOgG]‘/u);
      }
    });

    it('does not write o’/g’ (U+2019) where o‘/g‘ (U+2018) is meant', () => {
      for (const [path, value] of texts) {
        expect(value, path).not.toMatch(/[oOgG]’\p{L}/u);
      }
    });
  });

  describe('site config', () => {
    it('keeps client data as visible placeholders until the client provides it', () => {
      expect(SITE_CONFIG.contacts.phoneDisplay).toContain('XX');
      expect(Object.values(SITE_CONFIG.stats).every((v) => v.includes('X'))).toBe(true);
    });

    it('has an image for every city, country and gallery item', () => {
      expect(sorted(Object.keys(SITE_CONFIG.images.cities))).toEqual(sorted(CITY_IDS));
      expect(sorted(Object.keys(SITE_CONFIG.images.countries))).toEqual(sorted(COUNTRY_IDS));
      expect(sorted(Object.keys(SITE_CONFIG.images.gallery))).toEqual(sorted(GALLERY_IDS));
    });
  });
});
