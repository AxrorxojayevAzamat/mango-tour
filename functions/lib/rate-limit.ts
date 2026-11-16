/** At most MAX_LEADS accepted leads per IP per WINDOW_SECONDS. */
export const RATE_LIMIT = { maxLeads: 5, windowSeconds: 600 } as const;

/** KV stores a hash of the IP, never the IP itself. */
async function keyFor(ip: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
  const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
  return `lead-rl:${hex.slice(0, 32)}`;
}

/**
 * Simple fixed-window counter in KV. KV is eventually consistent, so this is a soft limit —
 * good enough to stop a script hammering the form; Turnstile is the main bot defence.
 * Returns true when the request may proceed (and counts it).
 */
export async function takeRateLimitSlot(kv: KVNamespace, ip: string): Promise<boolean> {
  const key = await keyFor(ip);
  const used = Number((await kv.get(key)) ?? 0);
  if (used >= RATE_LIMIT.maxLeads) return false;
  await kv.put(key, String(used + 1), { expirationTtl: RATE_LIMIT.windowSeconds });
  return true;
}
