// ============================================================
//  دوال التوقعات: الحفظ، الجلب، التحقق من الحالة
// ============================================================

import { SUPABASE_URL, SUPABASE_KEY, state, setState, userPredictionsMap, setUserPredictionsMap, isEditing, currentUserName, setCurrentUserName } from './config.js';
import { getSubmittedMatches, addSubmittedMatch, removeSubmittedMatch, isMatchSubmitted, getLocalPredictions, saveLocalPrediction, getUserPredictionFromLocal, findMatchResult, canPredict, isMatchFinished, isMatchLive, matchTime, now, getCache, setCache, translateToArabic, toSaudiTime, formatSaudiDate, formatSaudiDateTime } from './utils.js';
import { matchesData, getFlag } from './data.js';

// تهيئة عميل Supabase
let supabaseClient = null;
try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (e) {
    console.error("Supabase init error", e);
}

// جلب جميع التوقعات
export async function getAllPredictions() {
    const cached = getCache("predictions");
    if (cached) {
        state.predictions = cached;
        return;
    }
    if (!supabaseClient) {
        state.predictions = [];
        return;
    }
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

// جلب توقعات لاعب معين (جميعها)
export async function getPredictionsForUserFull(userName) {
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

// جلب توقعات مباراة معينة (جميعها)
export async function getPredictionsForMatchFull(matchId) {
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

// جلب توقع محدد لمستخدم ومباراة
export async function getUserPrediction(userName, matchId) {
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

// حفظ أو تحديث توقع
export async function savePrediction(userName, matchId, prediction) {
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
                .update({ prediction: prediction })
                .eq("id", existing.id);
            if (error) throw error;
            saveLocalPrediction(userName, matchId, prediction);
            addSubmittedMatch(matchId);
            localStorage.removeItem("predictions");
            await getAllPredictions();
            return { success: true, updated: true };
        } catch (e) {
            console.error("❌ تحديث التوقع:", e);
            return { success: false, message: e.message };
        }
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
        } catch (e) {
            console.error("❌ إضافة توقع:", e);
            return { success: false, message: e.message };
        }
    }
}

// تحميل توقعات المستخدم الحالي
export async function loadUserPredictions(userName) {
    if (!supabaseClient || !userName) return;
    try {
        const { data, error } = await supabaseClient
            .from("predictions")
            .select("match_id")
            .eq("user_name", userName);
        if (error) throw error;
        const map = {};
        if (data && data.length) {
            data.forEach(p => { map[p.match_id] = true; });
        }
        setUserPredictionsMap(map);
    } catch (e) {
        console.error("❌ جلب توقعات المستخدم:", e);
        setUserPredictionsMap({});
    }
}

// الحصول على حالة التوقع (صحيح/خاطئ/قيد الانتظار)
export function getPredictionStatus(prediction) {
    const parts = prediction.match_id.split('_');
    if (parts.length < 3) return { status: 'pending', text: '⏳ المباراة لم تلعب بعد', color: 'var(--gold-light)' };
    const team1 = parts[1],
        team2 = parts[2];
    const result = findMatchResult(team1, team2);
    if (!result) return { status: 'pending', text: '⏳ المباراة لم تلعب بعد', color: 'var(--gold-light)' };
    let correctResult = result.homeScore > result.awayScore ? result.homeAr : (result.awayScore > result.homeScore ?
        result.awayAr : "DRAW");
    const isCorrect = prediction.prediction === correctResult;
    if (isCorrect) return { status: 'correct', text: '✅ توقع صحيح', color: 'var(--success)' };
    else return { status: 'wrong', text: '❌ توقع خاطئ', color: 'var(--danger)' };
}

// دوال النوافذ المتعلقة بالتوقعات (سيتم استدعاؤها من ui.js)
export function openNameModal(matchId, team1, team2, timeISO) {
    // يتم تنفيذها في ui.js، لكننا نمررها كدالة للتصدير
    console.log("openNameModal called", matchId, team1, team2, timeISO);
}

export function openPredictionModal(matchId, team1, team2, timeISO, userName) {
    console.log("openPredictionModal called", matchId, team1, team2, timeISO, userName);
}

export function openEditPredictionModal(matchId, team1, team2, timeISO) {
    console.log("openEditPredictionModal called", matchId, team1, team2, timeISO);
}

export function openMatchPredictions(matchId, team1, team2, homeScore, awayScore) {
    console.log("openMatchPredictions called", matchId, team1, team2, homeScore, awayScore);
}

export function openPlayerPredictions(userName) {
    console.log("openPlayerPredictions called", userName);
}

export function openViewPredictionsModal(matchId, team1, team2) {
    console.log("openViewPredictionsModal called", matchId, team1, team2);
}

export function closeNameModal() {
    console.log("closeNameModal called");
}