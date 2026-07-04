// ============================================================
//  API & Supabase
// ============================================================

// Supabase configuration
const SUPABASE_URL = "https://szjxwhsmefqpfcebtvei.supabase.co";
const SUPABASE_KEY = "sb_publishable_0um28lgPMHcjDOThT0UgDA_K-Y7Wmx3";

let supabaseClient = null;
try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (e) {
    console.error("Supabase init error", e);
}

// Cache helpers
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

// Submitted matches
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

// ============================================================
//  Data Fetching
// ============================================================

async function loadPreviousGames() {
    const cached = getCache("games");
    if (cached) {
        state.previousGamesData = cached;
        return;
    }
    const res = await fetch("https://worldcup26.ir/get/games");
    const data = await res.json();
    const finished = (data.games || []).filter(g => g.finished === "TRUE");
    state.previousGamesData = finished.map(g => ({
        homeAr: g.home_team_name_en || g.home_team_name_fa,
        awayAr: g.away_team_name_en || g.away_team_name_fa,
        homeScore: parseInt(g.home_score || 0),
        awayScore: parseInt(g.away_score || 0)
    }));
    setCache("games", state.previousGamesData);
}

async function fetchOpenfootballData() {
    const cached = getCache("openfootball");
    if (cached) {
        state.openfootballMatches = cached;
        return;
    }
    try {
        const res = await fetch("https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json");
        const data = await res.json();
        state.openfootballMatches = data.matches || [];
        setCache("openfootball", state.openfootballMatches);
    } catch (e) {
        console.warn("⚠️ فشل تحميل بيانات openfootball:", e);
        state.openfootballMatches = [];
    }
}

async function getAllPredictions() {
    const cached = getCache("predictions");
    if (cached) {
        state.predictions = cached;
        return;
    }
    if (!supabaseClient) { state.predictions = []; return; }
    try {
        const { data } = await supabaseClient
            .from("predictions")
            .select("*")
            .limit(500);
        state.predictions = data || [];
        setCache("predictions", state.predictions);
    } catch (e) {
        console.warn("⚠️ فشل تحميل التوقعات:", e);
        state.predictions = [];
    }
}

async function loadPreviousGamesFull() {
    if (isLoadingPrevious) return;
    isLoadingPrevious = true;
    try {
        const response = await fetch('https://worldcup26.ir/get/games');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (!data?.games) throw new Error('تنسيق غير صحيح');
        state.allGames = data.games;
        const finished = state.allGames.filter(g => g.finished === "TRUE");
        const newData = finished.map(game => {
            const homeAr = translateToArabic(game.home_team_name_fa || game.home_team_name_en || '');
            const awayAr = translateToArabic(game.away_team_name_fa || game.away_team_name_en || '');
            const homeScore = parseInt(game.home_score, 10);
            const awayScore = parseInt(game.away_score, 10);
            let dateStr = game.local_date || '';
            let dayName = '',
                formattedDate = '',
                timeMatch = '';
            let sortTimestamp = 0;
            if (dateStr) {
                const parts = dateStr.split(' ');
                const dateParts = parts[0]?.split('/');
                if (dateParts && dateParts.length === 3) {
                    const d = new Date(`${dateParts[2]}-${dateParts[0]}-${dateParts[1]}T12:00:00`);
                    if (!isNaN(d)) {
                        dayName = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][d
                        .getDay()];
                        formattedDate =
                            `${d.getDate()} ${['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'][d.getMonth()]} ${d.getFullYear()}`;
                        sortTimestamp = d.getTime();
                    }
                }
                if (parts.length > 1 && parts[1]?.match(/\d{2}:\d{2}/)) {
                    timeMatch = parts[1];
                    const timeParts = parts[1].split(':');
                    if (timeParts.length === 2) {
                        sortTimestamp += parseInt(timeParts[0]) * 3600000 + parseInt(timeParts[1]) * 60000;
                    }
                }
            }
            // استخراج بيانات ركلات الترجيح
            const penaltyData = extractPenaltyData(game);
            let homePenalty = null,
                awayPenalty = null,
                hadPenalties = false;
            if (penaltyData) {
                homePenalty = parseInt(penaltyData.home);
                awayPenalty = parseInt(penaltyData.away);
                hadPenalties = true;
            }
            return { homeAr, awayAr, homeScore, awayScore, dayName, formattedDate, timeMatch, sortTimestamp,
                homePenalty, awayPenalty, hadPenalties };
        });
        state.previousGamesData = newData;
        setCache("games", newData);
    } catch (e) {
        console.error("❌ تحميل السابقة:", e);
    } finally { isLoadingPrevious = false; }
}

