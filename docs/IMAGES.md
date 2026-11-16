# Saytdagi rasmlar ro‘yxati

Hozir saytda shahar va davlatlar uchun **11 ta mijoz illyustratsiyasi** va qolgan joylar uchun
**10 ta neytral placeholder** (hero + galereya) turibdi. Placeholder'larning pastki o‘ng burchagida nomi
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

## 2. O‘zbekiston shaharlari (`#cities`) — ✅ mijoz illyustratsiyalari qo‘yilgan

Kartochkalar mijoz bergan maket bo‘yicha joylashgan: desktopda yuqorida **4 ta kvadrat**,
pastda **3 ta keng** kartochka; planshetda 2 ustun; telefonda 1 ustun. Rasm pastki qismi
(binolar) doim ko‘rinadi, kesilsa — osmon kesiladi.

| Fayl | Shakl | Hozirgi o‘lcham | Yaxshiroq sifat uchun tavsiya | Tasvir |
|---|---|---|---|---|
| `cities/tashkent.jpg` | kvadrat 1:1 | 684×688 | 1200×1200 | Toshkent teleminorasi |
| `cities/samarkand.jpg` | kvadrat 1:1 | 682×688 | 1200×1200 | Registon madrasasi |
| `cities/bukhara.jpg` | kvadrat 1:1 | 680×688 | 1200×1200 | Ark qal’asi darvozasi |
| `cities/khiva.jpg` | kvadrat 1:1 | 686×688 | 1200×1200 | Kalta minor va Ichan qal’a |
| `cities/fergana.jpg` | keng 3:2 | 936×642 | 1500×1000 | tog‘lar etagidagi vodiy |
| `cities/shakhrisabz.jpg` | keng 3:2 | 952×642 | 1500×1000 | Oqsaroy peshtoqi |
| `cities/nukus.jpg` | keng 3:2 | 932×596 | 1500×1000 | ustunli muzey binosi |

## 3. Markaziy Osiyo davlatlari (`#countries`) — ✅ mijoz illyustratsiyalari qo‘yilgan

| Fayl | Shakl | Hozirgi o‘lcham | Yaxshiroq sifat uchun tavsiya | Tasvir |
|---|---|---|---|---|
| `countries/kazakhstan.jpg` | tik 8:9 | 682×766 | 1200×1350 | ko‘k gumbazli maqbara |
| `countries/kyrgyzstan.jpg` | tik 8:9 | 684×766 | 1200×1350 | tog‘lar etagidagi o‘tov |
| `countries/tajikistan.jpg` | tik 8:9 | 684×766 | 1200×1350 | Ismoil Somoniy yodgorligi |
| `countries/turkmenistan.jpg` | tik 8:9 | 682×766 | 1200×1350 | Ashxobod: minora, oltin ot |

> Bu 11 ta illyustratsiya mijoz yuborgan maket rasmlaridan kesib olingan va 2× kattalashtirilgan
> (maketdagi asl o‘lcham ~350–480px edi). Telefonlarda tiniqroq chiqishi uchun illyustratsiyalarning
> **asl, katta faylarini** (yoki SVG) bersangiz, ular shu nomlar bilan almashtiriladi.
> Rasm almashtirilsa, `src/content/{uz,en,ru}.ts` dagi `imageAlt` matnlarini ham moslang.

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
