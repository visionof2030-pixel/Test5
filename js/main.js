// ============================================================
//  الملف الرئيسي - تهيئة التطبيق
// ============================================================

// حالة التطبيق العامة
const state = {
    previousGamesData: [],
    allGames: [],
    openfootballMatches: [],
    predictions: [],
    userPredictionsMap: {},
    loaded: false
};

// تصدير state للاستخدام في الملفات الأخرى
window.state = state;

// ============================================================
//  دوال تحميل البيانات
// ============================================================

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

async function init() {
    console.log("🚀 INIT START (محسن)");
    
    // تهيئة الثيم
    initTheme();
    
    // تحميل البيانات
    await Promise.all([
        loadPreviousGamesFull(),
        fetchOpenfootballData(),
        getAllPredictions()
    ]);
    
    state.loaded = true;
    
    // تحديث جميع التوقعات فوراً
    await renderAllPredictions();
    updateScorers();
    renderUpcoming();
    calculateStandings();
    renderTeamStats();
    renderScorers();
    renderBracket();
    initTabs();
    checkUrlForMatch();
    startAutoUpdate();
    updateNewsTicker();
    
    // تحميل توقعات المستخدم إذا كان مسجلاً
    const lastUser = getLastUserName();
    if (lastUser) {
        await loadUserPredictions(lastUser);
    }
    
    // ===== تشغيل لوحة المتصدرين =====
    if (typeof initLeaderboard === 'function') {
        console.log("🏆 تشغيل لوحة المتصدرين...");
        initLeaderboard();
    }
    
    console.log("✅ INIT DONE (محسن)");
}

function initTabs() {
    console.log("🔹 تفعيل التبويبات");
    const tabBtns = document.querySelectorAll('.tab-btn[data-tab]');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.tab;
            console.log("🔹 تبويب مختار:", id);
            
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            const target = document.getElementById(`${id}Tab`);
            if (target) target.classList.add('active');
            
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const dayFilter = document.getElementById('dayFilterTabs');
            if (id === 'upcoming') {
                if (dayFilter) dayFilter.classList.add('visible');
            } else {
                if (dayFilter) dayFilter.classList.remove('visible');
            }
            
            if (id === 'previous' && state.previousGamesData.length === 0) loadPreviousGamesFull();
            if (id === 'standings' && state.previousGamesData.length) calculateStandings();
            if (id === 'scorers') renderScorers();
            if (id === 'stats') renderTeamStats();
            if (id === 'predictions') renderAllPredictions();
            if (id === 'leaderboard') {
                if (typeof leaderboard !== 'undefined' && leaderboard.render) {
                    setTimeout(() => leaderboard.render('all'), 100);
                }
            }
        });
    });
    
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
        const id = activeTab.dataset.tab;
        const target = document.getElementById(`${id}Tab`);
        if (target) target.classList.add('active');
        if (id === 'upcoming') {
            const dayFilter = document.getElementById('dayFilterTabs');
            if (dayFilter) dayFilter.classList.add('visible');
        }
    }
    console.log("✅ التبويبات مفعلة");
}

function startAutoUpdate() {
    // تحديث المباريات كل ثانية
    setInterval(renderUpcoming, 1000);
    
    // تحديث البيانات كل 30 ثانية
    setInterval(async () => {
        const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab;
        if (activeTab === 'previous') loadPreviousGamesFull();
        if (activeTab === 'standings' && state.previousGamesData.length) calculateStandings();
        if (activeTab === 'scorers') renderScorers();
        if (activeTab === 'stats') renderTeamStats();
        if (activeTab === 'predictions') await renderAllPredictions();
        if (activeTab === 'leaderboard' && typeof leaderboard !== 'undefined' && leaderboard.render) {
            leaderboard.render('all');
        }
        updateShareAllCount();
        updateNewsTicker();
    }, 30000);
}

function checkUrlForMatch() {
    const params = new URLSearchParams(window.location.search);
    const matchId = params.get('m');
    if (matchId && !isNaN(matchId) && typeof matchesData !== 'undefined') {
        const match = matchesData.find(m => m.id === parseInt(matchId));
        if (match && !isMatchFinished(match.timeISO)) {
            setTimeout(() => {
                openNameModal(
                    `${match.timeISO}_${match.team1}_${match.team2}`, 
                    match.team1,
                    match.team2, 
                    match.timeISO
                );
            }, 800);
        }
    }
}