// ============================================================
//  Prediction Functions
// ============================================================

async function savePrediction(userName, matchId, prediction) {
    if (!supabaseClient) return { success: false, message: "Supabase غير متصل" };
    const match = matchesData.find(m => `${m.timeISO}_${m.team1}_${m.team2}` === matchId);
    if (match) {
        if (!canPredict(match.timeISO)) {
            return { success: false,
                message: "⛔ لا يمكن التوقع الآن، المباراة على وشك البدء أو بدأت بالفعل (يُسمح حتى 5 دقائق قبل البداية)." };
        }
    } else {
        return { success: false, message: "⛔ مباراة غير معروفة" };
    }

    async function isUserNameExists(userName) {
        if (!supabaseClient || !userName) return false;
        try {
            const { data, error } = await supabaseClient.from("predictions").select("user_name").eq("user_name",
                userName).limit(1);
            if (error) throw error;
            return data && data.length > 0;
        } catch (e) { console.error("❌ التحقق من الاسم:", e); return false; }
    }

    const existing = await getUserPrediction(userName, matchId);

    if (existing) {
        try {
            const { error } = await supabaseClient
                .from("predictions")
                .update({ prediction: prediction, updated_at: new Date().toISOString() })
                .eq("id", existing.id);
            if (error) throw error;
            saveLocalPrediction(userName, matchId, prediction);
            addSubmittedMatch(matchId);
            localStorage.removeItem("predictions");
            await getAllPredictions();
            return { success: true, updated: true };
        } catch (e) { return { success: false, message: e.message }; }
    } else {
        if (isMatchSubmitted(matchId)) {
            return { success: false, message: `⚠️ توقعت مسبقاً هذه المباراة`, duplicate: true };
        }

        const exists = await isUserNameExists(userName);
        if (exists) {
            const storedUserName = localStorage.getItem('lastUserName') || '';
            if (storedUserName !== userName) {
                return { success: false,
                    message: `⚠️ هذا الاسم "${userName}" مسجل لمستخدم آخر. الرجاء استخدام اسم مختلف أو تأكيد أنك أنت صاحب الاسم.` };
            }
        }

        try {
            const { error } = await supabaseClient.from("predictions").insert([{ user_name: userName,
                match_id: matchId, prediction }]);
            if (error) throw error;
            saveLocalPrediction(userName, matchId, prediction);
            addSubmittedMatch(matchId);
            localStorage.removeItem("predictions");
            await getAllPredictions();
            return { success: true, updated: false };
        } catch (e) { return { success: false, message: e.message }; }
    }
}

async function getUserPrediction(userName, matchId) {
    if (!supabaseClient || !userName || !matchId) return null;
    try {
        const { data, error } = await supabaseClient
            .from("predictions")
            .select("*")
            .eq("user_name", userName)
            .eq("match_id", matchId)
            .order("created_at", { ascending: false })
            .limit(1);
        if (error) throw error;
        return data && data.length > 0 ? data[0] : null;
    } catch (e) {
        console.error("❌ جلب توقع المستخدم:", e);
        return null;
    }
}

async function getPredictionsForMatchFull(matchId) {
    if (!supabaseClient || !matchId) return [];
    try {
        const { data, error } = await supabaseClient
            .from("predictions")
            .select("*")
            .eq("match_id", matchId)
            .order("created_at", { ascending: true });
        if (error) throw error;
        return data || [];
    } catch (e) {
        console.error("❌ جلب توقعات المباراة (جميعها):", e);
        return [];
    }
}

async function getPredictionsForUserFull(userName) {
    if (!supabaseClient || !userName) return [];
    try {
        const { data, error } = await supabaseClient
            .from("predictions")
            .select("*")
            .eq("user_name", userName)
            .order("created_at", { ascending: true });
        if (error) throw error;
        return data || [];
    } catch (e) {
        console.error("❌ جلب توقعات اللاعب (جميعها):", e);
        return [];
    }
}

