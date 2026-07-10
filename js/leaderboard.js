// ============================================================
//  LEADERBOARD MODULE
//  تم تعديله للعمل داخل المشروع الرئيسي
// ============================================================

let leaderboardState = {
    predictions: [],
    previousGamesData: [],
    loaded: false,
    loading: false,
    playersData: {},
    currentPeriod: 'all'
};

let leaderboardChartInstance = null;

// ============================================================
//  CACHE HELPERS (مستخدمة من المشروع الرئيسي)
// ============================================================
// نستخدم دوال الكاش الموجودة في storage.js

// ============================================================
//  TRANSLATION HELPERS (مستخدمة من المشروع الرئيسي)
// ============================================================
// نستخدم دوال الترجمة الموجودة في utils.js

// ============================================================
//  LOAD DATA (مستخدمة من المشروع الرئيسي)
// ============================================================
// نستخدم دوال تحميل البيانات الموجودة في predictions.js و matches.js

// ============================================================
//  LEADERBOARD SPECIFIC FUNCTIONS
// ============================================================

function resolvePredictionTeam(prediction, result) {
    if (!prediction) return null;
    
    if (prediction === 'HOME') {
        return result ? result.homeAr : 'HOME';
    } else if (prediction === 'AWAY') {
        return result ? result.awayAr : 'AWAY';
    } else if (prediction === 'DRAW') {
        return 'DRAW';
    } else {
        return typeof translateToArabic === 'function' ? translateToArabic(prediction) : prediction;
    }
}

function calculatePlayerScore(prediction) {
    const parts = (prediction.match_id || "").split("_");
    if (parts.length < 3) return { isCorrect: false, predictionTeam: null, winner: null };
    
    const result = typeof findMatchResult === 'function' ? findMatchResult(parts[1], parts[2]) : null;
    if (!result) return { isCorrect: false, predictionTeam: null, winner: null };
    
    const winner = typeof determineWinner === 'function' ? determineWinner(result) : null;
    const predictionTeam = resolvePredictionTeam(prediction.prediction, result);
    
    let isCorrect = false;
    if (winner === null) {
        isCorrect = predictionTeam === 'DRAW';
    } else {
        isCorrect = predictionTeam === winner;
    }
    
    return { isCorrect, predictionTeam, winner };
}

function calculatePlayersData() {
    // استخدام بيانات المشروع الرئيسي
    const predictions = window.state && window.state.predictions ? window.state.predictions : [];
    const previousGames = window.state && window.state.previousGamesData ? window.state.previousGamesData : [];
    
    leaderboardState.predictions = predictions;
    leaderboardState.previousGamesData = previousGames;
    
    const scores = {};
    let totalPredictions = 0;

    for (let p of predictions) {
        totalPredictions++;
        if (!scores[p.user_name]) {
            scores[p.user_name] = { name: p.user_name, points: 0, correct: 0, wrong: 0, total: 0, predictions: [] };
        }
        scores[p.user_name].total++;
        scores[p.user_name].predictions.push(p);
        
        const result = calculatePlayerScore(p);
        if (result.isCorrect) {
            scores[p.user_name].points++;
            scores[p.user_name].correct++;
        } else if (result.predictionTeam !== null) {
            scores[p.user_name].wrong++;
        }
    }

    const board = Object.values(scores).sort((a, b) => b.points - a.points || (b.correct - a.correct));

    let totalPoints = 0,
        maxPoints = 0,
        totalAccuracy = 0,
        maxAccuracy = 0,
        totalCorrect = 0,
        totalWrong = 0;
    board.forEach(p => {
        totalPoints += p.points;
        if (p.points > maxPoints) maxPoints = p.points;
        totalCorrect += p.correct;
        totalWrong += p.wrong;
        const acc = p.total > 0 ? (p.correct / p.total) * 100 : 0;
        totalAccuracy += acc;
        if (acc > maxAccuracy) maxAccuracy = acc;
    });

    const avgPoints = board.length > 0 ? Math.round(totalPoints / board.length) : 0;
    const avgAccuracy = board.length > 0 ? Math.round(totalAccuracy / board.length) : 0;

    leaderboardState.playersData = {
        board: board,
        totalPlayers: board.length,
        totalPredictions: totalPredictions,
        avgPoints: avgPoints,
        maxPoints: maxPoints,
        avgAccuracy: avgAccuracy,
        maxAccuracy: Math.round(maxAccuracy),
        totalCorrect: totalCorrect,
        totalWrong: totalWrong
    };

    return leaderboardState.playersData;
}

