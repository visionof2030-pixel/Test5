// ============================================================
//  ui.js - واجهة المستخدم، العرض، الأحداث والتهيئة
//  يعتمد على OpenFootball API كمصدر رئيسي للبيانات
//  مع دمج المباريات الثابتة يدوياً.
// ============================================================

// (يعتمد على core.js و api.js)

// ------------------------------------------------------------
//  دالة تحميل البيانات من OpenFootball (المصدر الأساسي)
// ------------------------------------------------------------
async function loadOpenFootballData() {
    try {
        const cached = getCache("openfootball_full");
        if (cached) {
            state.allGames = cached;
            state.openfootballMatches = cached;
            // تصفية المباريات المنتهية
            const finished = cached.filter(m => m.score && m.score.ft);
            state.previousGamesData = finished.map(match => mapOpenFootballMatch(match));
            // دمج المباريات الثابتة مع النتائج
            mergeFixedResults();
            setCache("games", state.previousGamesData);
            return;
        }

        const response = await fetch('https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (!data?.matches) throw new Error('تنسيق غير صحيح');

        const allMatches = data.matches;
        state.allGames = allMatches;
        state.openfootballMatches = allMatches;

        // استخراج المباريات المنتهية (التي لها نتيجة)
        const finished = allMatches.filter(m => m.score && m.score.ft);
        const mapped = finished.map(match => mapOpenFootballMatch(match));
        state.previousGamesData = mapped;

        // دمج المباريات الثابتة مع النتائج
        mergeFixedResults();

        // تخزين في الكاش
        setCache("openfootball_full", allMatches);
        setCache("games", state.previousGamesData);

        console.log(`✅ تم تحميل ${allMatches.length} مباراة من OpenFootball، ${finished.length} منتهية، بالإضافة إلى ${extraFixedResults.length} نتيجة ثابتة`);
    } catch (e) {
        console.error("❌ فشل تحميل بيانات OpenFootball:", e);
        // في حال الفشل، نحاول استعادة من الكاش
        const cached = getCache("openfootball_full");
        if (cached) {
            state.allGames = cached;
            state.openfootballMatches = cached;
            const finished = cached.filter(m => m.score && m.score.ft);
            state.previousGamesData = finished.map(match => mapOpenFootballMatch(match));
            mergeFixedResults();
        } else {
            // استخدام البيانات الاحتياطية
            console.warn("⚠️ استخدام البيانات الاحتياطية (matchesData)");
            state.allGames = matchesData.map(m => ({
                team1: m.team1,
                team2: m.team2,
                date: m.timeISO,
                round: m.roundLabel,
                score: null,
                finished: false
            }));
            state.openfootballMatches = state.allGames;
            state.previousGamesData = [];
            // في هذه الحالة، نعتمد فقط على المباريات الثابتة
            mergeFixedResults();
        }
    }
}

// دالة مساعدة لدمج المباريات الثابتة مع البيانات الحالية
function mergeFixedResults() {
    // نمر على كل مباراة ثابتة ونتأكد من عدم وجودها مسبقاً في state.previousGamesData
    for (let fixed of extraFixedResults) {
        // نبحث عن مباراة مطابقة (نفس الفريقين) في البيانات الحالية
        const exists = state.previousGamesData.some(m =>
            (m.homeAr === fixed.homeAr && m.awayAr === fixed.awayAr) ||
            (m.homeAr === fixed.awayAr && m.awayAr === fixed.homeAr)
        );
        if (!exists) {
            // نضيف المباراة الثابتة مع ترتيب الفريقين بشكل صحيح
            state.previousGamesData.push({
                homeAr: fixed.homeAr,
                awayAr: fixed.awayAr,
                homeScore: fixed.homeScore,
                awayScore: fixed.awayScore,
                dayName: fixed.dayName,
                formattedDate: fixed.formattedDate,
                timeMatch: fixed.timeMatch,
                sortTimestamp: fixed.sortTimestamp || Date.now() - (state.previousGamesData.length * 1000) // ترتيب تقريبي
            });
        } else {
            // إذا كانت موجودة، نستبدلها (للتأكد من النتائج الصحيحة)
            const index = state.previousGamesData.findIndex(m =>
                (m.homeAr === fixed.homeAr && m.awayAr === fixed.awayAr) ||
                (m.homeAr === fixed.awayAr && m.awayAr === fixed.homeAr)
            );
            if (index !== -1) {
                // نحافظ على ترتيب الفريقين كما هو موجود
                state.previousGamesData[index] = {
                    ...state.previousGamesData[index],
                    homeScore: fixed.homeScore,
                    awayScore: fixed.awayScore,
                    dayName: fixed.dayName,
                    formattedDate: fixed.formattedDate,
                    timeMatch: fixed.timeMatch,
                    sortTimestamp: fixed.sortTimestamp || state.previousGamesData[index].sortTimestamp
                };
            }
        }
    }
    // إزالة التكرارات (في حال وجودها)
    const unique = new Map();
    for (let m of state.previousGamesData) {
        const key = [m.homeAr, m.awayAr].sort().join('|');
        unique.set(key, m);
    }
    state.previousGamesData = Array.from(unique.values());
    // فرز حسب التاريخ
    state.previousGamesData.sort((a, b) => (a.sortTimestamp || 0) - (b.sortTimestamp || 0));
}

// دالة مساعدة لتحويل كائن المباراة من OpenFootball إلى بنية متوقعة
function mapOpenFootballMatch(match) {
    const homeAr = translateToArabic(match.team1 || match.home_team_name || '');
    const awayAr = translateToArabic(match.team2 || match.away_team_name || '');
    const homeScore = match.score?.ft?.[0] ?? 0;
    const awayScore = match.score?.ft?.[1] ?? 0;
    const sortTimestamp = getSortTimestamp(match);

    let dayName = '', formattedDate = '', timeMatch = '';
    const dateStr = match.date || match.local_date || '';
    if (dateStr) {
        const parts = dateStr.split(' ');
        const dateParts = parts[0]?.split('/');
        if (dateParts && dateParts.length === 3) {
            const d = new Date(`${dateParts[2]}-${dateParts[0]}-${dateParts[1]}T12:00:00`);
            if (!isNaN(d)) {
                dayName = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][d.getDay()];
                formattedDate = `${d.getDate()} ${['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'][d.getMonth()]} ${d.getFullYear()}`;
            }
        }
        if (parts.length > 1 && parts[1]?.match(/\d{2}:\d{2}/)) {
            timeMatch = parts[1];
        }
    }

    return {
        ...match,
        homeAr,
        awayAr,
        homeScore,
        awayScore,
        dayName,
        formattedDate,
        timeMatch,
        sortTimestamp,
        // إضافة حقول مساعدة للتوافق مع الكود القديم
        finished: !!match.score?.ft,
        home_team_name_fa: homeAr,
        away_team_name_fa: awayAr,
        home_score: homeScore,
        away_score: awayScore,
    };
}

