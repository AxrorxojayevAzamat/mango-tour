import type { CityId, CountryId, GalleryId, StatId } from './ids';

/**
 * Language-neutral client data — the ONE place to replace placeholders with real values.
 * Everything marked PLACEHOLDER must come from the client before launch.
 */
export const SITE_CONFIG = {
  brandName: 'mango_tour',

  /** From the state registration certificate (12.11.2026). */
  company: {
    legalName: 'MANGOTOUR TRAVEL',
    taxId: '313479851',
    address: {
      street: 'Kizilyulduz ko‘chasi, 48-uy, Sergeli MFY',
      locality: 'Yuqorichirchiq tumani',
      region: 'Toshkent viloyati',
      country: 'UZ',
    },
  },

  contacts: {
    /** PLACEHOLDER. Display form. */
    phoneDisplay: '+998 (XX) XXX-XX-XX',
    /** PLACEHOLDER. E.164 for `tel:` links. */
    phoneHref: 'tel:+998000000000',
    /** PLACEHOLDER. */
    email: 'info@example.com',
  },

  social: {
    /** PLACEHOLDER. */
    instagramHandle: '@XXXXXXXX',
    instagramUrl: 'https://www.instagram.com/',
    /** PLACEHOLDER. */
    telegramUrl: 'https://t.me/',
    /** PLACEHOLDER. Format: https://wa.me/998XXXXXXXXX */
    whatsappUrl: 'https://wa.me/',
  },

  /** PLACEHOLDER. Hero numbers, shown verbatim. */
  stats: {
    tourists: 'XXXX+',
    years: 'XX',
    countries: 'XX',
  } satisfies Record<StatId, string>,

  /** URL of the public offer (ommaviy oferta) document. PLACEHOLDER. */
  offerUrl: '#',

  /**
   * Extension-less image bases for the WebP loader (`{base}-{width}.webp`).
   * Placeholders until the client supplies photos — see docs/IMAGES.md.
   */
  images: {
    hero: 'images/hero/hero',
    cities: {
      tashkent: 'images/cities/tashkent',
      samarkand: 'images/cities/samarkand',
      bukhara: 'images/cities/bukhara',
      khiva: 'images/cities/khiva',
      fergana: 'images/cities/fergana',
      shakhrisabz: 'images/cities/shakhrisabz',
      nukus: 'images/cities/nukus',
    } satisfies Record<CityId, string>,
    countries: {
      kazakhstan: 'images/countries/kazakhstan',
      kyrgyzstan: 'images/countries/kyrgyzstan',
      tajikistan: 'images/countries/tajikistan',
      turkmenistan: 'images/countries/turkmenistan',
    } satisfies Record<CountryId, string>,
    gallery: {
      registan: 'images/gallery/registan',
      'bukhara-old-town': 'images/gallery/bukhara-old-town',
      'khiva-walls': 'images/gallery/khiva-walls',
      'tashkent-metro': 'images/gallery/tashkent-metro',
      plov: 'images/gallery/plov',
      suzani: 'images/gallery/suzani',
      chimgan: 'images/gallery/chimgan',
      'issyk-kul': 'images/gallery/issyk-kul',
      'desert-camp': 'images/gallery/desert-camp',
    } satisfies Record<GalleryId, string>,
  },
} as const;
