import type { Fetch } from './env';

export const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface SiteverifyResponse {
  success: boolean;
  'error-codes'?: string[];
}

/** Server-side Turnstile check. Any network/parse failure counts as "not verified". */
export async function verifyTurnstile(options: {
  secret: string;
  token: string;
  ip: string | null;
  fetch: Fetch;
  url?: string;
}): Promise<boolean> {
  if (!options.token) return false;
  const form = new FormData();
  form.append('secret', options.secret);
  form.append('response', options.token);
  if (options.ip) form.append('remoteip', options.ip);

  try {
    const res = await options.fetch(options.url ?? TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body: form,
    });
    if (!res.ok) return false;
    const data = (await res.json()) as SiteverifyResponse;
    return data.success === true;
  } catch {
    return false;
  }
}
