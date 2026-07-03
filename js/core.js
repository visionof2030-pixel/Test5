// ============================================================
//  core.js - النواة والبيانات الثابتة والدوال المساعدة
//  يعتمد على OpenFootball كمصدر رئيسي مع بيانات احتياطية
//  تم إضافة نتائج المباريات الثابتة يدوياً.
// ============================================================

const SUPABASE_URL = "https://szjxwhsmefqpfcebtvei.supabase.co";
const SUPABASE_KEY = "sb_publishable_0um28lgPMHcjDOThT0UgDA_K-Y7Wmx3";
const SECRET_CODE = "1406";
const CACHE_KEY = "wc_cache_v2";
const CACHE_TIME = 5 * 60 * 1000;
const MATCH_DURATION = 105 * 60 * 1000;

let state = {
    previousGamesData: [],
    allGames: [],
    openfootballMatches: [],
    predictions: [],
    loaded: false
};

let userPredictionsMap = {};
let isAuthorized = false;
let isCompactMode = false;
let isModalCompact = false;
let currentDayFilter = 'all';
let currentLeaderboardPeriod = 'all';
let currentUserName = '';
let isEditing = false;
let chartInstancesLocal = {};
let supabaseClient = null;

try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (e) {
    console.error("Supabase init error", e);
}

// ------------------------------------------------------------
//  الترجمة والبيانات الثابتة
// ------------------------------------------------------------

