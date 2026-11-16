// Lead validation rules shared by the Angular form AND the Cloudflare Pages Function
// (functions/api/lead.ts imports this file). Keep it framework-free: no Angular, no DOM.
import { CITY_IDS, COUNTRY_IDS, type DestinationId } from '../../../content/ids';
import { LANGS, type Lang } from '../i18n/languages';

export const LEAD_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  emailMax: 120,
  commentMax: 1000,
  /** Raw phone input length (with spaces, brackets, dashes). */
  phoneInputMax: 25,
} as const;

export const DESTINATION_IDS: readonly DestinationId[] = [...CITY_IDS, ...COUNTRY_IDS, 'other'];

/** What the browser POSTs to /api/lead. */
export interface LeadRequest {
  readonly name: string;
  readonly phone: string;
  readonly email: string;
  /** Empty string = not chosen. */
  readonly destination: DestinationId | '';
  readonly comment: string;
  readonly lang: Lang;
  /** Honeypot: hidden from people, bots fill it. Must be empty. */
  readonly website: string;
  readonly turnstileToken: string;
}

/** A validated, normalized lead (phone as `+<digits>`, text trimmed). */
export interface Lead {
  readonly name: string;
  readonly phone: string;
  readonly email: string;
  readonly destination: DestinationId | '';
  readonly comment: string;
  readonly lang: Lang;
}

export type LeadField = 'name' | 'phone' | 'email' | 'destination' | 'comment' | 'lang';
export type LeadFieldError = 'required' | 'tooShort' | 'tooLong' | 'invalid';
export type LeadErrors = Partial<Record<LeadField, LeadFieldError>>;

export type LeadValidation =
  { readonly ok: true; readonly lead: Lead } | { readonly ok: false; readonly errors: LeadErrors };

// ---------------------------------------------------------------- text

// Control characters except tab/newline/carriage return.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** Trims and strips control characters; single-line fields also collapse whitespace. */
export function cleanText(value: string, multiline = false): string {
  const stripped = value.replace(CONTROL_CHARS, '');
  return (multiline ? stripped.replace(/\r\n?/g, '\n') : stripped.replace(/\s+/g, ' ')).trim();
}

// ---------------------------------------------------------------- phone

const UZ_CODE = '998';
const UZ_LOCAL_DIGITS = 9;

export const phoneDigits = (value: string): string => value.replace(/\D/g, '');

/**
 * Formats phone input as the user types.
 * - `+998…` → `+998 (90) 123-45-67` (separators appear only before a following digit, so
 *   Backspace never gets stuck on a bracket or dash);
 * - any other country → `+<digits>` (8–15 digits, E.164), so foreign numbers are accepted.
 */
export function formatPhone(raw: string): string {
  const digits = phoneDigits(raw).slice(0, 15);
  if (!digits) return raw.trimStart().startsWith('+') ? '+' : '';
  if (!digits.startsWith(UZ_CODE)) return `+${digits}`;

  const local = digits.slice(UZ_CODE.length, UZ_CODE.length + UZ_LOCAL_DIGITS);
  let out = `+${UZ_CODE}`;
  if (local.length > 0) out += ` (${local.slice(0, 2)}`;
  if (local.length > 2) out += `) ${local.slice(2, 5)}`;
  if (local.length > 5) out += `-${local.slice(5, 7)}`;
  if (local.length > 7) out += `-${local.slice(7, 9)}`;
  return out;
}

/** `+<digits>` canonical form for storage/links. */
export const normalizePhone = (value: string): string => `+${phoneDigits(value)}`;

// ---------------------------------------------------------------- field checks

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function checkName(value: string): LeadFieldError | null {
  const name = cleanText(value);
  if (!name) return 'required';
  if (name.length < LEAD_LIMITS.nameMin) return 'tooShort';
  if (name.length > LEAD_LIMITS.nameMax) return 'tooLong';
  return null;
}

export function checkPhone(value: string): LeadFieldError | null {
  const trimmed = value.trim();
  const digits = phoneDigits(trimmed);
  // An untouched "+998" prefix counts as empty.
  if (!digits || digits === UZ_CODE) return 'required';
  if (trimmed.length > LEAD_LIMITS.phoneInputMax || !trimmed.startsWith('+')) return 'invalid';
  if (digits.startsWith(UZ_CODE)) {
    return digits.length === UZ_CODE.length + UZ_LOCAL_DIGITS ? null : 'invalid';
  }
  return digits.length >= 8 && digits.length <= 15 && !digits.startsWith('0') ? null : 'invalid';
}

/** Email is optional: empty is valid. */
export function checkEmail(value: string): LeadFieldError | null {
  const email = value.trim();
  if (!email) return null;
  if (email.length > LEAD_LIMITS.emailMax) return 'tooLong';
  return EMAIL.test(email) ? null : 'invalid';
}

export function checkComment(value: string): LeadFieldError | null {
  return cleanText(value, true).length > LEAD_LIMITS.commentMax ? 'tooLong' : null;
}

export function checkDestination(value: unknown): LeadFieldError | null {
  return value === '' || DESTINATION_IDS.includes(value as DestinationId) ? null : 'invalid';
}

// ---------------------------------------------------------------- whole lead

const str = (value: unknown): string => (typeof value === 'string' ? value : '');

/** Validates untrusted input (e.g. a parsed JSON body) and returns a normalized lead. */
export function validateLead(input: unknown): LeadValidation {
  const body = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const raw = {
    name: str(body['name']),
    phone: str(body['phone']),
    email: str(body['email']),
    destination: body['destination'] ?? '',
    comment: str(body['comment']),
    lang: body['lang'],
  };

  const errors: LeadErrors = {};
  const set = (field: LeadField, error: LeadFieldError | null) => {
    if (error) errors[field] = error;
  };
  set('name', checkName(raw.name));
  set('phone', checkPhone(raw.phone));
  set('email', checkEmail(raw.email));
  set('destination', checkDestination(raw.destination));
  set('comment', checkComment(raw.comment));
  set('lang', LANGS.includes(raw.lang as Lang) ? null : 'invalid');

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    lead: {
      name: cleanText(raw.name),
      phone: normalizePhone(raw.phone),
      email: raw.email.trim(),
      destination: raw.destination as DestinationId | '',
      comment: cleanText(raw.comment, true),
      lang: raw.lang as Lang,
    },
  };
}

// ---------------------------------------------------------------- API contract

export const LEAD_ENDPOINT = '/api/lead';

export type LeadErrorCode =
  | 'method_not_allowed'
  | 'forbidden_origin'
  | 'too_large'
  | 'bad_request'
  | 'validation'
  | 'rate_limited'
  | 'captcha'
  | 'not_configured'
  | 'delivery_failed';

/** JSON body returned by /api/lead. */
export type LeadApiResponse =
  | { readonly ok: true }
  | { readonly ok: false; readonly error: LeadErrorCode; readonly fields?: LeadErrors };
