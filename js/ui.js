// ============================================================
//  UI - واجهة المستخدم والعرض
// ============================================================

// ===== Scorers =====
function updateScorers() {
    scorersDict = {};
    playerTeamMap = {};
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
    renderScorers();
}

function renderScorers() {
    const container = document.getElementById('scorersContainer');
    const countSpan = document.getElementById('scorersCount');
    const scorersArray = Object.entries(scorersDict).map(([name, goals]) => ({ name, goals }));
    scorersArray.sort((a, b) => b.goals - a.goals);
    countSpan.textContent = scorersArray.length;
    if (!scorersArray.length) { container.innerHTML =
            `<div class="empty-state"><span class="icon">📭</span> لا توجد أهداف مسجلة بعد</div>`; return; }
    let html =
        `<table class="scorers-table"><thead><tr><th>#</th><th>اللاعب</th><th>الفريق</th><th>الأهداف</th></tr></thead><tbody>`;
    scorersArray.forEach((s, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}`;
        const team = playerTeamMap[s.name] || '';
        const flag = getFlag(team);
        html += `<tr><td class="medal">${medal}</td><td class="player-name">${s.name}</td><td>${flag} ${team}</td><td class="goals">${s.goals}</td></tr>`;
    });
    html += `</tbody></table>`;
    container.innerHTML = html;
}

// ===== Render Previous Games =====
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
        let penaltyHtml = '';
        if (g.hadPenalties && g.homePenalty !== null && g.awayPenalty !== null) {
            penaltyHtml =
                `<span class="score-penalty-badge">⚽ ركلات ترجيح: ${g.homePenalty} — ${g.awayPenalty}</span>`;
        }
        let winnerText = '';
        if (g.hadPenalties && g.homePenalty !== null && g.awayPenalty !== null) {
            if (parseInt(g.homePenalty) > parseInt(g.awayPenalty)) winnerText = `🏆 ${g.homeAr}`;
            else if (parseInt(g.awayPenalty) > parseInt(g.homePenalty)) winnerText = `🏆 ${g.awayAr}`;
        } else if (g.homeScore > g.awayScore) {
            winnerText = `🏆 ${g.homeAr}`;
        } else if (g.awayScore > g.homeScore) {
            winnerText = `🏆 ${g.awayAr}`;
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

// ===== Calculate Standings =====
function calculateStandings() {
    try {
        const standings = {};
        for (const [group, teams] of Object.entries(finalGroups)) {
            standings[group] = {};
            teams.forEach(team => { standings[group][team] = { played: 0, wins: 0, draws: 0, losses: 0,
                    goalsFor: 0, goalsAgainst: 0, points: 0 }; });
        }
        state.previousGamesData.forEach(game => {
            const { homeAr, awayAr, homeScore, awayScore, homePenalty, awayPenalty, hadPenalties } = game;
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

            let winner = null;
            if (hadPenalties && homePenalty !== null && awayPenalty !== null) {
                winner = parseInt(homePenalty) > parseInt(awayPenalty) ? homeAr :
                    (parseInt(awayPenalty) > parseInt(homePenalty) ? awayAr : null);
            } else {
                winner = homeScore > awayScore ? homeAr : (awayScore > homeScore ? awayAr : null);
            }

            if (winner === homeAr) { stats[homeAr].wins++;
                stats[homeAr].points += 3;
                stats[awayAr].losses++; } else if (winner === awayAr) { stats[awayAr].wins++;
                stats[awayAr].points += 3;
                stats[homeAr].losses++; } else { stats[homeAr].draws++;
                stats[awayAr].draws++;
                stats[homeAr].points++;
                stats[awayAr].points++; }
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
                    `<tr><td>${idx+1}</td><td><div class="team-cell"><span>${getFlag(row.team)}</span> <span>${row.team}</span></div></td><td>${row.played}</td><td>${row.wins}</td><td>${row.draws}</td><td>${row.losses}</td><td>${row.goalsFor}</td><td>${row.goalsAgainst}</td><td>${row.diff}</td><td style="color:var(--gold);font-weight:800;">${row.points}</td></tr>`;
            });
            html += `</tbody></table></div>`;
        }
        container.innerHTML = html ||
            `<div class="empty-state"><span class="icon">📊</span> لا توجد نتائج كافية</div>`;
    } catch (e) { console.error("calculateStandings:", e);
        document.getElementById('standingsContainer').innerHTML =
            `<div class="empty-state"><span class="icon">⚠️</span> خطأ في حساب الترتيب</div>`; }
}

// ===== Render Team Stats =====
function renderTeamStats() {
    const container = document.getElementById('teamStatsContainer');
    if (!state.previousGamesData.length) {
        container.innerHTML = `<div class="empty-state"><span class="icon">⏳</span> لا توجد نتائج كافية</div>`;
        return;
    }
    const stats = {};
    state.previousGamesData.forEach(g => {
        const { homeAr, awayAr, homeScore, awayScore } = g;
        let winner = null;
        if (g.hadPenalties && g.homePenalty !== null && g.awayPenalty !== null) {
            winner = parseInt(g.homePenalty) > parseInt(g.awayPenalty) ? homeAr :
                (parseInt(g.awayPenalty) > parseInt(g.homePenalty) ? awayAr : null);
        } else {
            winner = homeScore > awayScore ? homeAr : (awayScore > homeScore ? awayAr : null);
        }

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

        if (winner === homeAr) { stats[homeAr].wins++;
            stats[awayAr].losses++; } else if (winner === awayAr) { stats[awayAr].wins++;
            stats[homeAr].losses++; } else { stats[homeAr].draws++;
            stats[awayAr].draws++; }
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

// ===== Render Bracket =====
function renderBracket() {
    const container = document.getElementById('bracketContainer');

    let allMatches = [];

    if (state.openfootballMatches && state.openfootballMatches.length) {
        allMatches = [...state.openfootballMatches];
    }

    if (state.allGames && state.allGames.length) {
        const gamesWithStage = state.allGames.filter(g =>
            g.group && ['R32', 'R16', 'QF', 'SF', '3RD', 'FINAL', 'Final'].includes(g.group) ||
            g.type === 'final' || g.type === 'third' || g.group === 'Final' ||
            g.round === 'final' || g.round === 'third' ||
            g.stage && g.stage.toLowerCase().includes('round')
        );
        allMatches = [...allMatches, ...gamesWithStage];
    }

    if (allMatches.length === 0) {
        const first32 = matchesData.filter(m => m.round === 'round32').map(m => ({
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
        allMatches = [...first32];
    }

    const roundMapping = {
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

    const seenMatches = new Set();

    for (let match of allMatches) {
        let roundKey = null;
        if (match.round) roundKey = roundMapping[match.round] || null;
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
            const homeName = match.team1 || match.home_team_name_fa || match.home_team_name_en || match
                .home_team_label || '?';
            const awayName = match.team2 || match.away_team_name_fa || match.away_team_name_en || match
                .away_team_label || '?';
            const matchKey = `${roundKey}|${homeName}|${awayName}`;

            if (!seenMatches.has(matchKey)) {
                seenMatches.add(matchKey);
                rounds[roundKey].push(match);
            }
        }
    }

    if (!rounds['R32'] || rounds['R32'].length === 0) {
        const first32 = matchesData.filter(m => m.round === 'round32').map(m => ({
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
        for (let m of first32) {
            const matchKey = `R32|${m.team1}|${m.team2}`;
            if (!seenMatches.has(matchKey)) {
                seenMatches.add(matchKey);
                rounds['R32'].push(m);
            }
        }
    }

    if (rounds['R32'] && rounds['R32'].length > 16) {
        rounds['R32'] = rounds['R32'].slice(0, 16);
    }
    if (rounds['R16'] && rounds['R16'].length > 8) {
        rounds['R16'] = rounds['R16'].slice(0, 8);
    }
    if (rounds['FINAL'] && rounds['FINAL'].length > 1) {
        rounds['FINAL'] = rounds['FINAL'].slice(0, 1);
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
            let homeName = match.team1 || match.home_team_name_fa || match.home_team_name_en || match
                .home_team_label || '?';
            let awayName = match.team2 || match.away_team_name_fa || match.away_team_name_en || match
                .away_team_label || '?';
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
            let penaltyText = '';
            if (isFinished) {
                const s1 = match.home_score || match.goals1?.length || 0;
                const s2 = match.away_score || match.goals2?.length || 0;
                scoreText = `${s1} - ${s2}`;
                statusText = '✅ انتهت';
                statusClass = 'finished';
                const penData = extractPenaltyData(match);
                if (penData) {
                    penaltyText = ` ⚽ ركلات ترجيح: ${penData.home} — ${penData.away}`;
                    if (parseInt(penData.home) > parseInt(penData.away)) winnerText = `🏆 ${homeDisplay}`;
                    else if (parseInt(penData.away) > parseInt(penData.home)) winnerText = `🏆 ${awayDisplay}`;
                    else winnerText = '🤝 تعادل';
                } else {
                    if (s1 > s2) winnerText = `🏆 ${homeDisplay}`;
                    else if (s2 > s1) winnerText = `🏆 ${awayDisplay}`;
                    else winnerText = '🤝 تعادل';
                }
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
                            ${scoreText ? `<div class="score">${scoreText}${penaltyText}</div>` : ''}
                            ${winnerText ? `<div class="match-winner">${winnerText}</div>` : ''}
                            <div class="status ${statusClass}">${statusText}</div>
                        </div>
                    `;
        }

        html += `</div>`;
    }

    html += `</div>`;

    if (!hasMatches) {
        container.innerHTML = `<div class="empty-state"><span class="icon">📊</span> لا توجد مباريات في المخطط</div>`;
        return;
    }
    container.innerHTML = html;
}