// ------------------------------------------------------------
//  دوال العرض الأساسية (نفس السابق)
// ------------------------------------------------------------
function renderMatchCard(m, isUpcoming) {
    const st = getMatchStatus(m);
    const isLive = st.live;
    const isFinished = st.finished;
    const matchId = `${m.timeISO}_${m.team1}_${m.team2}`;
    const savedUserName = localStorage.getItem('lastUserName') || '';
    const submitted = isMatchSubmitted(matchId);
    const canPredictNow = isUpcoming && !isLive && !isFinished && canPredict(m.timeISO);

    const userHasPrediction = userPredictionsMap && userPredictionsMap[matchId] === true;

    let scoreDisplay = '🆚',
        scoreClass = 'upcoming',
        matchClass = '';
    let homeScore = 0,
        awayScore = 0,
        matchResult = null;
    if (isLive) {
        scoreDisplay = '🔴 LIVE';
        scoreClass = 'live';
        matchClass = 'live';
    } else if (isFinished) {
        const result = findMatchResult(m.team1, m.team2);
        if (result) {
            homeScore = result.homeScore;
            awayScore = result.awayScore;
            scoreDisplay = `${homeScore} - ${awayScore}`;
            scoreClass = 'finished';
            matchClass = 'finished-match';
            matchResult = { homeScore, awayScore };
        } else {
            scoreDisplay = '✅';
            scoreClass = 'finished';
            matchClass = 'finished-match';
        }
    }

    let predictBtnHtml = 'توقع الآن';
    let predictDisabled = false;
    let predictBtnClass = 'predict-btn';
    let predictBtnExtra = '';
    let editBtnHtml = 'تعديل';
    let editDisabled = true;
    let editBtnExtra = '';

    if (userHasPrediction) {
        predictDisabled = true;
        predictBtnHtml = '✅ تم التوقع';
        predictBtnClass += ' submitted';
        predictBtnExtra = 'disabled';
        if (canPredictNow) {
            editDisabled = false;
            editBtnExtra = `onclick="openEditPredictionModal('${matchId}','${m.team1}','${m.team2}','${m.timeISO}')"`;
        } else {
            editDisabled = true;
            editBtnExtra = 'disabled';
            if (isFinished) {
                editBtnHtml = '⏳ انتهت';
            } else if (isLive) {
                editBtnHtml = '⛔ جارية';
            } else if (!canPredict(m.timeISO) && !isFinished && !isLive) {
                editBtnHtml = '⏳ انتهت المهلة';
            } else {
                editBtnHtml = '⏳ غير متاح';
            }
        }
    } else if (submitted) {
        predictDisabled = true;
        predictBtnHtml = 'تم التوقع ✅';
        predictBtnClass += ' submitted';
        predictBtnExtra = 'disabled';
        if (canPredictNow) {
            editDisabled = false;
            editBtnExtra = `onclick="openEditPredictionModal('${matchId}','${m.team1}','${m.team2}','${m.timeISO}')"`;
        } else {
            editDisabled = true;
            editBtnExtra = 'disabled';
            if (isFinished) {
                editBtnHtml = '⏳ انتهت';
            } else if (isLive) {
                editBtnHtml = '⛔ جارية';
            } else if (!canPredict(m.timeISO) && !isFinished && !isLive) {
                editBtnHtml = '⏳ انتهت المهلة';
            } else {
                editBtnHtml = '⏳ غير متاح';
            }
        }
    } else if (!canPredictNow) {
        predictDisabled = true;
        if (isFinished) {
            predictBtnHtml = '📋 عرض التوقعات';
            predictBtnClass += ' view-btn';
            predictBtnExtra = `onclick="openMatchPredictions('${matchId}', '${m.team1}', '${m.team2}', ${homeScore}, ${awayScore})"`;
        } else if (isLive) {
            predictBtnHtml = '⛔ جارية';
            predictBtnClass += ' view-btn';
            predictBtnExtra = 'disabled';
        } else if (!canPredict(m.timeISO) && !isFinished && !isLive) {
            predictBtnHtml = '⏳ قريباً (أقل من 5 دقائق)';
            predictBtnClass += ' view-btn';
            predictBtnExtra = 'disabled';
        } else {
            predictBtnHtml = '⏳ قريباً';
            predictBtnClass += ' view-btn';
            predictBtnExtra = 'disabled';
        }
    } else {
        predictBtnExtra = `onclick="openNameModal('${matchId}','${m.team1}','${m.team2}','${m.timeISO}')"`;
    }

    const groupName = Object.keys(finalGroups).find(g => finalGroups[g].includes(m.team1)) || '';
    const isToday = isMatchToday(m.timeISO);
    const dayLabel = isToday ? '📌 اليوم' : (isMatchTodayOrTomorrow(m.timeISO) ? '📌 غداً' : '');
    let ground = getGroundForMatch(m.team1, m.team2, m.timeISO);
    if (!ground) {
        const matchFromAPI = state.allGames.find(g => {
            const home = translateToArabic(g.team1 || g.home_team_name || '');
            const away = translateToArabic(g.team2 || g.away_team_name || '');
            return (home === m.team1 && away === m.team2) || (home === m.team2 && away === m.team1);
        });
        if (matchFromAPI && matchFromAPI.stadium_id) {
            ground = getStadiumName(matchFromAPI.stadium_id);
        }
    }
    const onclickAttr = (isFinished && matchResult) ?
        `onclick="openMatchPredictions('${matchId}', '${m.team1}', '${m.team2}', ${homeScore}, ${awayScore})"` :
        '';

    const showEdit = (userHasPrediction || submitted) && canPredictNow;

    return `
            <div class="match-card ${matchClass}" ${onclickAttr}>
              <div class="match-teams">
                <div class="match-team"><span class="flag">${getFlag(m.team1)}</span> ${m.team1}</div>
                <div class="match-score ${scoreClass}">${scoreDisplay}</div>
                <div class="match-team"><span class="flag">${getFlag(m.team2)}</span> ${m.team2}</div>
              </div>
              <div class="match-meta">
                <span class="tag">🏅 ${m.roundLabel}</span>
                <span class="tag">${groupName ? `المجموعة ${groupName}` : ''}</span>
                ${isUpcoming ? `<span class="timer ${isLive ? 'live' : ''}">${isLive ? '🔴 تُلعب الآن' : st.text}</span>` : `<span class="tag finished-tag">✅ انتهت - اضغط لعرض التوقعات</span>`}
              </div>
              <div class="match-meta" style="margin-top:4px;">
                <span class="tag">${getDay(m.timeISO)}</span>
                <span class="tag">${getDateTimeDisplay(m.timeISO)}</span>
                ${dayLabel ? `<span class="tag" style="color:var(--gold-light);">${dayLabel}</span>` : ''}
                ${ground ? `<span class="tag stadium-tag">🏟️ ${ground}</span>` : ''}
              </div>
              ${isUpcoming ? `
                <div class="predict-btn-wrap">
                  <div class="btn-group">
                    <button class="${predictBtnClass}" ${predictBtnExtra} data-matchid="${matchId}">
                      ${predictBtnHtml}
                    </button>
                    ${showEdit ? `<button class="edit-btn" ${editBtnExtra} data-matchid="${matchId}">✏️ ${editBtnHtml}</button>` : ''}
                  </div>
                  <button class="view-btn" onclick="openViewPredictionsModal('${matchId}','${m.team1}','${m.team2}')">
                    📋 استعراض التوقعات
                  </button>
                  <button class="share-link-btn" onclick="copyMatchLink('${m.id}', '${m.team1}', '${m.team2}')">
                    🔗 مشاركة
                  </button>
                </div>
              ` : ''}
            </div>
          `;
}

