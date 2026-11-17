// schema.org JSON-LD for the landing page. Pure functions (unit-tested), no Angular.
import type { SiteContent } from '../../../content/content.model';
import { FAQ_IDS } from '../../../content/ids';
import { isPlaceholder } from '../../../content/placeholder';
import { SITE_CONFIG } from '../../../content/site-config';
import { LANG_META, type Lang } from '../i18n/languages';

export const pageUrl = (siteUrl: string, lang: Lang): string => `${siteUrl}/${lang}`;

const real = <T extends string>(value: T): T | undefined =>
  isPlaceholder(value) ? undefined : value;

const AREA_SERVED = ['Uzbekistan', 'Kazakhstan', 'Kyrgyzstan', 'Tajikistan', 'Turkmenistan'];

export function buildStructuredData(siteUrl: string, lang: Lang, content: SiteContent): object {
  const url = pageUrl(siteUrl, lang);
  const { company, contacts, social } = SITE_CONFIG;
  const phone = real(contacts.phoneHref.replace(/^tel:/, ''));
  const sameAs = [social.instagramUrl, social.telegramUrl].filter((u) => !isPlaceholder(u));

  const agency = {
    '@type': 'TravelAgency',
    '@id': `${siteUrl}/#agency`,
    name: SITE_CONFIG.brandName,
    legalName: `${company.legalName} MChJ`,
    url,
    logo: `${siteUrl}/brand/logo.png`,
    image: `${siteUrl}/og-image.png`,
    description: content.meta.description,
    taxID: company.taxId,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address.street,
      addressLocality: company.address.locality,
      addressRegion: company.address.region,
      addressCountry: company.address.country,
    },
    areaServed: AREA_SERVED.map((name) => ({ '@type': 'Country', name })),
    knowsLanguage: ['uz', 'ru', 'en'],
    ...(phone && isPlaceholder(contacts.phoneDisplay) === false ? { telephone: phone } : {}),
    ...(real(contacts.email) ? { email: contacts.email } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: SITE_CONFIG.brandName,
    inLanguage: LANG_META[lang].htmlLang,
    publisher: { '@id': agency['@id'] },
  };

  const faq = {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    inLanguage: LANG_META[lang].htmlLang,
    mainEntity: FAQ_IDS.map((id) => ({
      '@type': 'Question',
      name: content.faq.items[id].question,
      acceptedAnswer: { '@type': 'Answer', text: content.faq.items[id].answer },
    })),
  };

  return { '@context': 'https://schema.org', '@graph': [website, agency, faq] };
}

/** JSON safe to inline in <script>: `<` is escaped so "</script>" can never close the tag. */
export const serializeJsonLd = (data: object): string =>
  JSON.stringify(data).replace(/</g, '\\u003c');
