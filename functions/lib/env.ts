/**
 * Server-only configuration for the lead endpoint. Set in Cloudflare Pages →
 * Settings → Variables and Secrets / Bindings (or `.dev.vars` for `wrangler pages dev`).
 * NEVER import this from `src/` — the browser bundle must not know any of these.
 */
export interface LeadEnv {
  /** Telegram bot token from @BotFather (secret). */
  TELEGRAM_BOT_TOKEN?: string;
  /** Chat/group/channel id that receives leads, e.g. `-1001234567890`. */
  TELEGRAM_CHAT_ID?: string;
  /** Cloudflare Turnstile secret key (secret). */
  TURNSTILE_SECRET_KEY?: string;
  /** KV namespace binding used for the per-IP rate limit. */
  LEAD_RATE_LIMIT?: KVNamespace;

  /** Local testing only: point Telegram / Turnstile calls at a mock server. */
  TELEGRAM_API_BASE?: string;
  TURNSTILE_VERIFY_URL?: string;
}

export type Fetch = typeof fetch;
