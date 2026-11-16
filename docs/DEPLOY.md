# Deploy: Cloudflare Pages

Bu hujjat saytni ishga tushirish va keyin qo‘llab-quvvatlash uchun kerak bo‘ladigan hamma narsani
bir joyda jamlaydi: Cloudflare Pages sozlamalari, env o‘zgaruvchilari, Telegram/Turnstile/KV,
o‘z domeningizni ulash, ishga tushirishdan oldingi checklist va muammolarni hal qilish.

Hozirgi manzil: **https://mango-tour.pages.dev** · Repo: `main` branch.

## 1. Qanday ishlaydi

```
GitHub (main) ──push──▶ Cloudflare Pages build ──▶ statik fayllar (CDN) + Pages Function /api/lead
                         npm run build                dist/mango-tour/browser   functions/api/lead.ts
```

- **Sayt** — build paytida prerender qilingan statik HTML (`/uz`, `/en`, `/ru`), JS, CSS, rasmlar.
  Server yo‘q, hammasi Cloudflare CDN'dan beriladi.
- **`/api/lead`** — ariza formasini qabul qiladigan Pages Function. U Turnstile'ni tekshiradi,
  rate-limit uchun KV'dan foydalanadi va arizani Telegram botga yuboradi.
- `main` ga har push → **production** deploy. Boshqa branch'lar → **preview** deploy
  (`<branch>.mango-tour.pages.dev`), production'ga ta’sir qilmaydi.

## 2. Pages loyihasi sozlamalari

**Workers & Pages → mango-tour → Settings → Build** (loyiha yaratilganda kiritilgan):

| Sozlama | Qiymat |
|---|---|
| Production branch | `main` |
| Framework preset | **None** |
| Build command | `npm run build` |
| Build output directory | `dist/mango-tour/browser` |
| Root directory | *(bo‘sh)* |

