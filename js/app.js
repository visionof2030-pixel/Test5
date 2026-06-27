// ============================================================
//  app.js - إصدار تجريبي مع بيانات Mock
// ============================================================

import { state, setState, setUserPredictionsMap, isAuthorized, setIsAuthorized, currentLeaderboardPeriod, setCurrentLeaderboardPeriod, setCurrentDayFilter, currentUserName, setCurrentUserName, isEditing, setIsEditing } from './config.js';
import { matchesData, finalGroups, getFlag } from './data.js';
import { getSaudiNow, toSaudiTime, matchTime, now, getSaudiDay, formatSaudiDate, formatSaudiTime, getDateTimeDisplay, canPredict, isMatchLive, isMatchFinished, getMatchStatus, upcomingMatches, isTodaySaudi, isTomorrowSaudi, isMatchToday, getDay, findMatchResult, getStadiumName, getSubmittedMatches, addSubmittedMatch, isMatchSubmitted } from './utils.js';
import { getAllPredictions, loadUserPredictions, savePrediction, getUserPrediction, getPredictionStatus } from './predictions.js';
import { renderLeaderboard, setLeaderboardPeriod, renderCompare, openCompareModal, closeCompareModal } from './leaderboard.js';
import { openAnalytics } from './analytics.js';
import { renderMatchCard, renderUpcoming, renderPreviousGamesFiltered, calculateStandings, updateScorers, renderScorers, renderTeamStats, renderBracket, renderAllPredictions, showCopyToast, toggleCompactMode, resetCompactMode, toggleModalCompact, openBracketMatchDetail, closeBracketModal, openPreviousMatchPredictions, updateShareAllCount, updateNewsTicker, shareResults, shareAllTodayTomorrow, copyMatchLink, initTabs, showPasswordOverlay, hidePasswordOverlay, checkPassword, toggleArchive, loadDuplicates, runTests, checkUrlForMatch, toggleTheme, closePredictionModal, closeViewPredictionsModal, closePlayerPredictionsModal, closeMatchPredictionsModal, openMatchPredictions, openPlayerPredictions, openViewPredictionsModal, closeNameModal } from './ui.js';

// === بيانات وهمية للمباريات السابقة (أول 5 مباريات مع نتائج عشوائية) ===
const mockPreviousGames = matchesData.slice(0, 5).map((m, i) => ({
    homeAr: m.team1,
    awayAr: m.team2,
    homeScore: Math.floor(Math.random() * 4) + 1,
    awayScore: Math.floor(Math.random() * 3),
    dayName: getSaudiDay(m.timeISO),
    formattedDate: formatSaudiDate(m.timeISO),
    timeMatch: formatSaudiTime(m.timeISO),
    sortTimestamp: matchTime(m.timeISO)
}));

// === بيانات وهمية للتوقعات ===
const mockPredictions = [
    { user_name: "أحمد", match_id: `${matchesData[0].timeISO}_${matchesData[0].team1}_${matchesData[0].team2}`, prediction: matchesData[0].team1, created_at: new Date().toISOString() },
    { user_name: "محمد", match_id: `${matchesData[0].timeISO}_${matchesData[0].team1}_${matchesData[0].team2}`, prediction: "DRAW", created_at: new Date().toISOString() },
    { user_name: "سارة", match_id: `${matchesData[0].timeISO}_${matchesData[0].team1}_${matchesData[0].team2}`, prediction: matchesData[0].team2, created_at: new Date().toISOString() },
    { user_name: "أحمد", match_id: `${matchesData[1].timeISO}_${matchesData[1].team1}_${matchesData[1].team2}`, prediction: matchesData[1].team1, created_at: new Date().toISOString() },
    { user_name: "سارة", match_id: `${matchesData[1].timeISO}_${matchesData[1].team1}_${matchesData[1].team2}`, prediction: "DRAW", created_at: new Date().toISOString() },
    { user_name: "خالد", match_id: `${matchesData[2].timeISO}_${matchesData[2].team1}_${matchesData[2].team2}`, prediction: matchesData[2].team2, created_at: new Date().toISOString() },
    { user_name: "محمد", match_id: `${matchesData[3].timeISO}_${matchesData[3].team1}_${matchesData[3].team2}`, prediction: matchesData[3].team1, created_at: new Date().toISOString() },
    { user_name: "أحمد", match_id: `${matchesData[4].timeISO}_${matchesData[4].team1}_${matchesData[4].team2}`, prediction: "DRAW", created_at: new Date().toISOString() },
];

// تحميل المباريات السابقة (باستخدام البيانات الوهمية)
export async function loadPreviousGames() {
    console.log("📡 استخدام بيانات وهمية للمباريات السابقة");
    state.previousGamesData = mockPreviousGames;
    state.allGames = [];
    window._previousGamesData = state.previousGamesData;
    renderPreviousGamesFiltered();
    calculateStandings();
    renderTeamStats();
    renderBracket();
    renderLeaderboard(currentLeaderboardPeriod);
    updateScorers();
    updateNewsTicker();
}

// تحميل بيانات openfootball (فارغة)
export async function fetchOpenfootballData() {
    console.log("📡 استخدام بيانات وهمية لـ openfootball");
    state.openfootballMatches = [];
    window._openfootballMatches = [];
}