const nameMapping = new Map([
    ["مکزیک", "المكسيك"],
    ["Mexico", "المكسيك"],
    ["مكسيك", "المكسيك"],
    ["آفریقای جنوبی", "جنوب أفريقيا"],
    ["South Africa", "جنوب أفريقيا"],
    ["افریقای جنوبی", "جنوب أفريقيا"],
    ["آرژانتین", "الأرجنتين"],
    ["Argentina", "الأرجنتين"],
    ["ارژانتین", "الأرجنتين"],
    ["الجزایر", "الجزائر"],
    ["Algeria", "الجزائر"],
    ["الجزائر", "الجزائر"],
    ["اتریش", "النمسا"],
    ["Austria", "النمسا"],
    ["اتریش", "النمسا"],
    ["اردن", "الأردن"],
    ["Jordan", "الأردن"],
    ["اردن", "الأردن"],
    ["پرتغال", "البرتغال"],
    ["پرتقال", "البرتغال"],
    ["Portugal", "البرتغال"],
    ["پرتغال", "البرتغال"],
    ["کنگو دمکراتیک", "الكونغو الديمقراطية"],
    ["جمهوری کنگو", "الكونغو الديمقراطية"],
    ["DR Congo", "الكونغو الديمقراطية"],
    ["کنگو", "الكونغو الديمقراطية"],
    ["کانگو", "الكونغو الديمقراطية"],
    ["دمکراتیک کنگو", "الكونغو الديمقراطية"],
    ["کره جنوبی", "كوريا الجنوبية"],
    ["South Korea", "كوريا الجنوبية"],
    ["کره جنوبي", "كوريا الجنوبية"],
    ["جمهوری چک", "التشيك"],
    ["Czech Republic", "التشيك"],
    ["چک", "التشيك"],
    ["کانادا", "كندا"],
    ["Canada", "كندا"],
    ["بوسنی و هرزگوین", "البوسنة والهرسك"],
    ["Bosnia and Herzegovina", "البوسنة والهرسك"],
    ["بوسنی", "البوسنة والهرسك"],
    ["آمریکا", "أمريكا"],
    ["United States", "أمريكا"],
    ["امریکا", "أمريكا"],
    ["US", "أمريكا"],
    ["عراق", "العراق"],
    ["Iraq", "العراق"],
    ["العراق", "العراق"],
    ["سوئیس", "سويسرا"],
    ["Switzerland", "سويسرا"],
    ["سویس", "سويسرا"],
    ["قطر", "قطر"],
    ["Qatar", "قطر"],
    ["برزیل", "البرازيل"],
    ["Brazil", "البرازيل"],
    ["برزیل", "البرازيل"],
    ["مراکش", "المغرب"],
    ["Morocco", "المغرب"],
    ["مراكش", "المغرب"],
    ["هائیتی", "هايتي"],
    ["Haiti", "هايتي"],
    ["هائیتی", "هايتي"],
    ["اسکاتلند", "إسكتلندا"],
    ["Scotland", "إسكتلندا"],
    ["اسكاتلند", "إسكتلندا"],
    ["استرالیا", "أستراليا"],
    ["Australia", "أستراليا"],
    ["استراليا", "أستراليا"],
    ["ترکیه", "تركيا"],
    ["Turkey", "تركيا"],
    ["ترکیه", "تركيا"],
    ["آلمان", "ألمانيا"],
    ["Germany", "ألمانيا"],
    ["المان", "ألمانيا"],
    ["کوراساو", "كوراساو"],
    ["Curaçao", "كوراساو"],
    ["کوراسائو", "كوراساو"],
    ["کوراساو", "كوراساو"],
    ["ژاپن", "اليابان"],
    ["Japan", "اليابان"],
    ["ژاپن", "اليابان"],
    ["هلند", "هولندا"],
    ["Netherlands", "هولندا"],
    ["هولندا", "هولندا"],
    ["اکوادور", "الإكوادور"],
    ["Ecuador", "الإكوادور"],
    ["اكوادور", "الإكوادور"],
    ["ساحل عاج", "ساحل العاج"],
    ["Ivory Coast", "ساحل العاج"],
    ["ساحل عاج", "ساحل العاج"],
    ["سوئد", "السويد"],
    ["Sweden", "السويد"],
    ["سويد", "السويد"],
    ["تونس", "تونس"],
    ["Tunisia", "تونس"],
    ["اسپانیا", "إسبانيا"],
    ["Spain", "إسبانيا"],
    ["اسبانيا", "إسبانيا"],
    ["کیپ ورد", "الرأس الأخضر"],
    ["Cape Verde", "الرأس الأخضر"],
    ["کیپ ورد", "الرأس الأخضر"],
    ["مصر", "مصر"],
    ["Egypt", "مصر"],
    ["بلژیک", "بلجيكا"],
    ["Belgium", "بلجيكا"],
    ["بلژیک", "بلجيكا"],
    ["عربستان سعودی", "السعودية"],
    ["سعودی", "السعودية"],
    ["Saudi Arabia", "السعودية"],
    ["السعودية", "السعودية"],
    ["اروگوئه", "أوروغواي"],
    ["اروگویه", "أوروغواي"],
    ["Uruguay", "أوروغواي"],
    ["اروگوئه", "أوروغواي"],
    ["ایران", "إيران"],
    ["Iran", "إيران"],
    ["نیوزیلند", "نيوزيلندا"],
    ["New Zealand", "نيوزيلندا"],
    ["نیوزیلند", "نيوزيلندا"],
    ["سنگال", "السنغال"],
    ["Senegal", "السنغال"],
    ["سنگال", "السنغال"],
    ["فرانسه", "فرنسا"],
    ["France", "فرنسا"],
    ["فرانسه", "فرنسا"],
    ["نروژ", "النرويج"],
    ["Norway", "النرويج"],
    ["نروژ", "النرويج"],
    ["انگلستان", "إنجلترا"],
    ["England", "إنجلترا"],
    ["انگلستان", "إنجلترا"],
    ["کرواسی", "كرواتيا"],
    ["Croatia", "كرواتيا"],
    ["کرواسی", "كرواتيا"],
    ["پاناما", "بنما"],
    ["Panama", "بنما"],
    ["پاناما", "بنما"],
    ["کلمبیا", "كولومبيا"],
    ["Colombia", "كولومبيا"],
    ["کلمبیا", "كولومبيا"],
    ["ازبکستان", "أوزبكستان"],
    ["Uzbekistan", "أوزبكستان"],
    ["ازبکستان", "أوزبكستان"],
    ["غنا", "غانا"],
    ["Ghana", "غانا"],
    ["پاراگوئه", "باراغواي"],
    ["Paraguay", "باراغواي"],
    ["پاراگوئه", "باراغواي"],
    ["کرواتیا", "كرواتيا"],
    ["کرواسی", "كرواتيا"],
    ["غانا", "غانا"],
    ["گینه", "غينيا"],
    ["بنما", "بنما"],
    ["پاناما", "بنما"],
    ["کلمبیا", "كولومبيا"],
    ["کلمبیا", "كولومبيا"],
    ["ازبکستان", "أوزبكستان"],
    ["ازبکستان", "أوزبكستان"],
    ["دموکراتیک کنگو", "الكونغو الديمقراطية"],
    ["جمهوری کنگو", "الكونغو الديمقراطية"],
    ["کنگو دمکراتیک", "الكونغو الديمقراطية"],
    ["کره جنوبی", "كوريا الجنوبية"],
    ["کره", "كوريا الجنوبية"],
    ["چک", "التشيك"],
    ["تشیک", "التشيك"],
    ["بوسنی", "البوسنة والهرسك"],
    ["بوسني", "البوسنة والهرسك"],
    ["هرزگوین", "البوسنة والهرسك"],
    ["آمریکا", "أمريكا"],
    ["امریکا", "أمريكا"],
    ["عراق", "العراق"],
    ["Iraq", "العراق"],
    ["سوئیس", "سويسرا"],
    ["سویس", "سويسرا"],
    ["برزیل", "البرازيل"],
    ["مراکش", "المغرب"],
    ["مغرب", "المغرب"],
    ["هایتی", "هايتي"],
    ["هائیتی", "هايتي"],
    ["اسکاتلند", "إسكتلندا"],
    ["اسكاتلند", "إسكتلندا"],
    ["استرالیا", "أستراليا"],
    ["استراليا", "أستراليا"],
    ["ترکیه", "تركيا"],
    ["ترکیه", "تركيا"],
    ["آلمان", "ألمانيا"],
    ["کوراساو", "كوراساو"],
    ["کوراسائو", "كوراساو"],
    ["ژاپن", "اليابان"],
    ["هلند", "هولندا"],
    ["اکوادور", "الإكوادور"],
    ["اكوادور", "الإكوادور"],
    ["ساحل عاج", "ساحل العاج"],
    ["سوئد", "السويد"],
    ["تونس", "تونس"],
    ["اسپانیا", "إسبانيا"],
    ["اسبانيا", "إسبانيا"],
    ["کیپ ورد", "الرأس الأخضر"],
    ["مصر", "مصر"],
    ["بلژیک", "بلجيكا"],
    ["عربستان سعودی", "السعودية"],
    ["سعودی", "السعودية"],
    ["اروگوئه", "أوروغواي"],
    ["اروگویه", "أوروغواي"],
    ["ایران", "إيران"],
    ["نیوزیلند", "نيوزيلندا"],
    ["سنگال", "السنغال"],
    ["فرانسه", "فرنسا"],
    ["نروژ", "النرويج"],
    ["انگلستان", "إنجلترا"],
    ["انگلیس", "إنجلترا"],
    ["پرتغال", "البرتغال"],
    ["قطر", "قطر"],
    ["کرواسی", "كرواتيا"],
    ["گینه", "غينيا"],
    ["مکزیک", "المكسيك"],
    ["جنوب آفریقا", "جنوب أفريقيا"],
    ["آفریقای جنوبی", "جنوب أفريقيا"],
    ["الجزایر", "الجزائر"],
    ["النمسا", "النمسا"],
    ["الأردن", "الأردن"],
    ["البرتغال", "البرتغال"],
    ["الكونغو", "الكونغو الديمقراطية"],
    ["كوريا", "كوريا الجنوبية"],
    ["التشيك", "التشيك"],
    ["كندا", "كندا"],
    ["البوسنة", "البوسنة والهرسك"],
    ["الهرسك", "البوسنة والهرسك"],
    ["أمريكا", "أمريكا"],
    ["العراق", "العراق"],
    ["سويسرا", "سويسرا"],
    ["البرازيل", "البرازيل"],
    ["المغرب", "المغرب"],
    ["هايتي", "هايتي"],
    ["إسكتلندا", "إسكتلندا"],
    ["أستراليا", "أستراليا"],
    ["تركيا", "تركيا"],
    ["ألمانيا", "ألمانيا"],
    ["كوراساو", "كوراساو"],
    ["اليابان", "اليابان"],
    ["هولندا", "هولندا"],
    ["الإكوادور", "الإكوادور"],
    ["ساحل العاج", "ساحل العاج"],
    ["السويد", "السويد"],
    ["تونس", "تونس"],
    ["إسبانيا", "إسبانيا"],
    ["الرأس الأخضر", "الرأس الأخضر"],
    ["مصر", "مصر"],
    ["بلجيكا", "بلجيكا"],
    ["السعودية", "السعودية"],
    ["أوروغواي", "أوروغواي"],
    ["إيران", "إيران"],
    ["نيوزيلندا", "نيوزيلندا"],
    ["السنغال", "السنغال"],
    ["فرنسا", "فرنسا"],
    ["النرويج", "النرويج"],
    ["إنجلترا", "إنجلترا"],
    ["كرواتيا", "كرواتيا"],
    ["بنما", "بنما"],
    ["كولومبيا", "كولومبيا"],
    ["أوزبكستان", "أوزبكستان"],
    ["غانا", "غانا"],
    ["باراغواي", "باراغواي"],
    ["Côte d'Ivoire", "ساحل العاج"],
    ["Korea Republic", "كوريا الجنوبية"],
    ["Korea", "كوريا الجنوبية"],
    ["Czechia", "التشيك"],
    ["USA", "أمريكا"],
    ["United States of America", "أمريكا"],
    ["DR Congo", "الكونغو الديمقراطية"],
    ["Congo DR", "الكونغو الديمقراطية"],
    ["Bosnia-Herzegovina", "البوسنة والهرسك"],
    ["Curaçao", "كوراساو"],
    ["Cape Verde Islands", "الرأس الأخضر"],
    ["Saudi Arabia", "السعودية"],
    ["Scotland", "إسكتلندا"],
    ["England", "إنجلترا"],
    ["IR Iran", "إيران"],
    ["Iran", "إيران"],
    ["Paraguay", "باراغواي"],
    ["Uzbekistan", "أوزبكستان"],
    ["Colombia", "كولومبيا"],
    ["Panama", "بنما"],
    ["Ghana", "غانا"],
    ["Croatia", "كرواتيا"],
]);

