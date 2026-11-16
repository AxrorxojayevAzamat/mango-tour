import type {
  AdvantageId,
  CityId,
  CountryId,
  FaqId,
  GalleryId,
  NavId,
  ReasonId,
  ServiceId,
  StatId,
} from './ids';

/**
 * Everything a visitor reads on the page, for ONE language.
 *
 * Rules:
 * - Every field is required. `src/content/{uz,en,ru}.ts` must each `satisfies SiteContent`,
 *   so a missing or misspelled field is a build error.
 * - Fixed lists are `Record<Id, …>` keyed by the ids in `ids.ts` (which also set the order),
 *   so each language must contain exactly the same items.
 * - Text containing `{placeholders}` is filled at runtime with `fill()` (core/i18n/fill.ts).
 * - Language-neutral client data (phone, links, stat numbers, image paths) is NOT here —
 *   see `site-config.ts`.
 */
export interface SiteContent {
  readonly meta: MetaContent;
  readonly a11y: A11yContent;
  readonly nav: NavContent;
  readonly hero: HeroContent;
  readonly whyUs: CardSection<AdvantageId>;
  readonly services: CardSection<ServiceId>;
  readonly reasons: CardSection<ReasonId>;
  readonly cities: PlaceSection<CityId>;
  readonly countries: PlaceSection<CountryId>;
  readonly gallery: GalleryContent;
  readonly leadForm: LeadFormContent;
  readonly faq: FaqContent;
  readonly footer: FooterContent;
  readonly floating: FloatingContactsContent;
}

/** <head> tags. `title` ≤ 60 chars, `description` 70–160 chars (checked by tests). */
export interface MetaContent {
  readonly title: string;
  readonly description: string;
  readonly ogTitle: string;
  readonly ogDescription: string;
  readonly ogImageAlt: string;
}

export interface A11yContent {
  readonly skipToContent: string;
}

export interface NavContent {
  /** aria-label of the main <nav>. */
  readonly label: string;
  readonly items: Readonly<Record<NavId, string>>;
  readonly openMenu: string;
  readonly closeMenu: string;
  readonly languageSwitcher: string;
  /** Visible next to the phone link, e.g. "Call us". */
  readonly phoneLabel: string;
  readonly instagramLabel: string;
}

export interface HeroContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly lead: string;
  readonly cta: string;
  readonly stats: Readonly<Record<StatId, string>>;
  readonly imageAlt: string;
}

/** Shared heading block used by every section. */
export interface SectionHeading {
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
}

export interface CardText {
  readonly title: string;
  readonly text: string;
}

export interface CardSection<Id extends string> extends SectionHeading {
  readonly items: Readonly<Record<Id, CardText>>;
}

export interface PlaceText {
  readonly name: string;
  readonly description: string;
  readonly imageAlt: string;
}

export interface PlaceSection<Id extends string> extends SectionHeading {
  /** Button label on each card, e.g. "Get a consultation". */
  readonly cta: string;
  /** Pre-filled into the form's comment field. Must contain `{name}`. */
  readonly commentTemplate: string;
  readonly items: Readonly<Record<Id, PlaceText>>;
}

export interface GalleryContent extends SectionHeading {
  /** Alt text per photo. */
  readonly items: Readonly<Record<GalleryId, string>>;
  readonly openImage: string;
  readonly lightbox: {
    readonly label: string;
    readonly close: string;
    readonly previous: string;
    readonly next: string;
    /** Must contain `{current}` and `{total}`. */
    readonly counter: string;
  };
}

export interface LeadFormContent extends SectionHeading {
  readonly fields: {
    readonly name: FieldText;
    readonly phone: FieldText;
    readonly email: FieldText;
    readonly destination: FieldText;
    readonly comment: FieldText;
  };
  readonly optional: string;
  readonly destinationGroups: { readonly cities: string; readonly countries: string };
  readonly destinationOther: string;
  readonly submit: string;
  readonly submitting: string;
  readonly privacyNote: string;
  readonly errors: {
    readonly required: string;
    /** Must contain `{min}`. */
    readonly nameTooShort: string;
    /** Must contain `{max}`. */
    readonly tooLong: string;
    readonly phoneInvalid: string;
    readonly emailInvalid: string;
    readonly captcha: string;
  };
  readonly success: { readonly title: string; readonly text: string; readonly again: string };
  readonly failure: { readonly title: string; readonly text: string; readonly retry: string };
}

export interface FieldText {
  readonly label: string;
  readonly placeholder: string;
}

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export interface FaqContent extends SectionHeading {
  readonly items: Readonly<Record<FaqId, FaqItem>>;
}

export interface FooterContent {
  readonly tagline: string;
  readonly contactsTitle: string;
  readonly menuTitle: string;
  readonly socialTitle: string;
  readonly addressLabel: string;
  /** Client placeholder, e.g. "Toshkent sh., XXXXX ko‘chasi, XX-uy". */
  readonly address: string;
  readonly phoneLabel: string;
  readonly emailLabel: string;
  readonly companyTitle: string;
  /** Client placeholder lines: legal name, tax id, licence number… */
  readonly companyDetails: readonly string[];
  readonly offerLink: string;
  /** Must contain `{year}`. */
  readonly copyright: string;
}

export interface FloatingContactsContent {
  readonly label: string;
  readonly telegram: string;
  readonly whatsapp: string;
}
