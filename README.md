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

## Formani ishga tushirish: 4 qadam

### 1. Telegram bot va chat ID

1. Telegram'da **@BotFather** ga yozing → `/newbot` → bot nomi va username'ini kiriting.
   BotFather **token** beradi (`1234567890:AAH…`). Uni hech kimga bermang.
2. Arizalar keladigan joyni tanlang:
   - **Guruh** (tavsiya etiladi — butun jamoa ko‘radi): guruh yarating, botni a’zo qilib qo‘shing
     va guruhga `/start@sizning_botingiz` deb yozing.
   - **Kanal**: botni kanalga **administrator** qilib qo‘shing.
   - **Shaxsiy chat**: botga `/start` yozing.
3. Chat ID ni bilish: brauzerda `https://api.telegram.org/bot<TOKEN>/getUpdates` ni oching
   (`<TOKEN>` o‘rniga tokeningiz) va javobdan `"chat":{"id": …}` qiymatini toping.
   Guruh/kanal ID si odatda `-100` bilan boshlanadi.

### 2. Cloudflare Turnstile (spamdan himoya)

1. Cloudflare dashboard → **Turnstile** → **Add widget**.
2. Widget name: `mango-tour`. Hostname: `mango-tour.pages.dev` (keyin o‘z domeningizni ham qo‘shasiz).
3. Widget mode: **Managed** → **Create**.
4. Ikkita kalit beriladi: **Site Key** (ochiq) va **Secret Key** (maxfiy).

### 3. KV namespace (rate-limit uchun)

1. Cloudflare dashboard → **Storage & Databases → KV** → **Create** → nom: `mango-tour-rate-limit`.
2. **Workers & Pages → mango-tour → Settings → Bindings → Add → KV namespace**:
   Variable name: `LEAD_RATE_LIMIT`, namespace: `mango-tour-rate-limit` → **Save**.

KV ulanmagan bo‘lsa ham forma ishlaydi, faqat rate-limit o‘chiq bo‘ladi (Cloudflare loglarida
ogohlantirish chiqadi).

### 4. Cloudflare Pages o‘zgaruvchilari

**Workers & Pages → mango-tour → Settings → Variables and Secrets → Add**:

| Nomi | Turi | Qiymati | Kim ishlatadi |
|---|---|---|---|
| `TURNSTILE_SITE_KEY` | Text | Turnstile **Site Key** | build (brauzerga tushadi — bu normal) |
| `TELEGRAM_BOT_TOKEN` | **Secret** | BotFather bergan token | faqat Pages Function |
| `TELEGRAM_CHAT_ID` | Text | chat ID (`-100…`) | faqat Pages Function |
| `TURNSTILE_SECRET_KEY` | **Secret** | Turnstile **Secret Key** | faqat Pages Function |
| `NODE_VERSION` | Text | `22.23.4` | build (allaqachon qo‘shilgan) |

Saqlagandan so‘ng **Deployments → oxirgi deploy → ⋯ → Retry deployment** qiling: site key
build paytida saytga yoziladi, shuning uchun qayta build kerak.

> Kalitlar kiritilmaguncha sayt Cloudflare'ning **test** Turnstile kalitidan foydalanadi, server
> esa arizalarni `not_configured` xatosi bilan rad etadi — forma «Arizani yuborib bo‘lmadi» deb
> ko‘rsatadi. Bu kutilgan holat.

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
- `docs/DEPLOY.md` — Cloudflare Pages, env o‘zgaruvchilar, custom domen *(7-bosqich)*
