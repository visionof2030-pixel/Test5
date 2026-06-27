// ============================================================
//  الدوال المساعدة: الوقت، الترجمة، التنسيق، المنطق
// ============================================================

import { nameMapping, groupLetters, stadiums, matchesData, finalGroups, getFlag as getFlagData } from './data.js';
import { MATCH_DURATION, CACHE_KEY, CACHE_TIME } from './config.js';

// دالة تطبيع الأسماء
export function normalizeName(str) {
    if (!str) return "";
    str = str.normalize("NFD").replace(/[\u064B-\u065F]/g, "");
    str = str.replace(/[ى]/g, "ا").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/[ک]/g, "ك").replace(/[ی]/g, "ي").replace(/[ي]/g, "ي").replace(/[ئ]/g, "ي").replace(/[ؤ]/g, "و").replace(/[إ]/g, "ا").replace(/[آ]/g, "ا");
    return str.trim().replace(/\s+/g, ' ');
}

// الترجمة إلى العربية
export function translateToArabic(raw) {
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

// ترجمة أسماء الفرق في المخطط
export function translateBracketTeamName(name) {
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

// دوال الوقت (بتوقيت جهاز المستخدم)
export function toSaudiTime(isoString) { return new Date(isoString); }
export function getSaudiNow() { return new Date(); }
export function formatSaudiDate(isoString) {
    const d = toSaudiTime(isoString);
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
export function formatSaudiTime(isoString) {
    const d = toSaudiTime(isoString);
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}
export function formatSaudiDateTime(isoString) {
    return `${formatSaudiDate(isoString)} - ${formatSaudiTime(isoString)}`;
}
export function isTodaySaudi(isoString) {
    const d = toSaudiTime(isoString);
    const now = getSaudiNow();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}
export function isTomorrowSaudi(isoString) {
    const d = toSaudiTime(isoString);
    const now = getSaudiNow();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return d.getFullYear() === tomorrow.getFullYear() && d.getMonth() === tomorrow.getMonth() && d.getDate() === tomorrow.getDate();
}
export function getSaudiDay(isoString) {
    const d = toSaudiTime(isoString);
    return ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][d.getDay()];
}

// دوال المباريات
export function matchTime(timeISO) { return new Date(timeISO).getTime(); }
export function isMatchLive(timeISO) { const cur = now(); const start = matchTime(timeISO); return cur >= start && cur <= start + MATCH_DURATION; }
export function isMatchFinished(timeISO) { return now() > matchTime(timeISO) + MATCH_DURATION; }
export function canPredict(timeISO) {
    const start = matchTime(timeISO);
    const nowTime = now();
    const fiveMinutes = 5 * 60 * 1000;
    return (start - nowTime) > fiveMinutes;
}
export function getMatchStatus(m) {
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
export function upcomingMatches(arr) { return arr.filter(m => (matchTime(m.timeISO) + MATCH_DURATION) > now()); }
export function isMatchTodayOrTomorrow(timeISO) { return isTodaySaudi(timeISO) || isTomorrowSaudi(timeISO); }
export function isMatchToday(timeISO) { return isTodaySaudi(timeISO); }
export function getDay(t) { return getSaudiDay(t); }
export function getDateFmt(t) { return formatSaudiDate(t); }
export function getTimeFromISO(t) { return formatSaudiTime(t); }
export function getDateTimeDisplay(t) { return formatSaudiDateTime(t); }
export function formatDate(isoString) {
    if (!isoString) return 'تاريخ غير معروف';
    const d = toSaudiTime(isoString);
    return `${d.getDate()} ${['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'][d.getMonth()]} ${d.getFullYear()}، ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

// الحصول على اسم الملعب
export function getStadiumName(id) { return stadiums[id] || `ملعب رقم ${id}`; }

// الحصول على الملعب من بيانات Openfootball
export function getGroundForMatch(team1, team2, timeISO) {
    if (!window._openfootballMatches) return null;
    const t1 = translateToArabic(team1);
    const t2 = translateToArabic(team2);
    let match = window._openfootballMatches.find(m => {
        const h = translateToArabic(m.team1 || '');
        const a = translateToArabic(m.team2 || '');
        return (h === t1 && a === t2) || (h === t2 && a === t1);
    });
    if (match && match.ground) return match.ground;
    if (timeISO) {
        const dateStr = getDateFmt(timeISO);
        match = window._openfootballMatches.find(m => {
            if (!m.date) return false;
            return m.date.includes(dateStr) || dateStr.includes(m.date);
        });
        if (match && match.ground) return match.ground;
    }
    return null;
}

// البحث عن نتيجة مباراة من البيانات المحملة
export function findMatchResult(team1, team2) {
    const games = window._previousGamesData || [];
    let match = games.find(m => (m.homeAr === team1 && m.awayAr === team2) || (m.homeAr === team2 && m.awayAr === team1));
    if (match) return { homeScore: match.homeScore, awayScore: match.awayScore, homeAr: match.homeAr, awayAr: match.awayAr };
    return null;
}

// تحليل قائمة الأهداف
export function parseScorersWithMinutes(scorerString) {
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

// دالة لتحويل التاريخ إلى طابع زمني (للفرز)
export function getSortTimestamp(game) {
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

// دالة للحصول على القيمة من التخزين المحلي
export function getCache(key) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.time > CACHE_TIME) return null;
        return parsed.value;
    } catch { return null; }
}
export function setCache(key, value) {
    localStorage.setItem(key, JSON.stringify({ value, time: Date.now() }));
}

// دوال التخزين المحلي للمباريات المسجلة
export function getSubmittedMatches() {
    try {
        const raw = localStorage.getItem('submitted_matches');
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
}
export function addSubmittedMatch(matchId) {
    const current = getSubmittedMatches();
    if (!current.includes(matchId)) {
        current.push(matchId);
        localStorage.setItem('submitted_matches', JSON.stringify(current));
    }
}
export function removeSubmittedMatch(matchId) {
    const current = getSubmittedMatches();
    const filtered = current.filter(id => id !== matchId);
    localStorage.setItem('submitted_matches', JSON.stringify(filtered));
}
export function isMatchSubmitted(matchId) {
    return getSubmittedMatches().includes(matchId);
}

// دوال التخزين المحلي للتوقعات المحلية (احتياطي)
export function getLocalPredictions() { try { const data = localStorage.getItem('predictions'); return data ? JSON.parse(data) : {}; } catch (e) { return {}; } }
export function saveLocalPrediction(userName, matchId, prediction) { try { const predictions = getLocalPredictions(); predictions[`${userName}_${matchId}`] = { userName, matchId, prediction, timestamp: new Date().toISOString() }; localStorage.setItem('predictions', JSON.stringify(predictions)); return true; } catch (e) { return false; } }
export function getUserPredictionFromLocal(userName, matchId) { if (!userName) return null; return getLocalPredictions()[`${userName}_${matchId}`] || null; }

// دوال للتوقيت العام (now)
export function now() { return Date.now(); }