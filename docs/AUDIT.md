# SEO, accessibility va performance auditi (6-bosqich)

Sana: 2026-11-16 · Sayt: https://mango-tour.pages.dev · Rasmlar hozircha placeholder.

## Lighthouse (mobil, simulyatsiya qilingan 4G + 4× sekin CPU)

Har bir til jonli saytda **3 marta** o‘lchandi. Performance uchun median ko‘rsatilgan, chunki u
CPU shovqiniga sezgir.

| Sahifa | Performance (median / 3 ta o‘lchov) | Accessibility | Best Practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| `/uz` | **95** (92 / 95 / 98) | 100 | 100 | 100 | 1.1 s | 0 |
| `/en` | **97** (96 / 97 / 97) | 100 | 100 | 100 | 1.0–1.1 s | 0 |
| `/ru` | **97** (97 / 97 / 99) | 100 | 100 | 100 | 1.1 s | 0 |

Optimizatsiyadan oldin Performance 92–95 edi (TBT 270–340 ms). Uni ko‘targan o‘zgarishlar:

- **Incremental hydration.** Header va hero darhol jonlanadi. Qolgan bloklar to‘liq HTML sifatida
  prerender qilinadi, lekin ularning JavaScript kodi faqat ekranga kelganda yuklanadi. Sahifa kodi
  27 KB → 7 KB (gzip) ga kamaydi.
- **Scroll animatsiyasi CSS'ga o‘tkazildi** (scroll-driven animations): JS umuman yo‘q.
- Hash nomli JS/CSS/shrift fayllari 1 yilga, rasmlar 1 haftaga keshlanadi (`public/_headers`).
- Hero rasmi `preload` + `fetchpriority=high`, qolganlari lazy. Turnstile skripti esa faqat forma
  ekranga yaqinlashganda yuklanadi.

Qolgan TBT'ning asosiy qismi — Angular framework kodining bajarilishi (~350 ms, 4× sekinlashtirilgan
CPU'da). Real qurilmalardagi natijalarni sayt trafik olgach Search Console → Core Web Vitals
bo‘limida kuzatish tavsiya etiladi.

**Muhim:** haqiqiy suratlar qo‘yilgach (hozir placeholder), Lighthouse'ni qayta ishga tushiring.
Rasmlarni `docs/IMAGES.md` dagi o‘lchamlardan katta qilib yubormang.

## Accessibility (axe-core 4.14, WCAG 2.2 A/AA + best practices)

**0 ta buzilish** — quyidagi holatlarning har birida tekshirildi:
`/uz` 360px, `/en` 1280px, `/ru` 768px, ochiq mobil menyu, ochiq lightbox, xatolar ko‘rsatilgan
forma, 404 sahifasi.

Qo‘lda tekshirilganlar:

- Sarlavhalar: bitta `h1`, keyin `h2` → `h3`, darajalar sakramaydi (39 ta sarlavha).
- Landmark'lar: `header`, `nav` (asosiy menyu + footer menyusi), `main`, `footer`, `aside`
  (messenjer tugmalari), har bir `section` sarlavhasi bilan bog‘langan.
- Klaviatura: «Asosiy kontentga o‘tish» havolasi → logo → menyu → telefon → Instagram → tillar →
  CTA. Har bir elementda ko‘rinadigan fokus halqasi bor. Escape menyu va lightbox'ni yopadi, fokus
  qaytadi.
- Kontrast: barcha matn ranglari WCAG AA'dan o‘tadi (`src/styles/_tokens.scss` da nisbatlar
  yozilgan). Mango fonidagi tugma matni to‘q rangda (7.35:1).
- `prefers-reduced-motion` yoqilgan bo‘lsa, animatsiyalar o‘chadi.

## SEO

- Har bir til uchun: `title`, `meta description`, `canonical`, `hreflang` (uz/en/ru + x-default),
  Open Graph (1200×630 rasm, locale + alternate'lar), Twitter `summary_large_image`.
- JSON-LD `@graph`: `WebSite`, `TravelAgency` (MANGOTOUR TRAVEL MChJ, STIR, yuridik manzil),
  `FAQPage` (8 ta savol-javob, sahifa tilida). Placeholder telefon, email va ijtimoiy tarmoqlar
  JSON-LD'ga **qo‘shilmaydi** — haqiqiy qiymat yozilganda avtomatik paydo bo‘ladi.
- `sitemap.xml` (3 sahifa, hreflang bog‘lanishlari bilan) va `robots.txt` (`/api/` yopiq) har
  build'da `SITE_URL` bo‘yicha yaratiladi.
- Mavjud bo‘lmagan sahifalar haqiqiy **404** qaytaradi (`404.html`, `noindex`), avvalgi «soft 404»
  yo‘q.
- `/uz/` va `/uz.html` → `/uz` (308): har sahifaning bitta manzili bor.

## Ochiq qolgan masalalar

1. **Custom domen ulanganda:** Cloudflare Pages'da `SITE_URL=https://sizning-domen.uz` ni
   qo‘shing, Turnstile widget'iga domenni qo‘shing va qayta deploy qiling. Shunda canonical,
   hreflang, OG va sitemap avtomatik yangilanadi.
2. **Content-Security-Policy** hali qo‘yilmagan. Angular ichki skriptlari va Turnstile uchun
   hash/nonce kerak bo‘ladi (Angular `security.autoCsp`). Lighthouse bahosiga ta’sir qilmaydi, lekin
   kelajakda qo‘shish tavsiya etiladi.
3. Placeholder ma’lumotlar (telefon, email, Instagram/Telegram/WhatsApp, statistika,
   litsenziya raqami) — `src/content/site-config.ts` va til fayllaridagi footer rekvizitlari.
4. Google Search Console'ga saytni qo‘shib, `sitemap.xml` ni yuboring.