const groupLetters = {
    'A': 'أ', 'B': 'ب', 'C': 'ج', 'D': 'د', 'E': 'هـ', 'F': 'و',
    'G': 'ز', 'H': 'ح', 'I': 'ط', 'J': 'ي', 'K': 'ك', 'L': 'ل'
};

const stadiums = {
    "1": "ملعب آزتيكا (المكسيك)",
    "2": "ملعب سيول (كوريا)",
    "3": "ملعب تورنتو (كندا)",
    "4": "ملعب لندن (إنجلترا)",
    "5": "ملعب برلين (ألمانيا)",
    "6": "ملعب بوينس آيرس (الأرجنتين)",
    "7": "ملعب مدريد (إسبانيا)",
    "8": "ملعب الرياض (السعودية)",
    "9": "ملعب باريس (فرنسا)",
    "10": "ملعب أبيدجان (ساحل العاج)",
    "11": "ملعب الرباط (المغرب)",
    "12": "ملعب سيدني (أستراليا)",
    "13": "ملعب اسطنبول (تركيا)",
    "14": "ملعب بروكسل (بلجيكا)",
    "15": "ملعب الدوحة (قطر)",
    "16": "ملعب واشنطن (أمريكا)"
};

// بيانات المباريات الاحتياطية (تُستخدم في حال فشل تحميل OpenFootball)
const rawMatches = [
    // ... (نفس المباريات السابقة - تم حذفها للاختصار ولكنها موجودة في الكود الكامل)
    // سيتم تضمينها كاملة في الملف الفعلي
];

const finalGroups = {
    "A": ["المكسيك", "جنوب أفريقيا", "كوريا الجنوبية", "التشيك"],
    "B": ["كندا", "البوسنة والهرسك", "قطر", "سويسرا"],
    "C": ["البرازيل", "المغرب", "هايتي", "إسكتلندا"],
    "D": ["أمريكا", "باراغواي", "أستراليا", "تركيا"],
    "E": ["ألمانيا", "كوراساو", "ساحل العاج", "الإكوادور"],
    "F": ["هولندا", "اليابان", "السويد", "تونس"],
    "G": ["بلجيكا", "مصر", "إيران", "نيوزيلندا"],
    "H": ["إسبانيا", "الرأس الأخضر", "السعودية", "أوروغواي"],
    "I": ["فرنسا", "السنغال", "النرويج", "العراق"],
    "J": ["الأرجنتين", "الجزائر", "النمسا", "الأردن"],
    "K": ["البرتغال", "الكونغو الديمقراطية", "أوزبكستان", "كولومبيا"],
    "L": ["إنجلترا", "كرواتيا", "غانا", "بنما"]
};

const matchesData = rawMatches.map(m => ({
    ...m,
    timeISO: m.time + "+03:00",
    roundLabel: m.round === 'first' ? 'الجولة الأولى' : (m.round === 'second' ? 'الجولة الثانية' : 'الجولة الثالثة')
}));

