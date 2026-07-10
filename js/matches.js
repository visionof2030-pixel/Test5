// ============================================================
//  إدارة المباريات
// ============================================================

let isLoadingPrevious = false;
let currentDayFilter = 'all';

function getGroundForMatch(team1, team2, timeISO) {
    if (typeof matchesData !== 'undefined') {
        const directMatch = matchesData.find(m => (m.team1 === team1 && m.team2 === team2) || (m.team1 === team2 && m
            .team2 === team1));
        if (directMatch && directMatch.stadium) return directMatch.stadium;
    }

    if (state && state.openfootballMatches && state.openfootballMatches.length) {
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
    }
    return null;
}

function renderMatchCard(m, isUpcoming) {
    const st = getMatchStatus(m);
    const isLive = st.live;
    const isFinished = st.finished;
    const matchId = `${m.timeISO}_${m.team1}_${m.team2}`;
    const savedUserName = getLastUserName();
    const submitted = isMatchSubmitted(matchId);
    const canPredictNow = isUpcoming && !isLive && !isFinished && canPredict(m.timeISO);

    const userHasPrediction = state && state.userPredictionsMap && state.userPredictionsMap[matchId] === true;

    let scoreDisplay = '🆚',
        scoreClass = 'upcoming',
        matchClass = '';
    let homeScore = 0,
        awayScore = 0,
        matchResult = null;
    let penaltyHtml = '';

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
            if (result.hadPenalties && result.homePenalty !== null && result.awayPenalty !== null) {
                penaltyHtml = `<span class="score-penalty-badge">⚽ ركلات ترجيح: ${result.homePenalty} — ${result.awayPenalty}</span>`;
            }
        } else {
            scoreDisplay = '✅';
            scoreClass = 'finished';
            matchClass = 'finished-match';
        }
    }

    const team1Stats = getTeamStats(m.team1);
    const team2Stats = getTeamStats(m.team2);

    let smartWinRate1 = 50;
    let smartWinRate2 = 50;
    if (team1Stats.total > 0 && team2Stats.total > 0) {
        const totalGoals1 = team1Stats.goalsFor + team1Stats.goalsAgainst;
        const totalGoals2 = team2Stats.goalsFor + team2Stats.goalsAgainst;
        if (totalGoals1 > 0 && totalGoals2 > 0) {
            const attack1 = team1Stats.goalsFor / team1Stats.total;
            const defense1 = team1Stats.goalsAgainst / team1Stats.total;
            const attack2 = team2Stats.goalsFor / team2Stats.total;
            const defense2 = team2Stats.goalsAgainst / team2Stats.total;

            const strength1 = (attack1 * 1.5) + (1 / (defense1 + 0.5));
            const strength2 = (attack2 * 1.5) + (1 / (defense2 + 0.5));
            const total = strength1 + strength2;
            smartWinRate1 = total > 0 ? (strength1 / total) * 100 : 50;
            smartWinRate2 = 100 - smartWinRate1;
        }
    } else if (team1Stats.total > 0) {
        smartWinRate1 = Math.min(100, Math.max(0, team1Stats.winRate));
        smartWinRate2 = 100 - smartWinRate1;
    } else if (team2Stats.total > 0) {
        smartWinRate2 = Math.min(100, Math.max(0, team2Stats.winRate));
        smartWinRate1 = 100 - smartWinRate2;
    }

    let predictBtnHtml = 'توقع الآن';
    let predictDisabled = false;
    let predictBtnClass = 'predict-btn';
    let predictBtnExtra = '';

    let editBtnHtml = 'تعديل';
    let editDisabled = true;
    let editBtnExtra = '';
    let editBtnClass = 'edit-btn';
    const isAuthorized = window.isAuthorized || false;

    if (userHasPrediction) {
        predictDisabled = true;
        predictBtnHtml = '✅ تم التوقع';
        predictBtnClass += ' submitted';
        predictBtnExtra = 'disabled';

        if (canPredictNow && isAuthorized) {
            editDisabled = false;
            editBtnExtra = `onclick="openEditPredictionModal('${matchId}','${m.team1}','${m.team2}','${m.timeISO}')"`;
            editBtnClass += ' visible';
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
            if (isAuthorized) editBtnClass += ' visible';
        }
    } else if (submitted) {
        predictDisabled = true;
        predictBtnHtml = 'تم التوقع ✅';
        predictBtnClass += ' submitted';
        predictBtnExtra = 'disabled';

        if (canPredictNow && isAuthorized) {
            editDisabled = false;
            editBtnExtra = `onclick="openEditPredictionModal('${matchId}','${m.team1}','${m.team2}','${m.timeISO}')"`;
            editBtnClass += ' visible';
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
            if (isAuthorized) editBtnClass += ' visible';
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

    const isToday = isTodaySaudi(m.timeISO);
    const dayLabel = isToday ? '📌 اليوم' : (isMatchTodayOrTomorrow(m.timeISO) ? '📌 غداً' : '');
    let ground = getGroundForMatch(m.team1, m.team2, m.timeISO);
    if (!ground && state && state.allGames) {
        const matchFromAPI = state.allGames.find(g => {
            const home = translateToArabic(g.home_team_name_fa || g.home_team_name_en || '');
            const away = translateToArabic(g.away_team_name_fa || g.away_team_name_en || '');
            return (home === m.team1 && away === m.team2) || (home === m.team2 && away === m.team1);
        });
        if (matchFromAPI && matchFromAPI.stadium_id) {
            ground = getStadiumName(matchFromAPI.stadium_id);
        }
    }
    const onclickAttr = (isFinished && matchResult) ?
        `onclick="openMatchPredictions('${matchId}', '${m.team1}', '${m.team2}', ${homeScore}, ${awayScore})"` :
        '';

    const showEdit = (userHasPrediction || submitted) && canPredictNow && isAuthorized;

    return `
        <div class="match-card ${matchClass}" ${onclickAttr}>
          <div class="match-teams">
            <div class="match-team"><span class="flag">${getFlag(m.team1)}</span> ${m.team1}</div>
            <div class="match-score ${scoreClass}">${scoreDisplay} ${penaltyHtml}</div>
            <div class="match-team"><span class="flag">${getFlag(m.team2)}</span> ${m.team2}</div>
          </div>
          
          <div class="win-probability" style="margin:8px 0 6px 0;padding:6px 12px;">
            <div class="prob-title" style="font-size:0.6rem;">📊 نسبة الفوز المتوقعة وفقاً لتحليل الذكاء الاصطناعي</div>
            <div class="prob-bar" style="height:18px;">
              <div class="segment home" style="width:${Math.round(smartWinRate1)}%;background:${smartWinRate1 >= 50 ? 'var(--success)' : 'var(--danger)'};">${Math.round(smartWinRate1)}%</div>
              <div class="segment away" style="width:${Math.round(smartWinRate2)}%;background:${smartWinRate2 >= 50 ? 'var(--success)' : 'var(--danger)'};">${Math.round(smartWinRate2)}%</div>
            </div>
            <div class="prob-labels" style="font-size:0.5rem;">
              <span class="label"><span class="dot home" style="background:${smartWinRate1 >= 50 ? 'var(--success)' : 'var(--danger)'};"></span> ${m.team1}</span>
              <span class="label"><span class="dot away" style="background:${smartWinRate2 >= 50 ? 'var(--success)' : 'var(--danger)'};"></span> ${m.team2}</span>
            </div>
          </div>
          
          <div style="display:flex;justify-content:center;margin:6px 0 8px 0;">
            <button class="admin-btn secondary" onclick="event.stopPropagation();openTeamStatsModal('${m.team1}','${m.team2}')" style="padding:4px 16px;font-size:0.6rem;background:var(--info-bg);border:1px solid rgba(74,158,255,0.15);color:var(--info);">
              📊 عرض إحصائيات الفريقين
            </button>
          </div>
          
          <div class="match-meta">
            <span class="tag">🏅 ${m.roundLabel}</span>
            ${isUpcoming ? `<span class="timer ${isLive ? 'live' : ''}">${isLive ? '🔴 تُلعب الآن' : st.text}</span>` : `<span class="tag finished-tag">✅ انتهت - اضغط لعرض التوقعات</span>`}
          </div>
          <div class="match-meta" style="margin-top:4px;">
            <span class="tag">${getSaudiDay(m.timeISO)}</span>
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
                ${showEdit ? `<button class="${editBtnClass}" ${editBtnExtra} data-matchid="${matchId}">✏️ ${editBtnHtml}</button>` : (isAuthorized ? `<button class="${editBtnClass}" ${editBtnExtra} data-matchid="${matchId}" style="display:none;">✏️ ${editBtnHtml}</button>` : '')}
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
        const groupFilter = document.getElementById('groupFilter')?.value || 'all';
        let active = [];

        if (typeof matchesData === 'undefined') return;

        if (groupFilter === 'all') {
            active = upcomingMatches(matchesData);
        } else {
            if (typeof finalGroups !== 'undefined') {
                const teams = finalGroups[groupFilter] || [];
                const allMatchesForGroup = matchesData.filter(m => teams.includes(m.team1) || teams.includes(m.team2));
                active = allMatchesForGroup;
            } else {
                active = upcomingMatches(matchesData);
            }
        }

        active.sort((a, b) => matchTime(a.timeISO) - matchTime(b.timeISO));

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
        const countSpan = document.getElementById('upcomingCount');
        if (!container) return;

        countSpan.textContent = active.length;

        if (!active.length) {
            container.innerHTML = `<div class="empty-state"><span class="icon">📭</span> لا توجد مباريات تطابق الفلاتر</div>`;
            return;
        }

        container.innerHTML = active.map(m => {
            const isUpcoming = (matchTime(m.timeISO) + MATCH_DURATION) > now();
            return renderMatchCard(m, isUpcoming);
        }).join('');

        if (typeof updateShareAllCount === 'function') updateShareAllCount();
    } catch (e) {
        console.error("renderUpcoming:", e);
        const container = document.getElementById('matchesContainer');
        if (container) {
            container.innerHTML = `<div class="empty-state"><span class="icon">⚠️</span> حدث خطأ</div>`;
        }
    }
}

function loadPreviousGamesFull() {
    if (isLoadingPrevious) return;
    isLoadingPrevious = true;

    async function fetchGames() {
        try {
            const cached = getCache("games");
            if (cached && state) {
                state.previousGamesData = cached;
                renderPreviousGamesFiltered();
                calculateStandings();
                renderTeamStats();
                renderBracket();
                updateScorers();
                updateNewsTicker();
                isLoadingPrevious = false;
                return;
            }

            const response = await fetch('https://worldcup26.ir/get/games');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            if (!data?.games) throw new Error('تنسيق غير صحيح');

            if (state) state.allGames = data.games;
            const finished = data.games.filter(g => g.finished === "TRUE");
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

            if (state) state.previousGamesData = newData;
            setCache("games", newData);
            renderPreviousGamesFiltered();
            calculateStandings();
            renderTeamStats();
            renderBracket();
            updateScorers();
            updateNewsTicker();
        } catch (e) {
            console.error("❌ تحميل السابقة:", e);
            if (state && state.previousGamesData && state.previousGamesData.length === 0) {
                const container = document.getElementById('previousMatchesContainer');
                if (container) {
                    container.innerHTML =
                        `<div class="empty-state"><span class="icon">⚠️</span> فشل التحميل <button onclick="loadPreviousGamesFull()" style="display:block;margin:12px auto 0;background:var(--gold-gradient);border:none;padding:8px 24px;border-radius:40px;font-weight:700;color:#0a0e1a;cursor:pointer;font-family:inherit;">🔄 إعادة المحاولة</button></div>`;
                }
            }
        } finally {
            isLoadingPrevious = false;
        }
    }

    fetchGames();
}

function renderPreviousGamesFiltered() {
    const searchText = document.getElementById('prevSearchInput')?.value.trim().toLowerCase() || '';
    let filtered = state && state.previousGamesData ? [...state.previousGamesData] : [];

    filtered.sort((a, b) => (b.sortTimestamp || 0) - (a.sortTimestamp || 0));

    if (searchText) {
        filtered = filtered.filter(g =>
            g.homeAr.toLowerCase().includes(searchText) ||
            g.awayAr.toLowerCase().includes(searchText)
        );
    }

    const container = document.getElementById('previousMatchesContainer');
    const countSpan = document.getElementById('prevCount');
    if (!container) return;

    countSpan.textContent = filtered.length;

    if (!filtered.length) {
        let message = '📭 لا توجد مباريات مطابقة';
        if (state && state.previousGamesData && state.previousGamesData.length === 0) message = '⏳ جاري التحميل...';
        if (searchText && state && state.previousGamesData && state.previousGamesData.length > 0) message =
            `🔍 لا توجد مباريات سابقة للمنتخب "${searchText}"`;
        container.innerHTML = `<div class="empty-state"><span class="icon">${message === '⏳ جاري التحميل...' ? '⏳' : '📭'}</span> ${message}</div>`;
        return;
    }

    container.innerHTML = filtered.map(g => {
        let ground = getGroundForMatch(g.homeAr, g.awayAr, null);
        let penaltyHtml = '';
        if (g.hadPenalties && g.homePenalty !== null && g.awayPenalty !== null) {
            penaltyHtml =
                `<span class="score-penalty-badge">⚽ ركلات ترجيح: ${g.homePenalty} — ${g.awayPenalty}</span>`;
        }
        let winnerText = '';
        let result = { homeScore: g.homeScore, awayScore: g.awayScore, homeAr: g.homeAr, awayAr: g.awayAr,
            homePenalty: g.homePenalty, awayPenalty: g.awayPenalty, hadPenalties: g.hadPenalties };
        let winner = determineWinner(result);
        if (winner) {
            winnerText = `🏆 ${winner}`;
        }

        return `
              <div class="match-card finished-match" onclick="openPreviousMatchPredictions('${g.homeAr}', '${g.awayAr}', ${g.homeScore}, ${g.awayScore})">
                <div class="match-teams">
                  <div class="match-team"><span class="flag">${getFlag(g.homeAr)}</span> ${g.homeAr}</div>
                  <div class="match-score finished">${g.homeScore} - ${g.awayScore} ${penaltyHtml}</div>
                  <div class="match-team"><span class="flag">${getFlag(g.awayAr)}</span> ${g.awayAr}</div>
                </div>
                <div class="match-meta">
                  <span class="tag">${g.dayName || 'تاريخ'}</span>
                  <span class="tag">${g.formattedDate || ''} ${g.timeMatch || ''}</span>
                  <span class="tag finished-tag">✅ انتهت - اضغط لعرض التوقعات</span>
                  ${ground ? `<span class="tag stadium-tag">🏟️ ${ground}</span>` : ''}
                  ${winnerText ? `<span class="tag" style="color:var(--gold-light);">${winnerText}</span>` : ''}
                </div>
                <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;">
                  <button class="view-btn" onclick="event.stopPropagation();openPreviousMatchPredictions('${g.homeAr}','${g.awayAr}',${g.homeScore},${g.awayScore})" style="padding:6px 14px;border-radius:40px;font-size:0.6rem;font-weight:600;background:var(--info-bg);border:1px solid rgba(74,158,255,0.10);color:var(--info);cursor:pointer;font-family:inherit;">📋 عرض التوقعات</button>
                  <button class="share-link-btn" onclick="event.stopPropagation();copyMatchLink('${g.homeAr}_${g.awayAr}','${g.homeAr}','${g.awayAr}')" style="padding:4px 12px;border-radius:40px;font-size:0.55rem;font-weight:600;background:var(--info-bg);border:1px solid rgba(74,158,255,0.10);color:var(--info);cursor:pointer;font-family:inherit;">🔗 مشاركة</button>
                </div>
              </div>
            `;
    }).join('');
}

function openPreviousMatchPredictions(team1, team2, homeScore, awayScore) {
    if (typeof matchesData !== 'undefined') {
        const match = matchesData.find(m => (m.team1 === team1 && m.team2 === team2) || (m.team1 === team2 && m.team2 ===
            team1));
        if (match) {
            const matchId = `${match.timeISO}_${match.team1}_${match.team2}`;
            openMatchPredictions(matchId, team1, team2, homeScore, awayScore);
        } else {
            showCopyToast('⚠️ لا توجد توقعات لهذه المباراة');
        }
    }
}

// إضافة مستمع لأحداث تغيير الفلتر
document.addEventListener('DOMContentLoaded', function() {
    const groupFilter = document.getElementById('groupFilter');
    if (groupFilter) {
        groupFilter.addEventListener('change', renderUpcoming);
    }

    const prevSearch = document.getElementById('prevSearchInput');
    if (prevSearch) {
        prevSearch.addEventListener('input', renderPreviousGamesFiltered);
    }

    const dayBtns = document.querySelectorAll('.day-btn');
    dayBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentDayFilter = this.dataset.day;
            renderUpcoming();
        });
    });
});