function getPlayerTitle(player, index, totalPlayers) {
    const acc = player.total > 0 ? Math.round((player.correct / player.total) * 100) : 0;

    if (acc >= 80 && player.total >= 5) return '🧠 فاهم';
    if (acc >= 70 && player.total >= 5) return '🎯 استراتيجي';
    if (player.points >= 15) return '⚡ محنك';
    if (player.points >= 8) return '🔥 مغامر';
    if (player.total >= 10) return '📚 متابع';

    if (index === 0) return '👑 البطل';
    if (index === 1) return '🥈 الوصيف';
    if (index === 2) return '🥉 الثالث';

    const randomTitles = [
        '🧠 المحلل', '🎯 الصياد', '⚡ البرق', '🔥 النار',
        '🌊 الموج', '🏔️ الصخر', '🌟 النجم', '💎 الماس'
    ];

    const titleIndex = index % randomTitles.length;
    return randomTitles[titleIndex];
}

function getPredictionStatus(prediction) {
    if (!prediction || !prediction.match_id) {
        return { status: 'pending', text: '⏳ مباراة غير معروفة' };
    }
    const parts = prediction.match_id.split('_');
    if (parts.length < 3) {
        return { status: 'pending', text: '⏳ بيانات غير مكتملة' };
    }
    const result = typeof findMatchResult === 'function' ? findMatchResult(parts[1], parts[2]) : null;
    if (!result) {
        return { status: 'pending', text: '⏳ لم تلعب بعد' };
    }
    const winner = typeof determineWinner === 'function' ? determineWinner(result) : null;
    const predictionTeam = resolvePredictionTeam(prediction.prediction, result);
    
    if (!winner) {
        if (predictionTeam === 'DRAW') {
            return { status: 'correct', text: '✅ صحيح (تعادل)' };
        } else {
            return { status: 'wrong', text: '❌ خاطئ (تعادل)' };
        }
    }
    if (predictionTeam === winner) {
        return { status: 'correct', text: `✅ صحيح (${winner})` };
    } else {
        return { status: 'wrong', text: `❌ خاطئ (الفائز: ${winner})` };
    }
}

// ============================================================
//  RENDER LEADERBOARD
// ============================================================

function setLeaderboardPeriod(period) {
    leaderboardState.currentPeriod = period;
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.period === period);
    });
    renderLeaderboard(period);
}

