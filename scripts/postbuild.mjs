// Post-processes the static build in dist/mango-tour/browser for Cloudflare Pages.
//
// 1. Clean URLs: Pages serves `uz/index.html` at `/uz/` (with a trailing-slash redirect), but
//    our canonical URLs are `/uz`, `/en`, `/ru`. Pages serves `uz.html` at `/uz`, so flatten.
// 2. SEO files from SITE_URL: sitemap.xml (with hreflang alternates) and robots.txt.
import { readdir, rename, rmdir, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolvePublicEnv } from './env.mjs';

const DIST = 'dist/mango-tour/browser';
const LANGS = ['uz', 'en', 'ru'];
const DEFAULT_LANG = 'uz';

const exists = (path) =>
  stat(path).then(
    () => true,
    () => false,
  );

async function flattenLanguagePages() {
  for (const lang of LANGS) {
    const dir = join(DIST, lang);
    const nested = join(dir, 'index.html');
    if (!(await exists(nested))) {
      throw new Error(`postbuild: expected prerendered page ${nested}`);
    }
    await rename(nested, join(DIST, `${lang}.html`));
    if ((await readdir(dir)).length === 0) await rmdir(dir);
  }
}

export function sitemapXml(siteUrl, lastmod) {
  const alternates = [
    ...LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${siteUrl}/${l}"/>`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/${DEFAULT_LANG}"/>`,
  ].join('\n');
  const urls = LANGS.map(
    (lang) => `  <url>
    <loc>${siteUrl}/${lang}</loc>
    <lastmod>${lastmod}</lastmod>
${alternates}
  </url>`,
  ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}

export function robotsTxt(siteUrl) {
  return `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`;
}

async function main() {
  await flattenLanguagePages();
  const { siteUrl } = resolvePublicEnv();
  const lastmod = new Date().toISOString().slice(0, 10);
  await writeFile(join(DIST, 'sitemap.xml'), sitemapXml(siteUrl, lastmod));
  await writeFile(join(DIST, 'robots.txt'), robotsTxt(siteUrl));
  console.log(
    `postbuild: flattened ${LANGS.map((l) => `${l}.html`).join(', ')}; ` +
      `sitemap.xml + robots.txt for ${siteUrl}`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
