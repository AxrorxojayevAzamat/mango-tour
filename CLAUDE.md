# Mango Tour — landing page

Multilingual (uz / en / ru) single-page landing for the **mango_tour** inbound & outbound travel
agency (Uzbekistan cities + Central Asia). Goal: collect free-consultation leads.
**No payments, no "About us" block, no testimonials/reviews block.**

## Key decisions

| Topic | Decision |
|---|---|
| Framework | Angular 22 (standalone, signals, `@if`/`@for`, typed Reactive Forms). OnPush is the v22 default, but we still declare `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. Zoneless (v22 default). |
| Rendering | `@angular/ssr` **build-time prerender only** — `outputMode: "static"`. No Node server at runtime. |
| Routes | `/uz` (default), `/en`, `/ru`. `/` → `/uz` via `public/_redirects` (301) plus a prerendered meta-refresh fallback. Unknown paths → `/uz`. |
| Clean URLs | `scripts/postbuild.mjs` flattens `uz/index.html` → `uz.html` so Cloudflare Pages serves `/uz` without a trailing slash. |
| Content | One typed file per language in `src/content/{uz,en,ru}.ts`, each `as const satisfies SiteContent` (`content.model.ts`) → a missing field fails the build. Fixed lists (cities, FAQ, …) are `Record<Id, …>` keyed by the ids in `src/content/ids.ts`, which also define display order. Language-neutral client data (phone, links, stat numbers, image paths) lives only in `src/content/site-config.ts`. `{placeholders}` in text are filled with `fill()` (`core/i18n/fill.ts`). Never hardcode user-facing text in templates. |
| Content loading | `contentResolver` (`core/content/`) activates the language and lazy-loads only that language's chunk; the result is bound to `HomePage.content` (`withComponentInputBinding`). Sections receive their slice via `input()`. |
| Styling | SCSS + BEM, no UI libraries (no Material/Bootstrap/Tailwind). |
| Font | Manrope Variable, self-hosted via `@fontsource-variable/manrope` (latin, latin-ext, cyrillic). |
| Uzbek apostrophes | Manrope has **no U+02BB/U+02BC**. In Uzbek text write oʻ/gʻ with **U+2018** (`O‘zbekiston`, `G‘ijduvon`) and the tutuq belgisi with **U+2019** (`san’at`, `qal’a`). Never a plain `'`. Enforced by `content.spec.ts`. |
| Images | `NgOptimizedImage` + custom loader (`core/images/image-loader.ts`). `ngSrc` is the extension-less base path (from `SITE_CONFIG.images`). Sources live in `src/assets/images/<group>/<name>.jpg` (neutral placeholders until the client sends photos — see `docs/IMAGES.md`); `npm run images` (auto-run before `build`/`start`) writes `public/images/<group>/<name>-{240…1920}.webp` (git-ignored, incremental). `npm run images -- --placeholders` creates missing placeholder sources. Hero image gets `priority`. |
| Page sections | Order in `HomePage`: header · hero · why-us · services · reasons · destinations(cities) · destinations(countries) · gallery · lead form (`#contact`, stage 5) · faq · footer · floating contacts. Cities/countries share one `app-destinations` component (`kind` input). |
| Card → form hand-off | City/country CTAs call `LeadPrefillService.request(destinationId, comment)` (`core/lead/`) and link to `/{lang}#contact`; the lead form reacts to `pending()`. |
| Motion | Scroll-in reveal is pure CSS (scroll-driven animations): `@use 'motion'; @include motion.reveal-keyframes;` once per stylesheet, `@include motion.reveal;` on an element. No JS, works before hydration, progressive (no animation in browsers without `animation-timeline: view()` or under `prefers-reduced-motion`). Uses the `translate` property so it never fights hover `transform`s. |
| Hydration | Incremental hydration (`withIncrementalHydration()`): header + hero hydrate at once; every other section is wrapped in `@defer (on immediate; hydrate on viewport)` in `home-page.html` — full prerendered HTML, JS loaded/hydrated only when scrolled into view. New below-the-fold sections must follow the same pattern. Code that measures layout must not depend on a section being hydrated. |
| Overlays | Lightbox = native `<dialog>` + `showModal()` (focus trap, Escape, inert page). FAQ = native `<details name="faq">` (exclusive). Prefer native elements over hand-rolled ARIA widgets. |
| Anchor links | In-page links are plain `href="/{lang}#{anchor}"` (never bare `#x`: `<base href="/">` would resolve it to `/#x`). The router scrolls to anchors; `Header` gives `ViewportScroller` the fixed-header offset. |
| Forms → leads | `app-lead-form` (typed Reactive Forms) POSTs JSON to the Pages Function `functions/api/lead.ts` → Telegram bot. Validation rules live ONCE in `src/app/core/lead/lead-rules.ts` (framework-free) and are imported by both the form and the function. Pipeline: origin check → size → JSON → honeypot (`website`, silent fake success) → validation (422 + field codes) → KV rate-limit (5 / 10 min / hashed IP, binding `LEAD_RATE_LIMIT`, soft-fails open) → Turnstile siteverify → Telegram `sendMessage` (HTML, every value escaped, time in Asia/Tashkent). `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TURNSTILE_SECRET_KEY` are **server-only**; never import `functions/` or these names from `src/`. |
| Public build env | `scripts/env.mjs` (runs before build/start/test, reads `.env` locally) writes git-ignored `src/app/core/config/public-env.generated.ts` with ONLY public values: `TURNSTILE_SITE_KEY` (defaults to Cloudflare's always-pass test key) and `SITE_URL`. |
| Cloudflare config | No `wrangler.toml`: env vars, secrets and the KV binding are set in the Pages dashboard (a `wrangler.toml` would make those read-only there). Local: `npm run dev:functions` (wrangler reads `.env`, in-memory KV). |
| Deploy | Cloudflare Pages: build `npm run build`, output `dist/mango-tour/browser`, functions in `functions/`. |
| SEO | `SeoService` (applied in `contentResolver`, so prerendered heads are complete): title, description, canonical, hreflang uz/en/ru + x-default, OG, Twitter, JSON-LD `@graph` (WebSite, TravelAgency, FAQPage) from `core/seo/structured-data.ts`. Placeholder contact data is never emitted (`isPlaceholder`). `postbuild` writes `sitemap.xml` + `robots.txt`; `public/404.html` (noindex) is the real 404; `public/_headers` sets security + cache headers. |
| Site URL | Single source: `PUBLIC_ENV.siteUrl` from the `SITE_URL` build env (default `https://mango-tour.pages.dev` until the custom domain is connected). Used for canonical, hreflang, OG URLs, JSON-LD, sitemap and robots. |
| Client data | Phone, address, email, Instagram, stats, etc. are **visible placeholders** like `+998 (XX) XXX-XX-XX`. Never invent real-looking data. |

## Brand

Colours are sampled from `docs/brand/logo-source.jpg` and live only in `src/styles/_tokens.scss`:

- bg `#0B0B0B`, surface `#161616`, raised `#1F1F1F`
- mango accent `#EA8430` (7.35:1 on bg), hover `#F29A4A`
- leaf `#7A853E` — **decorative only**; leaf-coloured text uses `--color-leaf-text` `#9AA85A`
- text cream `#F6E9D1`, muted `#BFB5A3`, subtle `#A89F8F`
- Text on mango buttons is **dark** (`--color-on-accent`); cream on mango is 2.23:1 and fails WCAG.

Logo assets are generated by `npm run brand` (`scripts/brand.mjs`) from the source JPG and the
hand-drawn vector mark `src/assets/brand/mango-mark.svg`: `public/brand/logo*.webp|png`,
`favicon.svg|ico`, `apple-touch-icon.png`, `icons/icon-{192,512}.png`, `og-image.png` (1200×630).

## Folder structure

```
docs/                  brand source, IMAGES.md, DEPLOY.md
functions/             Cloudflare Pages Functions: api/lead.ts (route) + lib/ (logic, *.test.ts)
public/                static files copied as-is (_redirects, _headers, icons, brand/, images/)
scripts/               node build helpers (brand, postbuild, images, seo)
src/
  content/             content.model.ts (SiteContent), ids.ts, site-config.ts (client data),
                       uz.ts / en.ts / ru.ts, content.spec.ts
  styles/              _tokens, _reset, _typography (global) + _breakpoints, _motion (mixins only)
  assets/brand/        vector sources
  app/
    core/              i18n (languages, guard, LanguageService, fill), content (resolver),
                       images (loader), lead (lead-rules shared with functions, prefill),
                       turnstile (lazy loader), config (generated public env), seo, …
    pages/home/        HomePage — composes all sections for one language
    sections/          header, lang-switcher, hero, footer, … (one BEM block each)
    shared/            reusable UI: icon (hand-drawn set in icons.ts), button, section-heading,
                       place-card, lightbox, phone-mask
```

## Code style

- Standalone components only; `inject()` over constructor params; `input()`/`output()`/`model()`
  signal APIs; `computed()` for derived state; native control flow (`@if`, `@for` with `track`).
- Explicit `changeDetection: ChangeDetectionStrategy.OnPush` on every component.
- Components: `selector: 'app-<name>'`, files `<name>.ts|html|scss` (+ `.spec.ts`).
- No hardcoded UI strings in templates — read them from the current `SiteContent`.
- Strict TypeScript; no `any`. Prettier: 100 cols, single quotes.

### SCSS / BEM rules

- **1 component = 1 BEM block** named after the selector without `app-` (`app-hero` → `.hero`).
  The block class sits on the template's root element. Components whose **host element is the
  block** (`app-icon`, `a[app-button]`) use `ViewEncapsulation.None` — BEM names keep them scoped.
- Max **2 levels**: `.block__element` — never `.block__element__sub`. Needing a 3rd level means
  extracting a child component.
- Modifiers: `.block--variant`, `.block__element--state`, always together with the base class.
- **Flat selectors**: no descendant/child/tag-qualified selectors. SCSS nesting only for
  `&:hover`, `&:focus-visible`, `&::before` and `@include bp.up(...)` media queries.
- Global CSS is limited to tokens, reset (incl. `.visually-hidden`) and base typography.
  Every colour/size/spacing value comes from a `var(--token)`.
- Breakpoints: `@use 'breakpoints' as bp;` then `@include bp.up(md) { … }` (mobile-first;
  sm 480, md 768, lg 1024, xl 1280). Must work from 360px to 1440px+.
- Motion: use `--duration-*` tokens (zeroed under `prefers-reduced-motion`).

## Commands

```bash
npm ci                 # install
npm start              # dev server http://localhost:4200 (→ /uz)
npm run build          # production build + prerender + postbuild → dist/mango-tour/browser
npm test               # Angular unit tests (ng test) + Pages Function tests (functions/vitest.config.mts)
npm run dev:functions  # serve dist/ with /api/lead locally via wrangler (after npm run build)
npm run test:watch     # tests in watch mode
npm run brand          # regenerate logo/favicon/OG assets
npm run images         # build responsive WebP ladders from src/assets/images
```

Every stage must end with a clean `npm run build` and `npm test`, then a meaningful commit.

## Workflow agreed with the client

Work in stages, stop after each and wait for "davom et":
1) skeleton · 2) content model + uz/en/ru content · 3) header, hero, footer · 4) remaining blocks
· 5) lead form + Pages Function + Telegram · 6) SEO/sitemap/JSON-LD/a11y/perf audit
· 7) deploy docs. If a requirement is ambiguous, ask — don't guess.