function renderLeaderboard(period) {
    const container = document.getElementById("leaderboardContainer");
    if (!container) return;
    
    const data = calculatePlayersData();
    const board = data.board || [];
    
    if (board.length === 0) {
        container.innerHTML =
            `<div class="empty-state"><span class="icon">📭</span> لا توجد بيانات كافية<br><small style="color:var(--text-muted);font-size:0.6rem;">تأكد من وجود توقعات ومباريات</small></div>`;
        document.getElementById('lbTotalPlayers').textContent = '0';
        document.getElementById('lbTotalPredictions').textContent = state.predictions ? state.predictions.length : 0;
        return;
    }

    document.getElementById('lbTotalPlayers').textContent = board.length;
    document.getElementById('lbTotalPredictions').textContent = data.totalPredictions;

    let rank = 1,
        i = 0;
    while (i < board.length) {
        let j = i,
            points = board[i].points;
        while (j < board.length && board[j].points === points) j++;
        const groupSize = j - i;
        for (let k = i; k < j; k++) board[k].rank = rank;
        i = j;
        rank += groupSize;
    }

    const currentUser = typeof getLastUserName === 'function' ? getLastUserName() : localStorage.getItem('lastUserName') || '';
    const topThree = board.slice(0, 3);
    const rest = board.slice(3, 10);

    let html = '';
    if (topThree.length) {
        const champ = topThree[0];
        const accuracy = champ.total > 0 ? Math.round((champ.correct / champ.total) * 100) : 0;
        const isCurrentUser = champ.name === currentUser;
        const medal = champ.rank === 1 ? '🥇' : champ.rank === 2 ? '🥈' : champ.rank === 3 ? '🥉' : `#${champ.rank}`;
        const title = getPlayerTitle(champ, 0, board.length);

        html += `
            <div class="champion-card" onclick="openPlayerPredictions('${champ.name}')">
                <div class="rank-badge">${medal}</div>
                <div class="avatar">${champ.name.charAt(0).toUpperCase()}</div>
                <div class="info">
                    <div class="name">${champ.name} ${isCurrentUser ? '👤' : ''} <span class="badge">${title}</span></div>
                    <div class="stats-row">
                        <span class="item">🏆 نقاط <strong class="highlight">${champ.points}</strong></span>
                        <span class="item">✅ <strong style="color:var(--gold-light);">${champ.correct}</strong></span>
                        <span class="item">📊 <strong>${champ.total}</strong></span>
                        <span class="item">🎯 <strong>${accuracy}%</strong></span>
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
        allPlayers.forEach((player, idx) => {
            const rankNum = player.rank;
            const accuracy = player.total > 0 ? Math.round((player.correct / player.total) * 100) : 0;
            const isCurrentUser = player.name === currentUser;
            let medal = rankNum === 1 ? '🥇' : rankNum === 2 ? '🥈' : rankNum === 3 ? '🥉' : `#${rankNum}`;
            let rankClass = rankNum === 1 ? 'gold' : rankNum === 2 ? 'silver' : rankNum === 3 ? 'bronze' : '';
            let borderClass = rankNum === 1 ? 'gold-border' : rankNum === 2 ? 'silver-border' : rankNum === 3 ? 'bronze-border' : '';
            const isTie = board.filter(p => p.rank === rankNum).length > 1;
            const tieBadge = isTie ? ' ⚡' : '';
            const title = getPlayerTitle(player, idx + 1, board.length);

            html += `
                <div class="player-card" onclick="openPlayerPredictions('${player.name}')">
                    <div class="rank ${rankClass}">${medal}${tieBadge}</div>
                    <div class="avatar-sm ${borderClass}">${player.name.charAt(0).toUpperCase()}</div>
                    <div class="info-sm">
                        <div class="name-sm">${player.name} ${isCurrentUser ? '👤' : ''}
                            ${isTie ? `<span class="mini-badge">⚡ متعادل</span>` : ''}
                        </div>
                        <div class="achievement">
                            <span class="achievement-badge">${title}</span>
                        </div>
                        <div class="sub-sm">
                            <span>✅ <span class="highlight">${player.correct}</span></span>
                            <span>📊 ${player.total}</span>
                            <span>🎯 ${accuracy}%</span>
                        </div>
                        <div class="progress-mini"><div class="fill-mini" style="width:${Math.min(accuracy,100)}%;"></div></div>
                    </div>
                    <div class="points-sm">${player.points}</div>
                    ${isCurrentUser ? `<div class="current-user-indicator active"></div><div class="pulse-dot"></div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }
    container.innerHTML = html;

    updateStatsTab();
    updateChartDropdown();
}

// ============================================================
//  RENDER STATS TAB
// ============================================================