function updateNewsTicker() {
    const tickerEl = document.getElementById('todayHighlights');
    if (!tickerEl) return;

    const today = getSaudiNow();
    const todayMatches = typeof matchesData !== 'undefined' ? 
        matchesData.filter(m => {
            const d = toSaudiTime(m.timeISO);
            return d.getDate() === today.getDate() &&
                d.getMonth() === today.getMonth() &&
                d.getFullYear() === today.getFullYear() &&
                (matchTime(m.timeISO) + MATCH_DURATION) > now();
        }) : [];

    if (todayMatches.length === 0) {
        tickerEl.textContent = '📅 لا توجد مباريات اليوم';
        return;
    }

    let text = '📅 مباريات اليوم: ';
    const matchTexts = todayMatches.map(m => {
        const flag1 = getFlag(m.team1);
        const flag2 = getFlag(m.team2);
        const timeStr = getTimeFromISO(m.timeISO);
        const stats1 = getTeamStats(m.team1);
        const stats2 = getTeamStats(m.team2);
        const winRate1 = stats1.total > 0 ? Math.round(stats1.winRate) : 0;
        const winRate2 = stats2.total > 0 ? Math.round(stats2.winRate) : 0;
        return `${flag1} ${m.team1} (نسبة الفوز ${winRate1}%) 🆚 ${flag2} ${m.team2} (نسبة الفوز ${winRate2}%) (${timeStr})`;
    });
    text += matchTexts.join(' | ');

    text += ' | 🔄 التسلسل الزمني: ';
    const sortedTodayMatches = [...todayMatches].sort((a, b) => matchTime(a.timeISO) - matchTime(b.timeISO));
    const sequenceTexts = sortedTodayMatches.map((m, index) => {
        const timeStr = getTimeFromISO(m.timeISO);
        return `${index+1}. ${m.team1} 🆚 ${m.team2} (${timeStr})`;
    });
    text += sequenceTexts.join(' → ');

    const predictions = state.predictions || [];
    if (predictions.length > 0) {
        const todayMatchIds = todayMatches.map(m => `${m.timeISO}_${m.team1}_${m.team2}`);
        const todayPredictions = predictions.filter(p => todayMatchIds.includes(p.match_id));

        if (todayPredictions.length > 0) {
            const userPreds = {};
            for (let p of todayPredictions) {
                if (!userPreds[p.user_name]) userPreds[p.user_name] = [];
                userPreds[p.user_name].push(p);
            }
            const sortedUsers = Object.entries(userPreds).sort((a, b) => b[1].length - a[1].length);
            if (sortedUsers.length > 0) {
                const topUser = sortedUsers[0];
                const predCount = topUser[1].length;
                text += ` | 🔥 أكثر متوقع اليوم: ${topUser[0]} (${predCount} توقع${predCount > 1 ? 'ات' : ''})`;
            }
        }
    }

    tickerEl.textContent = text;
}

// ============================================================
//  ربط الأحداث العامة
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    // ربط فلتر المجموعات
    const groupFilter = document.getElementById('groupFilter');
    if (groupFilter) {
        groupFilter.addEventListener('change', renderUpcoming);
    }
    
    // ربط زر تحديث الثيم
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
    
    // ربط أزرار اليوم
    const dayBtns = document.querySelectorAll('.day-btn');
    dayBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentDayFilter = this.dataset.day;
            renderUpcoming();
        });
    });
    
    // ربط زر تحديث الصفحة
    const reloadBtn = document.querySelector('.header-btn[onclick="location.reload()"]');
    if (reloadBtn) {
        reloadBtn.addEventListener('click', function() {
            location.reload();
        });
    }
    
    // ربط زر إخفاء مسار البطولة
    const hideBracketBtn = document.querySelector('#bracketWrapper .admin-btn');
    if (hideBracketBtn) {
        hideBracketBtn.addEventListener('click', function() {
            document.getElementById('bracketWrapper').classList.remove('visible');
        });
    }
    
    // ربط زر تصغير للتصوير
    const compactBtn = document.getElementById('toggleCompactBtn');
    if (compactBtn) {
        compactBtn.addEventListener('click', toggleCompactMode);
    }
    
    // ربط زر إعادة الحجم الطبيعي
    const resetBtn = document.querySelector('.admin-btn.danger[onclick="resetCompactMode()"]');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetCompactMode);
    }
    
    // ربط زر التوقعات المكررة
    const dupBtn = document.querySelector('.admin-btn.secondary[onclick="loadDuplicates()"]');
    if (dupBtn) {
        dupBtn.addEventListener('click', loadDuplicates);
    }
    
    // ربط زر الأرشيف
    const archiveBtn = document.querySelector('.admin-btn[onclick="toggleArchive()"]');
    if (archiveBtn) {
        archiveBtn.addEventListener('click', toggleArchive);
    }
    
    // ربط زر الاختبارات
    const testBtn = document.querySelector('.admin-btn.secondary[onclick="runTests()"]');
    if (testBtn) {
        testBtn.addEventListener('click', runTests);
    }
    
    // ربط زر مسار البطولة
    const bracketBtn = document.querySelector('.admin-btn.bracket-btn');
    if (bracketBtn) {
        bracketBtn.addEventListener('click', toggleBracketAdmin);
    }
    
    // ربط زر المقارنة في نافذة المقارنة
    const compareBtn = document.querySelector('#compareModal .admin-btn');
    if (compareBtn) {
        compareBtn.addEventListener('click', renderCompare);
    }
    
    // ربط زر إغلاق نافذة المقارنة
    const compareCloseBtn = document.querySelector('#compareModal .modal-submit');
    if (compareCloseBtn) {
        compareCloseBtn.addEventListener('click', closeCompareModal);
    }
    
    // ربط زر تحليل اللاعب
    const playerAnalyticsSelect = document.getElementById('playerAnalyticsSelect');
    if (playerAnalyticsSelect) {
        playerAnalyticsSelect.addEventListener('change', updatePlayerAnalytics);
    }
});