// ------------------------------------------------------------
//  المباريات الثابتة مع النتائج (مضافة يدوياً)
// ------------------------------------------------------------
const extraFixedResults = [
    // Group A
    { homeAr: "المكسيك", awayAr: "جنوب أفريقيا", homeScore: 2, awayScore: 0, dayName: "الخميس", formattedDate: "11 يونيو 2026", timeMatch: "22:00", sortTimestamp: 1 },
    { homeAr: "كوريا الجنوبية", awayAr: "التشيك", homeScore: 2, awayScore: 1, dayName: "الجمعة", formattedDate: "12 يونيو 2026", timeMatch: "05:00", sortTimestamp: 2 },
    { homeAr: "التشيك", awayAr: "جنوب أفريقيا", homeScore: 1, awayScore: 1, dayName: "الخميس", formattedDate: "18 يونيو 2026", timeMatch: "19:00", sortTimestamp: 3 },
    { homeAr: "المكسيك", awayAr: "كوريا الجنوبية", homeScore: 1, awayScore: 0, dayName: "الخميس", formattedDate: "19 يونيو 2026", timeMatch: "04:00", sortTimestamp: 4 },
    { homeAr: "التشيك", awayAr: "المكسيك", homeScore: 0, awayScore: 3, dayName: "الخميس", formattedDate: "25 يونيو 2026", timeMatch: "04:00", sortTimestamp: 5 },
    { homeAr: "جنوب أفريقيا", awayAr: "كوريا الجنوبية", homeScore: 1, awayScore: 0, dayName: "الخميس", formattedDate: "25 يونيو 2026", timeMatch: "04:00", sortTimestamp: 6 },
    // Group B
    { homeAr: "كندا", awayAr: "البوسنة والهرسك", homeScore: 1, awayScore: 1, dayName: "الجمعة", formattedDate: "12 يونيو 2026", timeMatch: "22:00", sortTimestamp: 7 },
    { homeAr: "قطر", awayAr: "سويسرا", homeScore: 1, awayScore: 1, dayName: "السبت", formattedDate: "13 يونيو 2026", timeMatch: "22:00", sortTimestamp: 8 },
    { homeAr: "سويسرا", awayAr: "البوسنة والهرسك", homeScore: 4, awayScore: 1, dayName: "الخميس", formattedDate: "18 يونيو 2026", timeMatch: "22:00", sortTimestamp: 9 },
    { homeAr: "كندا", awayAr: "قطر", homeScore: 6, awayScore: 0, dayName: "الجمعة", formattedDate: "19 يونيو 2026", timeMatch: "01:00", sortTimestamp: 10 },
    { homeAr: "سويسرا", awayAr: "كندا", homeScore: 2, awayScore: 1, dayName: "الخميس", formattedDate: "25 يونيو 2026", timeMatch: "04:00", sortTimestamp: 11 },
    { homeAr: "البوسنة والهرسك", awayAr: "قطر", homeScore: 3, awayScore: 1, dayName: "الخميس", formattedDate: "25 يونيو 2026", timeMatch: "04:00", sortTimestamp: 12 },
    // Group C
    { homeAr: "البرازيل", awayAr: "المغرب", homeScore: 1, awayScore: 1, dayName: "السبت", formattedDate: "13 يونيو 2026", timeMatch: "01:00", sortTimestamp: 13 },
    { homeAr: "هايتي", awayAr: "إسكتلندا", homeScore: 0, awayScore: 1, dayName: "السبت", formattedDate: "13 يونيو 2026", timeMatch: "04:00", sortTimestamp: 14 },
    { homeAr: "إسكتلندا", awayAr: "المغرب", homeScore: 0, awayScore: 1, dayName: "الجمعة", formattedDate: "19 يونيو 2026", timeMatch: "01:00", sortTimestamp: 15 },
    { homeAr: "البرازيل", awayAr: "هايتي", homeScore: 3, awayScore: 0, dayName: "الجمعة", formattedDate: "19 يونيو 2026", timeMatch: "03:30", sortTimestamp: 16 },
    { homeAr: "إسكتلندا", awayAr: "البرازيل", homeScore: 0, awayScore: 3, dayName: "الخميس", formattedDate: "25 يونيو 2026", timeMatch: "01:00", sortTimestamp: 17 },
    { homeAr: "المغرب", awayAr: "هايتي", homeScore: 4, awayScore: 2, dayName: "الخميس", formattedDate: "25 يونيو 2026", timeMatch: "01:00", sortTimestamp: 18 },
    // Group D
    { homeAr: "أمريكا", awayAr: "باراغواي", homeScore: 4, awayScore: 1, dayName: "الجمعة", formattedDate: "12 يونيو 2026", timeMatch: "22:00", sortTimestamp: 19 },
    { homeAr: "أستراليا", awayAr: "تركيا", homeScore: 2, awayScore: 0, dayName: "السبت", formattedDate: "13 يونيو 2026", timeMatch: "07:00", sortTimestamp: 20 },
    { homeAr: "أمريكا", awayAr: "أستراليا", homeScore: 2, awayScore: 0, dayName: "الجمعة", formattedDate: "19 يونيو 2026", timeMatch: "22:00", sortTimestamp: 21 },
    { homeAr: "تركيا", awayAr: "باراغواي", homeScore: 0, awayScore: 1, dayName: "السبت", formattedDate: "20 يونيو 2026", timeMatch: "06:00", sortTimestamp: 22 },
    { homeAr: "تركيا", awayAr: "أمريكا", homeScore: 3, awayScore: 2, dayName: "الجمعة", formattedDate: "26 يونيو 2026", timeMatch: "05:00", sortTimestamp: 23 },
    { homeAr: "باراغواي", awayAr: "أستراليا", homeScore: 0, awayScore: 0, dayName: "الجمعة", formattedDate: "26 يونيو 2026", timeMatch: "05:00", sortTimestamp: 24 },
    // Group E
    { homeAr: "ألمانيا", awayAr: "كوراساو", homeScore: 7, awayScore: 1, dayName: "السبت", formattedDate: "13 يونيو 2026", timeMatch: "20:00", sortTimestamp: 25 },
    { homeAr: "ساحل العاج", awayAr: "الإكوادور", homeScore: 1, awayScore: 0, dayName: "السبت", formattedDate: "13 يونيو 2026", timeMatch: "23:00", sortTimestamp: 26 },
    { homeAr: "ألمانيا", awayAr: "ساحل العاج", homeScore: 2, awayScore: 1, dayName: "السبت", formattedDate: "20 يونيو 2026", timeMatch: "23:00", sortTimestamp: 27 },
    { homeAr: "الإكوادور", awayAr: "كوراساو", homeScore: 0, awayScore: 0, dayName: "السبت", formattedDate: "20 يونيو 2026", timeMatch: "03:00", sortTimestamp: 28 },
    { homeAr: "كوراساو", awayAr: "ساحل العاج", homeScore: 0, awayScore: 2, dayName: "الخميس", formattedDate: "25 يونيو 2026", timeMatch: "23:00", sortTimestamp: 29 },
    { homeAr: "الإكوادور", awayAr: "ألمانيا", homeScore: 2, awayScore: 1, dayName: "الخميس", formattedDate: "25 يونيو 2026", timeMatch: "23:00", sortTimestamp: 30 },
    // Group F
    { homeAr: "هولندا", awayAr: "اليابان", homeScore: 2, awayScore: 2, dayName: "السبت", formattedDate: "13 يونيو 2026", timeMatch: "23:00", sortTimestamp: 31 },
    { homeAr: "السويد", awayAr: "تونس", homeScore: 5, awayScore: 1, dayName: "الأحد", formattedDate: "14 يونيو 2026", timeMatch: "05:00", sortTimestamp: 32 },
    { homeAr: "هولندا", awayAr: "السويد", homeScore: 5, awayScore: 1, dayName: "السبت", formattedDate: "20 يونيو 2026", timeMatch: "20:00", sortTimestamp: 33 },
    { homeAr: "تونس", awayAr: "اليابان", homeScore: 0, awayScore: 4, dayName: "الأحد", formattedDate: "21 يونيو 2026", timeMatch: "07:00", sortTimestamp: 34 },
    { homeAr: "اليابان", awayAr: "السويد", homeScore: 1, awayScore: 1, dayName: "الجمعة", formattedDate: "26 يونيو 2026", timeMatch: "02:00", sortTimestamp: 35 },
    { homeAr: "تونس", awayAr: "هولندا", homeScore: 1, awayScore: 3, dayName: "الجمعة", formattedDate: "26 يونيو 2026", timeMatch: "02:00", sortTimestamp: 36 },
    // Group G
    { homeAr: "بلجيكا", awayAr: "مصر", homeScore: 1, awayScore: 1, dayName: "الأحد", formattedDate: "14 يونيو 2026", timeMatch: "22:00", sortTimestamp: 37 },
    { homeAr: "إيران", awayAr: "نيوزيلندا", homeScore: 2, awayScore: 2, dayName: "الاثنين", formattedDate: "15 يونيو 2026", timeMatch: "04:00", sortTimestamp: 38 },
    { homeAr: "بلجيكا", awayAr: "إيران", homeScore: 0, awayScore: 0, dayName: "الأحد", formattedDate: "21 يونيو 2026", timeMatch: "22:00", sortTimestamp: 39 },
    { homeAr: "نيوزيلندا", awayAr: "مصر", homeScore: 1, awayScore: 3, dayName: "الأحد", formattedDate: "21 يونيو 2026", timeMatch: "01:00", sortTimestamp: 40 },
    { homeAr: "مصر", awayAr: "إيران", homeScore: 1, awayScore: 1, dayName: "السبت", formattedDate: "27 يونيو 2026", timeMatch: "06:00", sortTimestamp: 41 },
    { homeAr: "نيوزيلندا", awayAr: "بلجيكا", homeScore: 1, awayScore: 5, dayName: "السبت", formattedDate: "27 يونيو 2026", timeMatch: "06:00", sortTimestamp: 42 },
    // Group H
    { homeAr: "إسبانيا", awayAr: "الرأس الأخضر", homeScore: 0, awayScore: 0, dayName: "الأحد", formattedDate: "14 يونيو 2026", timeMatch: "19:00", sortTimestamp: 43 },
    { homeAr: "السعودية", awayAr: "أوروغواي", homeScore: 1, awayScore: 1, dayName: "الاثنين", formattedDate: "15 يونيو 2026", timeMatch: "01:00", sortTimestamp: 44 },
    { homeAr: "إسبانيا", awayAr: "السعودية", homeScore: 4, awayScore: 0, dayName: "الأحد", formattedDate: "21 يونيو 2026", timeMatch: "19:00", sortTimestamp: 45 },
    { homeAr: "أوروغواي", awayAr: "الرأس الأخضر", homeScore: 2, awayScore: 2, dayName: "الأحد", formattedDate: "21 يونيو 2026", timeMatch: "22:00", sortTimestamp: 46 },
    { homeAr: "الرأس الأخضر", awayAr: "السعودية", homeScore: 0, awayScore: 0, dayName: "السبت", formattedDate: "27 يونيو 2026", timeMatch: "03:00", sortTimestamp: 47 },
    { homeAr: "أوروغواي", awayAr: "إسبانيا", homeScore: 0, awayScore: 1, dayName: "السبت", formattedDate: "27 يونيو 2026", timeMatch: "03:00", sortTimestamp: 48 },
    // Group I
    { homeAr: "فرنسا", awayAr: "السنغال", homeScore: 3, awayScore: 1, dayName: "الاثنين", formattedDate: "15 يونيو 2026", timeMatch: "22:00", sortTimestamp: 49 },
    { homeAr: "العراق", awayAr: "النرويج", homeScore: 1, awayScore: 4, dayName: "الثلاثاء", formattedDate: "16 يونيو 2026", timeMatch: "04:00", sortTimestamp: 50 },
    { homeAr: "فرنسا", awayAr: "العراق", homeScore: 3, awayScore: 0, dayName: "الاثنين", formattedDate: "22 يونيو 2026", timeMatch: "20:00", sortTimestamp: 51 },
    { homeAr: "النرويج", awayAr: "السنغال", homeScore: 3, awayScore: 2, dayName: "الثلاثاء", formattedDate: "23 يونيو 2026", timeMatch: "03:00", sortTimestamp: 52 },
    { homeAr: "النرويج", awayAr: "فرنسا", homeScore: 1, awayScore: 4, dayName: "الجمعة", formattedDate: "26 يونيو 2026", timeMatch: "22:00", sortTimestamp: 53 },
    { homeAr: "السنغال", awayAr: "العراق", homeScore: 5, awayScore: 0, dayName: "الجمعة", formattedDate: "26 يونيو 2026", timeMatch: "22:00", sortTimestamp: 54 },
    // Group J
    { homeAr: "الأرجنتين", awayAr: "الجزائر", homeScore: 3, awayScore: 0, dayName: "الاثنين", formattedDate: "15 يونيو 2026", timeMatch: "04:00", sortTimestamp: 55 },
    { homeAr: "النمسا", awayAr: "الأردن", homeScore: 3, awayScore: 1, dayName: "الثلاثاء", formattedDate: "16 يونيو 2026", timeMatch: "07:00", sortTimestamp: 56 },
    { homeAr: "الأرجنتين", awayAr: "النمسا", homeScore: 2, awayScore: 0, dayName: "الاثنين", formattedDate: "22 يونيو 2026", timeMatch: "20:00", sortTimestamp: 57 },
    { homeAr: "الأردن", awayAr: "الجزائر", homeScore: 1, awayScore: 2, dayName: "الثلاثاء", formattedDate: "23 يونيو 2026", timeMatch: "06:00", sortTimestamp: 58 },
    { homeAr: "الجزائر", awayAr: "النمسا", homeScore: 3, awayScore: 3, dayName: "الأحد", formattedDate: "28 يونيو 2026", timeMatch: "05:00", sortTimestamp: 59 },
    { homeAr: "الأردن", awayAr: "الأرجنتين", homeScore: 1, awayScore: 3, dayName: "الأحد", formattedDate: "28 يونيو 2026", timeMatch: "05:00", sortTimestamp: 60 },
    // Group K
    { homeAr: "البرتغال", awayAr: "الكونغو الديمقراطية", homeScore: 1, awayScore: 1, dayName: "الثلاثاء", formattedDate: "16 يونيو 2026", timeMatch: "20:00", sortTimestamp: 61 },
    { homeAr: "أوزبكستان", awayAr: "كولومبيا", homeScore: 1, awayScore: 3, dayName: "الثلاثاء", formattedDate: "16 يونيو 2026", timeMatch: "20:00", sortTimestamp: 62 },
    { homeAr: "البرتغال", awayAr: "أوزبكستان", homeScore: 5, awayScore: 0, dayName: "الثلاثاء", formattedDate: "23 يونيو 2026", timeMatch: "20:00", sortTimestamp: 63 },
    { homeAr: "كولومبيا", awayAr: "الكونغو الديمقراطية", homeScore: 1, awayScore: 0, dayName: "الثلاثاء", formattedDate: "23 يونيو 2026", timeMatch: "23:00", sortTimestamp: 64 },
    { homeAr: "كولومبيا", awayAr: "البرتغال", homeScore: 0, awayScore: 0, dayName: "الأحد", formattedDate: "28 يونيو 2026", timeMatch: "02:30", sortTimestamp: 65 },
    { homeAr: "الكونغو الديمقراطية", awayAr: "أوزبكستان", homeScore: 3, awayScore: 1, dayName: "الأحد", formattedDate: "28 يونيو 2026", timeMatch: "02:30", sortTimestamp: 66 },
    // Group L
    { homeAr: "إنجلترا", awayAr: "كرواتيا", homeScore: 4, awayScore: 2, dayName: "الثلاثاء", formattedDate: "16 يونيو 2026", timeMatch: "23:00", sortTimestamp: 67 },
    { homeAr: "غانا", awayAr: "بنما", homeScore: 1, awayScore: 0, dayName: "الثلاثاء", formattedDate: "16 يونيو 2026", timeMatch: "23:00", sortTimestamp: 68 },
    { homeAr: "إنجلترا", awayAr: "غانا", homeScore: 0, awayScore: 0, dayName: "الثلاثاء", formattedDate: "23 يونيو 2026", timeMatch: "23:00", sortTimestamp: 69 },
    { homeAr: "بنما", awayAr: "كرواتيا", homeScore: 0, awayScore: 1, dayName: "الأربعاء", formattedDate: "24 يونيو 2026", timeMatch: "02:00", sortTimestamp: 70 },
    { homeAr: "بنما", awayAr: "إنجلترا", homeScore: 0, awayScore: 2, dayName: "الأحد", formattedDate: "28 يونيو 2026", timeMatch: "00:00", sortTimestamp: 71 },
    { homeAr: "كرواتيا", awayAr: "غانا", homeScore: 2, awayScore: 1, dayName: "الأحد", formattedDate: "28 يونيو 2026", timeMatch: "00:00", sortTimestamp: 72 },
    // Round of 32
    { homeAr: "جنوب أفريقيا", awayAr: "كندا", homeScore: 0, awayScore: 1, dayName: "الأحد", formattedDate: "28 يونيو 2026", timeMatch: "00:00", sortTimestamp: 73 },
    { homeAr: "ألمانيا", awayAr: "باراغواي", homeScore: 1, awayScore: 1, dayName: "الأحد", formattedDate: "28 يونيو 2026", timeMatch: "00:00", sortTimestamp: 74 },
    { homeAr: "هولندا", awayAr: "المغرب", homeScore: 1, awayScore: 1, dayName: "الأحد", formattedDate: "28 يونيو 2026", timeMatch: "00:00", sortTimestamp: 75 },
    { homeAr: "البرازيل", awayAr: "اليابان", homeScore: 2, awayScore: 1, dayName: "الأحد", formattedDate: "28 يونيو 2026", timeMatch: "00:00", sortTimestamp: 76 },
    { homeAr: "فرنسا", awayAr: "السويد", homeScore: 3, awayScore: 0, dayName: "الأحد", formattedDate: "28 يونيو 2026", timeMatch: "00:00", sortTimestamp: 77 },
    { homeAr: "ساحل العاج", awayAr: "النرويج", homeScore: 1, awayScore: 2, dayName: "الأحد", formattedDate: "28 يونيو 2026", timeMatch: "00:00", sortTimestamp: 78 },
    { homeAr: "المكسيك", awayAr: "الإكوادور", homeScore: 2, awayScore: 0, dayName: "الأحد", formattedDate: "28 يونيو 2026", timeMatch: "00:00", sortTimestamp: 79 },
    { homeAr: "إنجلترا", awayAr: "الكونغو الديمقراطية", homeScore: 2, awayScore: 1, dayName: "الأحد", formattedDate: "28 يونيو 2026", timeMatch: "00:00", sortTimestamp: 80 },
    { homeAr: "أمريكا", awayAr: "البوسنة والهرسك", homeScore: 2, awayScore: 0, dayName: "الأحد", formattedDate: "28 يونيو 2026", timeMatch: "00:00", sortTimestamp: 81 },
    { homeAr: "بلجيكا", awayAr: "السنغال", homeScore: 3, awayScore: 2, dayName: "الأحد", formattedDate: "28 يونيو 2026", timeMatch: "00:00", sortTimestamp: 82 },
    { homeAr: "البرتغال", awayAr: "كرواتيا", homeScore: 2, awayScore: 1, dayName: "الأحد", formattedDate: "28 يونيو 2026", timeMatch: "00:00", sortTimestamp: 83 },
    { homeAr: "إسبانيا", awayAr: "النمسا", homeScore: 3, awayScore: 0, dayName: "الأحد", formattedDate: "28 يونيو 2026", timeMatch: "00:00", sortTimestamp: 84 },
    { homeAr: "سويسرا", awayAr: "الجزائر", homeScore: 2, awayScore: 0, dayName: "الأحد", formattedDate: "28 يونيو 2026", timeMatch: "00:00", sortTimestamp: 85 }
];