// ===== Render Match Card =====
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
    let penaltyHtml = '';

    if (isLive) { scoreDisplay = '🔴 LIVE';
        scoreClass = 'live';
        matchClass = 'live'; } else if (isFinished) {
        const result = findMatchResult(m.team1, m.team2);
        if (result) {
            homeScore = result.homeScore;
            awayScore = result.awayScore;
            scoreDisplay = `${homeScore} - ${awayScore}`;
            scoreClass = 'finished';
            matchClass = 'finished-match';
            matchResult = { homeScore, awayScore };
            if (result.hadPenalties && result.homePenalty !== null && result.awayPenalty !== null) {
                penaltyHtml =
                    `<span class="score-penalty-badge">⚽ ركلات ترجيح: ${result.homePenalty} — ${result.awayPenalty}</span>`;
            }
        } else { scoreDisplay = '✅';
            scoreClass = 'finished';
            matchClass = 'finished-match'; }
    }

    let predictBtnHtml = 'توقع الآن';
    let predictDisabled = false;
    let predictBtnClass = 'predict-btn';
    let predictBtnExtra = '';

    let editBtnHtml = 'تعديل';
    let editDisabled = true;
    let editBtnExtra = '';
    let editBtnClass = 'edit-btn';

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
            predictBtnExtra = 'onclick="openMatchPredictions(\'' + matchId + '\', \'' + m.team1 + '\', \'' + m
                .team2 + '\', ' + homeScore + ', ' + awayScore + ')"';
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

    const showEdit = (userHasPrediction || submitted) && canPredictNow && isAuthorized;

    return `
            <div class="match-card ${matchClass}" ${onclickAttr}>
              <div class="match-teams">
                <div class="match-team"><span class="flag">${getFlag(m.team1)}</span> ${m.team1}</div>
                <div class="match-score ${scoreClass}">${scoreDisplay} ${penaltyHtml}</div>
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

// ===== Render Upcoming Matches =====
function renderUpcoming() {
    try {
        const groupFilter = document.getElementById('groupFilter')?.value || 'all';
        let active = [];
        if (groupFilter === 'all') {
            active = upcomingMatches(matchesData);
        } else {
            const teams = finalGroups[groupFilter] || [];
            const allMatchesForGroup = matchesData.filter(m => teams.includes(m.team1) || teams.includes(m
            .team2));
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
        if (!active.length) { container.innerHTML =
                `<div class="empty-state"><span class="icon">📭</span> لا توجد مباريات تطابق الفلاتر</div>`; return; }
        container.innerHTML = active.map(m => {
            const isUpcoming = (matchTime(m.timeISO) + MATCH_DURATION) > now();
            return renderMatchCard(m, isUpcoming);
        }).join('');
        updateShareAllCount();
    } catch (e) { console.error("renderUpcoming:", e);
        document.getElementById('matchesContainer').innerHTML =
            `<div class="empty-state"><span class="icon">⚠️</span> حدث خطأ</div>`; }
}

// ===== Render All Predictions =====
async function renderAllPredictions() {
    const container = document.getElementById('allPredictions');
    const countSpan = document.getElementById('predictionsCount');
    let predictions = state.predictions;
    if (!predictions || !predictions.length) {
        await getAllPredictions();
        predictions = state.predictions;
    }
    allPredictionsCache = predictions;
    countSpan.textContent = predictions.length;
    if (!predictions || !predictions.length) { container.innerHTML =
            `<div class="empty-state"><span class="icon">📭</span> لا توجد توقعات بعد</div>`; return; }
    const sorted = [...predictions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    container.innerHTML = sorted.slice(0, 20).map(p => {
        const parts = p.match_id.split('_');
        const team1 = parts[1] || '?',
            team2 = parts[2] || '?';
        let predictionText = p.prediction === 'DRAW' ? '🤝 تعادل' : `🏆 فوز ${getFlag(p.prediction)} ${p.prediction}`;
        const status = getPredictionStatus(p);
        let cardClass = '',
            badgeClass = '';
        if (status.status === 'correct') { cardClass = 'correct';
            badgeClass = 'correct'; } else if (status.status === 'wrong') { cardClass = 'wrong';
            badgeClass = 'wrong'; } else { cardClass = 'pending';
            badgeClass = 'pending'; }
        return `<div class="prediction-card ${cardClass}" onclick="openPlayerPredictions('${p.user_name || ''}')" style="cursor:pointer;">
              <div class="user"><div class="avatar-p">${p.user_name ? p.user_name.charAt(0).toUpperCase() : '👤'}</div><span class="name-p">${p.user_name || 'مجهول'}</span></div>
              <div class="prediction-text">${team1} 🆚 ${team2}</div>
              <div class="prediction-text" style="color:var(--gold-light);">🔮 ${predictionText}</div>
              <span class="status-badge ${badgeClass}">${status.text}</span>
              <div style="font-size:0.6rem;color:var(--text-secondary);margin-top:4px;">🕒 ${p.created_at ? formatDate(p.created_at) : 'تاريخ غير معروف'}</div>
            </div>`;
    }).join('');
}

// ===== Render Leaderboard =====
function renderLeaderboard(period) {
    const container = document.getElementById("leaderboardContainer");
    if (!state.loaded) {
        container.innerHTML = `<div class="empty-state"><span class="icon">⏳</span> جاري التحميل...</div>`;
        return;
    }
    const predictions = state.predictions;
    const games = state.previousGamesData;
    if (!predictions.length || !games.length) {
        container.innerHTML = `<div class="empty-state"><span class="icon">📭</span> لا توجد بيانات</div>`;
        return;
    }

    let filteredGames = games;
    if (period === '24h') {
        const nowTime = now();
        const last24h = nowTime - 24 * 60 * 60 * 1000;
        filteredGames = games.filter(g => {
            const ts = g.sortTimestamp || 0;
            return ts >= last24h && ts <= nowTime;
        });
    }

    const scores = {};
    for (let p of predictions) {
        if (!scores[p.user_name]) {
            scores[p.user_name] = { name: p.user_name, points: 0, correct: 0, wrong: 0, total: 0 };
        }
        scores[p.user_name].total++;
        const parts = (p.match_id || "").split("_");
        if (parts.length < 3) continue;
        const team1 = parts[1],
            team2 = parts[2];
        const match = filteredGames.find(g =>
            (g.homeAr === team1 && g.awayAr === team2) ||
            (g.homeAr === team2 && g.awayAr === team1)
        );
        if (!match) continue;
        const result = findMatchResult(team1, team2);
        let winner = null;
        if (result) {
            winner = result.winner || (result.homeScore > result.awayScore ? result.homeAr : (result.awayScore >
                result.homeScore ? result.awayAr : "DRAW"));
        } else {
            winner = match.homeScore > match.awayScore ? match.homeAr :
                match.awayScore > match.homeScore ? match.awayAr : "DRAW";
        }
        const isCorrect = p.prediction === winner;
        if (isCorrect) {
            scores[p.user_name].points++;
            scores[p.user_name].correct++;
        } else {
            scores[p.user_name].wrong++;
        }
    }
    const board = Object.values(scores).sort((a, b) => b.points - a.points || (b.correct - a.correct));
    if (!board.length) {
        container.innerHTML = `<div class="empty-state"><span class="icon">📭</span> لا توجد توقعات صحيحة</div>`;
        return;
    }
    document.getElementById('lbTotalPlayers').textContent = board.length;
    document.getElementById('lbTotalPredictions').textContent = predictions.length;

    let rank = 1;
    let i = 0;
    while (i < board.length) {
        let j = i;
        let points = board[i].points;
        while (j < board.length && board[j].points === points) {
            j++;
        }
        const groupSize = j - i;
        for (let k = i; k < j; k++) {
            board[k].rank = rank;
        }
        i = j;
        rank += groupSize;
    }

    const prevRankKey = `prevRank_${period}`;
    let prevRank = {};
    try {
        const raw = localStorage.getItem(prevRankKey);
        if (raw) prevRank = JSON.parse(raw);
    } catch (e) {}

    const currentRank = {};
    board.forEach((p) => {
        currentRank[p.name] = p.rank;
    });
    localStorage.setItem(prevRankKey, JSON.stringify(currentRank));

    const topThree = board.slice(0, 3);
    const rest = board.slice(3, 10);

    let html = '';
    if (topThree.length) {
        const champ = topThree[0];
        const accuracy = champ.total > 0 ? Math.round((champ.correct / champ.total) * 100) : 0;
        const isCurrentUser = champ.name === localStorage.getItem('lastUserName') || '';
        const prevPos = prevRank[champ.name] || 0;
        const currentPos = champ.rank;
        let arrow = '';
        if (prevPos && prevPos !== currentPos) {
            if (currentPos < prevPos) arrow = ' <span class="arrow-up">▲</span>';
            else if (currentPos > prevPos) arrow = ' <span class="arrow-down">▼</span>';
        } else if (prevPos) {
            arrow = ' <span class="arrow-unchanged">—</span>';
        }
        const medal = champ.rank === 1 ? '🥇' : champ.rank === 2 ? '🥈' : champ.rank === 3 ? '🥉' : `#${champ.rank}`;
        html += `
              <div class="champion-card" style="${isCurrentUser ? 'border-color:var(--gold);box-shadow:0 0 60px rgba(212,167,69,0.08);' : ''}" onclick="openPlayerPredictions('${champ.name}')">
                <div class="rank-badge">${medal}</div>
                <div class="avatar">${champ.name.charAt(0).toUpperCase()}</div>
                <div class="info">
                  <div class="name">${champ.name} ${isCurrentUser ? '👤' : ''}
                    <button class="compare-btn" onclick="event.stopPropagation(); openCompareModal('${champ.name}')">📊 مقارنة</button>
                  </div>
                  <div class="stats-row">
                    <span class="item">🏆 <strong>${champ.points}</strong> نقطة</span>
                    <span class="item">✅ <strong style="color:var(--gold-light);">${champ.correct}</strong></span>
                    <span class="item">📊 <strong style="font-size:0.7rem;">${champ.total}</strong></span>
                    <span class="item">📊 <strong>${accuracy}%</strong> نجاح</span>
                    <span class="item">${arrow}</span>
                  </div>
                  <div class="progress-wrapper">
                    <div class="progress-label"><span>نسبة النجاح</span><span>${accuracy}%</span></div>
                    <div class="progress-bar"><div class="fill" style="width:${Math.min(accuracy,100)}%;"></div></div>
                  </div>
                </div>
              </div>
            `;
    }
    if (rest.length || topThree.length > 1) {
        const allPlayers = [...topThree.slice(1), ...rest];
        html += `<div class="players-list">`;
        allPlayers.forEach((player) => {
            const rankNum = player.rank;
            const accuracy = player.total > 0 ? Math.round((player.correct / player.total) * 100) : 0;
            const isCurrentUser = player.name === localStorage.getItem('lastUserName') || '';
            let medal = '';
            if (rankNum === 1) medal = '🥇';
            else if (rankNum === 2) medal = '🥈';
            else if (rankNum === 3) medal = '🥉';
            else if (rankNum === 4) medal = '4';
            else if (rankNum === 5) medal = '5';
            else medal = `#${rankNum}`;

            let rankClass = '';
            if (rankNum === 1) rankClass = 'gold';
            else if (rankNum === 2) rankClass = 'silver';
            else if (rankNum === 3) rankClass = 'bronze';
            else rankClass = '';

            let borderClass = '';
            if (rankNum === 1) borderClass = 'gold-border';
            else if (rankNum === 2) borderClass = 'silver-border';
            else if (rankNum === 3) borderClass = 'bronze-border';

            const isTie = board.filter(p => p.rank === rankNum).length > 1;
            const tieBadge = isTie ? ' ⚡' : '';

            const prevPos = prevRank[player.name] || 0;
            const currentPos = rankNum;
            let arrow = '';
            if (prevPos && prevPos !== currentPos) {
                if (currentPos < prevPos) arrow = ' ▲';
                else if (currentPos > prevPos) arrow = ' ▼';
            } else if (prevPos) {
                arrow = ' —';
            }
            const arrowClass = arrow.includes('▲') ? 'arrow-up' : (arrow.includes('▼') ? 'arrow-down' :
                'arrow-unchanged');

            html += `
                <div class="player-card" style="${isCurrentUser ? 'border-color:rgba(212,167,69,0.30);' : ''}" onclick="openPlayerPredictions('${player.name}')">
                  <div class="rank ${rankClass}">${medal}${tieBadge}</div>
                  <div class="avatar-sm ${borderClass}">${player.name.charAt(0).toUpperCase()}</div>
                  <div class="info-sm">
                    <div class="name-sm">${player.name} ${isCurrentUser ? '👤' : ''}
                      ${isTie ? `<span class="mini-badge gold">⚡ متعادل</span>` : ''}
                    </div>
                    <div class="sub-sm">
                      <span>✅ <span style="color:var(--gold-light);">${player.correct}</span></span>
                      <span>📊 <span style="font-size:0.65rem;">${player.total}</span></span>
                      <span>📊 ${accuracy}%</span>
                      <span class="${arrowClass}">${arrow.trim()}</span>
                    </div>
                    <div class="progress-mini"><div class="fill-mini" style="width:${Math.min(accuracy,100)}%;"></div></div>
                  </div>
                  <div class="points-sm">${player.points}</div>
                  <button class="compare-btn" onclick="event.stopPropagation(); openCompareModal('${player.name}')">📊 مقارنة</button>
                  ${isCurrentUser ? `<div class="current-user-indicator active"></div><div class="pulse-dot"></div>` : ''}
                </div>
              `;
        });
        html += `</div>`;
    }
    container.innerHTML = html;
}