// ============================================================
//  Local Storage Prediction Helpers
// ============================================================

function getLocalPredictions() { try { const data = localStorage.getItem('predictions'); return data ? JSON.parse(
            data) : {}; } catch (e) { return {}; } }

function saveLocalPrediction(userName, matchId, prediction) { try { const predictions = getLocalPredictions();
        predictions[`${userName}_${matchId}`] = { userName, matchId, prediction, timestamp: new Date()
            .toISOString() };
        localStorage.setItem('predictions', JSON.stringify(predictions)); return true; } catch (e) { return false; } }

function getUserPredictionFromLocal(userName, matchId) { if (!userName) return null; return getLocalPredictions()[
        `${userName}_${matchId}`] || null; }

// ============================================================
//  Utility Functions for Data Extraction
// ============================================================

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
    // البحث في البيانات المحملة
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
        if (result.hadPenalties && result.homePenalty !== null && result.awayPenalty !== null) {
            if (parseInt(result.homePenalty) > parseInt(result.awayPenalty)) {
                result.winner = result.homeAr;
            } else if (parseInt(result.awayPenalty) > parseInt(result.homePenalty)) {
                result.winner = result.awayAr;
            } else {
                result.winner = null;
            }
        } else if (result.homeScore > result.awayScore) {
            result.winner = result.homeAr;
        } else if (result.awayScore > result.homeScore) {
            result.winner = result.awayAr;
        } else {
            result.winner = null;
        }
        return result;
    }

    // البحث في allGames
    if (state.allGames && state.allGames.length) {
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
            if (result.hadPenalties && result.homePenalty !== null && result.awayPenalty !== null) {
                if (result.homePenalty > result.awayPenalty) result.winner = result.homeAr;
                else if (result.awayPenalty > result.homePenalty) result.winner = result.awayAr;
                else result.winner = null;
            } else if (homeScore > awayScore) result.winner = homeAr;
            else if (awayScore > homeScore) result.winner = awayAr;
            else result.winner = null;
            return result;
        }
    }

    // البحث في openfootball
    if (state.openfootballMatches && state.openfootballMatches.length) {
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
            if (result.hadPenalties && result.homePenalty !== null && result.awayPenalty !== null) {
                if (result.homePenalty > result.awayPenalty) result.winner = result.homeAr;
                else if (result.awayPenalty > result.homePenalty) result.winner = result.awayAr;
                else result.winner = null;
            } else if (homeScore > awayScore) result.winner = homeAr;
            else if (awayScore > homeScore) result.winner = awayAr;
            else result.winner = null;
            return result;
        }
    }

    // البحث في matchesData الثابتة (دور الـ 32)
    let staticMatch = matchesData.find(m => (m.team1 === team1 && m.team2 === team2) || (m.team1 === team2 && m
        .team2 === team1));
    if (staticMatch && isMatchFinished(staticMatch.timeISO)) {
        for (let pg of state.previousGamesData) {
            if ((pg.homeAr === team1 && pg.awayAr === team2) || (pg.homeAr === team2 && pg.awayAr === team1)) {
                let result = {
                    homeScore: pg.homeScore,
                    awayScore: pg.awayScore,
                    homeAr: pg.homeAr,
                    awayAr: pg.awayAr,
                    homePenalty: pg.homePenalty || null,
                    awayPenalty: pg.awayPenalty || null,
                    hadPenalties: pg.hadPenalties || false
                };
                if (result.hadPenalties && result.homePenalty !== null && result.awayPenalty !== null) {
                    if (parseInt(result.homePenalty) > parseInt(result.awayPenalty)) result.winner = result
                        .homeAr;
                    else if (parseInt(result.awayPenalty) > parseInt(result.homePenalty)) result.winner = result
                        .awayAr;
                    else result.winner = null;
                } else if (pg.homeScore > pg.awayScore) result.winner = pg.homeAr;
                else if (pg.awayScore > pg.homeScore) result.winner = pg.awayAr;
                else result.winner = null;
                return result;
            }
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