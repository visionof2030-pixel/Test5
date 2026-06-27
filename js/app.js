// ============================================================
//  التطبيق الرئيسي: التهيئة، تحميل البيانات، الأحداث العامة
// ============================================================

import { state, setState, userPredictionsMap, setUserPredictionsMap, isAuthorized, setIsAuthorized, isCompactMode, setIsCompactMode, isModalCompact, setIsModalCompact, currentDayFilter, setCurrentDayFilter, currentLeaderboardPeriod, setCurrentLeaderboardPeriod, currentUserName, setCurrentUserName, isEditing, setIsEditing, chartInstancesLocal, setChartInstancesLocal, SECRET_CODE, CACHE_KEY, CACHE_TIME, MATCH_DURATION } from './config.js';
import { matchesData, finalGroups, rawMatches, getFlag } from './data.js';
import { getCache, setCache, translateToArabic, getSaudiNow, toSaudiTime, matchTime, now, getSaudiDay, formatSaudiDate, getSaudiNow as getSaudiNowUtil, isTodaySaudi, isTomorrowSaudi, getSaudiDay as getSaudiDayUtil, formatSaudiTime, formatSaudiDateTime, getDateFmt, getTimeFromISO, getDateTimeDisplay, canPredict, isMatchLive, isMatchFinished, getMatchStatus, upcomingMatches, isMatchTodayOrTomorrow, isMatchToday, getDay, findMatchResult, parseScorersWithMinutes, translateBracketTeamName, groupLetters, getStadiumName, getGroundForMatch, getSubmittedMatches, addSubmittedMatch, removeSubmittedMatch, isMatchSubmitted, getLocalPredictions, saveLocalPrediction, getUserPredictionFromLocal, now as nowUtil, getSortTimestamp } from './utils.js';
import { getAllPredictions, loadUserPredictions, savePrediction, getUserPrediction, getPredictionsForUserFull, getPredictionsForMatchFull, getPredictionStatus, openNameModal, openPredictionModal, openEditPredictionModal } from './predictions.js';
import { renderLeaderboard, setLeaderboardPeriod, renderCompare, openCompareModal, closeCompareModal } from './leaderboard.js';
import { openAnalytics, generateAnalyticsCharts, updatePlayerAnalytics, populatePlayerAnalyticsSelect, renderMatchAnalytics } from './analytics.js';
import { renderMatchCard, renderUpcoming, renderPreviousGamesFiltered, calculateStandings, updateScorers, renderScorers, renderTeamStats, renderBracket, renderAllPredictions, showCopyToast, toggleCompactMode, resetCompactMode, toggleModalCompact, openBracketMatchDetail, closeBracketModal, openPreviousMatchPredictions, updateShareAllCount, updateNewsTicker, shareResults, shareAllTodayTomorrow, copyMatchLink, initTabs, showPasswordOverlay, hidePasswordOverlay, checkPassword, toggleArchive, loadDuplicates, runTests, checkUrlForMatch, toggleTheme, closePredictionModal, closeViewPredictionsModal, closePlayerPredictionsModal, closeMatchPredictionsModal, openMatchPredictions, openPlayerPredictions, openViewPredictionsModal, closeNameModal, loadPreviousGames as loadPreviousGamesUI } from './ui.js';

// تهيئة عميل Supabase (مستورد من predictions.js)
// لكننا نعتمد على predictions.js.

// تحميل المباريات السابقة من API
export async function loadPreviousGames() {
    try {
        const cached = getCache("games");
        if (cached) {
            state.previousGamesData = cached;
            renderPreviousGamesFiltered();
            calculateStandings();
            renderTeamStats();
            renderBracket();
            renderLeaderboard(currentLeaderboardPeriod);
            updateScorers();
            updateNewsTicker();
            return;
        }
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
            const sortTimestamp = getSortTimestamp(game);
            let dayName = '',
                formattedDate = '',
                timeMatch = '';
            const dateStr = game.local_date || '';
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
                    }
                }
                if (parts.length > 1 && parts[1]?.match(/\d{2}:\d{2}/)) {
                    timeMatch = parts[1];
                }
            }
            return { homeAr, awayAr, homeScore, awayScore, dayName, formattedDate, timeMatch, sortTimestamp };
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
                `<div class="empty-state"><span class="icon">⚠️</span> فشل التحميل <button onclick="loadPreviousGames()" style="display:block;margin:12px auto 0;background:var(--gold);border:none;padding:8px 24px;border-radius:40px;font-weight:700;color:#0a1628;cursor:pointer;font-family:inherit;">🔄 إعادة المحاولة</button></div>`;
        }
    }
}

