import { describe, expect, it } from 'vitest';
import type { Lead } from '../../src/app/core/lead/lead-rules';
import { destinationLabel, formatLeadMessage, formatTashkentTime } from './telegram';

const lead: Lead = {
  name: 'Aziza <b>&</b>',
  phone: '+998901234567',
  email: '',
  destination: 'kyrgyzstan',
  comment: 'Line 1\n<script>alert(1)</script>',
  lang: 'ru',
};

describe('formatLeadMessage', () => {
  const text = formatLeadMessage(lead, new Date('2026-11-16T19:30:00Z'));

  it('escapes every user value for Telegram HTML', () => {
    expect(text).toContain('Aziza &lt;b&gt;&amp;&lt;/b&gt;');
    expect(text).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(text).not.toContain('<script>');
  });

  it('shows a dash for empty optional fields', () => {
    expect(text).toContain('✉️ <b>Email:</b> —');
  });

  it('names the destination, site language and Tashkent time', () => {
    expect(text).toContain('📍 <b>Yo‘nalish:</b> Qirg‘iziston');
    expect(text).toContain('🌐 <b>Sayt tili:</b> Русский (ru)');
    expect(text).toContain('🕒 <b>Vaqt:</b> 17.11.2026, 00:30 (Toshkent)');
  });
});

describe('destinationLabel', () => {
  it('handles cities, countries, "other" and empty', () => {
    expect(destinationLabel('bukhara')).toBe('Buxoro');
    expect(destinationLabel('turkmenistan')).toBe('Turkmaniston');
    expect(destinationLabel('other')).toBe('Boshqa');
    expect(destinationLabel('')).toBe('—');
  });
});

describe('formatTashkentTime', () => {
  it('is UTC+5 all year (no DST)', () => {
    expect(formatTashkentTime(new Date('2026-07-01T00:00:00Z'))).toBe('01.07.2026, 05:00');
  });
});
