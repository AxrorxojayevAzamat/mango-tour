# Mango Tour — landing sahifa

**mango_tour** turistik agentligi uchun ko‘p tilli (uz / en / ru) landing sahifa.
Angular 22 · build paytida statik prerender · SCSS/BEM · Cloudflare Pages + Pages Functions.

Jonli sayt (preview): https://mango-tour.pages.dev

## Tez boshlash

Node.js **22.22.3+** kerak (`.node-version` faylida aniq versiya).

```bash
npm ci
npm start          # http://localhost:4200 → /uz ga yo‘naltiradi
```

`npm start` faqat frontendni ko‘rsatadi. Arizani yuborishni (Pages Function) lokal sinash uchun
quyidagi «Formani lokal sinash» bo‘limiga qarang.

## Buyruqlar

| Buyruq | Nima qiladi |
|---|---|
| `npm start` | Dev server, o‘zgarishlarda avtomatik yangilanadi |
| `npm run build` | Production build: `/`, `/uz`, `/en`, `/ru` statik HTML'ga prerender qilinadi → `dist/mango-tour/browser` |
| `npm test` | Barcha unit testlar: Angular (Vitest) + Pages Function (Vitest, Node) |
| `npm run dev:functions` | Build qilingan saytni `/api/lead` funksiyasi bilan birga lokal ishga tushiradi (wrangler) |
| `npm run images` | `src/assets/images` dagi suratlardan WebP o‘lchamlarini yaratadi (build oldidan avtomatik) |
| `npm run brand` | Logo, favicon, apple-touch-icon va OG rasmni qayta yaratadi |

## Ariza formasi qanday ishlaydi

```
Brauzer (forma) ──POST /api/lead──▶ Pages Function (functions/api/lead.ts)
                                      1. Origin, hajm, JSON tekshiruvi
                                      2. Honeypot (bot to‘ldirsa — jim tashlab yuboriladi)
                                      3. Maydonlar validatsiyasi (brauzerdagi qoidalar bilan bir xil)
                                      4. Rate-limit: 1 IP dan 10 daqiqada 5 ta ariza (Cloudflare KV)
                                      5. Cloudflare Turnstile tokenini server tomonda tekshirish
                                      6. Telegram botga formatlangan xabar ──▶ sizning chat
```

Bot token va boshqa maxfiy kalitlar **faqat server tomonda** (Cloudflare'ning env
o‘zgaruvchilarida) turadi va brauzerga hech qachon tushmaydi.

Telegram'ga keladigan xabar namunasi:

```
🥭 Yangi ariza — mango_tour

👤 Ism: Aziza
📞 Telefon: +998901234567
✉️ Email: aziza@example.com
📍 Yo‘nalish: Buxoro
💬 Izoh: Buxoro bo‘yicha konsultatsiya olmoqchiman.

🌐 Sayt tili: O‘zbekcha (uz)
🕒 Vaqt: 16.11.2026, 18:49 (Toshkent)
```

## Deploy va formani ishga tushirish

Cloudflare Pages sozlamalari, Telegram bot, Turnstile, KV, env o‘zgaruvchilari, o‘z domeningizni
ulash, ishga tushirishdan oldingi checklist va muammolarni hal qilish —
**[`docs/DEPLOY.md`](docs/DEPLOY.md)** da.

Qisqacha: Cloudflare'da `TURNSTILE_SITE_KEY`, `TELEGRAM_BOT_TOKEN` (Secret), `TELEGRAM_CHAT_ID`,
`TURNSTILE_SECRET_KEY` (Secret) va `LEAD_RATE_LIMIT` KV binding'ini qo‘shib, **Retry deployment**
qiling. Kalitlar kiritilmaguncha forma «Arizani yuborib bo‘lmadi» deb javob beradi — bu kutilgan holat.

## Formani lokal sinash

```bash
cp .env.example .env      # kerak bo‘lsa TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID ni yozing
npm run build
npm run dev:functions     # http://localhost:8788/uz
```

- `.env` dagi Turnstile **test** kalitlari har doim «inson» deb javob beradi.
- Haqiqiy `TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHAT_ID` yozsangiz, sinov arizalari haqiqiy chatga boradi.
- `wrangler` `.env` faylini o‘zi o‘qiydi; KV esa lokal xotirada yaratiladi.
- `.env` git'ga tushmaydi (`.gitignore`). Token oshkor bo‘lib qolsa — BotFather'da `/revoke` qiling.

## Hujjatlar

- [`CLAUDE.md`](CLAUDE.md) — arxitektura qarorlari, papka tuzilmasi, kod uslubi (ingliz tilida)
- [`docs/IMAGES.md`](docs/IMAGES.md) — mijoz beradigan rasmlar ro‘yxati va almashtirish tartibi
- [`docs/AUDIT.md`](docs/AUDIT.md) — SEO, accessibility va Lighthouse natijalari
- [`docs/DEPLOY.md`](docs/DEPLOY.md) — Cloudflare Pages, env o‘zgaruvchilar, custom domen, checklist
