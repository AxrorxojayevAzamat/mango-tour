// Cloudflare Pages Function: POST /api/lead → Telegram. Logic lives in ../lib (unit-tested).
import type { LeadEnv } from '../lib/env';
import { handleLead } from '../lib/handle-lead';

export const onRequest: PagesFunction<LeadEnv> = ({ request, env }) =>
  handleLead(request, env, {
    fetch: (input, init) => fetch(input, init),
    now: () => new Date(),
    log: (message) => console.warn(message),
  });