function updateStatsTab() {
    const data = calculatePlayersData();
    const board = data.board || [];

    const totalEl = document.getElementById('statsTotalPlayers');
    if (totalEl) totalEl.textContent = `${data.totalPlayers} لاعب`;

    const elements = {
        avgPoints: 'statAvgPoints',
        maxPoints: 'statMaxPoints',
        avgAccuracy: 'statAvgAccuracy',
        topAccuracy: 'statTopAccuracy',
        totalCorrect: 'statTotalCorrect',
        totalWrong: 'statTotalWrong'
    };

    const values = {
        avgPoints: data.avgPoints,
        maxPoints: data.maxPoints,
        avgAccuracy: data.avgAccuracy + '%',
        topAccuracy: data.maxAccuracy + '%',
        totalCorrect: data.totalCorrect,
        totalWrong: data.totalWrong
    };

    for (let [key, id] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) el.textContent = values[key];
    }

    const listContainer = document.getElementById('playerRankList');
    if (!listContainer) return;
    
    if (board.length === 0) {
        listContainer.innerHTML = `<div class="empty-state"><span class="icon">📭</span> لا توجد بيانات</div>`;
        return;
    }

    let html = '';
    board.forEach((p, idx) => {
        const acc = p.total > 0 ? Math.round((p.correct / p.total) * 100) : 0;
        const rankNum = idx + 1;
        let medal = rankNum === 1 ? '🥇' : rankNum === 2 ? '🥈' : rankNum === 3 ? '🥉' : `#${rankNum}`;
        const title = getPlayerTitle(p, idx, board.length);
        html += `
            <div class="player-rank-item" onclick="openPlayerPredictions('${p.name}')" style="cursor:pointer;">
                <span class="rank-num">${medal}</span>
                <span class="pname">${p.name} <span style="font-size:0.55rem;color:var(--gold-light);">${title}</span></span>
                <span class="ppoints">${p.points}</span>
                <span class="pacc">🎯 ${acc}%</span>
            </div>
        `;
    });
    listContainer.innerHTML = html;
}

// ============================================================
//  CHART
// ============================================================

function updateChartDropdown() {
    const select = document.getElementById('chartPlayerSelect');
    if (!select) return;
    
    const data = calculatePlayersData();
    const board = data.board || [];

    const currentVal = select.value;
    select.innerHTML = '<option value="">-- اختر لاعب --</option>';
    board.forEach(p => {
        const option = document.createElement('option');
        option.value = p.name;
        option.textContent = `${p.name} (${p.points} نقاط)`;
        select.appendChild(option);
    });
    if (currentVal && board.find(p => p.name === currentVal)) {
        select.value = currentVal;
    }
    updateChart();
}

