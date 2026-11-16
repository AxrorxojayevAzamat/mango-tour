# Mango Tour — landing page

Multilingual (uz / en / ru) landing page for the **mango_tour** travel agency.
Angular 22 · static prerender · SCSS/BEM · Cloudflare Pages.

## Quick start

Requires Node.js 22+.

```bash
npm ci
npm start          # http://localhost:4200 → redirects to /uz
```

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Dev server with live reload |
| `npm run build` | Production build, prerenders `/`, `/uz`, `/en`, `/ru` to static HTML in `dist/mango-tour/browser` |
| `npm test` | Unit tests (Vitest), single run |
| `npm run brand` | Regenerates logo, favicon, apple-touch-icon and OG image from `docs/brand/logo-source.jpg` |

## Project docs

- [`CLAUDE.md`](CLAUDE.md) — architecture decisions, folder structure, code style
- `docs/IMAGES.md` — list of images the client needs to supply *(stage 4)*
- `docs/DEPLOY.md` — Cloudflare Pages, env variables, custom domain *(stage 7)*

Lead form setup (Telegram bot, Turnstile, `.env.example`) is documented in stage 5.
