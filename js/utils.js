// ============================================================
//  دوال مساعدة عامة
// ============================================================

// ===== دوال الوقت =====
function now() { return Date.now(); }

function matchTime(timeISO) { return new Date(timeISO).getTime(); }

const MATCH_DURATION = 105 * 60 * 1000;

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

function toSaudiTime(isoString) {
    return new Date(isoString);
}

function getSaudiNow() {
    return new Date();
}

function formatSaudiDate(isoString) {
    const d = toSaudiTime(isoString);
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
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
    return d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate();
}

function isTomorrowSaudi(isoString) {
    const d = toSaudiTime(isoString);
    const now = getSaudiNow();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return d.getFullYear() === tomorrow.getFullYear() &&
        d.getMonth() === tomorrow.getMonth() &&
        d.getDate() === tomorrow.getDate();
}

function getSaudiDay(isoString) {
    const d = toSaudiTime(isoString);
    return ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][d.getDay()];
}

function getDateFmt(t) { return formatSaudiDate(t); }

function getTimeFromISO(t) { return formatSaudiTime(t); }

function getDateTimeDisplay(t) { return formatSaudiDateTime(t); }

function formatDate(isoString) {
    if (!isoString) return 'تاريخ غير معروف';
    const d = toSaudiTime(isoString);
    return `${d.getDate()} ${['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'][d.getMonth()]} ${d.getFullYear()}، ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
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

// ===== دوال الترجمة والأعلام =====
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
    ["جمهورية الكونغو الديمقراطية", "الكونغو الديمقراطية"],
    ["جمهورية الكونغو", "الكونغو الديمقراطية"],
    ["الكونغو الديمقراطية", "الكونغو الديمقراطية"],
    ["البوسنة والهرسك", "البوسنة والهرسك"],
    ["الرأس الأخضر", "الرأس الأخضر"],
    ["باراجواي", "باراغواي"],
    ["باراغواي", "باراغواي"],
    ["السنغال", "السنغال"],
    ["جمهورية الكونغو الديمقراطية", "الكونغو الديمقراطية"]
]);

function normalizeName(str) {
    if (!str) return "";
    str = str.normalize("NFD").replace(/[\u064B-\u065F]/g, "");
    str = str.replace(/[ى]/g, "ا").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/[ک]/g, "ك").replace(/[ی]/g, "ي")
        .replace(/[ي]/g, "ي").replace(/[ئ]/g, "ي").replace(/[ؤ]/g, "و").replace(/[إ]/g, "ا").replace(/[آ]/g, "ا");
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

const groupLetters = {
    'A': 'أ',
    'B': 'ب',
    'C': 'ج',
    'D': 'د',
    'E': 'هـ',
    'F': 'و',
    'G': 'ز',
    'H': 'ح',
    'I': 'ط',
    'J': 'ي',
    'K': 'ك',
    'L': 'ل'
};

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
        "باراغواي": "🇵🇾"
    };
    return map[name] || "🏁";
}

// ===== دوال تحديد الفائز والنتائج =====
function determineWinner(matchResult) {
    if (!matchResult) return null;

    if (matchResult.hadPenalties && matchResult.homePenalty !== null && matchResult.awayPenalty !== null) {
        if (parseInt(matchResult.homePenalty) > parseInt(matchResult.awayPenalty)) {
            return matchResult.homeAr;
        } else if (parseInt(matchResult.awayPenalty) > parseInt(matchResult.homePenalty)) {
            return matchResult.awayAr;
        }
        return null;
    }

    if (matchResult.homeScore > matchResult.awayScore) {
        return matchResult.homeAr;
    } else if (matchResult.awayScore > matchResult.homeScore) {
        return matchResult.awayAr;
    }

    return null;
}

function extractPenaltyData(game) {
    let homePen = game.home_penalty_score;
    let awayPen = game.away_penalty_score;
    if (homePen !== undefined && homePen !== null && homePen !== 'null' && homePen !== '') {
        homePen = String(homePen);
    } else { homePen = null; }
    if (awayPen !== undefined && awayPen !== null && awayPen !== 'null' && awayPen !== '') {
        awayPen = String(awayPen);
    } else { awayPen = null; }
    if (homePen === null || awayPen === null) {
        if (game.penalties && typeof game.penalties === 'object') {
            homePen = game.penalties.home_score || game.penalties.home || null;
            awayPen = game.penalties.away_score || game.penalties.away || null;
            if (homePen) homePen = String(homePen);
            if (awayPen) awayPen = String(awayPen);
        }
    }
    if (homePen !== null && awayPen !== null) {
        return { home: homePen, away: awayPen };
    }
    return null;
}

function findMatchResult(team1, team2) {
    if (state && state.previousGamesData) {
        let match = state.previousGamesData.find(m => (m.homeAr === team1 && m.awayAr === team2) || (m.homeAr === team2 &&
                m.awayAr === team1));
        if (match) {
            let result = {
                homeScore: match.homeScore,
                awayScore: match.awayScore,
                homeAr: match.homeAr,
                awayAr: match.awayAr,
                homePenalty: match.homePenalty || null,
                awayPenalty: match.awayPenalty || null,
                hadPenalties: match.hadPenalties || false
            };
            result.winner = determineWinner(result);
            return result;
        }
    }

    if (state && state.allGames && state.allGames.length) {
        let g = state.allGames.find(m => {
            const home = translateToArabic(m.home_team_name_fa || m.home_team_name_en || '');
            const away = translateToArabic(m.away_team_name_fa || m.away_team_name_en || '');
            return (home === team1 && away === team2) || (home === team2 && away === team1);
        });
        if (g && g.finished === "TRUE") {
            let homeScore = parseInt(g.home_score, 10);
            let awayScore = parseInt(g.away_score, 10);
            let homeAr = translateToArabic(g.home_team_name_fa || g.home_team_name_en || '');
            let awayAr = translateToArabic(g.away_team_name_fa || g.away_team_name_en || '');
            let penaltyData = extractPenaltyData(g);
            let result = { homeScore, awayScore, homeAr, awayAr, homePenalty: null, awayPenalty: null,
                hadPenalties: false };
            if (penaltyData) {
                result.homePenalty = parseInt(penaltyData.home);
                result.awayPenalty = parseInt(penaltyData.away);
                result.hadPenalties = true;
            }
            result.winner = determineWinner(result);
            return result;
        }
    }

    if (state && state.openfootballMatches && state.openfootballMatches.length) {
        let m = state.openfootballMatches.find(m => {
            const h = translateToArabic(m.team1 || '');
            const a = translateToArabic(m.team2 || '');
            return (h === team1 && a === team2) || (h === team2 && a === team1);
        });
        if (m && (m.finished === true || m.finished === "TRUE" || m.status === 'finished')) {
            let homeScore = m.home_score || m.goals1?.length || 0;
            let awayScore = m.away_score || m.goals2?.length || 0;
            let homeAr = translateToArabic(m.team1 || '');
            let awayAr = translateToArabic(m.team2 || '');
            let result = { homeScore, awayScore, homeAr, awayAr, homePenalty: null, awayPenalty: null,
                hadPenalties: false };
            if (m.penalties && typeof m.penalties === 'object') {
                let hPen = m.penalties.home_score || m.penalties.home || null;
                let aPen = m.penalties.away_score || m.penalties.away || null;
                if (hPen !== null && aPen !== null) {
                    result.homePenalty = parseInt(hPen);
                    result.awayPenalty = parseInt(aPen);
                    result.hadPenalties = true;
                }
            }
            result.winner = determineWinner(result);
            return result;
        }
    }

    return null;
}

function isKnockoutMatch(match) {
    if (!match) return false;
    const knockoutRounds = ['round32', 'round16', 'quarterfinal', 'semifinal', 'third', 'final'];
    return knockoutRounds.includes(match.round) ||
        match.roundLabel?.includes('دور') ||
        match.roundLabel?.includes('ربع') ||
        match.roundLabel?.includes('نصف') ||
        match.roundLabel?.includes('المركز') ||
        match.roundLabel?.includes('النهائي');
}

function getMatchById(matchId) {
    if (typeof matchesData !== 'undefined') {
        return matchesData.find(m => `${m.timeISO}_${m.team1}_${m.team2}` === matchId) || null;
    }
    return null;
}

// ===== دالة تحليل الأهداف =====
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

// ===== Toast notifications =====
function showCopyToast(msg) {
    const t = document.getElementById('copyToast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

// ===== Cache functions =====
const CACHE_KEY = "wc_cache_v2";
const CACHE_TIME = 5 * 60 * 1000;

function setCache(key, value) {
    localStorage.setItem(key, JSON.stringify({
        value,
        time: Date.now()
    }));
}

function getCache(key) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.time > CACHE_TIME) return null;
        return parsed.value;
    } catch { return null; }
}