import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { LeadEnv } from './env';
import { handleLead, MAX_BODY_BYTES } from './handle-lead';
import { RATE_LIMIT } from './rate-limit';

const SITE = 'https://mango-tour.pages.dev';

const VALID = {
  name: 'Aziza',
  phone: '+998 (90) 123-45-67',
  email: 'aziza@example.com',
  destination: 'samarkand',
  comment: 'Samarqand bo‘yicha konsultatsiya olmoqchiman.',
  lang: 'uz',
  website: '',
  turnstileToken: 'token-ok',
};

/** In-memory stand-in for a KV namespace (only what the rate limiter uses). */
function fakeKv(): KVNamespace {
  const store = new Map<string, string>();
  return {
    get: async (key: string) => store.get(key) ?? null,
    put: async (key: string, value: string) => void store.set(key, value),
  } as unknown as KVNamespace;
}

interface Calls {
  siteverify: FormData[];
  telegram: { url: string; body: Record<string, unknown> }[];
}

function fakeFetch(options: { human?: boolean; telegramOk?: boolean } = {}) {
  const calls: Calls = { siteverify: [], telegram: [] };
  const fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('siteverify')) {
      calls.siteverify.push(init?.body as FormData);
      return Response.json({ success: options.human ?? true });
    }
    if (url.includes('/sendMessage')) {
      calls.telegram.push({ url, body: JSON.parse(String(init?.body)) });
      return options.telegramOk === false
        ? Response.json({ ok: false }, { status: 400 })
        : Response.json({ ok: true });
    }
    throw new Error(`unexpected fetch ${url}`);
  });
  return { fetch: fetch as unknown as typeof globalThis.fetch, calls };
}

function request(body: unknown, init: { method?: string; headers?: Record<string, string> } = {}) {
  return new Request(`${SITE}/api/lead`, {
    method: init.method ?? 'POST',
    headers: {
      'content-type': 'application/json',
      origin: SITE,
      'cf-connecting-ip': '203.0.113.7',
      ...init.headers,
    },
    body:
      init.method === 'GET' ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('handleLead', () => {
  let env: LeadEnv;
  let net: ReturnType<typeof fakeFetch>;
  const log = vi.fn();
  const deps = () => ({ fetch: net.fetch, now: () => new Date('2026-11-16T13:05:00Z'), log });

  beforeEach(() => {
    env = {
      TELEGRAM_BOT_TOKEN: '123:abc',
      TELEGRAM_CHAT_ID: '-100500',
      TURNSTILE_SECRET_KEY: 'secret',
      LEAD_RATE_LIMIT: fakeKv(),
    };
    net = fakeFetch();
    log.mockReset();
  });

  it('delivers a valid lead to Telegram and answers 200', async () => {
    const res = await handleLead(request(VALID), env, deps());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    expect(net.calls.siteverify).toHaveLength(1);
    expect(net.calls.siteverify[0].get('secret')).toBe('secret');
    expect(net.calls.siteverify[0].get('response')).toBe('token-ok');
    expect(net.calls.siteverify[0].get('remoteip')).toBe('203.0.113.7');

    expect(net.calls.telegram).toHaveLength(1);
    const { url, body } = net.calls.telegram[0];
    expect(url).toBe('https://api.telegram.org/bot123:abc/sendMessage');
    expect(body['chat_id']).toBe('-100500');
    expect(body['parse_mode']).toBe('HTML');
    const text = String(body['text']);
    expect(text).toContain('Aziza');
    expect(text).toContain('+998901234567');
    expect(text).toContain('Samarqand');
    expect(text).toContain('O‘zbekcha (uz)');
    expect(text).toContain('16.11.2026, 18:05 (Toshkent)');
  });

  it('silently drops honeypot submissions with a fake success', async () => {
    const res = await handleLead(request({ ...VALID, website: 'http://spam' }), env, deps());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(net.fetch).not.toHaveBeenCalled();
  });

  it('rejects invalid fields with 422 and per-field codes', async () => {
    const res = await handleLead(request({ ...VALID, name: '', phone: '+998 90' }), env, deps());
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({
      ok: false,
      error: 'validation',
      fields: { name: 'required', phone: 'invalid' },
    });
    expect(net.fetch).not.toHaveBeenCalled();
  });

  it('refuses a failed Turnstile check and sends nothing', async () => {
    net = fakeFetch({ human: false });
    const res = await handleLead(request(VALID), env, deps());
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ ok: false, error: 'captcha' });
    expect(net.calls.telegram).toHaveLength(0);
  });

  it('refuses a missing Turnstile token without calling siteverify', async () => {
    const res = await handleLead(request({ ...VALID, turnstileToken: '' }), env, deps());
    expect(res.status).toBe(403);
    expect(net.fetch).not.toHaveBeenCalled();
  });

  it(`rate-limits after ${RATE_LIMIT.maxLeads} leads per IP`, async () => {
    for (let i = 0; i < RATE_LIMIT.maxLeads; i++) {
      expect((await handleLead(request(VALID), env, deps())).status).toBe(200);
    }
    const blocked = await handleLead(request(VALID), env, deps());
    expect(blocked.status).toBe(429);
    const otherIp = request(VALID, { headers: { 'cf-connecting-ip': '198.51.100.1' } });
    expect((await handleLead(otherIp, env, deps())).status).toBe(200);
  });

  it('still accepts leads (and logs) when the KV binding is missing', async () => {
    delete env.LEAD_RATE_LIMIT;
    expect((await handleLead(request(VALID), env, deps())).status).toBe(200);
    expect(log).toHaveBeenCalledWith(expect.stringContaining('LEAD_RATE_LIMIT'));
  });

  it('reports a Telegram failure as 502', async () => {
    net = fakeFetch({ telegramOk: false });
    const res = await handleLead(request(VALID), env, deps());
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ ok: false, error: 'delivery_failed' });
  });

  it('answers 500 when secrets are not configured (and never leaks which)', async () => {
    delete env.TELEGRAM_BOT_TOKEN;
    const res = await handleLead(request(VALID), env, deps());
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ ok: false, error: 'not_configured' });
  });

  it.each([
    ['GET', request(null, { method: 'GET' }), 405],
    ['foreign origin', request(VALID, { headers: { origin: 'https://evil.example' } }), 403],
    ['opaque "null" origin', request(VALID, { headers: { origin: 'null' } }), 403],
    ['broken JSON', request('{"name":'), 400],
    ['JSON array', request('[1,2]'), 400],
    ['oversized body', request({ ...VALID, comment: 'x'.repeat(MAX_BODY_BYTES) }), 413],
  ])('rejects %s', async (_label, req, status) => {
    expect((await handleLead(req, env, deps())).status).toBe(status);
    expect(net.fetch).not.toHaveBeenCalled();
  });

  it('accepts requests without an Origin header (e.g. same-origin tools)', async () => {
    const req = request(VALID);
    req.headers.delete('origin');
    expect((await handleLead(req, env, deps())).status).toBe(200);
  });

  it('responses are never cached', async () => {
    const res = await handleLead(request(VALID), env, deps());
    expect(res.headers.get('cache-control')).toBe('no-store');
  });
});
