import { RenderMode, ServerRoute } from '@angular/ssr';
import { LANGS } from './core/i18n/languages';

/** Everything is prerendered to static HTML at build time — no server runtime. */
export const serverRoutes: ServerRoute[] = [
  // `/` → redirect page (Cloudflare `_redirects` does the real 301; this is the fallback).
  { path: '', renderMode: RenderMode.Prerender },
  {
    path: ':lang',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => LANGS.map((lang) => ({ lang })),
  },
  { path: '**', renderMode: RenderMode.Client },
];