function renderUpcoming() {
    try {
        const allMatches = state.allGames || [];
        const matches = allMatches.map(m => ({
            id: m.id || m._id,
            team1: translateToArabic(m.team1 || m.home_team_name || ''),
            team2: translateToArabic(m.team2 || m.away_team_name || ''),
            timeISO: m.date || m.local_date || new Date().toISOString(),
            roundLabel: m.round || m.stage || 'دور المجموعات',
            ...m
        }));

        const groupFilter = document.getElementById('groupFilter')?.value || 'all';
        let active = [];
        if (groupFilter === 'all') {
            active = upcomingMatches(matches);
        } else {
            const teams = finalGroups[groupFilter] || [];
            const allMatchesForGroup = matches.filter(m => teams.includes(m.team1) || teams.includes(m.team2));
            active = allMatchesForGroup;
            active.sort((a, b) => matchTime(a.timeISO) - matchTime(b.timeISO));
        }
        if (groupFilter === 'all') {
            if (currentDayFilter === 'today') {
                active = active.filter(m => isTodaySaudi(m.timeISO));
            } else if (currentDayFilter === 'tomorrow') {
                active = active.filter(m => isTomorrowSaudi(m.timeISO));
            } else if (currentDayFilter === 'week') {
                const today = getSaudiNow();
                const weekLater = new Date(today);
                weekLater.setDate(weekLater.getDate() + 7);
                active = active.filter(m => {
                    const d = toSaudiTime(m.timeISO);
                    return d >= today && d <= weekLater;
                });
            }
        }
        const container = document.getElementById('matchesContainer');
        document.getElementById('upcomingCount').textContent = active.length;
        if (!active.length) {
            container.innerHTML =
                `<div class="empty-state"><span class="icon">📭</span> لا توجد مباريات تطابق الفلاتر</div>`;
            return;
        }
        container.innerHTML = active.map(m => {
            const isUpcoming = (matchTime(m.timeISO) + MATCH_DURATION) > now();
            return renderMatchCard(m, isUpcoming);
        }).join('');
        updateShareAllCount();
    } catch (e) {
        console.error("renderUpcoming:", e);
        document.getElementById('matchesContainer').innerHTML =
            `<div class="empty-state"><span class="icon">⚠️</span> حدث خطأ</div>`;
    }
}

