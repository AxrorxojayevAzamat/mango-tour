import type { SiteContent } from './content.model';

// Typography: oʻ/gʻ are written with U+2018 (‘), the tutuq belgisi with U+2019 (’).
// Manrope has no U+02BB/U+02BC glyphs — never use them or a plain ASCII apostrophe here.

export const uz = {
  meta: {
    title: 'Mango Tour — O‘zbekiston va Markaziy Osiyo bo‘ylab turlar',
    description:
      'Samarqand, Buxoro, Xiva va Markaziy Osiyo bo‘ylab shaxsiy turlar. Mehmonxona, transfer, chiptalar va sug‘urta — bir joyda. Bepul konsultatsiya oling.',
    ogTitle: 'Mango Tour — O‘zbekiston va Markaziy Osiyoga sayohatlar',
    ogDescription:
      'Siz uchun tuzilgan marshrutlar: Ipak yo‘li shaharlari, tog‘lar, cho‘llar va milliy taomlar. Bepul konsultatsiya.',
    ogImageAlt: 'mango_tour logotipi: mango va uchayotgan samolyot',
  },

  a11y: {
    skipToContent: 'Asosiy kontentga o‘tish',
  },

  nav: {
    label: 'Asosiy menyu',
    items: {
      services: 'Xizmatlar',
      cities: 'Shaharlar',
      countries: 'Davlatlar',
      faq: 'FAQ',
      contact: 'Kontakt',
    },
    openMenu: 'Menyuni ochish',
    closeMenu: 'Menyuni yopish',
    languageSwitcher: 'Sayt tilini tanlash',
    phoneLabel: 'Qo‘ng‘iroq qilish',
    instagramLabel: 'Instagram sahifamiz',
  },

  hero: {
    eyebrow: 'Kiruvchi va chiquvchi turizm',
    title: 'O‘zbekiston va Markaziy Osiyo — siz uchun tuzilgan sayohatda',
    lead: 'Ipak yo‘lining qadimiy shaharlari, tog‘ yo‘llari va dasturxon atrofidagi samimiy suhbatlar. Marshrutni sizning qiziqishlaringiz, vaqtingiz va byudjetingizga moslab tuzamiz.',
    cta: 'Bepul konsultatsiya olish',
    stats: {
      tourists: 'mamnun sayyoh',
      years: 'yillik tajriba',
      countries: 'davlat yo‘nalishlari',
    },
    imageAlt: 'Kechki yorug‘likdagi Samarqand Registon maydoni',
  },

  whyUs: {
    eyebrow: 'Nega aynan biz',
    title: 'Sayohatni tashvishsiz qilamiz',
    subtitle: 'Har bir safarni o‘zimiz uchun tuzayotgandek puxta rejalaymiz.',
    items: {
      experience: {
        title: 'Tajriba',
        text: 'Mintaqani ichidan bilamiz: qaysi mavsumda qayerga borish, qayerda tunash va nimani albatta ko‘rish kerakligini aytib beramiz.',
      },
      personalRoutes: {
        title: 'Shaxsiy marshrutlar',
        text: 'Tayyor shablon emas — sizning sur’atingiz, qiziqishlaringiz va byudjetingizga mos marshrut tuzamiz.',
      },
      safety: {
        title: 'Xavfsizlik va qulaylik',
        text: 'Tekshirilgan mehmonxonalar, ishonchli transport va sayohat davomida doimiy aloqa — siz faqat dam olasiz.',
      },
      culture: {
        title: 'Madaniy uchrashuvlar',
        text: 'Hunarmandlar ustaxonalari, oilaviy dasturxonlar va mahalliy bayramlar — mintaqani odamlari orqali kashf eting.',
      },
    },
  },

  services: {
    eyebrow: 'Xizmatlar',
    title: 'Sayohatning barcha qismi — bir joyda',
    subtitle: 'Bitta murojaat bilan butun safarni tashkil qilamiz.',
    items: {
      tours: {
        title: 'Tur paketlar',
        text: 'Shaharlar bo‘ylab ekskursiyalar, tog‘ va cho‘l sarguzashtlari, gastronomik va madaniy turlar.',
      },
      hotels: {
        title: 'Mehmonxona bron qilish',
        text: 'Butik-mehmonxonalardan tortib an’anaviy uylargacha — joylashuvi va narxi sizga mos variantlar.',
      },
      insurance: {
        title: 'Sug‘urta rasmiylashtirish',
        text: 'Sayohat davri uchun tibbiy sug‘urtani tez va qulay rasmiylashtirishga yordam beramiz.',
      },
      transfers: {
        title: 'Transferlar',
        text: 'Aeroport va vokzaldan kutib olish, shaharlararo qulay avtomobillar va tajribali haydovchilar.',
      },
      tickets: {
        title: 'Avia va poyezd chiptalari',
        text: 'Xalqaro va ichki reyslar, tezyurar poyezdlar — eng qulay vaqt va narxdagi chiptalarni topamiz.',
      },
    },
  },

  reasons: {
    eyebrow: 'O‘zbekiston',
    title: 'O‘zbekistonga kelish uchun 6 sabab',
    subtitle: 'Bir safarda tarix, tabiat va mehmondo‘stlikni his qilish mumkin bo‘lgan mamlakat.',
    items: {
      heritage: {
        title: 'Ipak yo‘li merosi',
        text: 'Samarqand, Buxoro, Xiva va Shahrisabzdagi YUNESKO ro‘yxatiga kiritilgan obidalar — ochiq osmon ostidagi muzeylar.',
      },
      hospitality: {
        title: 'Mashhur mehmondo‘stlik',
        text: 'Bu yerda mehmon — aziz. Choy taklif qilish va dasturxonga chorlash kundalik odat.',
      },
      cuisine: {
        title: 'Boy oshxona',
        text: 'Palov, tandir non, somsa va shashlik — har bir viloyatning o‘z retsepti va o‘z sirlari bor.',
      },
      entry: {
        title: 'Oson kirish',
        text: 'Ko‘plab davlatlar fuqarolari vizasiz yoki elektron viza bilan kira oladi. Shartlarni sizning fuqaroligingiz bo‘yicha tekshirib beramiz.',
      },
      nature: {
        title: 'Turfa tabiat',
        text: 'Chimyon tog‘lari, Qizilqum cho‘li, Orol bo‘yi va Farg‘ona vodiysi bog‘lari — bir mamlakatda bir necha manzara.',
      },
      crafts: {
        title: 'Hunarmandchilik va bozorlar',
        text: 'Marg‘ilon ipagi, Rishton sopoli, so‘zana va zardo‘zlik — ustalar qo‘lidan chiqqan san’atni o‘z ko‘zingiz bilan ko‘ring.',
      },
    },
  },

  cities: {
    eyebrow: 'Shaharlar',
    title: 'O‘zbekiston shaharlari',
    subtitle: 'Har bir shahar — alohida hikoya. Qaysi biridan boshlashni birga tanlaymiz.',
    cta: 'Konsultatsiya olish',
    commentTemplate: '{name} bo‘yicha konsultatsiya olmoqchiman.',
    items: {
      tashkent: {
        name: 'Toshkent',
        description:
          'Zamonaviy poytaxt: san’at asari kabi bezatilgan metro bekatlari, Chorsu bozori va Hazrati Imom majmuasi.',
        imageAlt: 'Toshkent teleminorasi illyustratsiyasi',
      },
      samarkand: {
        name: 'Samarqand',
        description:
          'Registon, Go‘ri Amir va Shohi Zinda — Amir Temur davri me’morchiligining eng yorqin namunalari.',
        imageAlt: 'Samarqanddagi Registon madrasasi illyustratsiyasi',
      },
      bukhara: {
        name: 'Buxoro',
        description:
          'Ikki yarim ming yillik tarixga ega shahar: Poi Kalon majmuasi, Ark qal’asi va Labi Hovuz atrofidagi tor ko‘chalar.',
        imageAlt: 'Buxorodagi Ark qal’asi darvozasi illyustratsiyasi',
      },
      khiva: {
        name: 'Xiva',
        description:
          'Ichan qal’a devorlari ichidagi shahar-muzey: minoralar, saroylar va kechki loy devorlar ustidagi oltin quyosh.',
        imageAlt: 'Xivadagi Kalta minor va Ichan qal’a devorlari illyustratsiyasi',
      },
      fergana: {
        name: 'Farg‘ona vodiysi',
        description:
          'Marg‘ilonning ipak ustaxonalari, Rishton kulollari va Qo‘qon saroylari — hunarmandlar vodiysi.',
        imageAlt: 'Farg‘ona vodiysi: qorli tog‘lar etagidagi yashil dalalar illyustratsiyasi',
      },
      shakhrisabz: {
        name: 'Shahrisabz',
        description:
          'Amir Temurning vatani: Oqsaroy saroyi qoldiqlari va tog‘lar etagidagi yashil shahar.',
        imageAlt: 'Shahrisabzdagi Oqsaroy peshtoqi illyustratsiyasi',
      },
      nukus: {
        name: 'Nukus',
        description:
          'Savitskiy nomidagi san’at muzeyining noyob avangard to‘plami va Orol dengizi tomon sayohat boshlanadigan nuqta.',
        imageAlt: 'Nukusdagi oq ustunli muzey binosi illyustratsiyasi',
      },
    },
  },

  countries: {
    eyebrow: 'Markaziy Osiyo',
    title: 'Markaziy Osiyo davlatlariga sayohat',
    subtitle: 'O‘zbekiston safarini qo‘shni davlatlar bilan bitta marshrutga birlashtiramiz.',
    cta: 'Konsultatsiya olish',
    commentTemplate: '{name} bo‘yicha konsultatsiya olmoqchiman.',
    items: {
      kazakhstan: {
        name: 'Qozog‘iston',
        description:
          'Olmaotaning tog‘ ko‘llari, Charin kanyoni va bepoyon dashtlar — katta masofalar va yorqin manzaralar.',
        imageAlt: 'Ko‘k gumbazli va naqshinkor minorali qadimiy maqbara illyustratsiyasi',
      },
      kyrgyzstan: {
        name: 'Qirg‘iziston',
        description:
          'Issiqko‘l sohili, yaylovdagi o‘tovlar va otda sayr — tog‘lar va ko‘chmanchi madaniyati mamlakati.',
        imageAlt: 'Qorli tog‘lar etagidagi o‘tov illyustratsiyasi',
      },
      tajikistan: {
        name: 'Tojikiston',
        description:
          'Pomir trakti, Fan tog‘lari va Iskandarko‘l — haqiqiy tog‘ sarguzashtini sevuvchilar uchun.',
        imageAlt: 'Dushanbedagi Ismoil Somoniy yodgorligi illyustratsiyasi',
      },
      turkmenistan: {
        name: 'Turkmaniston',
        description:
          'Qadimiy Marv xarobalari, oq marmarli Ashxobod va Qoraqumdagi Darvoza gaz krateri.',
        imageAlt:
          'Ashxobod: naqshinkor minora, oltin ot haykali va oq marmar binolar illyustratsiyasi',
      },
    },
  },

  gallery: {
    eyebrow: 'Galereya',
    title: 'Safarlarimizdan lavhalar',
    subtitle: 'Sizni kutayotgan manzaralar, ranglar va lazzatlar.',
    items: {
      registan: 'Samarqanddagi Registon maydoni kechki yorug‘likda',
      'bukhara-old-town': 'Buxoro eski shahrining gumbazlari va tor ko‘chalari',
      'khiva-walls': 'Xivadagi Ichan qal’aning loy devorlari',
      'tashkent-metro': 'Toshkent metrosining naqshinkor bekati',
      plov: 'Qozonda tayyorlanayotgan an’anaviy o‘zbek palovi',
      suzani: 'Qo‘lda tikilgan rang-barang so‘zanalar',
      chimgan: 'Chimyon tog‘lari va tog‘ yo‘li',
      'issyk-kul': 'Qirg‘izistondagi Issiqko‘l sohili',
      'desert-camp': 'Qizilqum cho‘lidagi o‘tov lageri',
    },
    openImage: 'Rasmni kattalashtirish',
    lightbox: {
      label: 'Rasmni ko‘rish oynasi',
      close: 'Yopish',
      previous: 'Oldingi rasm',
      next: 'Keyingi rasm',
      counter: '{current} / {total}',
    },
  },

  leadForm: {
    eyebrow: 'Bepul konsultatsiya',
    title: 'Sayohatingizni birga rejalashtiraylik',
    subtitle:
      'Arizani qoldiring — mutaxassisimiz siz bilan bog‘lanib, marshrut va narxlar bo‘yicha maslahat beradi.',
    fields: {
      name: { label: 'Ismingiz', placeholder: 'Masalan, Aziza' },
      phone: { label: 'Telefon raqamingiz', placeholder: '+998 (XX) XXX-XX-XX' },
      email: { label: 'Email', placeholder: 'siz@example.com' },
      destination: { label: 'Qiziqqan yo‘nalish', placeholder: 'Yo‘nalishni tanlang' },
      comment: {
        label: 'Izoh',
        placeholder: 'Sanalar, sayyohlar soni, qiziqishlaringiz…',
      },
    },
    optional: 'ixtiyoriy',
    destinationGroups: { cities: 'O‘zbekiston shaharlari', countries: 'Markaziy Osiyo davlatlari' },
    destinationOther: 'Boshqa',
    submit: 'Konsultatsiya olish',
    submitting: 'Yuborilmoqda…',
    privacyNote:
      'Ma’lumotlaringiz faqat siz bilan bog‘lanish uchun ishlatiladi va uchinchi shaxslarga berilmaydi.',
    errors: {
      required: 'Bu maydonni to‘ldiring',
      nameTooShort: 'Ism kamida {min} ta harfdan iborat bo‘lsin',
      tooLong: 'Ko‘pi bilan {max} ta belgi kiriting',
      phoneInvalid: 'Raqamni davlat kodi bilan to‘liq kiriting, masalan +998… yoki +7…',
      emailInvalid: 'Email manzilini to‘g‘ri kiriting',
      captcha: 'Iltimos, robot emasligingizni tasdiqlang',
    },
    success: {
      title: 'Rahmat! Arizangiz qabul qilindi',
      text: 'Mutaxassisimiz tez orada siz bilan bog‘lanadi.',
      again: 'Yana ariza yuborish',
    },
    failure: {
      title: 'Arizani yuborib bo‘lmadi',
      text: 'Internet aloqasini tekshirib, qayta urinib ko‘ring yoki bizga to‘g‘ridan-to‘g‘ri qo‘ng‘iroq qiling.',
      retry: 'Qayta yuborish',
    },
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Ko‘p beriladigan savollar',
    subtitle: 'Javob topa olmadingizmi? Konsultatsiya paytida batafsil aytib beramiz.',
    items: {
      visa: {
        question: 'O‘zbekistonga kelish uchun viza kerakmi?',
        answer:
          'Ko‘plab davlatlar fuqarolari O‘zbekistonga vizasiz kira oladi, boshqalar uchun onlayn elektron viza mavjud. Talablar fuqarolikka qarab farq qiladi, shuning uchun konsultatsiya paytida aynan sizning holatingizni tekshirib, kerak bo‘lsa hujjatlarga yordam beramiz.',
      },
      currency: {
        question: 'Qaysi valyuta ishlatiladi, kartadan to‘lash mumkinmi?',
        answer:
          'Milliy valyuta — o‘zbek so‘mi (UZS). Yirik shaharlardagi mehmonxona, restoran va do‘konlarda xalqaro kartalar qabul qilinadi, bozor va kichik do‘konlar uchun naqd pul olib yurgan ma’qul. Valyutani bank va rasmiy ayirboshlash shoxobchalarida almashtirish mumkin.',
      },
      season: {
        question: 'Sayohat uchun eng yaxshi mavsum qachon?',
        answer:
          'Eng qulay vaqt — bahor (aprel–iyun) va kuz (sentabr–oktabr): havo iliq, bog‘lar gullagan yoki hosil pishgan bo‘ladi. Yozda kunduzi juda issiq, ammo tog‘li hududlar uchun ayni mavsum. Qishda sayyohlar kam, narxlar esa qulayroq.',
      },
      languages: {
        question: 'Qaysi tillarda gaplashiladi?',
        answer:
          'Davlat tili — o‘zbek tili, rus tili ham keng tarqalgan. Sayyohlik joylarida ingliz tilini tushunadiganlar ko‘p. Gidlarimiz o‘zbek, rus va ingliz tillarida ekskursiya o‘tkazadi; boshqa tillarni oldindan kelishib olamiz.',
      },
      transport: {
        question: 'Shaharlar orasida qanday harakatlaniladi?',
        answer:
          'Toshkent, Samarqand va Buxoro orasida tezyurar poyezdlar qatnaydi — Toshkentdan Samarqandgacha taxminan ikki soat. Uzoqroq masofalarga ichki reyslar, qolgan yo‘nalishlarga esa haydovchili qulay transferlarni tashkil qilamiz.',
      },
      cuisine: {
        question: 'Qaysi milliy taomlarni albatta tatib ko‘rish kerak?',
        answer:
          'Palov, tandir somsa, lag‘mon, shashlik, manti va issiq tandir non — eng mashhurlari. Har bir viloyatda palovning o‘z usuli bor. Vegetarian va boshqa parhez talablari bo‘lsa, oldindan aytsangiz, mos joylarni tanlaymiz.',
      },
      safety: {
        question: 'O‘zbekistonda sayohat qilish xavfsizmi?',
        answer:
          'O‘zbekiston sayyohlar uchun tinch va qulay mamlakat hisoblanadi. Biz faqat tekshirilgan mehmonxona va transportdan foydalanamiz hamda safar davomida siz bilan doimiy aloqada bo‘lamiz.',
      },
      consultation: {
        question: 'Bepul konsultatsiya qanday o‘tadi?',
        answer:
          'Arizani qoldirasiz, mutaxassisimiz siz bilan qulay usulda — qo‘ng‘iroq, Telegram yoki WhatsApp orqali bog‘lanadi. Sanalar, qiziqishlar va byudjetni aniqlab, marshrut taklifi va taxminiy narxni tayyorlaymiz. Konsultatsiya sizni hech narsaga majburlamaydi.',
      },
    },
  },

  footer: {
    tagline: 'O‘zbekiston va Markaziy Osiyo bo‘ylab kiruvchi va chiquvchi turizm agentligi.',
    contactsTitle: 'Kontaktlar',
    menuTitle: 'Menyu',
    socialTitle: 'Ijtimoiy tarmoqlar',
    addressLabel: 'Manzil',
    address: 'Toshkent viloyati, Yuqorichirchiq tumani, Sergeli MFY, Kizilyulduz ko‘chasi, 48-uy',
    phoneLabel: 'Telefon',
    emailLabel: 'Email',
    companyTitle: 'Rekvizitlar',
    companyDetails: [
      '«MANGOTOUR TRAVEL» MChJ',
      'STIR: 313 479 851',
      'Turoperator litsenziyasi: № XXXX',
    ],
    offerLink: 'Ommaviy oferta',
    photoCredits: 'Foto mualliflari va litsenziyalar',
    copyright: '© {year} mango_tour. Barcha huquqlar himoyalangan.',
  },

  floating: {
    label: 'Messenjer orqali yozish',
    telegram: 'Telegram orqali yozish',
    whatsapp: 'WhatsApp orqali yozish',
  },
} as const satisfies SiteContent;