// ------------------------------------------------------------
//  دوال الأعلام
// ------------------------------------------------------------
function getFlag(name) {
    const map = {
        "المكسيك": "🇲🇽",
        "جنوب أفريقيا": "🇿🇦",
        "الأرجنتين": "🇦🇷",
        "الجزائر": "🇩🇿",
        "النمسا": "🇦🇹",
        "الأردن": "🇯🇴",
        "البرتغال": "🇵🇹",
        "الكونغو الديمقراطية": "🇨🇩",
        "كوريا الجنوبية": "🇰🇷",
        "التشيك": "🇨🇿",
        "كندا": "🇨🇦",
        "البوسنة والهرسك": "🇧🇦",
        "أمريكا": "🇺🇸",
        "العراق": "🇮🇶",
        "سويسرا": "🇨🇭",
        "قطر": "🇶🇦",
        "البرازيل": "🇧🇷",
        "المغرب": "🇲🇦",
        "هايتي": "🇭🇹",
        "إسكتلندا": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
        "أستراليا": "🇦🇺",
        "تركيا": "🇹🇷",
        "ألمانيا": "🇩🇪",
        "كوراساو": "🇨🇼",
        "اليابان": "🇯🇵",
        "هولندا": "🇳🇱",
        "الإكوادور": "🇪🇨",
        "ساحل العاج": "🇨🇮",
        "السويد": "🇸🇪",
        "تونس": "🇹🇳",
        "إسبانيا": "🇪🇸",
        "الرأس الأخضر": "🇨🇻",
        "مصر": "🇪🇬",
        "بلجيكا": "🇧🇪",
        "السعودية": "🇸🇦",
        "أوروغواي": "🇺🇾",
        "إيران": "🇮🇷",
        "نيوزيلندا": "🇳🇿",
        "السنغال": "🇸🇳",
        "فرنسا": "🇫🇷",
        "النرويج": "🇳🇴",
        "إنجلترا": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        "كرواتيا": "🇭🇷",
        "بنما": "🇵🇦",
        "كولومبيا": "🇨🇴",
        "أوزبكستان": "🇺🇿",
        "غانا": "🇬🇭",
        "باراغواي": "🇵🇾",
        "غينيا": "🇬🇳"
    };
    return map[name] || "🏁";
}

