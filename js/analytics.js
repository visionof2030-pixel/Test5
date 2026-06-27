// ============================================================
//  دوال التحليلات المتقدمة والمخططات
// ============================================================

import { state, chartInstancesLocal, setChartInstancesLocal, currentUserName } from './config.js';
import { getPredictionStatus, getPredictionsForUserFull } from './predictions.js';
import { getAllPlayersStats } from './leaderboard.js';
import { matchesData, getFlag } from './data.js';
import { findMatchResult, now, matchTime, MATCH_DURATION } from './utils.js';

export function openAnalytics() {
    const modal = document.getElementById('analyticsModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    populatePlayerAnalyticsSelect();
    renderMatchAnalytics();
    setTimeout(() => {
        generateAnalyticsCharts();
        const select = document.getElementById('playerAnalyticsSelect');
        if (select.value) {
            updatePlayerAnalytics();
        }
    }, 300);
}

export function populatePlayerAnalyticsSelect() {
    const select = document.getElementById('playerAnalyticsSelect');
    const predictions = state.predictions || [];
    const players = [...new Set(predictions.map(p => p.user_name).filter(Boolean))];
    select.innerHTML = '<option value="">-- اختر لاعباً --</option>';
    players.forEach(p => {
        select.innerHTML += `<option value="${p}">${p}</option>`;
    });
    const currentUser = localStorage.getItem('lastUserName') || '';
    if (players.includes(currentUser)) {
        select.value = currentUser;
    }
}

export function updatePlayerAnalytics() {
    const select = document.getElementById('playerAnalyticsSelect');
    const playerName = select.value;
    const detailsDiv = document.getElementById('playerAnalyticsDetails');

    if (!playerName) {
        detailsDiv.style.display = 'none';
        return;
    }

    const predictions = state.predictions || [];
    const games = state.previousGamesData || [];

    const playerPreds = predictions.filter(p => p.user_name === playerName);
    if (playerPreds.length === 0) {
        detailsDiv.innerHTML =
            `<div class="empty-state"><span class="icon">📭</span> لا توجد توقعات لهذا اللاعب</div>`;
        detailsDiv.style.display = 'block';
        return;
    }

    let total = playerPreds.length;
    let correct = 0,
        wrong = 0,
        points = 0;
    let lastCorrect = 0,
        trend = 0;
    const sortedPreds = [...playerPreds].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    for (let p of sortedPreds) {
        const status = getPredictionStatus(p);
        if (status.status === 'correct') {
            correct++;
            points++;
        } else if (status.status === 'wrong') {
            wrong++;
        }
    }

    const recent = sortedPreds.slice(-5);
    let recentCorrect = 0;
    for (let p of recent) {
        const status = getPredictionStatus(p);
        if (status.status === 'correct') recentCorrect++;
    }
    const recentAcc = recent.length > 0 ? (recentCorrect / recent.length) * 100 : 0;
    const overallAcc = total > 0 ? (correct / total) * 100 : 0;

    const allStats = getAllPlayersStats();
    const totalPlayers = Object.keys(allStats).length;
    const remainingMatches = matchesData.filter(m => (matchTime(m.timeISO) + MATCH_DURATION) > now()).length;
    const avgPointsPerPred = total > 0 ? points / total : 0;
    const futurePoints = points + (avgPointsPerPred * remainingMatches);

    const futureRanks = Object.values(allStats).map(p => {
        const pAvg = p.total > 0 ? p.points / p.total : 0;
        const pFuture = p.points + (pAvg * remainingMatches);
        return { name: p.name, futurePoints: pFuture };
    }).sort((a, b) => b.futurePoints - a.futurePoints);

    const predictedRank = futureRanks.findIndex(p => p.name === playerName) + 1;
    const currentRank = Object.values(allStats).sort((a, b) => b.points - a.points).findIndex(p => p.name ===
        playerName) + 1;

    detailsDiv.innerHTML = `
            <div class="stat-item"><span class="label">👤 اللاعب</span><span class="value gold">${playerName}</span></div>
            <div class="stat-item"><span class="label">🏆 الترتيب الحالي</span><span class="value gold">#${currentRank}</span></div>
            <div class="stat-item"><span class="label">📊 عدد التوقعات الكلي</span><span class="value">${total}</span></div>
            <div class="stat-item"><span class="label">✅ صحيحة</span><span class="value green">${correct}</span></div>
            <div class="stat-item"><span class="label">❌ خاطئة</span><span class="value red">${wrong}</span></div>
            <div class="stat-item"><span class="label">🎯 نسبة النجاح الإجمالية</span><span class="value gold">${overallAcc.toFixed(1)}%</span></div>
            <div class="stat-item"><span class="label">🏆 النقاط</span><span class="value gold">${points}</span></div>
            <div class="stat-item"><span class="label">📈 متوسط النقاط لكل توقع</span><span class="value gold">${avgPointsPerPred.toFixed(2)}</span></div>
            <div class="stat-item"><span class="label">🔥 الأداء في آخر 5 توقعات</span><span class="value ${recentAcc >= 60 ? 'green' : 'red'}">${recentAcc.toFixed(0)}%</span></div>
            <div class="prediction-trend">
              <div class="trend-label">🔮 توقع الترتيب المستقبلي (بناءً على الأداء الحالي وعدد اللاعبين ${totalPlayers})</div>
              <div class="trend-value">${predictedRank} 🏅</div>
              ${predictedRank > currentRank ? `<div style="font-size:0.7rem;color:var(--success);">✅ من المتوقع أن يرتفع ترتيبك</div>` : (predictedRank < currentRank ? `<div style="font-size:0.7rem;color:var(--danger);">⚠️ من المتوقع أن ينخفض ترتيبك</div>` : `<div style="font-size:0.7rem;color:var(--text-secondary);">➖ من المتوقع أن يبقى ترتيبك كما هو</div>`)}
            </div>
          `;
    detailsDiv.style.display = 'block';
}

export function renderMatchAnalytics() {
    const grid = document.getElementById('matchAnalyticsGrid');
    const predictions = state.predictions || [];
    const games = state.previousGamesData || [];

    if (!predictions.length || !games.length) {
        grid.innerHTML = `<div class="empty-state"><span class="icon">📊</span> لا توجد بيانات كافية</div>`;
        return;
    }

    const matchStats = {};
    for (let p of predictions) {
        const parts = p.match_id.split('_');
        if (parts.length < 3) continue;
        const team1 = parts[1],
            team2 = parts[2];
        const key = `${team1} 🆚 ${team2}`;
        if (!matchStats[key]) matchStats[key] = { correct: 0, wrong: 0, total: 0 };
        matchStats[key].total++;

        const status = getPredictionStatus(p);
        if (status.status === 'correct') matchStats[key].correct++;
        else if (status.status === 'wrong') matchStats[key].wrong++;
    }

    const sortedCorrect = Object.entries(matchStats).sort((a, b) => b[1].correct - a[1].correct).slice(0, 5);
    const sortedWrong = Object.entries(matchStats).sort((a, b) => b[1].wrong - a[1].wrong).slice(0, 5);

    let html = `
            <div class="match-list">
              <div class="list-title">✅ أكثر المباريات توقعاً صحيحاً</div>
              ${sortedCorrect.length === 0 ? '<div class="empty-state" style="padding:10px;">لا توجد بيانات</div>' : ''}
              ${sortedCorrect.map(([match, stats]) => `
                <div class="match-item">
                  <span class="teams">${match}</span>
                  <span class="count correct">${stats.correct} صحيح</span>
                </div>
              `).join('')}
            </div>
            <div class="match-list">
              <div class="list-title">❌ أكثر المباريات توقعاً خاطئاً</div>
              ${sortedWrong.length === 0 ? '<div class="empty-state" style="padding:10px;">لا توجد بيانات</div>' : ''}
              ${sortedWrong.map(([match, stats]) => `
                <div class="match-item">
                  <span class="teams">${match}</span>
                  <span class="count wrong">${stats.wrong} خاطئ</span>
                </div>
              `).join('')}
            </div>
          `;

    grid.innerHTML = html;
}

export function generateAnalyticsCharts() {
    const predictions = state.predictions || [];
    const games = state.previousGamesData || [];

    if (!predictions.length || !games.length) {
        document.getElementById('analyticsContent').innerHTML = `
              <div class="empty-state"><span class="icon">📊</span> لا توجد بيانات كافية للتحليل</div>
              <div style="text-align:center;margin-top:12px;">
                <button class="tab-btn" onclick="document.getElementById('analyticsModal').classList.remove('active');document.body.style.overflow='';" style="background:rgba(240,180,41,0.08);border-color:rgba(240,180,41,0.2);color:var(--gold-light);">إغلاق</button>
              </div>
            `;
        return;
    }

    const playerPredCount = {};
    for (let p of predictions) {
        if (!playerPredCount[p.user_name]) playerPredCount[p.user_name] = 0;
        playerPredCount[p.user_name]++;
    }
    const topPredPlayers = Object.entries(playerPredCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    const predLabels = topPredPlayers.map(p => p[0]);
    const predData = topPredPlayers.map(p => p[1]);

    const userPoints = {};
    for (let p of predictions) {
        const parts = p.match_id.split('_');
        if (parts.length < 3) continue;
        const team1 = parts[1],
            team2 = parts[2];
        const match = games.find(g => (g.homeAr === team1 && g.awayAr === team2) || (g.homeAr === team2 && g.awayAr ===
            team1));
        if (!match) continue;
        const result = match.homeScore > match.awayScore ? match.homeAr : match.awayScore > match.homeScore ? match
            .awayAr : "DRAW";
        const isCorrect = p.prediction === result;
        if (!userPoints[p.user_name]) userPoints[p.user_name] = [];
        userPoints[p.user_name].push({ matchId: p.match_id, correct: isCorrect, time: p.created_at });
    }
    const cumulativePoints = {};
    for (let [user, preds] of Object.entries(userPoints)) {
        let total = 0;
        cumulativePoints[user] = preds.map(p => {
            if (p.correct) total++;
            return total;
        });
    }
    const topUsers = Object.entries(cumulativePoints)
        .sort((a, b) => b[1][b[1].length - 1] - a[1][a[1].length - 1])
        .slice(0, 5);
    const pointLabels = topUsers.length > 0 ? topUsers[0][1].map((_, i) => `توقع ${i+1}`) : [];

    const matchPredCount = {};
    for (let p of predictions) {
        const parts = p.match_id.split('_');
        if (parts.length < 3) continue;
        const key = `${parts[1]} 🆚 ${parts[2]}`;
        if (!matchPredCount[key]) matchPredCount[key] = 0;
        matchPredCount[key]++;
    }
    const popularMatches = Object.entries(matchPredCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);
    const popLabels = popularMatches.map(m => m[0].length > 25 ? m[0].substring(0, 22) + '...' : m[0]);
    const popData = popularMatches.map(m => m[1]);

    const accuracyStats = {};
    for (let p of predictions) {
        const parts = p.match_id.split('_');
        if (parts.length < 3) continue;
        const team1 = parts[1],
            team2 = parts[2];
        const match = games.find(g => (g.homeAr === team1 && g.awayAr === team2) || (g.homeAr === team2 && g.awayAr ===
            team1));
        if (!match) continue;
        const result = match.homeScore > match.awayScore ? match.homeAr : match.awayScore > match.homeScore ? match
            .awayAr : "DRAW";
        const isCorrect = p.prediction === result;
        if (!accuracyStats[p.user_name]) accuracyStats[p.user_name] = { correct: 0, total: 0 };
        accuracyStats[p.user_name].total++;
        if (isCorrect) accuracyStats[p.user_name].correct++;
    }
    const topAcc = Object.entries(accuracyStats)
        .filter(([_, v]) => v.total >= 2)
        .sort((a, b) => (b[1].correct / b[1].total) - (a[1].correct / a[1].total))
        .slice(0, 5);
    const accLabels = topAcc.map(p => p[0]);
    const accData = topAcc.map(p => Math.round((p[1].correct / p[1].total) * 100));

    if (chartInstancesLocal.predDist) chartInstancesLocal.predDist.destroy();
    if (chartInstancesLocal.points) chartInstancesLocal.points.destroy();
    if (chartInstancesLocal.pop) chartInstancesLocal.pop.destroy();
    if (chartInstancesLocal.acc) chartInstancesLocal.acc.destroy();

    const ctx1 = document.getElementById('chartPlayerDistribution').getContext('2d');
    chartInstancesLocal.predDist = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: predLabels,
            datasets: [{
                label: 'عدد التوقعات',
                data: predData,
                backgroundColor: 'rgba(240, 180, 41, 0.7)',
                borderColor: 'rgba(240, 180, 41, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#8899bb', font: { family: 'Cairo' } }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#8899bb', font: { family: 'Cairo', size: 9 } },
                    grid: { color: 'rgba(255,255,255,0.04)' }
                },
                y: {
                    ticks: { color: '#8899bb' },
                    grid: { color: 'rgba(255,255,255,0.04)' },
                    beginAtZero: true
                }
            }
        }
    });

    const ctx2 = document.getElementById('chartPoints').getContext('2d');
    const colors = ['#f0b429', '#5dade2', '#2ecc71', '#e74c3c', '#9b59b6'];
    const datasets = topUsers.map((user, idx) => ({
        label: user[0],
        data: user[1],
        borderColor: colors[idx % colors.length],
        backgroundColor: colors[idx % colors.length] + '33',
        fill: true,
        tension: 0.3,
        pointRadius: 2
    }));
    chartInstancesLocal.points = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: pointLabels,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#8899bb', font: { family: 'Cairo', size: 10 } }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#8899bb', font: { family: 'Cairo', size: 8 } },
                    grid: { color: 'rgba(255,255,255,0.04)' }
                },
                y: {
                    ticks: { color: '#8899bb' },
                    grid: { color: 'rgba(255,255,255,0.04)' },
                    beginAtZero: true
                }
            }
        }
    });

    const ctx3 = document.getElementById('chartPopular').getContext('2d');
    chartInstancesLocal.pop = new Chart(ctx3, {
        type: 'bar',
        data: {
            labels: popLabels,
            datasets: [{
                label: 'عدد التوقعات',
                data: popData,
                backgroundColor: 'rgba(240, 180, 41, 0.6)',
                borderColor: 'rgba(240, 180, 41, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#8899bb', font: { family: 'Cairo' } }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#8899bb', font: { family: 'Cairo', size: 9 } },
                    grid: { color: 'rgba(255,255,255,0.04)' }
                },
                y: {
                    ticks: { color: '#8899bb' },
                    grid: { color: 'rgba(255,255,255,0.04)' },
                    beginAtZero: true
                }
            }
        }
    });

    const ctx4 = document.getElementById('chartAccuracy').getContext('2d');
    chartInstancesLocal.acc = new Chart(ctx4, {
        type: 'bar',
        data: {
            labels: accLabels,
            datasets: [{
                label: 'نسبة التوقعات الصحيحة (%)',
                data: accData,
                backgroundColor: 'rgba(46, 204, 113, 0.7)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#8899bb', font: { family: 'Cairo' } }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#8899bb', font: { family: 'Cairo', size: 9 } },
                    grid: { color: 'rgba(255,255,255,0.04)' }
                },
                y: {
                    ticks: { color: '#8899bb' },
                    grid: { color: 'rgba(255,255,255,0.04)' },
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    setChartInstancesLocal(chartInstancesLocal);

    document.getElementById('analyticsContent').innerHTML = `
            <div class="analytics-grid">
              <div class="chart-box full-width">
                <div class="chart-title">📊 أكثر اللاعبين توقعاً</div>
                <canvas id="chartPlayerDistribution"></canvas>
              </div>
              <div class="chart-box full-width">
                <div class="chart-title">📈 تطور نقاط أفضل 5 لاعبين</div>
                <canvas id="chartPoints"></canvas>
              </div>
              <div class="chart-box full-width">
                <div class="chart-title">🔥 أكثر المباريات توقعاً</div>
                <canvas id="chartPopular"></canvas>
              </div>
              <div class="chart-box full-width">
                <div class="chart-title">🎯 نسبة التوقعات الصحيحة (أفضل 5)</div>
                <canvas id="chartAccuracy"></canvas>
              </div>
            </div>
            <div class="player-analytics-section" id="playerAnalyticsSection">
              <div class="select-player">
                <select id="playerAnalyticsSelect" onchange="updatePlayerAnalytics()">
                  <option value="">-- اختر لاعباً --</option>
                </select>
              </div>
              <div id="playerAnalyticsDetails" class="player-analytics-details" style="display:none;"></div>
            </div>
            <div class="match-analytics-section" id="matchAnalyticsSection">
              <div class="match-analytics-grid" id="matchAnalyticsGrid">
                <!-- سيتم ملؤها بواسطة JavaScript -->
              </div>
            </div>
            <div style="text-align:center;margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">
              <button class="tab-btn" onclick="document.getElementById('analyticsModal').classList.remove('active');document.body.style.overflow='';" style="background:rgba(240,180,41,0.08);border-color:rgba(240,180,41,0.2);color:var(--gold-light);">إغلاق</button>
            </div>
          `;

    setTimeout(() => {
        const ctx1b = document.getElementById('chartPlayerDistribution').getContext('2d');
        const ctx2b = document.getElementById('chartPoints').getContext('2d');
        const ctx3b = document.getElementById('chartPopular').getContext('2d');
        const ctx4b = document.getElementById('chartAccuracy').getContext('2d');

        if (chartInstancesLocal.predDist) chartInstancesLocal.predDist.destroy();
        if (chartInstancesLocal.points) chartInstancesLocal.points.destroy();
        if (chartInstancesLocal.pop) chartInstancesLocal.pop.destroy();
        if (chartInstancesLocal.acc) chartInstancesLocal.acc.destroy();

        chartInstancesLocal.predDist = new Chart(ctx1b, {
            type: 'bar',
            data: {
                labels: predLabels,
                datasets: [{
                    label: 'عدد التوقعات',
                    data: predData,
                    backgroundColor: 'rgba(240, 180, 41, 0.7)',
                    borderColor: 'rgba(240, 180, 41, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: { color: '#8899bb', font: { family: 'Cairo' } }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#8899bb', font: { family: 'Cairo', size: 9 } },
                        grid: { color: 'rgba(255,255,255,0.04)' }
                    },
                    y: {
                        ticks: { color: '#8899bb' },
                        grid: { color: 'rgba(255,255,255,0.04)' },
                        beginAtZero: true
                    }
                }
            }
        });

        chartInstancesLocal.points = new Chart(ctx2b, {
            type: 'line',
            data: {
                labels: pointLabels,
                datasets: datasets
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: { color: '#8899bb', font: { family: 'Cairo', size: 10 } }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#8899bb', font: { family: 'Cairo', size: 8 } },
                        grid: { color: 'rgba(255,255,255,0.04)' }
                    },
                    y: {
                        ticks: { color: '#8899bb' },
                        grid: { color: 'rgba(255,255,255,0.04)' },
                        beginAtZero: true
                    }
                }
            }
        });

        chartInstancesLocal.pop = new Chart(ctx3b, {
            type: 'bar',
            data: {
                labels: popLabels,
                datasets: [{
                    label: 'عدد التوقعات',
                    data: popData,
                    backgroundColor: 'rgba(240, 180, 41, 0.6)',
                    borderColor: 'rgba(240, 180, 41, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: { color: '#8899bb', font: { family: 'Cairo' } }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#8899bb', font: { family: 'Cairo', size: 9 } },
                        grid: { color: 'rgba(255,255,255,0.04)' }
                    },
                    y: {
                        ticks: { color: '#8899bb' },
                        grid: { color: 'rgba(255,255,255,0.04)' },
                        beginAtZero: true
                    }
                }
            }
        });

        chartInstancesLocal.acc = new Chart(ctx4b, {
            type: 'bar',
            data: {
                labels: accLabels,
                datasets: [{
                    label: 'نسبة التوقعات الصحيحة (%)',
                    data: accData,
                    backgroundColor: 'rgba(46, 204, 113, 0.7)',
                    borderColor: 'rgba(46, 204, 113, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: { color: '#8899bb', font: { family: 'Cairo' } }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#8899bb', font: { family: 'Cairo', size: 9 } },
                        grid: { color: 'rgba(255,255,255,0.04)' }
                    },
                    y: {
                        ticks: { color: '#8899bb' },
                        grid: { color: 'rgba(255,255,255,0.04)' },
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });

        populatePlayerAnalyticsSelect();
        renderMatchAnalytics();
        const select = document.getElementById('playerAnalyticsSelect');
        if (select.value) {
            updatePlayerAnalytics();
        }
    }, 100);
}