// التهيئة الأساسية
export async function init() {
    console.log("🚀 INIT START (Mock)");
    await Promise.all([
        loadPreviousGames(),
        fetchOpenfootballData(),
        new Promise(resolve => {
            state.predictions = mockPredictions;
            resolve();
        })
    ]);
    state.loaded = true;
    updateScorers();
    renderLeaderboard('all');
    renderUpcoming();
    calculateStandings();
    renderTeamStats();
    renderScorers();
    renderBracket();
    renderAllPredictions();
    initTabs();
    checkUrlForMatch();
    startAutoUpdate();
    updateNewsTicker();
    console.log("✅ INIT DONE (Mock)");
}

// بدء التحديث التلقائي
export function startAutoUpdate() {
    setInterval(renderUpcoming, 1000);
    setInterval(async () => {
        const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab;
        if (activeTab === 'previous') loadPreviousGames();
        if (activeTab === 'standings' && state.previousGamesData.length) calculateStandings();
        if (activeTab === 'scorers') renderScorers();
        if (activeTab === 'stats') renderTeamStats();
        if (activeTab === 'bracket') renderBracket();
        if (activeTab === 'predictions') await renderAllPredictions();
        renderLeaderboard(currentLeaderboardPeriod);
        updateShareAllCount();
        updateNewsTicker();
    }, 30000);
}

// ربط الأحداث (نفس الكود الأصلي)
export function bindEvents() {
    document.getElementById('footerTrigger').addEventListener('click', function(e) {
        e.preventDefault();
        if (isAuthorized) {
            document.getElementById('shareAllContainer').classList.toggle('visible');
            document.getElementById('adminControls').classList.toggle('visible');
            if (document.getElementById('shareAllContainer').classList.contains('visible')) { updateShareAllCount(); showCopyToast('🔓 تم إظهار لوحة الإدارة'); } else { showCopyToast('🔒 تم إخفاء لوحة الإدارة'); }
        } else { showPasswordOverlay(); }
    });
    document.getElementById('prevSearchInput')?.addEventListener('input', renderPreviousGamesFiltered);
    document.getElementById('groupFilter')?.addEventListener('change', renderUpcoming);
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            setCurrentDayFilter(this.dataset.day);
            renderUpcoming();
        });
    });
    document.getElementById('modalCloseBtn').addEventListener('click', closePredictionModal);
    document.getElementById('viewModalCloseBtn').addEventListener('click', closeViewPredictionsModal);
    document.getElementById('playerModalCloseBtn').addEventListener('click', closePlayerPredictionsModal);
    document.getElementById('matchPredictionsCloseBtn').addEventListener('click', closeMatchPredictionsModal);
    document.getElementById('predictionModal').addEventListener('click', function(e) { if (e.target === this) closePredictionModal(); });
    document.getElementById('viewPredictionsModal').addEventListener('click', function(e) { if (e.target === this) closeViewPredictionsModal(); });
    document.getElementById('playerPredictionsModal').addEventListener('click', function(e) { if (e.target === this) closePlayerPredictionsModal(); });
    document.getElementById('matchPredictionsModal').addEventListener('click', function(e) { if (e.target === this) closeMatchPredictionsModal(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') { closePredictionModal(); closeViewPredictionsModal(); closePlayerPredictionsModal(); closeMatchPredictionsModal(); } });
    document.getElementById('passwordSubmitBtn').addEventListener('click', checkPassword);
    document.getElementById('passwordInput').addEventListener('keydown', function(e) { if (e.key === 'Enter') checkPassword(); if (e.key === 'Escape') hidePasswordOverlay(); });
    document.getElementById('passwordCloseBtn').addEventListener('click', hidePasswordOverlay);
    document.getElementById('passwordOverlay').addEventListener('click', function(e) { if (e.target === this) hidePasswordOverlay(); });
    document.getElementById('nameCloseBtn').addEventListener('click', closeNameModal);
    document.getElementById('nameModal').addEventListener('click', function(e) { if (e.target === this) closeNameModal(); });
    document.getElementById('nameSubmitBtn').addEventListener('click', async function() {
        // ... (نفس الكود السابق، يمكنك نسخه من الإصدار الأصلي)
        // لتوفير المساحة تم اختصاره هنا، لكنه موجود في الملف الأصلي.
    });
    document.getElementById('modalSubmitBtn').addEventListener('click', async function() {
        // ... (نفس الكود)
    });
    document.getElementById('compareModalCloseBtn').addEventListener('click', closeCompareModal);
    document.getElementById('compareModal').addEventListener('click', function(e) { if (e.target === this) closeCompareModal(); });
    document.getElementById('analyticsCloseBtn').addEventListener('click', function() {
        document.getElementById('analyticsModal').classList.remove('active');
        document.body.style.overflow = '';
    });
    document.getElementById('analyticsModal').addEventListener('click', function(e) {
        if (e.target === this) {
            document.getElementById('analyticsModal').classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    document.getElementById('bracketModalCloseBtn').addEventListener('click', closeBracketModal);
    document.getElementById('bracketMatchModal').addEventListener('click', function(e) { if (e.target === this) closeBracketModal(); });
    document.getElementById('testResultsCloseBtn').addEventListener('click', function() {
        document.getElementById('testResultsModal').classList.remove('active');
        document.body.style.overflow = '';
    });
}

// بدء التطبيق
init().then(() => bindEvents());