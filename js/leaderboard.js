// ============================================================
//  دوال لوحة المتصدرين والمقارنات
// ============================================================

import { state, userPredictionsMap, currentLeaderboardPeriod, setCurrentLeaderboardPeriod, isCompactMode, setIsCompactMode, isAuthorized } from './config.js';
import { findMatchResult, now, getCache, setCache } from './utils.js';
import { getFlag } from './data.js';
import { openPlayerPredictions, getPredictionStatus } from './predictions.js';

export function getAllPlayersStats() {
    const stats = {};
    const predictions = state.predictions;
    const games = state.previousGamesData;

    for (let p of predictions) {
        if (!stats[p.user_name]) {
            stats[p.user_name] = { name: p.user_name, points: 0, correct: 0, wrong: 0, total: 0, predictions: [] };
        }
        stats[p.user_name].total++;
        const parts = (p.match_id || "").split("_");
        if (parts.length < 3) continue;
        const team1 = parts[1],
            team2 = parts[2];
        const match = games.find(g => (g.homeAr === team1 && g.awayAr === team2) || (g.homeAr === team2 && g.awayAr ===
            team1));
        if (!match) continue;
        const result = match.homeScore > match.awayScore ? match.homeAr : match.awayScore > match.homeScore ? match
            .awayAr : "DRAW";
        const isCorrect = p.prediction === result;
        if (isCorrect) {
            stats[p.user_name].points++;
            stats[p.user_name].correct++;
        } else {
            stats[p.user_name].wrong++;
        }
        stats[p.user_name].predictions.push({ matchId: p.match_id, prediction: p.prediction, correct: isCorrect });
    }
    return stats;
}

export async function renderLeaderboard(period) {
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
        const match = filteredGames.find(g => (g.homeAr === team1 && g.awayAr === team2) || (g.homeAr === team2 && g
            .awayAr === team1));
        if (!match) continue;
        const result = match.homeScore > match.awayScore ? match.homeAr : match.awayScore > match.homeScore ? match
            .awayAr : "DRAW";
        const isCorrect = p.prediction === result;
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

    const prevRankKey = `prevRank_${period}`;
    let prevRank = {};
    try {
        const raw = localStorage.getItem(prevRankKey);
        if (raw) prevRank = JSON.parse(raw);
    } catch (e) {}

    const currentRank = {};
    board.forEach((p, idx) => {
        currentRank[p.name] = idx + 1;
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
        const currentPos = 1;
        let arrow = '';
        if (prevPos && prevPos !== currentPos) {
            if (currentPos < prevPos) arrow = ' <span class="arrow-up">▲</span>';
            else if (currentPos > prevPos) arrow = ' <span class="arrow-down">▼</span>';
        } else if (prevPos) {
            arrow = ' <span class="arrow-unchanged">—</span>';
        }
        html += `
              <div class="champion-card" style="${isCurrentUser ? 'border-color:#f0b429;box-shadow:0 0 40px rgba(240,180,41,0.12);' : ''}" onclick="openPlayerPredictions('${champ.name}')">
                <div class="rank-badge">🥇</div>
                <div class="avatar">${champ.name.charAt(0).toUpperCase()}</div>
                <div class="info">
                  <div class="name">${champ.name} ${isCurrentUser ? '👤' : ''}
                    <button class="compare-btn" onclick="event.stopPropagation(); openCompareModal('${champ.name}')">📊 مقارنة</button>
                  </div>
                  <div class="stats-row">
                    <span class="item">🏆 <strong>${champ.points}</strong> نقطة</span>
                    <span class="item">✅ <strong style="color:#f0b429;">${champ.correct}</strong></span>
                    <span class="item">📊 <strong style="color:#ffffff;font-size:0.7rem;">${champ.total}</strong></span>
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
        const medals = ['🥈', '🥉', ...Array(rest.length).fill('')];
        html += `<div class="players-list">`;
        allPlayers.forEach((player, idx) => {
            const rank = idx + 2;
            const accuracy = player.total > 0 ? Math.round((player.correct / player.total) * 100) : 0;
            const isCurrentUser = player.name === localStorage.getItem('lastUserName') || '';
            const medal = medals[idx] || `#${rank}`;
            let rankClass = '';
            if (rank === 2) rankClass = 'silver';
            else if (rank === 3) rankClass = 'bronze';
            let borderClass = '';
            if (rank === 2) borderClass = 'silver-border';
            else if (rank === 3) borderClass = 'bronze-border';

            const prevPos = prevRank[player.name] || 0;
            const currentPos = rank;
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
                <div class="player-card" style="${isCurrentUser ? 'border-color:rgba(240,180,41,0.3);' : ''}" onclick="openPlayerPredictions('${player.name}')">
                  <div class="rank ${rankClass}">${medal}</div>
                  <div class="avatar-sm ${borderClass}">${player.name.charAt(0).toUpperCase()}</div>
                  <div class="info-sm">
                    <div class="name-sm">${player.name} ${isCurrentUser ? '👤' : ''}</div>
                    <div class="sub-sm">
                      <span>✅ <span style="color:#f0b429;">${player.correct}</span></span>
                      <span>📊 <span style="color:#ffffff;font-size:0.65rem;">${player.total}</span></span>
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

export function setLeaderboardPeriod(period) {
    currentLeaderboardPeriod = period;
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.period === period);
    });
    renderLeaderboard(period);
}

