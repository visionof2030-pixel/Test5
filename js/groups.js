// ============================================================
//  إدارة المجموعات والترتيب
// ============================================================

function calculateStandings() {
    try {
        if (typeof finalGroups === 'undefined') {
            console.warn("⚠️ finalGroups غير معرف");
            return;
        }

        const standings = {};
        for (const [group, teams] of Object.entries(finalGroups)) {
            standings[group] = {};
            teams.forEach(team => {
                standings[group][team] = {
                    played: 0,
                    wins: 0,
                    draws: 0,
                    losses: 0,
                    goalsFor: 0,
                    goalsAgainst: 0,
                    points: 0
                };
            });
        }

        const games = state && state.previousGamesData ? state.previousGamesData : [];
        games.forEach(game => {
            const { homeAr, awayAr, homeScore, awayScore, homePenalty, awayPenalty, hadPenalties } = game;
            let groupName = null;
            for (const [g, teams] of Object.entries(finalGroups)) {
                if (teams.includes(homeAr) && teams.includes(awayAr)) {
                    groupName = g;
                    break;
                }
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

            let result = { homeScore, awayScore, homeAr, awayAr, homePenalty, awayPenalty, hadPenalties };
            let winner = determineWinner(result);

            if (winner === homeAr) {
                stats[homeAr].wins++;
                stats[homeAr].points += 3;
                stats[awayAr].losses++;
            } else if (winner === awayAr) {
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
        if (!container) return;

        let html = '';
        for (const [group, teamsStats] of Object.entries(standings)) {
            const tableRows = [];
            for (const [team, stat] of Object.entries(teamsStats)) {
                tableRows.push({
                    team,
                    ...stat,
                    diff: stat.goalsFor - stat.goalsAgainst
                });
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
    } catch (e) {
        console.error("calculateStandings:", e);
        const container = document.getElementById('standingsContainer');
        if (container) {
            container.innerHTML =
                `<div class="empty-state"><span class="icon">⚠️</span> خطأ في حساب الترتيب</div>`;
        }
    }
}

function getTeamStats(teamName) {
    const games = state && state.previousGamesData ? state.previousGamesData : [];
    let wins = 0,
        losses = 0,
        draws = 0,
        goalsFor = 0,
        goalsAgainst = 0;
    const results = [];

    for (let game of games) {
        let isHome = game.homeAr === teamName;
        let isAway = game.awayAr === teamName;
        if (!isHome && !isAway) continue;

        const homeScore = game.homeScore || 0;
        const awayScore = game.awayScore || 0;
        const result = {
            homeScore,
            awayScore,
            homeAr: game.homeAr,
            awayAr: game.awayAr,
            homePenalty: game.homePenalty,
            awayPenalty: game.awayPenalty,
            hadPenalties: game.hadPenalties
        };
        const winner = determineWinner(result);

        if (isHome) {
            goalsFor += homeScore;
            goalsAgainst += awayScore;
            if (winner === teamName) {
                wins++;
                results.push('W');
            } else if (winner === game.awayAr) {
                losses++;
                results.push('L');
            } else {
                draws++;
                results.push('D');
            }
        } else {
            goalsFor += awayScore;
            goalsAgainst += homeScore;
            if (winner === teamName) {
                wins++;
                results.push('W');
            } else if (winner === game.homeAr) {
                losses++;
                results.push('L');
            } else {
                draws++;
                results.push('D');
            }
        }
    }

    const total = wins + losses + draws;
    const winRate = total > 0 ? (wins / total) * 100 : 0;
    const goalDiff = goalsFor - goalsAgainst;

    const recentResults = results.slice(-5);
    const streak = recentResults.map(r => r === 'W' ? '✅' : r === 'L' ? '❌' : '➖').join('');

    return {
        wins,
        losses,
        draws,
        total,
        winRate,
        goalsFor,
        goalsAgainst,
        goalDiff,
        streak: streak || 'لا مباريات سابقة',
        results
    };
}

function getTeamStatsFull(teamName) {
    const games = state && state.previousGamesData ? state.previousGamesData : [];
    let wins = 0,
        losses = 0,
        draws = 0,
        goalsFor = 0,
        goalsAgainst = 0;
    const results = [];
    const scorers = {};

    for (let game of games) {
        let isHome = game.homeAr === teamName;
        let isAway = game.awayAr === teamName;
        if (!isHome && !isAway) continue;

        const homeScore = game.homeScore || 0;
        const awayScore = game.awayScore || 0;
        const result = {
            homeScore,
            awayScore,
            homeAr: game.homeAr,
            awayAr: game.awayAr,
            homePenalty: game.homePenalty,
            awayPenalty: game.awayPenalty,
            hadPenalties: game.hadPenalties
        };
        const winner = determineWinner(result);

        if (isHome) {
            goalsFor += homeScore;
            goalsAgainst += awayScore;
            if (winner === teamName) {
                wins++;
                results.push('W');
            } else if (winner === game.awayAr) {
                losses++;
                results.push('L');
            } else {
                draws++;
                results.push('D');
            }
        } else {
            goalsFor += awayScore;
            goalsAgainst += homeScore;
            if (winner === teamName) {
                wins++;
                results.push('W');
            } else if (winner === game.homeAr) {
                losses++;
                results.push('L');
            } else {
                draws++;
                results.push('D');
            }
        }
    }

    const total = wins + losses + draws;
    const winRate = total > 0 ? (wins / total) * 100 : 0;
    const goalDiff = goalsFor - goalsAgainst;

    if (state && state.openfootballMatches) {
        for (let match of state.openfootballMatches) {
            const homeTeam = translateToArabic(match.team1 || '');
            const awayTeam = translateToArabic(match.team2 || '');
            if (homeTeam !== teamName && awayTeam !== teamName) continue;

            const goals = [...(match.goals1 || []), ...(match.goals2 || [])];
            for (let g of goals) {
                if (!g.name) continue;
                let playerName = g.name;
                if (!scorers[playerName]) scorers[playerName] = 0;
                scorers[playerName]++;
            }
        }
    }

    const topScorers = Object.entries(scorers)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, goals]) => ({ name, goals }));

    return {
        wins,
        losses,
        draws,
        total,
        winRate,
        goalsFor,
        goalsAgainst,
        goalDiff,
        results,
        topScorers
    };
}

function getTeamScorers(teamName) {
    const scorers = {};

    const ownGoalBlacklist = [
        'Damian Bobadilla', 'بوباديا', 'داميان بوباديا',
        'Cameron Burgess', 'كاميرون بورغيس',
        'Elvis Muheim', 'إلفيس موهيم',
        'Mohamed Hany', 'محمد هاني',
        'Ellyes Skhiri', 'إلياس السخيري',
        'Hassan Al-Tambakti', 'حسن التمبكتي',
        'Yazan Al-Arab', 'يزن العرب',
        'Aymen Hussein', 'أيمن حسين',
        'Mohamed Manai', 'محمد المناعي',
        'Abduvohid Nematov', 'عبد الواحد نيماتوف',
        'Yassine Bounou', 'ياسين بونو'
    ];

    const isOwnGoalScorer = (playerName) => {
        if (!playerName) return false;
        const nameLower = playerName.toLowerCase();
        return ownGoalBlacklist.some(name =>
            nameLower.includes(name.toLowerCase()) ||
            name.toLowerCase().includes(nameLower)
        );
    };

    if (state && state.openfootballMatches) {
        for (let match of state.openfootballMatches) {
            const homeTeam = translateToArabic(match.team1 || '');
            const awayTeam = translateToArabic(match.team2 || '');
            if (homeTeam !== teamName && awayTeam !== teamName) continue;

            const goals = [...(match.goals1 || []), ...(match.goals2 || [])];
            for (let g of goals) {
                if (!g.name) continue;
                let playerName = g.name;
                if (isOwnGoalScorer(playerName)) continue;
                const isHomePlayer = match.goals1 && match.goals1.some(gg => gg.name === g.name);
                const isAwayPlayer = match.goals2 && match.goals2.some(gg => gg.name === g.name);
                if (isHomePlayer && homeTeam !== teamName) continue;
                if (isAwayPlayer && awayTeam !== teamName) continue;
                if (!scorers[playerName]) scorers[playerName] = 0;
                scorers[playerName]++;
            }
        }
    }
    return Object.entries(scorers)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, goals]) => ({ name, goals }));
}

function renderTeamStats() {
    const container = document.getElementById('teamStatsContainer');
    if (!container) return;

    const games = state && state.previousGamesData ? state.previousGamesData : [];
    if (!games.length) {
        container.innerHTML = `<div class="empty-state"><span class="icon">⏳</span> لا توجد نتائج كافية</div>`;
        return;
    }

    const stats = {};
    games.forEach(g => {
        const { homeAr, awayAr, homeScore, awayScore } = g;
        let result = {
            homeScore,
            awayScore,
            homeAr,
            awayAr,
            homePenalty: g.homePenalty,
            awayPenalty: g.awayPenalty,
            hadPenalties: g.hadPenalties
        };
        let winner = determineWinner(result);

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

        if (winner === homeAr) {
            stats[homeAr].wins++;
            stats[awayAr].losses++;
        } else if (winner === awayAr) {
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