function updateChart() {
    const select = document.getElementById('chartPlayerSelect');
    if (!select) return;
    
    const playerName = select.value;
    const canvas = document.getElementById('progressChart');
    if (!canvas) return;

    if (!playerName) {
        if (leaderboardChartInstance) {
            leaderboardChartInstance.destroy();
            leaderboardChartInstance = null;
        }
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#8aa0c0';
        ctx.font = '12px Cairo';
        ctx.textAlign = 'center';
        ctx.fillText('📊 اختر لاعباً', canvas.width / 2, canvas.height / 2);
        return;
    }

    const data = calculatePlayersData();
    const board = data.board || [];
    const player = board.find(p => p.name === playerName);
    if (!player || !player.predictions || player.predictions.length === 0) {
        if (leaderboardChartInstance) {
            leaderboardChartInstance.destroy();
            leaderboardChartInstance = null;
        }
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#8aa0c0';
        ctx.font = '12px Cairo';
        ctx.textAlign = 'center';
        ctx.fillText('📭 لا توجد توقعات كافية', canvas.width / 2, canvas.height / 2);
        return;
    }

    let cumulativePoints = 0;
    const labels = [];
    const pointsData = [];

    const sortedPredictions = [...player.predictions].sort((a, b) => {
        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
    });

    for (let p of sortedPredictions) {
        const score = calculatePlayerScore(p);
        if (score.isCorrect) cumulativePoints++;
        const parts = (p.match_id || "").split("_");
        const matchLabel = parts.length >= 3 ? `${parts[1]?.slice(0,4)||'?'} vs ${parts[2]?.slice(0,4)||'?'}` : 'مباراة';
        labels.push(matchLabel);
        pointsData.push(cumulativePoints);
    }

    if (labels.length === 0) {
        if (leaderboardChartInstance) {
            leaderboardChartInstance.destroy();
            leaderboardChartInstance = null;
        }
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#8aa0c0';
        ctx.font = '12px Cairo';
        ctx.textAlign = 'center';
        ctx.fillText('📭 لا توجد مباريات محسوبة', canvas.width / 2, canvas.height / 2);
        return;
    }

    const isDark = document.documentElement.getAttribute('data-theme') === 'light' ? false : true;
    const textColor = isDark ? '#8aa0c0' : '#3d5a78';
    const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
    const goldColor = '#e4b34a';

    if (leaderboardChartInstance) {
        leaderboardChartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    leaderboardChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${playerName}`,
                data: pointsData,
                borderColor: goldColor,
                backgroundColor: 'rgba(212,167,69,0.08)',
                fill: true,
                tension: 0.3,
                pointBackgroundColor: goldColor,
                pointBorderColor: 'transparent',
                pointRadius: 3,
                pointHoverRadius: 6,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        font: { family: 'Cairo', size: 10 }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColor,
                        font: { family: 'Cairo', size: 9 },
                        stepSize: 1
                    },
                    grid: { color: gridColor }
                },
                x: {
                    ticks: {
                        color: textColor,
                        font: { family: 'Cairo', size: 8 },
                        maxRotation: 30,
                        minRotation: 0
                    },
                    grid: { display: false }
                }
            }
        }
    });
}

// ============================================================
//  COMPARE PLAYERS
// ============================================================

function comparePlayers() {
    const input1 = document.getElementById('compareInput1');
    const input2 = document.getElementById('compareInput2');
    const resultContainer = document.getElementById('compareResult');
    
    if (!input1 || !input2 || !resultContainer) return;

    const name1 = input1.value.trim();
    const name2 = input2.value.trim();

    if (!name1 || !name2) {
        showToast('⚠️ أدخل اسمي لاعبين');
        return;
    }

    const data = calculatePlayersData();
    const board = data.board || [];

    const findPlayer = (name) => {
        return board.find(p => p.name.toLowerCase() === name.toLowerCase());
    };

    const p1 = findPlayer(name1);
    const p2 = findPlayer(name2);

    if (!p1 && !p2) {
        resultContainer.innerHTML = `<div class="empty-state"><span class="icon">❌</span> لم يتم العثور على أي لاعب</div>`;
        resultContainer.classList.add('show');
        return;
    }

    if (!p1) {
        resultContainer.innerHTML =
            `<div class="empty-state"><span class="icon">❌</span> لم يتم العثور على: ${name1}</div>`;
        resultContainer.classList.add('show');
        return;
    }

    if (!p2) {
        resultContainer.innerHTML =
            `<div class="empty-state"><span class="icon">❌</span> لم يتم العثور على: ${name2}</div>`;
        resultContainer.classList.add('show');
        return;
    }

    const acc1 = p1.total > 0 ? Math.round((p1.correct / p1.total) * 100) : 0;
    const acc2 = p2.total > 0 ? Math.round((p2.correct / p2.total) * 100) : 0;

    const getPlayerType = (p) => {
        if (p.total === 0) return { type: '🤔 غير معروف', risk: 0 };
        const risk = Math.round((p.wrong / p.total) * 100);
        let type = '';
        if (risk > 60) type = '🔥 صياد مفاجآت';
        else if (risk > 40) type = '⚡ مغامر';
        else if (risk > 20) type = '🧠 استراتيجي';
        else type = '🛡️ محافظ';
        return { type, risk };
    };

    const type1 = getPlayerType(p1);
    const type2 = getPlayerType(p2);

    const getRiskClass = (risk) => {
        if (risk > 60) return 'high';
        if (risk > 35) return 'medium';
        return 'low';
    };

    const title1 = getPlayerTitle(p1, 0, board.length);
    const title2 = getPlayerTitle(p2, 1, board.length);

    const compareHTML = `
        <div class="compare-card">
            <div class="player-col">
                <div class="avatar-compare">${p1.name.charAt(0).toUpperCase()}</div>
                <div class="cname">👤 ${p1.name}</div>
                <div class="player-type">${title1}</div>
                <div class="cstat" style="margin-top:6px;">
                    <span class="num">${p1.points}</span> نقاط
                </div>
                <div class="cstat">
                    🎯 دقة <span class="num ${acc1 >= acc2 ? 'green' : 'red'}">${acc1}%</span>
                </div>
                <div style="margin-top:4px;font-size:0.6rem;color:var(--text-secondary);">
                    المجازفة: ${type1.risk}%
                </div>
                <div class="risk-bar">
                    <div class="fill-risk ${getRiskClass(type1.risk)}" style="width:${type1.risk}%;"></div>
                </div>
            </div>
            <div class="vs-divider">⚔️</div>
            <div class="player-col">
                <div class="avatar-compare">${p2.name.charAt(0).toUpperCase()}</div>
                <div class="cname">👤 ${p2.name}</div>
                <div class="player-type">${title2}</div>
                <div class="cstat" style="margin-top:6px;">
                    <span class="num">${p2.points}</span> نقاط
                </div>
                <div class="cstat">
                    🎯 دقة <span class="num ${acc2 >= acc1 ? 'green' : 'red'}">${acc2}%</span>
                </div>
                <div style="margin-top:4px;font-size:0.6rem;color:var(--text-secondary);">
                    المجازفة: ${type2.risk}%
                </div>
                <div class="risk-bar">
                    <div class="fill-risk ${getRiskClass(type2.risk)}" style="width:${type2.risk}%;"></div>
                </div>
            </div>
        </div>
        <div class="compare-details">
            <div class="detail-item"><span class="dlabel">🏆 النقاط</span><span class="dvalue gold">${p1.points} - ${p2.points}</span></div>
            <div class="detail-item"><span class="dlabel">✅ الصحيحة</span><span class="dvalue gold">${p1.correct} - ${p2.correct}</span></div>
            <div class="detail-item"><span class="dlabel">❌ الخاطئة</span><span class="dvalue">${p1.wrong} - ${p2.wrong}</span></div>
            <div class="detail-item"><span class="dlabel">📊 الإجمالي</span><span class="dvalue">${p1.total} - ${p2.total}</span></div>
            <div class="detail-item"><span class="dlabel">🎯 النجاح</span><span class="dvalue gold">${acc1}% - ${acc2}%</span></div>
            <div class="detail-item"><span class="dlabel">🔥 المجازفة</span><span class="dvalue">${type1.risk}% - ${type2.risk}%</span></div>
        </div>
    `;

    resultContainer.innerHTML = compareHTML;
    resultContainer.classList.add('show');
}

// ============================================================
//  OPEN PLAYER PREDICTIONS (مدمج مع المشروع الرئيسي)
// ============================================================

async function openPlayerPredictions(userName) {
    if (!userName) { 
        if (typeof showCopyToast === 'function') showCopyToast('⚠️ اسم المستخدم غير معروف');
        return; 
    }
    
    // إذا كانت الدالة موجودة في المشروع الرئيسي نستخدمها
    if (typeof window.openPlayerPredictions === 'function' && window.openPlayerPredictions !== openPlayerPredictions) {
        return window.openPlayerPredictions(userName);
    }
    
    // وإلا نستخدم الدالة المحلية
    const modal = document.getElementById('playerPredictionsModal');
    if (!modal) return;
    
    const listContainer = document.getElementById('playerPredictionsList');
    document.getElementById('playerModalTitle').textContent = `📋 توقعات ${userName}`;
    document.getElementById('playerModalSubtitle').textContent = `👤 عرض جميع توقعات اللاعب ${userName}`;
    listContainer.innerHTML = `<div class="empty-state"><span class="icon">⏳</span> جاري التحميل...</div>`;

    let predictions = [];
    if (window.supabaseClient) {
        try {
            const { data, error } = await window.supabaseClient
                .from("predictions")
                .select("*")
                .eq("user_name", userName)
                .order("created_at", { ascending: false });
            if (!error && data) predictions = data;
        } catch (e) { console.warn("⚠️ فشل جلب توقعات اللاعب:", e); }
    }
    
    if (!predictions.length) {
        listContainer.innerHTML =
            `<div class="empty-state"><span class="icon">📭</span> لا توجد توقعات لهذا اللاعب</div>`;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        return;
    }

    let correct = 0,
        wrong = 0,
        points = 0;
    const predictionsWithStatus = predictions.map(p => {
        const status = getPredictionStatus(p);
        if (status.status === 'correct') { correct++;
            points++; } else if (status.status === 'wrong') { wrong++; }
        return { ...p, status };
    });
    const total = predictions.length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    const pointsEl = document.getElementById('playerPoints');
    const correctEl = document.getElementById('playerCorrect');
    const wrongEl = document.getElementById('playerWrong');
    const totalEl = document.getElementById('playerTotal');
    const accuracyEl = document.getElementById('playerAccuracy');
    const rankEl = document.getElementById('playerRank');
    
    if (pointsEl) pointsEl.textContent = points;
    if (correctEl) correctEl.textContent = correct;
    if (wrongEl) wrongEl.textContent = wrong;
    if (totalEl) totalEl.textContent = total;
    if (accuracyEl) accuracyEl.textContent = accuracy + '%';

    const allScores = {};
    const allPredictions = window.state && window.state.predictions ? window.state.predictions : [];
    for (let p of allPredictions) {
        if (!allScores[p.user_name]) allScores[p.user_name] = { points: 0 };
        const score = calculatePlayerScore(p);
        if (score.isCorrect) allScores[p.user_name].points++;
    }
    const sorted = Object.entries(allScores).sort((a, b) => b[1].points - a[1].points);
    const rank = sorted.findIndex(([name]) => name === userName) + 1;
    if (rankEl) rankEl.textContent = rank > 0 ? `#${rank}` : '-';

    let html = '';
    predictionsWithStatus.forEach((p, idx) => {
        const parts = p.match_id ? p.match_id.split('_') : [];
        const team1Raw = parts.length > 1 ? parts[1] : '?';
        const team2Raw = parts.length > 2 ? parts[2] : '?';
        const team1Ar = typeof translateToArabic === 'function' ? translateToArabic(team1Raw) : team1Raw;
        const team2Ar = typeof translateToArabic === 'function' ? translateToArabic(team2Raw) : team2Raw;
        let predText = '';
        const result = typeof findMatchResult === 'function' ? findMatchResult(team1Raw, team2Raw) : null;
        const predictionTeam = resolvePredictionTeam(p.prediction, result);
        if (predictionTeam === 'DRAW') {
            predText = '🤝 تعادل';
        } else if (predictionTeam === team1Ar) {
            predText = `🏆 فوز ${typeof getFlag === 'function' ? getFlag(team1Ar) : ''} ${team1Ar}`;
        } else if (predictionTeam === team2Ar) {
            predText = `🏆 فوز ${typeof getFlag === 'function' ? getFlag(team2Ar) : ''} ${team2Ar}`;
        } else if (predictionTeam) {
            predText = `🔮 ${predictionTeam}`;
        } else {
            predText = `🔮 ${p.prediction || '?'}`;
        }
        const status = p.status;
        let statusClass = 'pending',
            statusText = '⏳ قيد الانتظار';
        if (status.status === 'correct') { statusClass = 'correct';
            statusText = '✅ صحيح'; } else if (status.status === 'wrong') { statusClass = 'wrong';
            statusText = '❌ خاطئ'; }
        const timeStr = typeof formatDate === 'function' ? formatDate(p.created_at) : p.created_at || 'تاريخ غير معروف';
        html += `
            <div class="player-prediction-item">
                <div class="num">#${idx + 1}</div>
                <div class="match-info">
                    <div class="teams"><span class="flag">${typeof getFlag === 'function' ? getFlag(team1Ar) : ''}</span> ${team1Ar} 🆚 <span class="flag">${typeof getFlag === 'function' ? getFlag(team2Ar) : ''}</span> ${team2Ar}</div>
                    <div class="pred">🔮 ${predText}</div>
                    <span class="status ${statusClass}">${statusText}</span>
                </div>
                <div class="time">🕒 ${timeStr}</div>
            </div>
        `;
    });
    listContainer.innerHTML = html;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ============================================================
//  LEADERBOARD INIT
// ============================================================

function initLeaderboard() {
    console.log("🏆 بدء تشغيل لوحة المتصدرين");
    
    // استخدام بيانات المشروع الرئيسي
    if (window.state && window.state.loaded) {
        leaderboardState.predictions = window.state.predictions || [];
        leaderboardState.previousGamesData = window.state.previousGamesData || [];
        leaderboardState.loaded = true;
        renderLeaderboard('all');
        updateStatsTab();
        updateChartDropdown();
        console.log("✅ تم تحميل لوحة المتصدرين");
    } else {
        console.log("⏳ انتظار تحميل البيانات الرئيسية...");
        // الانتظار حتى تحميل البيانات الرئيسية
        const checkData = setInterval(() => {
            if (window.state && window.state.loaded) {
                clearInterval(checkData);
                leaderboardState.predictions = window.state.predictions || [];
                leaderboardState.previousGamesData = window.state.previousGamesData || [];
                leaderboardState.loaded = true;
                renderLeaderboard('all');
                updateStatsTab();
                updateChartDropdown();
                console.log("✅ تم تحميل لوحة المتصدرين");
            }
        }, 500);
    }
}

// ============================================================
//  EVENT BINDINGS
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    // ربط أزرار الفترة
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            setLeaderboardPeriod(this.dataset.period);
        });
    });
    
    // ربط زر المقارنة
    const compareBtn = document.querySelector('.compare-search button');
    if (compareBtn) {
        compareBtn.addEventListener('click', comparePlayers);
    }
    
    // ربط Enter في حقول المقارنة
    const compareInput1 = document.getElementById('compareInput1');
    const compareInput2 = document.getElementById('compareInput2');
    if (compareInput1) {
        compareInput1.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') comparePlayers();
        });
    }
    if (compareInput2) {
        compareInput2.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') comparePlayers();
        });
    }
    
    // ربط تغيير لاعب الرسم البياني
    const chartSelect = document.getElementById('chartPlayerSelect');
    if (chartSelect) {
        chartSelect.addEventListener('change', updateChart);
    }
    
    // ربط إغلاق مودال اللاعب
    const modalClose = document.getElementById('playerModalCloseBtn');
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            document.getElementById('playerPredictionsModal').classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    const modal = document.getElementById('playerPredictionsModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // إغلاق المودال بـ Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('playerPredictionsModal');
            if (modal && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
});

// تصدير الدوال للاستخدام في المشروع الرئيسي
window.leaderboard = {
    init: initLeaderboard,
    render: renderLeaderboard,
    setPeriod: setLeaderboardPeriod,
    compare: comparePlayers,
    updateChart: updateChart,
    openPlayer: openPlayerPredictions
};

// ============================================================
//  تنفيذ التهيئة
// ============================================================
// تم استبدال init() بـ window.initLeaderboard = init;
// سيتم استدعاؤها من المشروع الرئيسي