// ============================================================
//  ui.js - واجهة المستخدم، العرض، الأحداث والتهيئة
// ============================================================

// (يعتمد على core.js و api.js)

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
        const groupFilter = document.getElementById('groupFilter')?.value || 'all';
        let active = [];
        if (groupFilter === 'all') {
            active = upcomingMatches(matchesData);
        } else {
            const teams = finalGroups[groupFilter] || [];
            const allMatchesForGroup = matchesData.filter(m => teams.includes(m.team1) || teams.includes(m.team2));
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

function calculateStandings() {
    try {
        const standings = {};
        for (const [group, teams] of Object.entries(finalGroups)) {
            standings[group] = {};
            teams.forEach(team => {
                standings[group][team] = { played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0,
                    points: 0 };
            });
        }
        state.previousGamesData.forEach(game => {
            const { homeAr, awayAr, homeScore, awayScore } = game;
            let groupName = null;
            for (const [g, teams] of Object.entries(finalGroups)) {
                if (teams.includes(homeAr) && teams.includes(awayAr)) { groupName = g; break; }
            }
            if (!groupName) return;
            const stats = standings[groupName];
            if (!stats[homeAr] || !stats[awayAr]) return;
            stats[homeAr].played++;
            stats[awayAr].played++;
            stats[homeAr].goalsFor += homeScore;
            stats[homeAr].goalsAgainst += awayScore;
            stats[awayAr].goalsFor += awayScore;
            stats[awayAr].goalsAgainst += homeScore;
            if (homeScore > awayScore) {
                stats[homeAr].wins++;
                stats[homeAr].points += 3;
                stats[awayAr].losses++;
            } else if (awayScore > homeScore) {
                stats[awayAr].wins++;
                stats[awayAr].points += 3;
                stats[homeAr].losses++;
            } else {
                stats[homeAr].draws++;
                stats[awayAr].draws++;
                stats[homeAr].points++;
                stats[awayAr].points++;
            }
        });
        const container = document.getElementById('standingsContainer');
        let html = '';
        for (const [group, teamsStats] of Object.entries(standings)) {
            const tableRows = [];
            for (const [team, stat] of Object.entries(teamsStats)) {
                tableRows.push({ team, ...stat, diff: stat.goalsFor - stat.goalsAgainst });
            }
            tableRows.sort((a, b) => b.points - a.points || b.diff - a.diff || b.goalsFor - a.goalsFor);
            html +=
                `<div class="group-card"><div class="group-title">المجموعة ${group}</div><table class="standings-table"><thead><tr><th>#</th><th>الفريق</th><th>ل</th><th>ف</th><th>ت</th><th>خ</th><th>له</th><th>عليه</th><th>±</th><th>ن</th></tr></thead><tbody>`;
            tableRows.forEach((row, idx) => {
                html +=
                    `<tr><td>${idx+1}</td><td><div class="team-cell"><span>${getFlag(row.team)}</span> <span>${row.team}</span></div></td><td>${row.played}</td><td>${row.wins}</td><td>${row.draws}</td><td>${row.losses}</td><td>${row.goalsFor}</td><td>${row.goalsAgainst}</td><td>${row.diff}</td><td style="color:#f0b429;font-weight:800;">${row.points}</td></tr>`;
            });
            html += `</tbody></table></div>`;
        }
        container.innerHTML = html ||
            `<div class="empty-state"><span class="icon">📊</span> لا توجد نتائج كافية</div>`;
    } catch (e) {
        console.error("calculateStandings:", e);
        document.getElementById('standingsContainer').innerHTML =
            `<div class="empty-state"><span class="icon">⚠️</span> خطأ في حساب الترتيب</div>`;
    }
}

function updateScorers() {
    let scorersDict = {};
    let playerTeamMap = {};
    for (let match of state.openfootballMatches) {
        const homeTeam = translateToArabic(match.team1 || '');
        const awayTeam = translateToArabic(match.team2 || '');
        const goals = [...(match.goals1 || []), ...(match.goals2 || [])];
        for (let g of goals) {
            if (!g.name) continue;
            let normalizedName = normalizeName(g.name);
            if (!scorersDict[normalizedName]) scorersDict[normalizedName] = 0;
            scorersDict[normalizedName]++;
            let team = '';
            if (match.goals1 && match.goals1.some(gg => gg.name === g.name)) team = homeTeam;
            else if (match.goals2 && match.goals2.some(gg => gg.name === g.name)) team = awayTeam;
            if (team && !playerTeamMap[normalizedName]) playerTeamMap[normalizedName] = team;
        }
    }
    for (let game of state.allGames) {
        if (game.finished === "TRUE" && game.scorers) {
            try {
                const scorersData = game.scorers;
                const homeTeam = translateToArabic(game.home_team_name_fa || game.home_team_name_en || '');
                const awayTeam = translateToArabic(game.away_team_name_fa || game.away_team_name_en || '');
                const scorerMatches = scorersData.match(/([^\d,]+?)\s*(\d+['’]?)/g);
                if (scorerMatches) {
                    for (let sm of scorerMatches) {
                        const parts = sm.match(/^(.+?)\s*(\d+['’]?)$/);
                        if (parts) {
                            let name = parts[1].trim();
                            let normalizedName = normalizeName(name);
                            if (!scorersDict[normalizedName]) scorersDict[normalizedName] = 0;
                            scorersDict[normalizedName]++;
                            if (!playerTeamMap[normalizedName]) {
                                if (game.home_team_name_en && name.includes(game.home_team_name_en))
                                    playerTeamMap[normalizedName] = homeTeam;
                                else if (game.away_team_name_en && name.includes(game.away_team_name_en))
                                    playerTeamMap[normalizedName] = awayTeam;
                                else if (game.home_team_name_fa && name.includes(game.home_team_name_fa))
                                    playerTeamMap[normalizedName] = homeTeam;
                                else if (game.away_team_name_fa && name.includes(game.away_team_name_fa))
                                    playerTeamMap[normalizedName] = awayTeam;
                            }
                        }
                    }
                }
            } catch (e) { /* تجاهل */ }
        }
    }
    window._scorersDict = scorersDict;
    window._playerTeamMap = playerTeamMap;
    renderScorers();
}

function renderScorers() {
    const container = document.getElementById('scorersContainer');
    const countSpan = document.getElementById('scorersCount');
    const scorersDict = window._scorersDict || {};
    const playerTeamMap = window._playerTeamMap || {};
    const scorersArray = Object.entries(scorersDict).map(([name, goals]) => ({ name, goals }));
    scorersArray.sort((a, b) => b.goals - a.goals);
    countSpan.textContent = scorersArray.length;
    if (!scorersArray.length) {
        container.innerHTML =
            `<div class="empty-state"><span class="icon">📭</span> لا توجد أهداف مسجلة بعد</div>`;
        return;
    }
    let html =
        `<table class="scorers-table"><thead><tr><th>#</th><th>اللاعب</th><th>الفريق</th><th>الأهداف</th></tr></thead><tbody>`;
    scorersArray.forEach((s, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}`;
        const team = playerTeamMap[s.name] || '';
        const flag = getFlag(team);
        html +=
            `<tr><td class="medal">${medal}</td><td class="player-name">${s.name}</td><td>${flag} ${team}</td><td class="goals">${s.goals}</td></tr>`;
    });
    html += `</tbody></table>`;
    container.innerHTML = html;
}

function renderTeamStats() {
    const container = document.getElementById('teamStatsContainer');
    if (!state.previousGamesData.length) {
        container.innerHTML = `<div class="empty-state"><span class="icon">⏳</span> لا توجد نتائج كافية</div>`;
        return;
    }
    const stats = {};
    state.previousGamesData.forEach(g => {
        const { homeAr, awayAr, homeScore, awayScore } = g;
        if (!stats[homeAr]) stats[homeAr] = { played: 0, goalsFor: 0, goalsAgainst: 0, wins: 0, draws: 0,
            losses: 0 };
        if (!stats[awayAr]) stats[awayAr] = { played: 0, goalsFor: 0, goalsAgainst: 0, wins: 0, draws: 0,
            losses: 0 };
        stats[homeAr].played++;
        stats[awayAr].played++;
        stats[homeAr].goalsFor += homeScore;
        stats[homeAr].goalsAgainst += awayScore;
        stats[awayAr].goalsFor += awayScore;
        stats[awayAr].goalsAgainst += homeScore;
        if (homeScore > awayScore) {
            stats[homeAr].wins++;
            stats[awayAr].losses++;
        } else if (awayScore > homeScore) {
            stats[awayAr].wins++;
            stats[homeAr].losses++;
        } else {
            stats[homeAr].draws++;
            stats[awayAr].draws++;
        }
    });
    const sorted = Object.keys(stats).sort((a, b) => {
        const diffA = stats[a].goalsFor - stats[a].goalsAgainst;
        const diffB = stats[b].goalsFor - stats[b].goalsAgainst;
        return diffB - diffA || stats[b].goalsFor - stats[a].goalsFor;
    });
    let html =
        `<table class="team-stats-table"><thead><tr><th>#</th><th>الفريق</th><th>لعب</th><th>فوز</th><th>تعادل</th><th>خسارة</th><th>له</th><th>عليه</th><th>±</th><th>معدل الأهداف</th></tr></thead><tbody>`;
    sorted.forEach((team, idx) => {
        const s = stats[team];
        const diff = s.goalsFor - s.goalsAgainst;
        const avg = s.played > 0 ? (s.goalsFor / s.played).toFixed(2) : '0.00';
        html += `<tr>
                <td>${idx+1}</td>
                <td class="team-name">${getFlag(team)} ${team}</td>
                <td>${s.played}</td>
                <td>${s.wins}</td>
                <td>${s.draws}</td>
                <td>${s.losses}</td>
                <td class="stat-highlight">${s.goalsFor}</td>
                <td>${s.goalsAgainst}</td>
                <td>${diff > 0 ? '+' : ''}${diff}</td>
                <td>${avg}</td>
              </tr>`;
    });
    html += `</tbody></table>`;
    container.innerHTML = html;
}

function renderBracket() {
    const container = document.getElementById('bracketContainer');

    let allMatches = [];
    if (state.openfootballMatches && state.openfootballMatches.length) {
        allMatches = [...state.openfootballMatches];
    }
    if (state.allGames && state.allGames.length) {
        const extra = state.allGames.filter(g =>
            g.group && ['R32', 'R16', 'QF', 'SF', '3RD', 'FINAL'].includes(g.group) ||
            g.type === 'final' || g.type === 'third' ||
            g.round === 'final' || g.round === 'third' ||
            g.stage && g.stage.toLowerCase().includes('round')
        );
        allMatches = [...allMatches, ...extra];
    }

    const uniqueMap = new Map();
    allMatches.forEach(m => {
        let roundKey = null;
        if (m.round) {
            const roundMap = {
                'Round of 32': 'R32',
                'R32': 'R32',
                'Round of 16': 'R16',
                'R16': 'R16',
                'Quarter-finals': 'QF',
                'Quarterfinal': 'QF',
                'QF': 'QF',
                'Semi-finals': 'SF',
                'Semifinal': 'SF',
                'SF': 'SF',
                'Final': 'FINAL',
                'FINAL': 'FINAL',
                '3rd Place': '3RD',
                'Third Place': '3RD',
                '3RD': '3RD'
            };
            roundKey = roundMap[m.round] || null;
        }
        if (!roundKey && m.stage) {
            const s = m.stage.toLowerCase();
            if (s.includes('round of 32') || s.includes('r32')) roundKey = 'R32';
            else if (s.includes('round of 16') || s.includes('r16')) roundKey = 'R16';
            else if (s.includes('quarter')) roundKey = 'QF';
            else if (s.includes('semi')) roundKey = 'SF';
            else if (s.includes('final')) roundKey = 'FINAL';
            else if (s.includes('third')) roundKey = '3RD';
        }
        if (!roundKey && m.group) {
            const g = m.group.toUpperCase();
            if (['R32', 'R16', 'QF', 'SF', '3RD', 'FINAL'].includes(g)) roundKey = g;
        }
        if (!roundKey && m.type) {
            if (m.type.toLowerCase() === 'final') roundKey = 'FINAL';
            else if (m.type.toLowerCase() === 'third') roundKey = '3RD';
        }
        if (!roundKey && m._id && m._id.toString().startsWith('r32_')) roundKey = 'R32';

        if (!roundKey) return;

        const t1 = (m.team1 || m.home_team_name_en || m.home_team_name_fa || m.home_team_label || '').trim();
        const t2 = (m.team2 || m.away_team_name_en || m.away_team_name_fa || m.away_team_label || '').trim();
        const sortedTeams = [t1, t2].sort().join('|');
        const key = `${sortedTeams}|${roundKey}`;

        const isFinished = m.finished === true || m.finished === "TRUE" || m.status === 'finished';
        const hasScore = m.home_score !== undefined && m.away_score !== undefined;
        if (!uniqueMap.has(key) || isFinished || hasScore) {
            uniqueMap.set(key, m);
        }
    });
    allMatches = Array.from(uniqueMap.values());

    const roundOrder = ['R32', 'R16', 'QF', 'SF', '3RD', 'FINAL'];
    const roundNames = {
        'R32': 'دور الـ 32',
        'R16': 'دور الـ 16',
        'QF': 'ربع النهائي',
        'SF': 'نصف النهائي',
        '3RD': 'المركز الثالث',
        'FINAL': 'النهائي'
    };

    const rounds = {};
    roundOrder.forEach(r => rounds[r] = []);

    for (let match of allMatches) {
        let roundKey = null;
        if (match.round) {
            const roundMap = {
                'Round of 32': 'R32',
                'R32': 'R32',
                'Round of 16': 'R16',
                'R16': 'R16',
                'Quarter-finals': 'QF',
                'Quarterfinal': 'QF',
                'QF': 'QF',
                'Semi-finals': 'SF',
                'Semifinal': 'SF',
                'SF': 'SF',
                'Final': 'FINAL',
                'FINAL': 'FINAL',
                '3rd Place': '3RD',
                'Third Place': '3RD',
                '3RD': '3RD'
            };
            roundKey = roundMap[match.round] || null;
        }
        if (!roundKey && match.stage) {
            const s = match.stage.toLowerCase();
            if (s.includes('round of 32') || s.includes('r32')) roundKey = 'R32';
            else if (s.includes('round of 16') || s.includes('r16')) roundKey = 'R16';
            else if (s.includes('quarter')) roundKey = 'QF';
            else if (s.includes('semi')) roundKey = 'SF';
            else if (s.includes('final')) roundKey = 'FINAL';
            else if (s.includes('third')) roundKey = '3RD';
        }
        if (!roundKey && match.group) {
            const g = match.group.toUpperCase();
            if (roundOrder.includes(g)) roundKey = g;
        }
        if (!roundKey && match.type) {
            if (match.type.toLowerCase() === 'final') roundKey = 'FINAL';
            else if (match.type.toLowerCase() === 'third') roundKey = '3RD';
        }
        if (!roundKey && match._id && match._id.toString().startsWith('r32_')) {
            roundKey = 'R32';
        }
        if (roundKey && rounds[roundKey]) {
            rounds[roundKey].push(match);
        }
    }

    if (!rounds['R32'] || rounds['R32'].length === 0) {
        const first32 = matchesData.slice(0, 32).map(m => ({
            team1: m.team1,
            team2: m.team2,
            round: 'Round of 32',
            stage: 'Round of 32',
            date: m.timeISO,
            home_score: 0,
            away_score: 0,
            finished: false,
            _id: `r32_${m.id}`
        }));
        rounds['R32'] = first32;
    }

    let hasMatches = false;
    let html = `<div class="bracket-tree">`;

    for (let r of roundOrder) {
        const matches = rounds[r] || [];
        if (matches.length === 0) continue;
        hasMatches = true;

        matches.sort((a, b) => (a.date || a.time || '').localeCompare(b.date || b.time || ''));

        html += `<div class="bracket-round">
                    <div class="bracket-round-title">🏅 ${roundNames[r] || r}</div>`;

        for (let match of matches) {
            let homeName = match.team1 || match.home_team_name_fa || match.home_team_name_en || match.home_team_label ||
            '?';
            let awayName = match.team2 || match.away_team_name_fa || match.away_team_name_en || match.away_team_label ||
            '?';
            let homeDisplay = translateBracketTeamName(homeName);
            let awayDisplay = translateBracketTeamName(awayName);
            if (homeDisplay === homeName && !homeName.includes('متصدر') && !homeName.includes('وصيف') && !homeName
                .includes('ثالث')) {
                homeDisplay = translateToArabic(homeName);
            }
            if (awayDisplay === awayName && !awayName.includes('متصدر') && !awayName.includes('وصيف') && !awayName
                .includes('ثالث')) {
                awayDisplay = translateToArabic(awayName);
            }
            const flag1 = getFlag(homeDisplay) || '🏁';
            const flag2 = getFlag(awayDisplay) || '🏁';

            let statusText = '⏳ لم تلعب';
            let statusClass = 'pending';
            const isFinished = match.finished === true || match.finished === "TRUE" || match.status === 'finished';
            const isLive = match.live === true || match.live === "TRUE" || match.status === 'live';
            let scoreText = '';
            let winnerText = '';
            if (isFinished) {
                const s1 = match.home_score || match.goals1?.length || 0;
                const s2 = match.away_score || match.goals2?.length || 0;
                scoreText = `${s1} - ${s2}`;
                statusText = '✅ انتهت';
                statusClass = 'finished';
                if (s1 > s2) winnerText = `🏆 ${homeDisplay}`;
                else if (s2 > s1) winnerText = `🏆 ${awayDisplay}`;
                else winnerText = '🤝 تعادل';
            } else if (isLive) {
                statusText = '🔴 جارية';
                statusClass = 'live';
            }

            const matchId = match._id || match.id || `bracket_${homeName}_${awayName}_${Date.now()}`;

            html += `
                        <div class="bracket-match-item" onclick="openBracketMatchDetail('${matchId}')">
                            <div class="teams">
                                <span class="team"><span class="flag">${flag1}</span> ${homeDisplay}</span>
                                <span class="vs">🆚</span>
                                <span class="team"><span class="flag">${flag2}</span> ${awayDisplay}</span>
                            </div>
                            ${scoreText ? `<div class="score">${scoreText}</div>` : ''}
                            ${winnerText ? `<div class="match-winner">${winnerText}</div>` : ''}
                            <div class="status ${statusClass}">${statusText}</div>
                        </div>
                    `;
        }

        html += `</div>`;
    }

    html += `</div>`;

    if (!hasMatches) {
        container.innerHTML =
            `<div class="empty-state"><span class="icon">📊</span> لا توجد مباريات في المخطط</div>`;
        return;
    }
    container.innerHTML = html;
}

async function renderAllPredictions() {
    const container = document.getElementById('allPredictions');
    const countSpan = document.getElementById('predictionsCount');
    let predictions = state.predictions;
    if (!predictions || !predictions.length) {
        await getAllPredictions();
        predictions = state.predictions;
    }
    countSpan.textContent = predictions.length;
    if (!predictions || !predictions.length) {
        container.innerHTML =
            `<div class="empty-state"><span class="icon">📭</span> لا توجد توقعات بعد</div>`;
        return;
    }
    const sorted = [...predictions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    container.innerHTML = sorted.slice(0, 20).map(p => {
        const parts = p.match_id.split('_');
        const team1 = parts[1] || '?',
            team2 = parts[2] || '?';
        let predictionText = p.prediction === 'DRAW' ? '🤝 تعادل' : `🏆 فوز ${getFlag(p.prediction)} ${p.prediction}`;
        const status = getPredictionStatus(p);
        let cardClass = '',
            badgeClass = '';
        if (status.status === 'correct') {
            cardClass = 'correct';
            badgeClass = 'correct';
        } else if (status.status === 'wrong') {
            cardClass = 'wrong';
            badgeClass = 'wrong';
        } else {
            cardClass = 'pending';
            badgeClass = 'pending';
        }
        return `<div class="prediction-card ${cardClass}" onclick="openPlayerPredictions('${p.user_name || ''}')" style="cursor:pointer;">
              <div class="user"><div class="avatar-p">${p.user_name ? p.user_name.charAt(0).toUpperCase() : '👤'}</div><span class="name-p">${p.user_name || 'مجهول'}</span></div>
              <div class="prediction-text">${team1} 🆚 ${team2}</div>
              <div class="prediction-text" style="color:var(--gold-light);">🔮 ${predictionText}</div>
              <span class="status-badge ${badgeClass}">${status.text}</span>
              <div style="font-size:0.6rem;color:var(--text-secondary);margin-top:4px;">🕒 ${p.created_at ? formatDate(p.created_at) : 'تاريخ غير معروف'}</div>
            </div>`;
    }).join('');
}

// ------------------------------------------------------------
//  النوافذ المنبثقة والإشعارات
// ------------------------------------------------------------

function showCopyToast(msg) {
    const t = document.getElementById('copyToast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

function toggleCompactMode() {
    const container = document.getElementById('leaderboardContainer');
    const playersList = container?.querySelector('.players-list');
    const championCard = container?.querySelector('.champion-card');
    if (playersList) {
        isCompactMode = !isCompactMode;
        playersList.classList.toggle('compact-mode');
        if (championCard) {
            championCard.style.transform = isCompactMode ? 'scale(0.85)' : 'scale(1)';
            championCard.style.transformOrigin = 'center center';
            championCard.style.margin = isCompactMode ? '-10px 0' : '0';
        }
        const btn = document.getElementById('toggleCompactBtn');
        if (isCompactMode) {
            btn.innerHTML = '📐 وضع التصوير (مفعل)';
            btn.style.background = 'linear-gradient(135deg, var(--success), #27ae60)';
            showCopyToast('📐 تم تفعيل وضع التصغير للقطة الشاشة');
        } else {
            btn.innerHTML = '📐 تصغير للتصوير';
            btn.style.background = 'linear-gradient(135deg, var(--gold), #d49a1a)';
            showCopyToast('📐 تم إلغاء وضع التصغير');
        }
    } else {
        showCopyToast('⚠️ انتظر حتى تحميل البيانات');
    }
}

function resetCompactMode() {
    const container = document.getElementById('leaderboardContainer');
    const playersList = container?.querySelector('.players-list');
    const championCard = container?.querySelector('.champion-card');
    if (playersList) {
        isCompactMode = false;
        playersList.classList.remove('compact-mode');
        if (championCard) {
            championCard.style.transform = 'scale(1)';
            championCard.style.margin = '0';
        }
        const btn = document.getElementById('toggleCompactBtn');
        btn.innerHTML = '📐 تصغير للتصوير';
        btn.style.background = 'linear-gradient(135deg, var(--gold), #d49a1a)';
        showCopyToast('🔄 تم إعادة الحجم الطبيعي');
    }
}

function toggleModalCompact() {
    const modalContent = document.getElementById('matchPredictionsContent');
    const btn = document.getElementById('modalCompactBtn');
    isModalCompact = !isModalCompact;
    modalContent.classList.toggle('compact-mode');
    if (isModalCompact) {
        btn.textContent = '📐 تكبير';
        showCopyToast('📐 تم تصغير جدول التوقعات للتصوير');
    } else {
        btn.textContent = '📐 تصغير';
        showCopyToast('📐 تم تكبير جدول التوقعات');
    }
}

async function openBracketMatchDetail(matchId) {
    const detailDiv = document.getElementById('bracketMatchDetail');
    detailDiv.innerHTML = `<div class="empty-state"><span class="icon">⏳</span> جاري التحميل...</div>`;
    let match = state.openfootballMatches.find(m => (m._id === matchId || m.id === matchId));
    if (!match) {
        match = state.allGames.find(g => g._id === matchId || g.id === matchId);
    }
    if (!match) {
        const fakeMatch = matchesData.find(m => `r32_${m.id}` === matchId);
        if (fakeMatch) {
            match = {
                team1: fakeMatch.team1,
                team2: fakeMatch.team2,
                round: 'Round of 32',
                stage: 'Round of 32',
                date: fakeMatch.timeISO,
                home_score: 0,
                away_score: 0,
                finished: false,
                _id: matchId
            };
        }
    }
    if (!match) {
        detailDiv.innerHTML =
            `<div class="empty-state"><span class="icon">⚠️</span> لا توجد تفاصيل لهذه المباراة</div>`;
        document.getElementById('bracketMatchModal').classList.add('active');
        document.body.style.overflow = 'hidden';
        return;
    }
    let homeName = match.team1 || match.home_team_name_fa || match.home_team_name_en || match.home_team_label ||
    '?';
    let awayName = match.team2 || match.away_team_name_fa || match.away_team_name_en || match.away_team_label ||
    '?';
    let homeDisplay = translateBracketTeamName(homeName);
    let awayDisplay = translateBracketTeamName(awayName);
    if (homeDisplay === homeName && !homeName.includes('متصدر') && !homeName.includes('وصيف') && !homeName
        .includes('ثالث')) {
        homeDisplay = translateToArabic(homeName);
    }
    if (awayDisplay === awayName && !awayName.includes('متصدر') && !awayName.includes('وصيف') && !awayName
        .includes('ثالث')) {
        awayDisplay = translateToArabic