// Stable, language-neutral identifiers for every fixed list on the page.
// The arrays define display order; the derived union types are used as `Record` keys in
// `SiteContent`, so a language file that forgets (or misspells) an item fails to compile.

export const SECTION_IDS = {
  whyUs: 'why-us',
  services: 'services',
  reasons: 'reasons',
  cities: 'cities',
  countries: 'countries',
  gallery: 'gallery',
  leadForm: 'contact',
  faq: 'faq',
} as const;
export type SectionAnchor = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

/** Header menu, in order. Each entry scrolls to a section anchor. */
export const NAV_IDS = ['services', 'cities', 'countries', 'faq', 'contact'] as const;
export type NavId = (typeof NAV_IDS)[number];

export const ADVANTAGE_IDS = ['experience', 'personalRoutes', 'safety', 'culture'] as const;
export type AdvantageId = (typeof ADVANTAGE_IDS)[number];

export const SERVICE_IDS = ['tours', 'hotels', 'insurance', 'transfers', 'tickets'] as const;
export type ServiceId = (typeof SERVICE_IDS)[number];

export const REASON_IDS = [
  'heritage',
  'hospitality',
  'cuisine',
  'entry',
  'nature',
  'crafts',
] as const;
export type ReasonId = (typeof REASON_IDS)[number];

export const CITY_IDS = [
  'tashkent',
  'samarkand',
  'bukhara',
  'khiva',
  'fergana',
  'shakhrisabz',
  'nukus',
] as const;
export type CityId = (typeof CITY_IDS)[number];

export const COUNTRY_IDS = ['kazakhstan', 'kyrgyzstan', 'tajikistan', 'turkmenistan'] as const;
export type CountryId = (typeof COUNTRY_IDS)[number];

/** Options of the "destination" select: every city, every country, then "other". */
export type DestinationId = CityId | CountryId | 'other';

export const STAT_IDS = ['tourists', 'years', 'countries'] as const;
export type StatId = (typeof STAT_IDS)[number];

export const GALLERY_IDS = [
  'registan',
  'bukhara-old-town',
  'khiva-walls',
  'tashkent-metro',
  'plov',
  'suzani',
  'chimgan',
  'issyk-kul',
  'desert-camp',
] as const;
export type GalleryId = (typeof GALLERY_IDS)[number];

export const FAQ_IDS = [
  'visa',
  'currency',
  'season',
  'languages',
  'transport',
  'cuisine',
  'safety',
  'consultation',
] as const;
export type FaqId = (typeof FAQ_IDS)[number];