`npm run build` o‘zi ketma-ket bajaradi: `env` (ochiq config) → `images` (WebP o‘lchamlar) →
`ng build` (prerender) → `postbuild` (toza URL'lar, `sitemap.xml`, `robots.txt`).

`functions/` papkasi avtomatik Pages Function sifatida deploy qilinadi. Repoda `wrangler.toml`
**ataylab yo‘q**: u bo‘lsa, panel'dagi o‘zgaruvchilar va binding'larni o‘zgartirib bo‘lmay qoladi.

## 3. O‘zgaruvchilar, secret'lar va KV

**Workers & Pages → mango-tour → Settings → Variables and Secrets**. Production va Preview
uchun alohida kiritiladi (Preview'ga test kalitlari va test chat qo‘yish tavsiya etiladi).

| Nomi | Turi | Qayerda ishlatiladi | Qiymat |
|---|---|---|---|
| `NODE_VERSION` | Text | build | `22.23.4` (allaqachon qo‘shilgan; `.node-version` fayli ham bor) |
| `TURNSTILE_SITE_KEY` | Text | build → brauzer | Turnstile **Site Key** (ochiq kalit, bu normal) |
| `SITE_URL` | Text | build → canonical, hreflang, OG, sitemap | o‘z domeningiz ulanguncha **qo‘ymang** (standart: `https://mango-tour.pages.dev`) |
| `TELEGRAM_BOT_TOKEN` | **Secret** | faqat `/api/lead` | BotFather bergan token |
| `TELEGRAM_CHAT_ID` | Text | faqat `/api/lead` | arizalar keladigan chat ID (`-100…`) |
| `TURNSTILE_SECRET_KEY` | **Secret** | faqat `/api/lead` | Turnstile **Secret Key** |

**KV binding** — **Settings → Bindings → Add → KV namespace**: Variable name `LEAD_RATE_LIMIT`,
namespace `mango-tour-rate-limit` (pastda 4.3-bo‘lim).

> ⚠️ O‘zgaruvchi qo‘shilgan yoki o‘zgartirilgandan keyin **qayta deploy** qiling:
> **Deployments → oxirgi production deploy → ⋯ → Retry deployment**. `TURNSTILE_SITE_KEY` va
> `SITE_URL` build paytida saytga yoziladi, secret'lar esa yangi deploy'dan boshlab amal qiladi.

Hech qachon `TELEGRAM_BOT_TOKEN` yoki `TURNSTILE_SECRET_KEY` ni kodga, `.env.example` ga yoki chatga
yozmang. Token oshkor bo‘lsa — BotFather'da `/revoke` qiling va yangisini kiriting.

## 4. Ariza formasini ulash

### 4.1. Telegram bot va chat ID

1. Telegram'da **@BotFather** → `/newbot` → nom va username → BotFather **token** beradi.
2. Arizalar keladigan joy:
   - **Guruh** (tavsiya — butun jamoa ko‘radi): guruh yarating, botni qo‘shing, guruhga
     `/start@sizning_botingiz` deb yozing.
   - **Kanal**: botni kanalga **administrator** qilib qo‘shing.
   - **Shaxsiy chat**: botga `/start` yozing.
3. Chat ID: brauzerda `https://api.telegram.org/bot<TOKEN>/getUpdates` ni oching va javobdan
   `"chat":{"id": …}` ni toping. Guruh/kanal ID si odatda `-100` bilan boshlanadi.

### 4.2. Cloudflare Turnstile

1. Cloudflare dashboard → **Turnstile → Add widget**.
2. Name: `mango-tour`. **Hostnames:** `mango-tour.pages.dev` (domen ulanganda uni ham qo‘shasiz).
3. Widget mode: **Managed** → Create → **Site Key** va **Secret Key** ni nusxalang.

### 4.3. KV namespace

1. **Storage & Databases → KV → Create** → nom: `mango-tour-rate-limit`.
2. Pages loyihasida binding qo‘shing (3-bo‘lim). KV ulanmasa ham forma ishlaydi, faqat rate-limit
   o‘chiq bo‘ladi va Function loglarida ogohlantirish chiqadi.

### 4.4. Sinab ko‘rish

Kalitlar kiritilib, qayta deploy qilingach:

1. Saytda formani to‘ldirib yuboring → «Rahmat! Arizangiz qabul qilindi» chiqishi kerak.
2. Telegram chatga xabar keladi: ism, telefon, email, yo‘nalish, izoh, sayt tili, Toshkent vaqti.
3. Kelmasa — 8-bo‘limdagi jadvalga qarang.

## 5. O‘z domeningizni ulash (masalan `mangotour.uz`)

Cloudflare Pages asosiy domenni (`mangotour.uz`, ya’ni `www` siz) faqat domen DNS'i **Cloudflare'da**
bo‘lsa ulay oladi. Shuning uchun tavsiya etilgan yo‘l — domenni Cloudflare'ga o‘tkazish (bepul).

### 5.1. Domenni Cloudflare'ga qo‘shish

1. Cloudflare dashboard → **Add a domain** → `mangotour.uz` → **Free** reja.
2. Cloudflare mavjud DNS yozuvlarini skanerlaydi — tekshirib chiqing (ayniqsa pochta uchun `MX`
   yozuvlari saqlanib qolganiga ishonch hosil qiling).
3. Cloudflare ikkita **nameserver** beradi (masalan `xxx.ns.cloudflare.com`). Domen ro‘yxatdan
   o‘tgan joyda (`.uz` registratori panelida) nameserver'larni shularga almashtiring.
4. Bir necha soatdan 24 soatgacha kuting — Cloudflare'da domen holati **Active** bo‘ladi.

### 5.2. Domenni Pages loyihasiga ulash

1. **Workers & Pages → mango-tour → Custom domains → Set up a custom domain**.
2. `mangotour.uz` ni kiriting → Cloudflare DNS yozuvini o‘zi yaratadi → holat **Active** bo‘lguncha
   kuting (SSL sertifikat avtomatik beriladi).
3. Xuddi shunday `www.mangotour.uz` ni ham qo‘shing.
4. `www` → asosiy domenga yo‘naltirish: **Rules → Redirect Rules → Create rule**:
   - *When:* Hostname equals `www.mangotour.uz`
   - *Then:* Dynamic redirect → `concat("https://mangotour.uz", http.request.uri.path)`,
     status **301**, «Preserve query string» yoqilgan.

> DNS'ni Cloudflare'ga o‘tkazishning iloji bo‘lmasa, faqat **subdomen** (masalan
> `www.mangotour.uz`) ulanadi: tashqi DNS'da `www` uchun `CNAME → mango-tour.pages.dev` yozuvi
> qo‘shib, so‘ng 5.2-qadamni bajaring. Asosiy domen (`mangotour.uz`) bu holda Pages'ga ulanmaydi.

### 5.3. Domen ulangandan keyin (majburiy)

1. **`SITE_URL`** = `https://mangotour.uz` (Production, Text) → canonical, hreflang, Open Graph,
   JSON-LD, `sitemap.xml`, `robots.txt` hammasi yangi domenga o‘tadi.
2. **Turnstile** widget'ining Hostnames ro‘yxatiga `mangotour.uz` va `www.mangotour.uz` ni qo‘shing.
3. **Retry deployment**.
4. Tekshiring: `https://mangotour.uz/robots.txt` va `https://mangotour.uz/sitemap.xml` yangi
   domenni ko‘rsatishi, `https://mangotour.uz/` → `/uz` ga o‘tishi kerak.
5. Ixtiyoriy: `mango-tour.pages.dev` ni ham yangi domenga yo‘naltirish — **Bulk Redirects** orqali
   `mango-tour.pages.dev` → `https://mangotour.uz` (301). Canonical teglar baribir domenni
   ko‘rsatgani uchun bu majburiy emas.

### 5.4. Google Search Console

1. https://search.google.com/search-console → **Add property → Domain** → `mangotour.uz`.
2. Tasdiqlash uchun berilgan `TXT` yozuvini Cloudflare DNS'ga qo‘shing.
3. **Sitemaps** → `https://mangotour.uz/sitemap.xml` ni yuboring.

## 6. Kundalik ish

| Vazifa | Qanday |
|---|---|
| O‘zgarishni saytga chiqarish | `main` ga push → 1–2 daqiqada production yangilanadi |
| Sinov uchun alohida versiya | boshqa branch'ga push → `<branch>.mango-tour.pages.dev` |
| Avvalgi versiyaga qaytish | **Deployments** → kerakli deploy → **⋯ → Rollback to this deployment** |
| Build xatosini ko‘rish | **Deployments** → deploy → **View details / build log** |
| Forma (Function) loglari | **Deployments** → production deploy → **Functions** → real-time logs |
| Rasm almashtirish | `docs/IMAGES.md` bo‘yicha fayl qo‘yib push qiling (URL avtomatik yangilanadi) |
| Matn o‘zgartirish | `src/content/uz.ts`, `en.ts`, `ru.ts` — uchala tilda bir xil maydon |
| Telefon, email, ijtimoiy tarmoqlar | `src/content/site-config.ts` |

## 7. Ishga tushirishdan oldingi checklist

- [ ] `src/content/site-config.ts`: telefon (`phoneDisplay` + `phoneHref`), email, Instagram,
      Telegram, WhatsApp havolalari, hero statistikasi (`XXXX+`, `XX`), ommaviy oferta havolasi
- [ ] `src/content/{uz,en,ru}.ts` → `footer.companyDetails`: turoperator litsenziyasi raqami
- [ ] Hero va galereya suratlari (`docs/IMAGES.md`), alt matnlar mos
- [ ] Telegram bot, chat ID, Turnstile kalitlari, KV binding → **Retry deployment**
- [ ] Haqiqiy sinov arizasi Telegram'ga keldi (uchala tildan bittadan)
- [ ] Custom domen + `SITE_URL` + Turnstile hostname (5-bo‘lim)
- [ ] Telefonda tekshirish: menyu, forma, Telegram/WhatsApp tugmalari, galereya
- [ ] Lighthouse (mobil) qayta o‘lchash — haqiqiy suratlar bilan (`docs/AUDIT.md`)
- [ ] Google Search Console + sitemap

Placeholder telefon/email/ijtimoiy tarmoqlar JSON-LD'ga tushmaydi — haqiqiy qiymat yozilishi bilan
avtomatik qo‘shiladi.

## 8. Muammolarni hal qilish

| Belgi | Sabab | Yechim |
|---|---|---|
| Build `Node.js version` xatosi | Eski Node | `NODE_VERSION=22.23.4` borligini tekshiring |
| Forma: «Arizani yuborib bo‘lmadi», Function logida `missing TELEGRAM_BOT_TOKEN…` (javob `not_configured`, 500) | Secret'lar kiritilmagan yoki deploy qilinmagan | 3-bo‘lim → Retry deployment |
| Javob `delivery_failed` (502) | Token noto‘g‘ri, chat ID noto‘g‘ri yoki bot guruhda/kanalda yo‘q | 4.1-bo‘limni qayta tekshiring; kanalda bot admin bo‘lishi shart |
| «Robot emasligingizni tasdiqlang» yo‘qolmaydi (`captcha`, 403) | Site/Secret key juftligi mos emas yoki hostname qo‘shilmagan | Turnstile widget'idagi kalitlar va Hostnames |
| Turnstile vidjeti ko‘rinmaydi | Site key yo‘q (test kalit ishlatilmoqda) yoki brauzer kengaytmasi bloklagan | `TURNSTILE_SITE_KEY` + Retry deployment |
| `rate_limited` (429) | Bir IP'dan 10 daqiqada 5 tadan ortiq ariza | Kuting; sinov paytida boshqa tarmoqdan yuboring |
| Canonical/sitemap eski domenni ko‘rsatadi | `SITE_URL` o‘zgartirilgandan keyin deploy qilinmagan | Retry deployment |
| `/uz/` → `/uz` ga 308 | Pages'ning toza URL qoidasi | Bu to‘g‘ri, o‘zgartirish kerak emas |

Lokal sinash (`npm run build` + `npm run dev:functions`) — `README.md` → «Formani lokal sinash».
