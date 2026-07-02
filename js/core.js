// ============================================================
//  core.js - النواة والبيانات الثابتة والدوال المساعدة
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
    // ... (نفس القاموس الكامل من الملف الأصلي)
    // تم حذفه للاختصار، ولكن يجب أن يكون موجوداً كاملاً
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

// ===== تم إضافة حقل streamUrl للمباراة رقم 71 =====
const rawMatches = [
    // ... (نفس القائمة الكاملة من الملف الأصلي)
];

const finalGroups = {
    // ... (نفس المجموعات)
};

const matchesData = rawMatches.map(m => ({
    ...m,
    timeISO: m.time + "+03:00",
    roundLabel: m.round === 'first' ? 'الجولة الأولى' : (m.round === 'second' ? 'الجولة الثانية' : 'الجولة الثالثة')
}));

function getFlag(name) {
    const map = {
        // ... (نفس خريطة الأعلام)
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

// ================================================================
//  دالة findMatchResult المحسّنة (للبحث في جميع المصادر)
// ================================================================
function findMatchResult(team1, team2) {
    // 1. البحث في previousGamesData
    const games = state.previousGamesData || [];
    let match = games.find(m => (m.homeAr === team1 && m.awayAr === team2) || (m.homeAr === team2 && m.awayAr === team1));
    if (match) {
        return { homeScore: match.homeScore, awayScore: match.awayScore, homeAr: match.homeAr, awayAr: match.awayAr };
    }
    // 2. البحث في allGames
    if (state.allGames && state.allGames.length) {
        const apiMatch = state.allGames.find(g => {
            const home = translateToArabic(g.home_team_name_fa || g.home_team_name_en || '');
            const away = translateToArabic(g.away_team_name_fa || g.away_team_name_en || '');
            return (home === team1 && away === team2) || (home === team2 && away === team1);
        });
        if (apiMatch && apiMatch.finished === "TRUE") {
            const homeScore = parseInt(apiMatch.home_score, 10);
            const awayScore = parseInt(apiMatch.away_score, 10);
            const homeAr = translateToArabic(apiMatch.home_team_name_fa || apiMatch.home_team_name_en || '');
            const awayAr = translateToArabic(apiMatch.away_team_name_fa || apiMatch.away_team_name_en || '');
            return { homeScore, awayScore, homeAr, awayAr };
        }
    }
    // 3. البحث في openfootballMatches
    if (state.openfootballMatches && state.openfootballMatches.length) {
        const ofMatch = state.openfootballMatches.find(m => {
            const h = translateToArabic(m.team1 || '');
            const a = translateToArabic(m.team2 || '');
            return (h === team1 && a === team2) || (h === team2 && a === team1);
        });
        if (ofMatch && ofMatch.finished === true) {
            const homeScore = ofMatch.goals1?.length || 0;
            const awayScore = ofMatch.goals2?.length || 0;
            const homeAr = translateToArabic(ofMatch.team1 || '');
            const awayAr = translateToArabic(ofMatch.team2 || '');
            return { homeScore, awayScore, homeAr, awayAr };
        }
    }
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