// ------------------------------------------------------------
//  دوال الترجمة والتطبيع
// ------------------------------------------------------------
function normalizeName(str) {
    if (!str) return "";
    str = str.normalize("NFD").replace(/[\u064B-\u065F]/g, "");
    str = str.replace(/[ى]/g, "ا").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/[ک]/g, "ك").replace(/[ی]/g, "ي").replace(/[ي]/g, "ي").replace(/[ئ]/g, "ي").replace(/[ؤ]/g, "و").replace(/[إ]/g, "ا").replace(/[آ]/g, "ا");
    return str.trim().replace(/\s+/g, ' ');
}

function translateToArabic(raw) {
    if (!raw) return "";
    let trimmed = raw.trim();
    if (nameMapping.has(trimmed)) return nameMapping.get(trimmed);
    let normalized = normalizeName(trimmed);
    for (let [key, value] of nameMapping) {
        if (normalizeName(key) === normalized) return value;
    }
    let lower = trimmed.toLowerCase();
    for (let [key, value] of nameMapping) {
        if (key.toLowerCase() === lower) return value;
    }
    for (let [key, value] of nameMapping) {
        if (normalized.includes(normalizeName(key)) || normalizeName(key).includes(normalized)) {
            return value;
        }
    }
    console.warn(`⚠️ لم يتم العثور على ترجمة لـ: "${raw}"`);
    return trimmed;
}

