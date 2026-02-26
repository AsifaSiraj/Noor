export interface Zikr {
  id: number;
  arabic: string;
  translation: string;
  count: number;
  category: 'morning' | 'evening';
}

export const morningAzkar: Zikr[] = [
  { id: 1, arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ', translation: 'We have reached the morning and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.', count: 1, category: 'morning' },
  { id: 2, arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ', translation: 'O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection.', count: 1, category: 'morning' },
  { id: 3, arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ', translation: 'Glory is to Allah and praise is to Him.', count: 100, category: 'morning' },
  { id: 4, arabic: 'لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', translation: 'None has the right to be worshipped except Allah, alone, without partner, to Him belongs all sovereignty and praise, and He is over all things omnipotent.', count: 10, category: 'morning' },
  { id: 5, arabic: 'أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created.', count: 3, category: 'morning' },
  { id: 6, arabic: 'بِسْمِ اللهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ', translation: 'In the name of Allah with whose name nothing is harmed on earth nor in the heavens and He is The All-Seeing, The All-Knowing.', count: 3, category: 'morning' },
  { id: 7, arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ', translation: 'O Allah, I ask You for well-being in this world and the next.', count: 3, category: 'morning' },
  { id: 8, arabic: 'حَسْبِيَ اللَّهُ لَا إِلَـٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ ۖ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ', translation: 'Allah is Sufficient for me, none has the right to be worshipped except Him, upon Him I rely and He is Lord of the exalted throne.', count: 7, category: 'morning' },
];

export const eveningAzkar: Zikr[] = [
  { id: 101, arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ', translation: 'We have reached the evening and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.', count: 1, category: 'evening' },
  { id: 102, arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ', translation: 'O Allah, by Your leave we have reached the evening and by Your leave we have reached the morning, by Your leave we live and die and unto You is our return.', count: 1, category: 'evening' },
  { id: 103, arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ', translation: 'Glory is to Allah and praise is to Him.', count: 100, category: 'evening' },
  { id: 104, arabic: 'أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created.', count: 3, category: 'evening' },
  { id: 105, arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ', translation: 'O Allah, I ask You for well-being in this world and the next.', count: 3, category: 'evening' },
  { id: 106, arabic: 'حَسْبِيَ اللَّهُ لَا إِلَـٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ ۖ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ', translation: 'Allah is Sufficient for me, none has the right to be worshipped except Him, upon Him I rely and He is Lord of the exalted throne.', count: 7, category: 'evening' },
];

export const hijriMonths = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Ula', 'Jumada al-Thani', 'Rajab', 'Shaban',
  'Ramadan', 'Shawwal', 'Dhul Qadah', 'Dhul Hijjah'
];

export interface BookChapter {
  id: number;
  titleArabic: string;
  titleUrdu: string;
  titleEnglish: string;
  content: string[];
  hadith?: string;
  hadithSource?: string;
}

export const tuhfatulAkhirat: BookChapter[] = [
  {
    id: 1,
    titleArabic: 'بَابُ ذِكْرِ الْمَوْتِ',
    titleUrdu: 'موت کی یاد',
    titleEnglish: 'Remembrance of Death',
    content: [
      'Nabi ﷺ ne farmaya: "Tamam lazzaton ko khatam karne wali cheez (yani maut) ko kasrat se yaad karo." (Tirmizi)',
      'Maut har insaan ke liye yaqeeni hai. Allah Ta\'ala ne farmaya: "Har nafs ko maut ka maza chakna hai." (Surah Aal-e-Imran: 185)',
      'Hazrat Umar (RA) farmate hain: "Apna muhasba karo qabl iske ke tumhara muhasba kiya jaye, aur apne aamaal ko tolo qabl iske ke woh tole jayein."',
      'Maut ki tayyari ka matlab yeh hai ke insaan apne gunahon se tauba kare, logon ke huqooq ada kare, aur nek aamaal mein masroof rahe.',
      'Hazrat Ali (RA) ne farmaya: "Duniya peeth pher kar ja rahi hai aur Akhirat saamne aa rahi hai, pas tum Akhirat ke farzand bano, duniya ke nahi."'
    ],
    hadith: 'أَكْثِرُوا ذِكْرَ هَاذِمِ اللَّذَّاتِ يَعْنِي الْمَوْتَ',
    hadithSource: 'Sunan al-Tirmidhi 2307'
  },
  {
    id: 2,
    titleArabic: 'بَابُ عَذَابِ الْقَبْرِ وَنَعِيمِهِ',
    titleUrdu: 'قبر کا عذاب اور نعمت',
    titleEnglish: 'Punishment & Blessings of the Grave',
    content: [
      'Qabr Akhirat ki pehli manzil hai. Nabi ﷺ ne farmaya: "Qabr ya toh Jannat ke baaghon mein se aik baagh hai ya Jahannam ke gaddho mein se aik gaddha." (Tirmizi)',
      'Qabr mein teen sawaal pooche jayenge: Tera Rab kaun hai? Tera Deen kya hai? Is shakhs ke baare mein kya kehta hai jo tumhare paas bheja gaya tha?',
      'Momin jawab dega: Mera Rab Allah hai, mera Deen Islam hai, aur yeh Muhammad ﷺ hain. Tab us ke liye Jannat ka darwaza khola jayega.',
      'Kafir aur munafiq keh dega: Haaye haaye! Main nahi jaanta. Tab us par qabr tang ki jayegi aur azaab diya jayega.',
      'Nabi ﷺ qabr ke azaab se panah maanga karte the. Har namaz mein yeh dua padhni chahiye.'
    ],
    hadith: 'إِنَّ الْقَبْرَ أَوَّلُ مَنَازِلِ الْآخِرَةِ',
    hadithSource: 'Sunan al-Tirmidhi 2308'
  },
  {
    id: 3,
    titleArabic: 'بَابُ أَهْوَالِ يَوْمِ الْقِيَامَةِ',
    titleUrdu: 'قیامت کی ہولناکیاں',
    titleEnglish: 'Horrors of the Day of Judgment',
    content: [
      'Qayamat ka din 50,000 saal ke barabar lamba hoga. Suraj logon ke qareeb aa jayega aur log apne pasene mein doobe honge.',
      'Allah Ta\'ala farmata hai: "Jab zameen apni poori shiddat se hilaayi jayegi, aur zameen apne bojh bahar phenk degi." (Surah Zilzaal)',
      'Us din koi kisi ka madad nahi karega siway Allah ke izn ke. Maa baap, bhai, behen sab ek doosre se bhagenge.',
      'Nabi ﷺ ne farmaya: "Qayamat ke din log nange paon, nange badan aur beghaur khatna uthaye jayenge." Hazrat Aisha (RA) ne kaha: Kya mard aur auratein ek doosre ko dekhenge? Aap ﷺ ne farmaya: "Mamla itna sakht hoga ke kisi ko is ki fikr nahi hogi."',
      'Amaal ka tarazoo rakha jayega. Jis ke nek aamaal bhaari honge woh kamyaab hoga, aur jis ke halke honge woh nuqsaan mein hoga.'
    ],
    hadith: 'يَوْمَ يَقُومُ النَّاسُ لِرَبِّ الْعَالَمِينَ',
    hadithSource: 'Surah Al-Mutaffifin: 6'
  },
  {
    id: 4,
    titleArabic: 'بَابُ الصِّرَاطِ وَالْحِسَابِ',
    titleUrdu: 'پل صراط اور حساب کتاب',
    titleEnglish: 'The Bridge (Sirat) & Accountability',
    content: [
      'Pul Sirat Jahannam ke upar lagaya jayega. Yeh baal se bareek aur talwar se tez hoga. Sab logon ko is par se guzarna hoga.',
      'Momin is par se bijli ki tarah, hawa ki tarah, ghode ki tarah guzar jayenge. Kuch log rengenge aur kuch gir jayenge.',
      'Nabi ﷺ ne farmaya: Pehla hisaab namaz ka hoga. Agar namaz durust hui toh baqi aamaal bhi durust honge.',
      'Allah Ta\'ala farmata hai: "Pas jis ne zarrah barabar neki ki hogi woh use dekhega, aur jis ne zarrah barabar burai ki hogi woh bhi use dekhega." (Surah Zilzaal: 7-8)',
      'Har insaan ko uska naam-e-aamaal diya jayega. Nek logon ko daahini taraf aur bure logon ko baayin taraf ya peeth ke peeche.'
    ],
    hadith: 'أَوَّلُ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ الصَّلاَةُ',
    hadithSource: 'Sunan al-Nasai 465'
  },
  {
    id: 5,
    titleArabic: 'بَابُ صِفَةِ الْجَنَّةِ',
    titleUrdu: 'جنت کی صفات',
    titleEnglish: 'Description of Paradise (Jannah)',
    content: [
      'Allah Ta\'ala farmata hai: "Main ne apne nek bandon ke liye woh cheezein tayyar ki hain jo na kisi aankh ne dekhi, na kisi kaan ne suni, aur na kisi ke dil mein aaya." (Hadith Qudsi - Bukhari)',
      'Jannat mein 100 darje hain. Har do darjon ke beech itna faasla hai jitna zameen aur aasman ka faasla hai.',
      'Jannat mein nehrein hain — doodh ki, shahad ki, sharaab ki (jo nasha nahi deti), aur saaf paani ki.',
      'Jannat walon ki sabse badi naimat Allah Ta\'ala ka deedar hoga. Allah Ta\'ala farmata hai: "Us din kuch chehre roshan honge, apne Rab ko dekh rahe honge." (Surah Qayamah: 22-23)',
      'Jannat mein maut nahi hogi, beemai nahi hogi, budhapa nahi hoga. Hamesha hamesha ke liye aram aur khushi hogi.',
      'Sabse kamtar Jannati ko bhi itna diya jayega jitna duniya ka 10 guna hai. (Bukhari & Muslim)'
    ],
    hadith: 'فِيهَا مَا لَا عَيْنٌ رَأَتْ، وَلَا أُذُنٌ سَمِعَتْ، وَلَا خَطَرَ عَلَى قَلْبِ بَشَرٍ',
    hadithSource: 'Sahih al-Bukhari 3244'
  },
  {
    id: 6,
    titleArabic: 'بَابُ صِفَةِ النَّارِ',
    titleUrdu: 'جہنم کی صفات',
    titleEnglish: 'Description of Hellfire (Jahannam)',
    content: [
      'Jahannam ki aag duniya ki aag se 70 guna zyada sakht hai. (Bukhari & Muslim)',
      'Allah Ta\'ala farmata hai: "Toh us aag se daro jis ka eendhan insaan aur patthar hain, jo kafiron ke liye tayyar ki gayi hai." (Surah Baqarah: 24)',
      'Jahannam ke log zaqqum ka darakht khayenge aur khaulta hua paani peeyenge.',
      'Nabi ﷺ ne farmaya: "Agar Jahannam se aik boond duniya ke samundaron mein daal di jaye toh woh sab ganda kar degi." (Tirmizi)',
      'Jahannam ke sab se halke azaab wala shakhs woh hoga jis ke pairon ke neeche aag ke angare rakhe jayenge jis se uska dimagh khaulega.',
      'Allah Ta\'ala Apni rehmaton se hume Jahannam se bachaye. Aameen.'
    ],
    hadith: 'نَارُكُمْ هَذِهِ جُزْءٌ مِنْ سَبْعِينَ جُزْءًا مِنْ نَارِ جَهَنَّمَ',
    hadithSource: 'Sahih al-Bukhari 3265'
  },
  {
    id: 7,
    titleArabic: 'بَابُ التَّوْبَةِ',
    titleUrdu: 'توبہ کی فضیلت',
    titleEnglish: 'The Virtue of Repentance (Taubah)',
    content: [
      'Allah Ta\'ala farmata hai: "Kaho: Aye mere bandon! Jinhon ne apni jaanon par zulm kiya hai, Allah ki rehmat se mayoos mat ho. Beshak Allah tamam gunahon ko maaf kar deta hai." (Surah Zumar: 53)',
      'Nabi ﷺ ne farmaya: "Allah Ta\'ala apne bande ki tauba se itna khush hota hai jitna tum mein se koi khush hota hai jab use apni khoyi hui sawaari paani aur khaane ke saath milti hai." (Muslim)',
      'Tauba ki teen shartein hain: (1) Gunaah chhod dena (2) Gunaah par nadaamat karna (3) Aage se na karne ka pukka irada karna. Agar kisi ka haq maara ho toh chauthi shart hai ke uska haq wapas karna.',
      'Allah ka darwaza hamesha khula hai. Raat ko gunaah karne wale ke liye subah tauba ka mauka hai, aur din ko gunaah karne wale ke liye raat ko tauba ka mauka.',
      'Istighfar ki kasrat karo. Nabi ﷺ din mein 70 se zyada baar istighfar karte the halaanke aap ke tamam gunaah maaf the.'
    ],
    hadith: 'يَا عِبَادِي الَّذِينَ أَسْرَفُوا عَلَى أَنْفُسِهِمْ لَا تَقْنَطُوا مِنْ رَحْمَةِ اللَّهِ',
    hadithSource: 'Surah Az-Zumar: 53'
  },
  {
    id: 8,
    titleArabic: 'بَابُ فَضَائِلِ الْأَعْمَالِ',
    titleUrdu: 'نیک اعمال کی فضیلت',
    titleEnglish: 'Virtues of Good Deeds',
    content: [
      'Namaz: Nabi ﷺ ne farmaya: "Bande aur shirk/kufr ke darmiyaan namaz ka chhorna hai." (Muslim)',
      'Quran: Nabi ﷺ ne farmaya: "Quran ka aik harf padhne par aik neki hai aur har neki ka 10 guna sawab hai." (Tirmizi)',
      'Sadaqah: Nabi ﷺ ne farmaya: "Sadaqah gunahon ko aise bujhata hai jaise paani aag ko bujhata hai." (Tirmizi)',
      'Roza: Allah Ta\'ala farmata hai (Hadith Qudsi): "Roza mere liye hai aur main hi is ka badla doonga." (Bukhari)',
      'Zikrullah: Nabi ﷺ ne farmaya: "Kya main tumhe tumhare behtareen amal na bataun? Jo tumhare Malik ke nazdeek sab se zyada paakeeza hai? SubhanAllah wal Hamdulillah." (Tirmizi)',
      'Dua: Nabi ﷺ ne farmaya: "Dua ibadat ka maghz (core) hai." (Tirmizi)',
      'Sabr: Allah farmata hai: "Beshak sabar karne walon ko be-hisaab ajr diya jayega." (Surah Zumar: 10)'
    ],
    hadith: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    hadithSource: 'Sahih al-Bukhari 5027'
  },
  {
    id: 9,
    titleArabic: 'بَابُ عَلَامَاتِ السَّاعَةِ',
    titleUrdu: 'قیامت کی نشانیاں',
    titleEnglish: 'Signs of the Hour',
    content: [
      'Choti Nishaaniyan: Ilm ka uthna, jahalat ka phailna, zina ka aam hona, sharaab ka kasrat se peena, mard kam aur auratein zyada hona.',
      'Nabi ﷺ ne farmaya: "Qayamat us waqt tak nahi aayegi jab tak imaaratain badi badi na bana li jayein." (Bukhari)',
      'Badi Nishaaniyan: Imam Mehdi ka aana, Dajjal ka aana, Hazrat Isa (AS) ka nazool, Yajooj Majooj ka nikalna.',
      'Suraj maghrib se tulu hoga — us ke baad tauba ka darwaza band ho jayega.',
      'Aik dhuaan aayega jo tamam zameen ko gher lega. Tab ke baad Qayamat bohot qareeb hogi.',
      'In nishaniyon ka maqsad yeh hai ke insaan hamesha tayyar rahe aur nek aamaal karta rahe.'
    ],
    hadith: 'بُعِثْتُ أَنَا وَالسَّاعَةَ كَهَاتَيْنِ',
    hadithSource: 'Sahih al-Bukhari 6503'
  },
  {
    id: 10,
    titleArabic: 'بَابُ الدُّعَاءِ لِلْآخِرَةِ',
    titleUrdu: 'آخرت کی دعائیں',
    titleEnglish: 'Duas for the Hereafter',
    content: [
      'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ\nAye hamare Rab! Hume duniya mein bhi bhalai de aur Akhirat mein bhi bhalai de aur hume aag ke azaab se bacha.',
      'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ وَمِنْ عَذَابِ جَهَنَّمَ\nAye Allah! Main tere se qabr ke azaab aur Jahannam ke azaab se panah maangta hoon.',
      'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ\nAye Allah! Meri madad farma Tere zikr mein, Tere shukr mein, aur Teri behtareen ibadat mein.',
      'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ\nAye mere Rab! Mujhe namaz qaim karne wala bana aur meri aulad ko bhi. Aye hamare Rab! Meri dua qabool farma.',
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ\nAye Allah! Main Tujh se Jannat maangta hoon aur Jahannam se Teri panah maangta hoon.'
    ],
    hadith: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    hadithSource: 'Surah Al-Baqarah: 201'
  }
];

export const tasbeehItems = [
  { id: 1, arabic: 'سُبْحَانَ اللَّهِ', translation: 'SubhanAllah (Glory be to Allah)', target: 33 },
  { id: 2, arabic: 'الْحَمْدُ لِلَّهِ', translation: 'Alhamdulillah (Praise be to Allah)', target: 33 },
  { id: 3, arabic: 'اللَّهُ أَكْبَرُ', translation: 'Allahu Akbar (Allah is the Greatest)', target: 34 },
  { id: 4, arabic: 'لَا إِلَهَ إِلَّا اللَّهُ', translation: 'La ilaha illallah (There is no god but Allah)', target: 100 },
  { id: 5, arabic: 'أَسْتَغْفِرُ اللَّهَ', translation: 'Astaghfirullah (I seek forgiveness from Allah)', target: 100 },
  { id: 6, arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', translation: 'La hawla wala quwwata illa billah', target: 100 },
];