function renderPreviousGamesFiltered() {
    const searchText = document.getElementById('prevSearchInput')?.value.trim().toLowerCase() || '';
    let filtered = [...state.previousGamesData];

    filtered.sort((a, b) => (b.sortTimestamp || 0) - (a.sortTimestamp || 0));

    if (searchText) {
        filtered = filtered.filter(g =>
            g.homeAr.toLowerCase().includes(searchText) ||
            g.awayAr.toLowerCase().includes(searchText)
        );
    }

    const container = document.getElementById('previousMatchesContainer');
    const countSpan = document.getElementById('prevCount');
    countSpan.textContent = filtered.length;

    if (!filtered.length) {
        let message = '📭 لا توجد مباريات مطابقة';
        if (state.previousGamesData.length === 0) message = '⏳ جاري التحميل...';
        if (searchText && state.previousGamesData.length > 0) message =
            `🔍 لا توجد مباريات سابقة للمنتخب "${searchText}"`;
        container.innerHTML = `<div class="empty-state"><span class="icon">${message === '⏳ جاري التحميل...' ? '⏳' : '📭'}</span> ${message}</div>`;
        return;
    }

    container.innerHTML = filtered.map(g => {
        let ground = getGroundForMatch(g.homeAr, g.awayAr, null);
        return `
              <div class="match-card finished-match" onclick="openPreviousMatchPredictions('${g.homeAr}', '${g.awayAr}', ${g.homeScore}, ${g.awayScore})">
                <div class="match-teams">
                  <div class="match-team"><span class="flag">${getFlag(g.homeAr)}</span> ${g.homeAr}</div>
                  <div class="match-score finished">${g.homeScore} - ${g.awayScore}</div>
                  <div class="match-team"><span class="flag">${getFlag(g.awayAr)}</span> ${g.awayAr}</div>
                </div>
                <div class="match-meta">
                  <span class="tag">${g.dayName || 'تاريخ'}</span>
                  <span class="tag">${g.formattedDate || ''} ${g.timeMatch || ''}</span>
                  <span class="tag finished-tag">✅ انتهت - اضغط لعرض التوقعات</span>
                  ${ground ? `<span class="tag stadium-tag">🏟️ ${ground}</span>` : ''}
                </div>
                <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;">
                  <button class="view-btn" onclick="event.stopPropagation();openPreviousMatchPredictions('${g.homeAr}','${g.awayAr}',${g.homeScore},${g.awayScore})" style="padding:6px 14px;border-radius:40px;font-size:0.65rem;font-weight:600;background:rgba(52,152,219,0.06);border:1px solid rgba(52,152,219,0.15);color:#5dade2;cursor:pointer;font-family:inherit;">📋 عرض التوقعات</button>
                  <button class="share-link-btn" onclick="event.stopPropagation();copyMatchLink('${g.homeAr}_${g.awayAr}','${g.homeAr}','${g.awayAr}')" style="padding:4px 12px;border-radius:40px;font-size:0.6rem;font-weight:600;background:rgba(52,152,219,0.1);border:1px solid rgba(52,152,219,0.2);color:#5dade2;cursor:pointer;font-family:inherit;">🔗 مشاركة</button>
                </div>
              </div>
            `;
    }).join('');
}