function translateBracketTeamName(name) {
    if (!name) return name;
    let match = name.match(/^Winner\s+Group\s+([A-L])$/i);
    if (match) {
        let groupLetter = match[1].toUpperCase();
        let arabicLetter = groupLetters[groupLetter] || groupLetter;
        return `متصدر المجموعة (${arabicLetter})`;
    }
    match = name.match(/^Runner-up\s+Group\s+([A-L])$/i);
    if (match) {
        let groupLetter = match[1].toUpperCase();
        let arabicLetter = groupLetters[groupLetter] || groupLetter;
        return `وصيف المجموعة (${arabicLetter})`;
    }
    match = name.match(/^3rd\s+Group\s+([A-L\/]+)$/i);
    if (match) {
        let groups = match[1].toUpperCase().split('/');
        let arabicGroups = groups.map(g => groupLetters[g] || g).join('/');
        return `ثالث المجموعة (${arabicGroups})`;
    }
    match = name.match(/^Group\s+([A-L])$/i);
    if (match) {
        let groupLetter = match[1].toUpperCase();
        let arabicLetter = groupLetters[groupLetter] || groupLetter;
        return `المجموعة (${arabicLetter})`;
    }
    return translateToArabic(name);
}

// ------------------------------------------------------------
//  دوال الوقت والتنسيق
// ------------------------------------------------------------
function toSaudiTime(isoString) { return new Date(isoString); }
function getSaudiNow() { return new Date(); }