// تحميل بيانات openfootball
export async function fetchOpenfootballData() {
    const cached = getCache("openfootball");
    if (cached) {
        state.openfootballMatches = cached;
        window._openfootballMatches = cached;
        updateScorers();
        renderBracket();
        return;
    }
    try {
        const res = await fetch("https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json");
        const data = await res.json();
        state.openfootballMatches = data.matches || [];
        window._openfootballMatches = state.openfootballMatches;
        setCache("openfootball", state.openfootballMatches);
        updateScorers();
        renderBracket();
    } catch (e) {
        console.warn("⚠️ فشل تحميل بيانات openfootball:", e);
        state.openfootballMatches = [];
        window._openfootballMatches = [];
    }
}

// التهيئة الأساسية
export async function init() {
    console.log("🚀 INIT START (محسن)");
    await Promise.all([
        loadPreviousGames(),
        fetchOpenfootballData(),
        getAllPredictions()
    ]);
    state.loaded = true;
    window._previousGamesData = state.previousGamesData;
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
    console.log("✅ INIT DONE (محسن)");
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

// ربط الأحداث
export function bindEvents() {
    document.getElementById('footerTrigger').addEventListener('click', function(e) {
        e.preventDefault();
        if (isAuthorized) {
            document.getElementById('shareAllContainer').classList.toggle('visible');
            document.getElementById('adminControls').classList.toggle('visible');
            if (document.getElementById('shareAllContainer').classList.contains('visible')) {
                updateShareAllCount();
                showCopyToast('🔓 تم إظهار لوحة الإدارة');
            } else {
                showCopyToast('🔒 تم إخفاء لوحة الإدارة');
            }
        } else {
            showPasswordOverlay();
        }
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

    // إغلاق النوافذ
    document.getElementById('modalCloseBtn').addEventListener('click', closePredictionModal);
    document.getElementById('viewModalCloseBtn').addEventListener('click', closeViewPredictionsModal);
    document.getElementById('playerModalCloseBtn').addEventListener('click', closePlayerPredictionsModal);
    document.getElementById('matchPredictionsCloseBtn').addEventListener('click', closeMatchPredictionsModal);
    document.getElementById('predictionModal').addEventListener('click', function(e) { if (e.target === this)
            closePredictionModal(); });
    document.getElementById('viewPredictionsModal').addEventListener('click', function(e) { if (e.target === this)
            closeViewPredictionsModal(); });
    document.getElementById('playerPredictionsModal').addEventListener('click', function(e) { if (e.target === this)
            closePlayerPredictionsModal(); });
    document.getElementById('matchPredictionsModal').addEventListener('click', function(e) { if (e.target === this)
            closeMatchPredictionsModal(); });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePredictionModal();
            closeViewPredictionsModal();
            closePlayerPredictionsModal();
            closeMatchPredictionsModal();
        }
    });

    // كلمة السر
    document.getElementById('passwordSubmitBtn').addEventListener('click', checkPassword);
    document.getElementById('passwordInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') checkPassword();
        if (e.key === 'Escape') hidePasswordOverlay();
    });
    document.getElementById('passwordCloseBtn').addEventListener('click', hidePasswordOverlay);
    document.getElementById('passwordOverlay').addEventListener('click', function(e) { if (e.target === this)
            hidePasswordOverlay(); });

    // اسم المستخدم
    document.getElementById('nameCloseBtn').addEventListener('click', closeNameModal);
    document.getElementById('nameModal').addEventListener('click', function(e) { if (e.target === this)
            closeNameModal(); });
    document.getElementById('nameSubmitBtn').addEventListener('click', async function() {
        const name = document.getElementById('nameInput').value.trim();
        const errorEl = document.getElementById('nameError');
        const statusEl = document.getElementById('nameStatus');
        if (!name) { errorEl.textContent = '⚠️ الرجاء إدخال اسمك'; return; }
        if (!supabaseClient) { errorEl.textContent = '❌ خطأ في الاتصال بقاعدة البيانات'; return; }
        this.disabled = true;
        this.textContent = '⏳ جاري التحقق...';
        errorEl.textContent = '';
        statusEl.style.display = 'block';
        try {
            const { data, error } = await supabaseClient.from("predictions").select("user_name").eq(
                "user_name", name).limit(1);
            if (error) throw error;
            const isExisting = data && data.length > 0;
            if (isExisting) {
                statusEl.className = 'user-status existing';
                statusEl.textContent = `👤 مرحباً بعودتك "${name}"! سيتم إضافة التوقع إلى حسابك.`;
                localStorage.setItem('lastUserName', name);
                setCurrentUserName(name);
                await loadUserPredictions(name);
                const existingPred = await getUserPrediction(name, nameModalMatchId);
                if (existingPred) {
                    errorEl.textContent =
                        `⚠️ لقد توقعت هذه المباراة مسبقاً: ${existingPred.prediction === 'DRAW' ? 'تعادل' : existingPred.prediction}`;
                    this.disabled = false;
                    this.textContent = 'متابعة →';
                    renderUpcoming();
                    return;
                }
                this.textContent = '✅ متابعة للتوقع';
                setTimeout(() => {
                    closeNameModal();
                    openPredictionModal(nameModalMatchId, nameModalTeam1, nameModalTeam2,
                        nameModalTimeISO, name);
                }, 600);
            } else {
                statusEl.className = 'user-status new';
                statusEl.textContent = `👤 مرحباً "${name}"! أنت لاعب جديد. سيتم تسجيل توقعاتك.`;
                localStorage.setItem('lastUserName', name);
                setCurrentUserName(name);
                setUserPredictionsMap({});
                this.textContent = '✅ متابعة للتوقع';
                setTimeout(() => {
                    closeNameModal();
                    openPredictionModal(nameModalMatchId, nameModalTeam1, nameModalTeam2,
                        nameModalTimeISO, name);
                }, 600);
            }
        } catch (e) {
            console.error("❌ التحقق من الاسم:", e);
            errorEl.textContent = '❌ حدث خطأ أثناء التحقق من الاسم';
            this.disabled = false;
            this.textContent = 'متابعة →';
            statusEl.style.display = 'none';
        }
    });
    document.getElementById('nameInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('nameSubmitBtn').click();
        }
        if (e.key === 'Escape') {
            closeNameModal();
        }
    });

    // حفظ التوقع
    document.getElementById('modalSubmitBtn').addEventListener('click', async function() {
        const userName = currentUserName || localStorage.getItem('lastUserName') || '';
        const selected = document.querySelector('input[name="prediction"]:checked');
        const msgEl = document.getElementById('modalMessage');
        if (!userName) { msgEl.textContent = '⚠️ الرجاء إدخال اسمك';
            msgEl.className = 'modal-message warning'; return; }
        if (!selected) { msgEl.textContent = '⚠️ الرجاء اختيار توقع';
            msgEl.className = 'modal-message warning'; return; }
        let prediction = selected.value === 'HOME' ? currentTeam1 : (selected.value === 'AWAY' ? currentTeam2 :
            'DRAW');
        if (isMatchFinished(currentTimeISO)) { msgEl.textContent = '⛔ هذه المباراة انتهت، لا يمكن حفظ التوقع.';
            msgEl.className = 'modal-message error'; return; }
        if (isMatchLive(currentTimeISO)) { msgEl.textContent = '⛔ لا يمكن التوقع على مباراة جارية';
            msgEl.className = 'modal-message error'; return; }
        if (!canPredict(currentTimeISO)) { msgEl.textContent =
                '⛔ لا يمكن التوقع الآن، المباراة على وشك البدء أو بدأت بالفعل (يُسمح حتى 5 دقائق قبل البداية).';
            msgEl.className = 'modal-message error'; return; }
        if (!isEditing && isMatchSubmitted(currentMatchId)) {
            msgEl.textContent = '⚠️ لقد توقعت هذه المباراة مسبقاً';
            msgEl.className = 'modal-message warning';
            return;
        }
        this.disabled = true;
        msgEl.textContent = '⏳ جاري الحفظ...';
        msgEl.className = 'modal-message';
        const result = await savePrediction(userName, currentMatchId, prediction);
        if (result.success) {
            msgEl.textContent = result.updated ? '✅ تم تحديث التوقع بنجاح! 🎉' :
            '✅ تم حفظ التوقع بنجاح! 🎉';
            msgEl.className = 'modal-message success';
            this.disabled = false;
            if (userName) {
                await loadUserPredictions(userName);
            }
            await renderAllPredictions();
            renderLeaderboard(currentLeaderboardPeriod);
            renderUpcoming();
            updateNewsTicker();
            setTimeout(closePredictionModal, 1200);
        } else {
            msgEl.textContent = result.message || '❌ فشل الحفظ';
            msgEl.className = 'modal-message error';
            this.disabled = false;
        }
    });

    // مقارنة
    document.getElementById('compareModalCloseBtn').addEventListener('click', closeCompareModal);
    document.getElementById('compareModal').addEventListener('click', function(e) { if (e.target === this)
            closeCompareModal(); });

    // تحليلات
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

    // شجرة البطولة
    document.getElementById('bracketModalCloseBtn').addEventListener('click', closeBracketModal);
    document.getElementById('bracketMatchModal').addEventListener('click', function(e) { if (e.target === this)
            closeBracketModal(); });

    // اختبارات
    document.getElementById('testResultsCloseBtn').addEventListener('click', function() {
        document.getElementById('testResultsModal').classList.remove('active');
        document.body.style.overflow = '';
    });
}

// بدء التطبيق
init().then(() => bindEvents()); 