// ------------------------------------------------------------
//  الترتيب والهدافين والإحصائيات (نفس السابق)
// ------------------------------------------------------------
function calculateStandings() { /* ... نفس الكود السابق ... */ }
function updateScorers() { /* ... */ }
function renderScorers() { /* ... */ }
function renderTeamStats() { /* ... */ }
function renderBracket() { /* ... */ }

// ------------------------------------------------------------
//  دوال التوقعات والتحليل (نفس السابق)
// ------------------------------------------------------------
async function renderAllPredictions() { /* ... */ }

// ------------------------------------------------------------
//  النوافذ المنبثقة والإشعارات (نفس السابق)
// ------------------------------------------------------------
function showCopyToast(msg) { /* ... */ }
function toggleCompactMode() { /* ... */ }
// ... إلخ، جميع الدوال السابقة موجودة.

// ------------------------------------------------------------
//  دوال التحميل الأساسية (تعتمد الآن على OpenFootball)
// ------------------------------------------------------------
async function loadPreviousGames() {
    await loadOpenFootballData();
    renderPreviousGamesFiltered();
    calculateStandings();
    renderTeamStats();
    renderBracket();
    renderLeaderboard(currentLeaderboardPeriod);
    updateScorers();
    updateNewsTicker();
}

async function fetchOpenfootballData() {
    await loadOpenFootballData();
}

// ------------------------------------------------------------
//  init - التهيئة الرئيسية
// ------------------------------------------------------------
async function init() {
    console.log("🚀 INIT START (OpenFootball + Fixed Results)");
    await loadOpenFootballData();
    await getAllPredictions();
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
    console.log("✅ INIT DONE");
}

function startAutoUpdate() {
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

// ------------------------------------------------------------
//  ربط الأحداث (نفس السابق)
// ------------------------------------------------------------
function bindEvents() { /* ... نفس الكود السابق ... */ }

// ------------------------------------------------------------
//  بدء التطبيق
// ------------------------------------------------------------
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        init().then(() => bindEvents());
    });
} else {
    init().then(() => bindEvents());
}

// نهاية ui.js