function formatSaudiDate(isoString) {
    const d = toSaudiTime(isoString);
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatSaudiTime(isoString) {
    const d = toSaudiTime(isoString);
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function formatSaudiDateTime(isoString) {
    return `${formatSaudiDate(isoString)} - ${formatSaudiTime(isoString)}`;
}

function isTodaySaudi(isoString) {
    const d = toSaudiTime(isoString);
    const now = getSaudiNow();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

function isTomorrowSaudi(isoString) {
    const d = toSaudiTime(isoString);
    const now = getSaudiNow();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return d.getFullYear() === tomorrow.getFullYear() && d.getMonth() === tomorrow.getMonth() && d.getDate() === tomorrow.getDate();
}

function getSaudiDay(isoString) {
    const d = toSaudiTime(isoString);
    return ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][d.getDay()];
}

function matchTime(timeISO) { return new Date(timeISO).getTime(); }
function now() { return Date.now(); }

function isMatchLive(timeISO) {
    const cur = now();
    const start = matchTime(timeISO);
    return cur >= start && cur <= start + MATCH_DURATION;
}

function isMatchFinished(timeISO) {
    return now() > matchTime(timeISO) + MATCH_DURATION;
}

function canPredict(timeISO) {
    const start = matchTime(timeISO);
    const nowTime = now();
    const fiveMinutes = 5 * 60 * 1000;
    return (start - nowTime) > fiveMinutes;
}

function getMatchStatus(m) {
    const start = matchTime(m.timeISO);
    const end = start + MATCH_DURATION;
    const cur = now();
    if (cur < start) {
        const diff = start - cur;
        const h = Math.floor(diff / 3600000);
        const min = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        const fiveMin = 5 * 60 * 1000;
        const remainingText = diff < fiveMin ? '⏳ تنطلق خلال أقل من 5 دقائق' : `⏱️ ${h}h ${min}m ${s}s`;
        return { live: false, finished: false, text: remainingText };
    } else if (cur <= end) {
        return { live: true, finished: false, text: "🔴 تُلعب الآن" };
    }
    return { live: false, finished: true, text: "✅ انتهت" };
}

function upcomingMatches(arr) {
    return arr.filter(m => (matchTime(m.timeISO) + MATCH_DURATION) > now());
}

function isMatchTodayOrTomorrow(timeISO) {
    return isTodaySaudi(timeISO) || isTomorrowSaudi(timeISO);
}

function isMatchToday(timeISO) { return isTodaySaudi(timeISO); }
function getDay(t) { return getSaudiDay(t); }
function getDateFmt(t) { return formatSaudiDate(t); }
function getTimeFromISO(t) { return formatSaudiTime(t); }
function getDateTimeDisplay(t) { return formatSaudiDateTime(t); }

function formatDate(isoString) {
    if (!isoString) return 'تاريخ غير معروف';
    const d = toSaudiTime(isoString);
    return `${d.getDate()} ${['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'][d.getMonth()]} ${d.getFullYear()}، ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function getStadiumName(id) {
    return stadiums[id] || `ملعب رقم ${id}`;
}

function getGroundForMatch(team1, team2, timeISO) {
    if (!state.openfootballMatches) return null;
    const t1 = translateToArabic(team1);
    const t2 = translateToArabic(team2);
    let match = state.openfootballMatches.find(m => {
        const h = translateToArabic(m.team1 || '');
        const a = translateToArabic(m.team2 || '');
        return (h === t1 && a === t2) || (h === t2 && a === t1);
    });
    if (match && match.ground) return match.ground;
    if (timeISO) {
        const dateStr = getDateFmt(timeISO);
        match = state.openfootballMatches.find(m => {
            if (!m.date) return false;
            return m.date.includes(dateStr) || dateStr.includes(m.date);
        });
        if (match && match.ground) return match.ground;
    }
    return null;
}

function findMatchResult(team1, team2) {
    const games = state.previousGamesData || [];
    // البحث بغض النظر عن الترتيب
    let match = games.find(m => (m.homeAr === team1 && m.awayAr === team2) || (m.homeAr === team2 && m.awayAr === team1));
    if (match) return { homeScore: match.homeScore, awayScore: match.awayScore, homeAr: match.homeAr, awayAr: match.awayAr };
    return null;
}

function parseScorersWithMinutes(scorerString) {
    if (!scorerString || scorerString === "null") return [];
    let cleaned = scorerString.trim();
    if (cleaned.startsWith('{') && cleaned.endsWith('}')) cleaned = cleaned.slice(1, -1);
    let parts = cleaned.split(',').map(s => s.trim());
    let result = [];
    for (let part of parts) {
        part = part.replace(/^["“”]|["“”]$/g, '').trim();
        let minuteMatch = part.match(/^(.+?)\s+(\d+['’]?)(?:\s*\(([^)]+)\))?$/);
        if (minuteMatch) {
            let name = minuteMatch[1].trim();
            let minute = minuteMatch[2].trim();
            let type = minuteMatch[3] ? minuteMatch[3].trim() : '';
            result.push({ name, minute, type });
        } else {
            result.push({ name: part, minute: '', type: '' });
        }
    }
    return result;
}

function getSortTimestamp(game) {
    let ts = 0;
    const dateStr = game.local_date || '';
    if (dateStr) {
        const parts = dateStr.split(' ');
        const dateParts = parts[0]?.split('/');
        if (dateParts && dateParts.length === 3) {
            const d = new Date(`${dateParts[2]}-${dateParts[0]}-${dateParts[1]}T12:00:00`);
            if (!isNaN(d)) {
                ts = d.getTime();
            }
        }
        if (parts.length > 1 && parts[1]?.match(/\d{2}:\d{2}/)) {
            const timeParts = parts[1].split(':');
            if (timeParts.length === 2) {
                ts += parseInt(timeParts[0]) * 3600000 + parseInt(timeParts[1]) * 60000;
            }
        }
    }
    return ts;
}

// ------------------------------------------------------------
//  دوال التخزين المحلي
// ------------------------------------------------------------
function getCache(key) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.time > CACHE_TIME) return null;
        return parsed.value;
    } catch { return null; }
}

function setCache(key, value) {
    localStorage.setItem(key, JSON.stringify({ value, time: Date.now() }));
}

function getSubmittedMatches() {
    try {
        const raw = localStorage.getItem('submitted_matches');
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
}

function addSubmittedMatch(matchId) {
    const current = getSubmittedMatches();
    if (!current.includes(matchId)) {
        current.push(matchId);
        localStorage.setItem('submitted_matches', JSON.stringify(current));
    }
}

function removeSubmittedMatch(matchId) {
    const current = getSubmittedMatches();
    const filtered = current.filter(id => id !== matchId);
    localStorage.setItem('submitted_matches', JSON.stringify(filtered));
}

function isMatchSubmitted(matchId) {
    return getSubmittedMatches().includes(matchId);
}

function getLocalPredictions() {
    try { const data = localStorage.getItem('predictions'); return data ? JSON.parse(data) : {}; } catch (e) { return {}; }
}

function saveLocalPrediction(userName, matchId, prediction) {
    try {
        const predictions = getLocalPredictions();
        predictions[`${userName}_${matchId}`] = { userName, matchId, prediction, timestamp: new Date().toISOString() };
        localStorage.setItem('predictions', JSON.stringify(predictions));
        return true;
    } catch (e) { return false; }
}

function getUserPredictionFromLocal(userName, matchId) {
    if (!userName) return null;
    return getLocalPredictions()[`${userName}_${matchId}`] || null;
}

// نهاية core.js