// ===== Utility Functions =====
function getGroundForMatch(team1, team2, timeISO) {
    const directMatch = matchesData.find(m => (m.team1 === team1 && m.team2 === team2) || (m.team1 === team2 && m
        .team2 === team1));
    if (directMatch && directMatch.stadium) return directMatch.stadium;

    if (!state.openfootballMatches || !state.openfootballMatches.length) return null;
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
    return null;
}

function getDateFmt(t) { return formatSaudiDate(t); }

function getDay(t) { return getSaudiDay(t); }

function isMatchTodayOrTomorrow(timeISO) {
    return isTodaySaudi(timeISO) || isTomorrowSaudi(timeISO);
}

function isMatchToday(timeISO) { return isTodaySaudi(timeISO); }

function isMatchYesterday(timeISO) {
    const d = toSaudiTime(timeISO);
    const now = getSaudiNow();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return d.getFullYear() === yesterday.getFullYear() &&
        d.getMonth() === yesterday.getMonth() &&
        d.getDate() === yesterday.getDate();
}

// ===== Toast Notification =====
function showCopyToast(msg) { const t = document.getElementById('copyToast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000); }

// ===== Copy Match Link =====
function copyMatchLink(matchId, team1, team2) {
    const shareUrl = `${window.location.origin}${window.location.pathname}?m=${matchId}`;
    if (navigator.share) {
        navigator.share({ title: `🏆 توقع مباراة ${team1} 🆚 ${team2}`,
            text: `🔮 توقع نتيجة مباراة ${team1} 🆚 ${team2} في كأس العالم 2026\n\n🔗 ${shareUrl}`, url: shareUrl })
            .catch(() => {});
    } else {
        navigator.clipboard.writeText(shareUrl).then(() => showCopyToast('✅ تم نسخ رابط المباراة!')).catch(
        () => {
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showCopyToast('✅ تم نسخ رابط المباراة!');
        });
    }
}

// ===== Open Match Predictions =====
async function openMatchPredictions(matchId, team1, team2, homeScore, awayScore) {
    if (!state.loaded) {
        await loadPreviousGames();
        await getAllPredictions();
    }
    document.getElementById('mpTeam1').textContent = team1;
    document.getElementById('mpTeam2').textContent = team2;
    document.getElementById('mpFlag1').textContent = getFlag(team1);
    document.getElementById('mpFlag2').textContent = getFlag(team2);
    let result = findMatchResult(team1, team2);
    let penaltyText = '';
    if (result) {
        homeScore = result.homeScore;
        awayScore = result.awayScore;
        let displayScore = `${homeScore} - ${awayScore}`;
        if (result.hadPenalties && result.homePenalty !== null && result.awayPenalty !== null) {
            penaltyText = ` ⚽ ركلات ترجيح: ${result.homePenalty} — ${result.awayPenalty}`;
        }
        document.getElementById('mpResult').textContent = `النتيجة: ${displayScore}${penaltyText}`;
    } else {
        document.getElementById('mpResult').textContent = `⚠️ لم يتم العثور على نتيجة هذه المباراة بعد`;
    }
    if (isAuthorized) { document.getElementById('modalCompactBtn').classList.add('visible'); } else { document
            .getElementById('modalCompactBtn').classList.remove('visible'); }
    if (isModalCompact) { isModalCompact = false;
        document.getElementById('matchPredictionsContent').classList.remove('compact-mode');
        document.getElementById('modalCompactBtn').textContent = '📐 تصغير'; }
    const scorersDiv = document.getElementById('mpScorersDetail');
    let scorersHtml = '';
    let matchOF = state.openfootballMatches.find(m => {
        const h = translateToArabic(m.team1 || '');
        const a = translateToArabic(m.team2 || '');
        return (h === team1 && a === team2) || (h === team2 && a === team1);
    });
    if (matchOF) {
        const goals = [...(matchOF.goals1 || []), ...(matchOF.goals2 || [])];
        if (goals.length) {
            scorersHtml += `<div style="margin:4px 0;"><strong>⚽ الأهداف:</strong></div>`;
            if (matchOF.goals1 && matchOF.goals1.length) {
                scorersHtml += `<div>${getFlag(team1)} <strong>${team1}</strong>: `;
                scorersHtml += matchOF.goals1.map(g => {
                    let minute = g.minute ? ` ${g.minute}'` : '';
                    let name = g.name || 'لاعب';
                    return `<span class="goal-item"><span class="minute">${minute}</span> ${name}</span>`;
                }).join(' ');
                scorersHtml += `</div>`;
            }
            if (matchOF.goals2 && matchOF.goals2.length) {
                scorersHtml += `<div>${getFlag(team2)} <strong>${team2}</strong>: `;
                scorersHtml += matchOF.goals2.map(g => {
                    let minute = g.minute ? ` ${g.minute}'` : '';
                    let name = g.name || 'لاعب';
                    return `<span class="goal-item"><span class="minute">${minute}</span> ${name}</span>`;
                }).join(' ');
                scorersHtml += `</div>`;
            }
        } else {
            scorersHtml = `<div style="color:var(--text-secondary);">⚽ لا توجد أهداف مسجلة</div>`;
        }
    } else {
        scorersHtml = `<div style="color:var(--text-secondary);">⚽ لا توجد تفاصيل للأهداف</div>`;
    }
    scorersDiv.innerHTML = scorersHtml;

    const correctSpan = document.getElementById('mpCorrectCount');
    const wrongSpan = document.getElementById('mpWrongCount');
    const totalSpan = document.getElementById('mpTotalCount');
    const tbody = document.getElementById('predictionsTableBody');
    tbody.innerHTML =
        `<tr><td colspan="4" style="text-align:center;padding:20px;color:var(--text-secondary);">⏳ جاري التحميل...</td></tr>`;
    correctSpan.textContent = '...';
    wrongSpan.textContent = '...';
    totalSpan.textContent = '...';

    let predictions = state.predictions;
    if (!predictions || !predictions.length) {
        await getAllPredictions();
        predictions = state.predictions;
    }
    const matchPredictions = predictions
        .filter(p => p.match_id === matchId)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    totalSpan.textContent = matchPredictions.length;
    if (matchPredictions.length === 0) {
        tbody.innerHTML =
            `<tr><td colspan="4" style="text-align:center;padding:20px;color:var(--text-secondary);">📭 لا توجد توقعات لهذه المباراة</td></tr>`;
        correctSpan.textContent = '0';
        wrongSpan.textContent = '0';
        document.getElementById('matchPredictionsModal').classList.add('active');
        document.body.style.overflow = 'hidden';
        return;
    }
    let correctResult = "DRAW";
    if (result) {
        correctResult = result.winner || (result.homeScore > result.awayScore ? team1 : (result.awayScore > result
            .homeScore ? team2 : "DRAW"));
    } else {
        let rows = '';
        matchPredictions.forEach((p, idx) => {
            let predictionText = p.prediction === 'DRAW' ? 'تعادل' : `فوز ${p.prediction}`;
            rows += `<tr>
                <td class="user-name" onclick="openPlayerPredictions('${p.user_name || ''}')">${p.user_name || 'مجهول'}</td>
                <td class="prediction-text">${predictionText}</td>
                <td class="status-pending">⏳ لم تحدد</td>
                <td class="time-cell">${p.created_at ? formatDate(p.created_at) : 'تاريخ غير معروف'}</td>
              </tr>`;
        });
        tbody.innerHTML = rows;
        correctSpan.textContent = '0';
        wrongSpan.textContent = '0';
        document.getElementById('matchPredictionsModal').classList.add('active');
        document.body.style.overflow = 'hidden';
        return;
    }
    let correctCount = 0,
        wrongCount = 0;
    let rows = '';
    matchPredictions.forEach((p, idx) => {
        const isCorrect = p.prediction === correctResult;
        if (isCorrect) correctCount++;
        else wrongCount++;
        let predictionText = p.prediction === 'DRAW' ? 'تعادل' : `فوز ${p.prediction}`;
        const statusText = isCorrect ? 'صحيح' : 'خاطئ';
        const statusClass = isCorrect ? 'status-correct' : 'status-wrong';
        const predClass = isCorrect ? 'correct' : 'wrong';
        const timeStr = p.created_at ? formatDate(p.created_at) : 'تاريخ غير معروف';
        rows += `<tr>
              <td class="user-name" onclick="openPlayerPredictions('${p.user_name || ''}')">${p.user_name || 'مجهول'}</td>
              <td class="prediction-text ${predClass}">${predictionText}</td>
              <td class="${statusClass}">${statusText}</td>
              <td class="time-cell">${timeStr}</td>
            </tr>`;
    });
    correctSpan.textContent = correctCount;
    wrongSpan.textContent = wrongCount;
    tbody.innerHTML = rows;
    document.getElementById('matchPredictionsModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ===== Open Previous Match Predictions =====
function openPreviousMatchPredictions(team1, team2, homeScore, awayScore) {
    const match = matchesData.find(m => (m.team1 === team1 && m.team2 === team2) || (m.team1 === team2 && m.team2 ===
        team1));
    if (match) { const matchId = `${match.timeISO}_${match.team1}_${match.team2}`;
        openMatchPredictions(matchId, team1, team2, homeScore, awayScore); } else { showCopyToast(
            '⚠️ لا توجد توقعات لهذه المباراة'); }
}

// ===== Open View Predictions Modal =====
async function openViewPredictionsModal(matchId, team1, team2) {
    document.getElementById('viewTeam1').textContent = team1;
    document.getElementById('viewTeam2').textContent = team2;
    document.getElementById('viewFlag1').textContent = getFlag(team1);
    document.getElementById('viewFlag2').textContent = getFlag(team2);
    document.getElementById('probTeam1').textContent = team1;
    document.getElementById('probTeam2').textContent = team2;
    const listContainer = document.getElementById('viewPredictionsList');
    const countSpan = document.getElementById('viewPredictionsCount');
    listContainer.innerHTML = `<div class="empty-state"><span class="icon">⏳</span> جاري التحميل...</div>`;
    countSpan.textContent = '...';

    const predictions = await getPredictionsForMatchFull(matchId);
    countSpan.textContent = predictions.length;

    let homeCount = 0,
        awayCount = 0;
    for (let p of predictions) {
        if (p.prediction === team1) homeCount++;
        else if (p.prediction === team2) awayCount++;
    }
    const totalPreds = predictions.length;
    const homePercent = totalPreds > 0 ? (homeCount / totalPreds) * 100 : 0;
    const awayPercent = totalPreds > 0 ? (awayCount / totalPreds) * 100 : 0;

    document.getElementById('probHomePercent').textContent = homePercent.toFixed(1) + '%';
    document.getElementById('probAwayPercent').textContent = awayPercent.toFixed(1) + '%';

    document.querySelector('#probBar .segment.home').style.width = homePercent + '%';
    document.querySelector('#probBar .segment.home').textContent = homePercent.toFixed(0) + '%';
    document.querySelector('#probBar .segment.away').style.width = awayPercent + '%';
    document.querySelector('#probBar .segment.away').textContent = awayPercent.toFixed(0) + '%';

    const drawSegment = document.querySelector('#probBar .segment.draw');
    if (drawSegment) drawSegment.style.display = 'none';

    if (totalPreds === 0) {
        document.querySelector('#probBar .segment.home').style.width = '50%';
        document.querySelector('#probBar .segment.home').textContent = '0%';
        document.querySelector('#probBar .segment.away').style.width = '50%';
        document.querySelector('#probBar .segment.away').textContent = '0%';
    }

    if (!predictions || predictions.length === 0) {
        listContainer.innerHTML =
            `<div class="empty-state"><span class="icon">📭</span> لا توجد توقعات لهذه المباراة</div>`;
    } else {
        let html = '';
        predictions.forEach((p, idx) => {
            let text = p.prediction === 'DRAW' ? '🤝 تعادل الفريقين' :
                `🏆 فوز ${getFlag(p.prediction)} ${p.prediction}`;
            const status = getPredictionStatus(p);
            let statusText = '⏳ قيد الانتظار';
            let statusClass = 'pending';
            if (status.status === 'correct') { statusText = '✅ صحيح';
                statusClass = 'correct'; } else if (status.status === 'wrong') { statusText = '❌ خاطئ';
                statusClass = 'wrong'; }
            html += `
                <div class="prediction-card ${statusClass}" onclick="openPlayerPredictions('${p.user_name || ''}')" style="cursor:pointer;">
                  <div class="user"><div class="avatar-p">${p.user_name ? p.user_name.charAt(0).toUpperCase() : '👤'}</div><span class="name-p">${p.user_name || 'مجهول'}</span></div>
                  <div class="prediction-text">🔮 ${text}</div>
                  <span class="status-badge ${statusClass}">${statusText}</span>
                  <div style="font-size:0.6rem;color:var(--text-secondary);margin-top:4px;">🕒 ${p.created_at ? formatDate(p.created_at) : 'تاريخ غير معروف'}</div>
                </div>
              `;
        });
        listContainer.innerHTML = html;
    }
    document.getElementById('viewPredictionsModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ===== Open Player Predictions =====
async function openPlayerPredictions(userName) {
    if (!userName) { showCopyToast('⚠️ اسم المستخدم غير معروف'); return; }
    document.getElementById('playerModalName').textContent = userName;
    const listContainer = document.getElementById('playerPredictionsList');
    const correctSpan = document.getElementById('playerCorrectCount');
    const wrongSpan = document.getElementById('playerWrongCount');
    const totalSpan = document.getElementById('playerTotalCount');
    listContainer.innerHTML = `<div class="empty-state"><span class="icon">⏳</span> جاري التحميل...</div>`;
    correctSpan.textContent = '...';
    wrongSpan.textContent = '...';
    totalSpan.textContent = '...';

    const predictions = await getPredictionsForUserFull(userName);
    let correct = 0,
        wrong = 0;
    for (let p of predictions) {
        const status = getPredictionStatus(p);
        if (status.status === 'correct') correct++;
        else if (status.status === 'wrong') wrong++;
    }
    correctSpan.textContent = correct;
    wrongSpan.textContent = wrong;
    totalSpan.textContent = predictions.length;

    if (!predictions || predictions.length === 0) {
        listContainer.innerHTML =
            `<div class="empty-state"><span class="icon">📭</span> لا توجد توقعات لهذا اللاعب</div>`;
        document.getElementById('playerPredictionsModal').classList.add('active');
        document.body.style.overflow = 'hidden';
        return;
    }

    predictions.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    let html = '';
    predictions.forEach((p, idx) => {
        const parts = p.match_id.split('_');
        const team1 = parts[1] || '?';
        const team2 = parts[2] || '?';
        const predText = p.prediction === 'DRAW' ? 'تعادل' : `فوز ${p.prediction}`;
        const status = getPredictionStatus(p);
        let statusClass = 'pending';
        let statusText = '⏳ لم تحدد';
        if (status.status === 'correct') { statusClass = 'correct';
            statusText = '✅ صحيح'; } else if (status.status === 'wrong') { statusClass = 'wrong';
            statusText = '❌ خاطئ'; } else { statusClass = 'pending';
            statusText = '⏳ قيد الانتظار'; }

        html += `
              <div class="player-prediction-item">
                <div class="num">#${idx + 1}</div>
                <div class="match-info">
                  <div class="teams">
                    <span class="flag">${getFlag(team1)}</span> ${team1} 🆚 <span class="flag">${getFlag(team2)}</span> ${team2}
                  </div>
                  <div class="pred">🔮 ${predText}</div>
                  <span class="status ${statusClass}">${statusText}</span>
                </div>
                <div class="time">🕒 ${p.created_at ? formatDate(p.created_at) : 'تاريخ غير معروف'}</div>
              </div>
            `;
    });

    listContainer.innerHTML = html;
    document.getElementById('playerPredictionsModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ===== Open Bracket Match Detail =====
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
        awayDisplay = translateToArabic(awayName);
    }
    const flag1 = getFlag(homeDisplay) || '🏁';
    const flag2 = getFlag(awayDisplay) || '🏁';
    const isFinished = match.finished === true || match.finished === "TRUE" || match.status === 'finished';
    let scoreText = 'لم تلعب بعد';
    let penaltyText = '';
    let winnerText = '';
    if (isFinished) {
        const s1 = match.home_score || match.goals1?.length || 0;
        const s2 = match.away_score || match.goals2?.length || 0;
        scoreText = `${s1} - ${s2}`;
        const penData = extractPenaltyData(match);
        if (penData) {
            penaltyText = ` ⚽ ركلات ترجيح: ${penData.home} — ${penData.away}`;
            if (parseInt(penData.home) > parseInt(penData.away)) winnerText = `🏆 الفائز: ${homeDisplay}`;
            else if (parseInt(penData.away) > parseInt(penData.home)) winnerText = `🏆 الفائز: ${awayDisplay}`;
            else winnerText = '🤝 تعادل';
        } else {
            if (s1 > s2) winnerText = `🏆 الفائز: ${homeDisplay}`;
            else if (s2 > s1) winnerText = `🏆 الفائز: ${awayDisplay}`;
            else winnerText = '🤝 تعادل';
        }
    }
    const dateStr = match.date || match.time || match.local_date || 'تاريخ غير معروف';
    const stadium = match.ground || (match.stadium_id ? getStadiumName(match.stadium_id) : 'غير معروف');
    const predictions = await getPredictionsForMatchFull(matchId);
    const predCount = predictions.length;

    detailDiv.innerHTML = `
            <div class="modal-teams">
              <div class="m-team"><span class="flag">${flag1}</span> ${homeDisplay}</div>
              <div class="m-vs">🆚</div>
              <div class="m-team"><span class="flag">${flag2}</span> ${awayDisplay}</div>
            </div>
            <div style="text-align:center;font-size:1.2rem;font-weight:800;color:var(--gold-light);">${scoreText}${penaltyText}</div>
            ${winnerText ? `<div style="text-align:center;font-size:0.9rem;color:var(--success);font-weight:700;margin:4px 0;">${winnerText}</div>` : ''}
            <div style="text-align:center;margin:8px 0;font-size:0.8rem;color:var(--text-secondary);">
              📅 ${dateStr} 
              ${stadium ? `| 🏟️ ${stadium}` : ''}
              ${predCount > 0 ? `| 📋 ${predCount} توقع` : ''}
            </div>
            <div style="text-align:center;margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">
              <button class="tab-btn" style="background:var(--gold-glow);border-color:var(--border-gold);color:var(--gold-light);" onclick="closeBracketModal()">إغلاق</button>
              ${isFinished ? `<button class="tab-btn" style="background:var(--info-bg);border-color:rgba(74,158,255,0.15);color:var(--info);" onclick="openMatchPredictions('${matchId}', '${homeDisplay}', '${awayDisplay}', ${match.home_score || match.goals1?.length || 0}, ${match.away_score || match.goals2?.length || 0})">📋 عرض التوقعات</button>` : ''}
              <button class="tab-btn" style="background:var(--info-bg);border-color:rgba(74,158,255,0.15);color:var(--info);" onclick="openViewPredictionsModal('${matchId}', '${homeDisplay}', '${awayDisplay}')">📋 استعراض التوقعات</button>
            </div>
          `;
    document.getElementById('bracketMatchModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBracketModal() {
    document.getElementById('bracketMatchModal').classList.remove('active');
    document.body.style.overflow = '';
}

// ===== toggleModalCompact =====
function toggleModalCompact() {
    const modalContent = document.getElementById('matchPredictionsContent');
    const btn = document.getElementById('modalCompactBtn');
    isModalCompact = !isModalCompact;
    modalContent.classList.toggle('compact-mode');
    if (isModalCompact) { btn.textContent = '📐 تكبير';
        showCopyToast('📐 تم تصغير جدول التوقعات للتصوير'); } else { btn.textContent = '📐 تصغير';
        showCopyToast('📐 تم تكبير جدول التوقعات'); }
}