# Saytdagi rasmlar ro‘yxati

Hozir saytda **21 ta neytral placeholder** turibdi. Har birining pastki o‘ng burchagida uning nomi
va kerakli o‘lchami yozilgan. Haqiqiy suratlarni mijoz beradi.

## Rasmni qanday almashtirish kerak

1. Suratni quyidagi jadvaldagi **aynan shu nom** bilan `src/assets/images/...` papkasiga qo‘ying va
   eski placeholder ustidan yozing. `.jpg`, `.jpeg`, `.png` yoki `.webp` formatlari qabul qilinadi.
   Agar yangi fayl kengaytmasi boshqacha bo‘lsa (masalan `.png`), eski `.jpg` placeholder'ni o‘chiring.
2. `npm run images` buyrug‘ini ishga tushiring, yoki shunchaki `npm run build` qiling: rasmlar
   avtomatik qayta tayyorlanadi. Skript har bir suratdan 7 xil kenglikda (240–1920px) WebP
   yaratadi va brauzer ekran o‘lchamiga mos variantni o‘zi tanlaydi.
3. Commit qilib push qiling — Cloudflare Pages saytni yangilaydi.

**Umumiy talablar**

- Format: JPG, sifati yuqori (eksportda 85–90%). Hajmi 1 faylga 5 MB gacha bo‘lsa yetarli.
- Kamida jadvaldagi o‘lchamda. Kattaroq bo‘lsa ham mayli, kichikroq bo‘lsa — xira chiqadi.
- Gorizontal kadr. Muhim obyekt markazga yaqin tursin: kartochkalar kadrni chetlaridan kesishi mumkin.
- Ustida matn, logotip yoki suv belgisi (watermark) bo‘lmasin.
- Faqat foydalanish huquqi sizda bo‘lgan suratlar (o‘zingiz olgan, sotib olingan yoki litsenziyali).

## 1. Hero (saytning eng yuqori qismi)

| Fayl | O‘lcham | Nima tasvirlanishi kerak |
|---|---|---|
| `hero/hero.jpg` | 1920×1080 (16:9) | Saytning asosiy, eng ta’sirli surati: masalan, kechki yorug‘likdagi Registon. Kadrning **chap yarmi** nisbatan sokin bo‘lsin, chunki sarlavha matni shu yerda turadi (ustiga qorong‘i gradient tushadi). |

Bu rasm sahifa ochilishi bilan birinchi yuklanadi, shuning uchun uni katta qilib yubormang:
1920px kenglik yetarli.

## 2. O‘zbekiston shaharlari (`#cities`)

Kartochkalarda 4:3, Toshkent kartochkasi esa kengroq (8:3) kesib ko‘rsatiladi. Shuning uchun
asosiy obyekt kadr markazida tursin.

| Fayl | O‘lcham | Nima tasvirlanishi kerak |
|---|---|---|
| `cities/tashkent.jpg` | 1600×1200 | Toshkent: Hazrati Imom majmuasi yoki metro bekati, zamonaviy shahar manzarasi |
| `cities/samarkand.jpg` | 1600×1200 | Samarqand: Registon maydoni madrasalari |
| `cities/bukhara.jpg` | 1600×1200 | Buxoro: Poi Kalon minorasi va masjidi |
| `cities/khiva.jpg` | 1600×1200 | Xiva: Ichan qal’a devorlari, Kalta minor |
| `cities/fergana.jpg` | 1600×1200 | Farg‘ona vodiysi: Marg‘ilondagi atlas ustaxonasi yoki Rishton kulollari |
| `cities/shakhrisabz.jpg` | 1600×1200 | Shahrisabz: Oqsaroy peshtoqi qoldiqlari |
| `cities/nukus.jpg` | 1600×1200 | Nukus: Savitskiy nomidagi san’at muzeyi yoki Orol bo‘yi manzarasi |

## 3. Markaziy Osiyo davlatlari (`#countries`)

| Fayl | O‘lcham | Nima tasvirlanishi kerak |
|---|---|---|
| `countries/kazakhstan.jpg` | 1600×1200 | Qozog‘iston: Charin kanyoni yoki Olmaota tog‘ ko‘llari |
| `countries/kyrgyzstan.jpg` | 1600×1200 | Qirg‘iziston: Issiqko‘l, tog‘ yaylovidagi o‘tovlar |
| `countries/tajikistan.jpg` | 1600×1200 | Tojikiston: Iskandarko‘l, Fan tog‘lari yoki Pomir trakti |
| `countries/turkmenistan.jpg` | 1600×1200 | Turkmaniston: Darvoza gaz krateri, Ashxobod yoki Marv |

## 4. Galereya (`#gallery`)

Galereya mozaika ko‘rinishida: ba’zi suratlar katta yoki vertikal kesiladi. Bosilganda surat
lightbox oynasida **to‘liq**, kesilmagan holda ochiladi.

| Fayl | O‘lcham | Mozaikadagi o‘rni | Nima tasvirlanishi kerak |
|---|---|---|---|
| `gallery/registan.jpg` | 1920×1280 | Katta (2×2) | Registon kechki yorug‘likda |
| `gallery/bukhara-old-town.jpg` | 1920×1280 | Oddiy | Buxoro eski shahrining gumbazlari va ko‘chalari |
| `gallery/khiva-walls.jpg` | 1920×1280 | Oddiy | Xiva, Ichan qal’a devorlari |
| `gallery/tashkent-metro.jpg` | 1920×1280 | Oddiy | Toshkent metrosining naqshinkor bekati |
| `gallery/plov.jpg` | 1920×1280 | Oddiy | Qozondagi palov |
| `gallery/suzani.jpg` | 1920×1280 | Oddiy | Qo‘lda tikilgan so‘zanalar |
| `gallery/chimgan.jpg` | 1920×1280 | Vertikal (1×2) | Chimyon tog‘lari, tog‘ yo‘li (asosiy obyekt markazda) |
| `gallery/issyk-kul.jpg` | 1920×1280 | Katta (2×2) | Issiqko‘l sohili |
| `gallery/desert-camp.jpg` | 1920×1280 | Oddiy | Qizilqum cho‘lidagi o‘tov lageri |

## Alt matnlar

Har bir rasmning izohi (alt matni) uchala tilda `src/content/{uz,en,ru}.ts` fayllarida yozilgan
(`imageAlt` va `gallery.items`). Agar surat mavzusi o‘zgarsa — masalan, Samarqand uchun Registon
o‘rniga Shohi Zinda bo‘lsa — shu matnlarni ham yangilang. Ular ko‘zi ojiz foydalanuvchilar va
qidiruv tizimlari uchun kerak.

## Yangi rasm qo‘shish yoki mavzusini o‘zgartirish

Galereyadagi suratlar ro‘yxati `src/content/ids.ts` (`GALLERY_IDS`) va
`src/content/site-config.ts` (`images.gallery`) fayllarida. Yangi id qo‘shilsa, build uchala tilda
alt matn yozilmaguncha xato beradi — bu ataylab qilingan. Shundan keyin
`npm run images -- --placeholders` buyrug‘i yangi rasm uchun placeholder yaratadi.

## Logo va ikonkalar

Logo variantlari (`public/brand`, favicon, apple-touch-icon, OG rasm) bu ro‘yxatga kirmaydi: ular
`docs/brand/logo-source.jpg` faylidan `npm run brand` buyrug‘i bilan yaratiladi.
