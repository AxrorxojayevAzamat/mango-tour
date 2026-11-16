import { uz } from '../../src/content/uz';
import { LANG_META } from '../../src/app/core/i18n/languages';
import type { Lead } from '../../src/app/core/lead/lead-rules';
import type { Fetch } from './env';

export const TELEGRAM_API_BASE = 'https://api.telegram.org';

const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Human name of the chosen destination, in Uzbek (the team's working language). */
export function destinationLabel(destination: Lead['destination']): string {
  if (destination === '') return '—';
  if (destination === 'other') return uz.leadForm.destinationOther;
  const cities: Record<string, { name: string }> = uz.cities.items;
  const countries: Record<string, { name: string }> = uz.countries.items;
  return (cities[destination] ?? countries[destination])?.name ?? destination;
}

/** "16.11.2026, 18:05" in Tashkent time. */
export function formatTashkentTime(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Asia/Tashkent',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/** Telegram HTML message for one lead. Every user-supplied value is escaped. */
export function formatLeadMessage(lead: Lead, receivedAt: Date): string {
  const value = (text: string) => (text ? escapeHtml(text) : '—');
  const lines = [
    '🥭 <b>Yangi ariza — mango_tour</b>',
    '',
    `👤 <b>Ism:</b> ${value(lead.name)}`,
    `📞 <b>Telefon:</b> ${value(lead.phone)}`,
    `✉️ <b>Email:</b> ${value(lead.email)}`,
    `📍 <b>Yo‘nalish:</b> ${escapeHtml(destinationLabel(lead.destination))}`,
    `💬 <b>Izoh:</b> ${value(lead.comment)}`,
    '',
    `🌐 <b>Sayt tili:</b> ${escapeHtml(LANG_META[lead.lang].label)} (${lead.lang})`,
    `🕒 <b>Vaqt:</b> ${formatTashkentTime(receivedAt)} (Toshkent)`,
  ];
  return lines.join('\n');
}

export async function sendTelegramMessage(options: {
  token: string;
  chatId: string;
  text: string;
  fetch: Fetch;
  apiBase?: string;
}): Promise<boolean> {
  try {
    const res = await options.fetch(
      `${options.apiBase ?? TELEGRAM_API_BASE}/bot${options.token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          chat_id: options.chatId,
          text: options.text,
          parse_mode: 'HTML',
          link_preview_options: { is_disabled: true },
        }),
      },
    );
    if (!res.ok) return false;
    const data = (await res.json()) as { ok?: boolean };
    return data.ok === true;
  } catch {
    return false;
  }
}
