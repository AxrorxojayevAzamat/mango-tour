import { describe, expect, it } from 'vitest';
import { resolvePublicEnv } from './env.mjs';
import { robotsTxt, sitemapXml } from './postbuild.mjs';

describe('sitemapXml', () => {
  const xml = sitemapXml('https://example.uz', '2026-11-16');

  it('lists the three language pages', () => {
    expect(xml.match(/<loc>/g)).toHaveLength(3);
    for (const lang of ['uz', 'en', 'ru'])
      expect(xml).toContain(`<loc>https://example.uz/${lang}</loc>`);
  });

  it('cross-links every page with hreflang alternates and x-default', () => {
    expect(xml.match(/hreflang="x-default" href="https:\/\/example.uz\/uz"/g)).toHaveLength(3);
    expect(xml.match(/<xhtml:link /g)).toHaveLength(12);
  });
});

describe('robotsTxt', () => {
  it('allows the site, blocks the API and points to the sitemap', () => {
    const txt = robotsTxt('https://example.uz');
    expect(txt).toContain('Disallow: /api/');
    expect(txt).toContain('Sitemap: https://example.uz/sitemap.xml');
  });
});

describe('resolvePublicEnv', () => {
  it('defaults to the pages.dev origin and the Turnstile test key', () => {
    expect(resolvePublicEnv({})).toEqual({
      siteUrl: 'https://mango-tour.pages.dev',
      turnstileSiteKey: '1x00000000000000000000AA',
    });
  });

  it('strips a trailing slash and rejects non-https origins', () => {
    expect(resolvePublicEnv({ SITE_URL: 'https://mangotour.uz/' }).siteUrl).toBe(
      'https://mangotour.uz',
    );
    expect(() => resolvePublicEnv({ SITE_URL: 'http://mangotour.uz' })).toThrow();
  });
});