// ============================================================
//  بدء التطبيق
// ============================================================

// بدء التطبيق عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// تصدير الدوال العامة للاستخدام في HTML
window.init = init;
window.renderUpcoming = renderUpcoming;
window.loadPreviousGamesFull = loadPreviousGamesFull;
window.calculateStandings = calculateStandings;
window.renderTeamStats = renderTeamStats;
window.renderScorers = renderScorers;
window.renderBracket = renderBracket;
window.renderAllPredictions = renderAllPredictions;
window.updateNewsTicker = updateNewsTicker;
window.openNameModal = openNameModal;
window.closeNameModal = closeNameModal;
window.openPredictionModal = openPredictionModal;
window.openMatchPredictions = openMatchPredictions;
window.openViewPredictionsModal = openViewPredictionsModal;
window.openPlayerPredictions = openPlayerPredictions;
window.openEditPredictionModal = openEditPredictionModal;
window.openTeamStatsModal = openTeamStatsModal;
window.closeTeamStatsModal = closeTeamStatsModal;
window.openBracketMatchDetail = openBracketMatchDetail;
window.closeBracketModal = closeBracketModal;
window.toggleBracketAdmin = toggleBracketAdmin;
window.toggleArchive = toggleArchive;
window.loadDuplicates = loadDuplicates;
window.runTests = runTests;
window.toggleCompactMode = toggleCompactMode;
window.resetCompactMode = resetCompactMode;
window.toggleModalCompact = toggleModalCompact;
window.shareResults = shareResults;
window.shareAllTodayTomorrow = shareAllTodayTomorrow;
window.copyMatchLink = copyMatchLink;
window.openCompareModal = openCompareModal;
window.closeCompareModal = closeCompareModal;
window.renderCompare = renderCompare;
window.openAnalytics = openAnalytics;
window.updatePlayerAnalytics = updatePlayerAnalytics;
window.populatePlayerAnalyticsSelect = populatePlayerAnalyticsSelect;
window.renderMatchAnalytics = renderMatchAnalytics;
window.showCopyToast = showCopyToast;
window.showPasswordOverlay = showPasswordOverlay;
window.hidePasswordOverlay = hidePasswordOverlay;
window.checkPassword = checkPassword;
window.toggleTheme = toggleTheme;
window.getLastUserName = getLastUserName;
window.setLastUserName = setLastUserName;
window.getTeamStats = getTeamStats;
window.getTeamStatsFull = getTeamStatsFull;
window.getTeamScorers = getTeamScorers;
window.getFlag = getFlag;
window.translateToArabic = translateToArabic;
window.translateBracketTeamName = translateBracketTeamName;
window.determineWinner = determineWinner;
window.findMatchResult = findMatchResult;
window.isMatchFinished = isMatchFinished;
window.canPredict = canPredict;
window.getMatchStatus = getMatchStatus;
window.formatDate = formatDate;
window.getDateTimeDisplay = getDateTimeDisplay;
window.getTimeFromISO = getTimeFromISO;
window.getSaudiDay = getSaudiDay;
window.isTodaySaudi = isTodaySaudi;
window.isTomorrowSaudi = isTomorrowSaudi;
window.toSaudiTime = toSaudiTime;
window.getSaudiNow = getSaudiNow;
window.matchTime = matchTime;
window.now = now;
window.MATCH_DURATION = MATCH_DURATION;
window.upcomingMatches = upcomingMatches;
window.isMatchSubmitted = isMatchSubmitted;
window.addSubmittedMatch = addSubmittedMatch;
window.removeSubmittedMatch = removeSubmittedMatch;
window.getSubmittedMatches = getSubmittedMatches;
window.saveLocalPrediction = saveLocalPrediction;
window.getUserPredictionFromLocal = getUserPredictionFromLocal;
window.getLocalPredictions = getLocalPredictions;
window.setCache = setCache;
window.getCache = getCache;
window.clearAllCache = clearAllCache;
window.getScorersDict = getScorersDict;
window.getPlayerTeamMap = getPlayerTeamMap;
window.getTopScorers = getTopScorers;
window.getPlayerTeam = getPlayerTeam;
window.getArchiveStats = getArchiveStats;
window.exportArchiveData = exportArchiveData;
window.clearArchiveCache = clearArchiveCache;
window.shareMatchLink = shareMatchLink;
window.sharePrediction = sharePrediction;
window.getShareLinksForDay = getShareLinksForDay;
window.copyDayLinks = copyDayLinks;
window.fallbackCopy = fallbackCopy;
window.getAllPlayersStats = getAllPlayersStats;
window.isKnockoutMatch = isKnockoutMatch;
window.getMatchById = getMatchById;
window.parseScorersWithMinutes = parseScorersWithMinutes;
window.extractPenaltyData = extractPenaltyData;
window.normalizeName = normalizeName;
window.groupLetters = groupLetters;
window.supabaseClient = supabaseClient;