export function openCompareModal(selectedPlayer) {
    const modal = document.getElementById('compareModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const players = Object.keys(getAllPlayersStats());
    const select1 = document.getElementById('compareSelect1');
    const select2 = document.getElementById('compareSelect2');
    select1.innerHTML = '<option value="">اختر لاعباً</option>';
    select2.innerHTML = '<option value="">اختر لاعباً</option>';
    players.forEach(p => {
        select1.innerHTML += `<option value="${p}">${p}</option>`;
        select2.innerHTML += `<option value="${p}">${p}</option>`;
    });
    if (selectedPlayer) {
        select1.value = selectedPlayer;
        const other = players.find(p => p !== selectedPlayer) || '';
        select2.value = other;
    }
    renderCompare();
}

export function closeCompareModal() {
    document.getElementById('compareModal').classList.remove('active');
    document.body.style.overflow = '';
}

export function renderCompare() {
    const p1 = document.getElementById('compareSelect1').value;
    const p2 = document.getElementById('compareSelect2').value;
    const stats = getAllPlayersStats();

    const div1 = document.getElementById('compareStats1');
    const name1 = document.getElementById('compareName1');
    if (p1 && stats[p1]) {
        const s = stats[p1];
        const acc = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
        name1.innerHTML = `👤 ${p1}`;
        div1.innerHTML = `
              <div class="stat-row"><span class="label">🏆 النقاط</span><span class="value gold">${s.points}</span></div>
              <div class="stat-row"><span class="label">✅ صحيحة</span><span class="value green">${s.correct}</span></div>
              <div class="stat-row"><span class="label">❌ خاطئة</span><span class="value red">${s.wrong}</span></div>
              <div class="stat-row"><span class="label">📊 عدد التوقعات الكلي</span><span class="value">${s.total}</span></div>
              <div class="stat-row"><span class="label">🎯 نسبة النجاح</span><span class="value gold">${acc}%</span></div>
            `;
    } else {
        name1.innerHTML = '👤 لاعب 1';
        div1.innerHTML = `<div class="empty-state"><span class="icon">⏳</span> اختر لاعباً</div>`;
    }

    const div2 = document.getElementById('compareStats2');
    const name2 = document.getElementById('compareName2');
    if (p2 && stats[p2]) {
        const s = stats[p2];
        const acc = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
        name2.innerHTML = `👤 ${p2}`;
        div2.innerHTML = `
              <div class="stat-row"><span class="label">🏆 النقاط</span><span class="value gold">${s.points}</span></div>
              <div class="stat-row"><span class="label">✅ صحيحة</span><span class="value green">${s.correct}</span></div>
              <div class="stat-row"><span class="label">❌ خاطئة</span><span class="value red">${s.wrong}</span></div>
              <div class="stat-row"><span class="label">📊 عدد التوقعات الكلي</span><span class="value">${s.total}</span></div>
              <div class="stat-row"><span class="label">🎯 نسبة النجاح</span><span class="value gold">${acc}%</span></div>
            `;
    } else {
        name2.innerHTML = '👤 لاعب 2';
        div2.innerHTML = `<div class="empty-state"><span class="icon">⏳</span> اختر لاعباً</div>`;
    }
} 