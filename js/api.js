// ============================================================
//  API - التعامل مع Supabase والبيانات الخارجية
// ============================================================

// ===== Supabase Configuration =====
const SUPABASE_URL = "https://szjxwhsmefqpfcebtvei.supabase.co";
const SUPABASE_KEY = "sb_publishable_0um28lgPMHcjDOThT0UgDA_K-Y7Wmx3";

let supabaseClient = null;
try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (e) {
    console.error("Supabase init error", e);
}

// ===== Caching =====
const CACHE_KEY = "wc_cache_v2";
const CACHE_TIME = 5 * 60 * 1000;

function setCache(key, value) {
    localStorage.setItem(key, JSON.stringify({ value, time: Date.now() }));
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

// ===== Local Storage Helpers =====
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

// ===== Load Data =====
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
            let dayName = '', formattedDate = '', timeMatch = '';
            let sortTimestamp = 0;
            if (dateStr) {
                const parts = dateStr.split(' ');
                const dateParts = parts[0]?.split('/');
                if (dateParts && dateParts.length === 3) {
                    const d = new Date(`${dateParts[2]}-${dateParts[0]}-${dateParts[1]}T12:00:00`);
                    if (!isNaN(d)) {
                        dayName = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][d.getDay()];
                        formattedDate = `${d.getDate()} ${['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'][d.getMonth()]} ${d.getFullYear()}`;
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
            const penaltyData = extractPenaltyData(game);
            let homePenalty = null, awayPenalty = null, hadPenalties = false;
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
        renderPreviousGamesFiltered();
        calculateStandings();
        renderTeamStats();
        renderBracket();
        renderLeaderboard(currentLeaderboardPeriod);
        updateScorers();
        updateNewsTicker();
    } catch (e) {
        console.error("❌ تحميل السابقة:", e);
        if (state.previousGamesData.length === 0) {
            document.getElementById('previousMatchesContainer').innerHTML =
                `<div class="empty-state"><span class="icon">⚠️</span> فشل التحميل <button onclick="loadPreviousGamesFull()" style="display:block;margin:12px auto 0;background:var(--gold-gradient);border:none;padding:8px 24px;border-radius:40px;font-weight:700;color:#0a0e1a;cursor:pointer;font-family:inherit;">🔄 إعادة المحاولة</button></div>`;
        }
    } finally { isLoadingPrevious = false; }
}

// ===== Save Prediction =====
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

function getLocalPredictions() {
    try {
        const data = localStorage.getItem('predictions');
        return data ? JSON.parse(data) : {};
    } catch (e) { return {}; }
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

// ===== Ranking Helpers =====
function getPredictionStatus(prediction) {
    const parts = prediction.match_id.split('_');
    if (parts.length < 3) return { status: 'pending', text: '⏳ المباراة لم تلعب بعد', color: 'var(--gold-light)' };
    const team1 = parts[1], team2 = parts[2];
    const result = findMatchResult(team1, team2);
    if (!result) return { status: 'pending', text: '⏳ المباراة لم تلعب بعد', color: 'var(--gold-light)' };
    let correctResult = result.winner || (result.homeScore > result.awayScore ? result.homeAr : (result.awayScore > result.homeScore ? result.awayAr : "DRAW"));
    const isCorrect = prediction.prediction === correctResult;
    if (isCorrect) return { status: 'correct', text: '✅ توقع صحيح', color: 'var(--success)' };
    else return { status: 'wrong', text: '❌ توقع خاطئ', color: 'var(--danger)' };
}