import {
  validateLead,
  type LeadApiResponse,
  type LeadErrorCode,
} from '../../src/app/core/lead/lead-rules';
import type { Fetch, LeadEnv } from './env';
import { takeRateLimitSlot } from './rate-limit';
import { formatLeadMessage, sendTelegramMessage } from './telegram';
import { verifyTurnstile } from './turnstile';

/** Generous for 5 short fields; anything bigger is not a real form submission. */
export const MAX_BODY_BYTES = 16 * 1024;

export interface LeadDeps {
  fetch: Fetch;
  now: () => Date;
  log: (message: string) => void;
}

const STATUS: Record<LeadErrorCode, number> = {
  method_not_allowed: 405,
  forbidden_origin: 403,
  too_large: 413,
  bad_request: 400,
  validation: 422,
  rate_limited: 429,
  captcha: 403,
  not_configured: 500,
  delivery_failed: 502,
};

function json(body: LeadApiResponse, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

/** False for other sites and for unparsable origins such as the literal `null`. */
function sameHost(origin: string, requestUrl: string): boolean {
  try {
    return new URL(origin).host === new URL(requestUrl).host;
  } catch {
    return false;
  }
}

const fail = (error: LeadErrorCode, extra: Partial<LeadApiResponse> = {}): Response =>
  json({ ok: false, error, ...extra } as LeadApiResponse, STATUS[error]);

/**
 * POST /api/lead
 * origin check → size → JSON → honeypot → validation → rate limit → Turnstile → Telegram.
 */
export async function handleLead(
  request: Request,
  env: LeadEnv,
  deps: LeadDeps,
): Promise<Response> {
  if (request.method !== 'POST') return fail('method_not_allowed');

  // Browsers always send Origin on cross-site POSTs: only accept our own site.
  const origin = request.headers.get('origin');
  if (origin && !sameHost(origin, request.url)) return fail('forbidden_origin');

  const declared = Number(request.headers.get('content-length') ?? 0);
  if (declared > MAX_BODY_BYTES) return fail('too_large');
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return fail('too_large');

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('shape');
    body = parsed as Record<string, unknown>;
  } catch {
    return fail('bad_request');
  }

  // Honeypot: pretend success so bots learn nothing, but drop the lead.
  if (typeof body['website'] === 'string' && body['website'].trim() !== '') {
    deps.log('lead: honeypot triggered, dropped');
    return json({ ok: true });
  }

  const result = validateLead(body);
  if (!result.ok) return fail('validation', { fields: result.errors });

  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID || !env.TURNSTILE_SECRET_KEY) {
    deps.log('lead: missing TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID or TURNSTILE_SECRET_KEY');
    return fail('not_configured');
  }

  const ip = request.headers.get('cf-connecting-ip');
  if (env.LEAD_RATE_LIMIT && ip) {
    if (!(await takeRateLimitSlot(env.LEAD_RATE_LIMIT, ip))) return fail('rate_limited');
  } else if (!env.LEAD_RATE_LIMIT) {
    deps.log('lead: LEAD_RATE_LIMIT KV binding missing, rate limit disabled');
  }

  const token = typeof body['turnstileToken'] === 'string' ? body['turnstileToken'] : '';
  const human = await verifyTurnstile({
    secret: env.TURNSTILE_SECRET_KEY,
    token,
    ip,
    fetch: deps.fetch,
    url: env.TURNSTILE_VERIFY_URL,
  });
  if (!human) return fail('captcha');

  const delivered = await sendTelegramMessage({
    token: env.TELEGRAM_BOT_TOKEN,
    chatId: env.TELEGRAM_CHAT_ID,
    text: formatLeadMessage(result.lead, deps.now()),
    fetch: deps.fetch,
    apiBase: env.TELEGRAM_API_BASE,
  });
  if (!delivered) {
    deps.log('lead: Telegram sendMessage failed');
    return fail('delivery_failed');
  }

  return json({ ok: true });
}
