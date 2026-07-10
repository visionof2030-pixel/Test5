// ============================================================
//  لوحة الإدارة
// ============================================================

const SECRET_CODE = "1406";
let isAuthorized = false;
let isCompactMode = false;
let isModalCompact = false;
let chartInstancesLocal = {};

function showPasswordOverlay() {
    const overlay = document.getElementById('passwordOverlay');
    if (!overlay) return;

    overlay.classList.add('active');
    document.getElementById('passwordInput').value = '';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('modalCompactBtn').classList.remove('visible');
    setTimeout(() => document.getElementById('passwordInput').focus(), 300);
    document.body.style.overflow = 'hidden';
}

function hidePasswordOverlay() {
    document.getElementById('passwordOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

function checkPassword() {
    const input = document.getElementById('passwordInput').value.trim();
    const errorEl = document.getElementById('passwordError');

    if (input === SECRET_CODE) {
        isAuthorized = true;
        window.isAuthorized = true;
        errorEl.textContent = '';
        hidePasswordOverlay();

        const shareContainer = document.getElementById('shareAllContainer');
        if (shareContainer) shareContainer.classList.add('visible');

        const adminControls = document.getElementById('adminControls');
        if (adminControls) adminControls.classList.add('visible');

        if (document.getElementById('matchPredictionsModal').classList.contains('active')) {
            document.getElementById('modalCompactBtn').classList.add('visible');
        }

        updateShareAllCount();
        document.querySelectorAll('.edit-btn').forEach(el => el.classList.add('visible'));
        showCopyToast('✅ تم تفعيل لوحة الإدارة');
    } else {
        errorEl.textContent = '❌ رمز غير صحيح';
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();
    }
}

function toggleCompactMode() {
    const container = document.getElementById('leaderboardContainer');
    if (!container) {
        showCopyToast('⚠️ انتظر حتى تحميل البيانات');
        return;
    }

    const playersList = container.querySelector('.players-list');
    const championCard = container.querySelector('.champion-card');

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
            btn.style.background = 'var(--gold-gradient)';
            showCopyToast('📐 تم إلغاء وضع التصغير');
        }
    } else {
        showCopyToast('⚠️ انتظر حتى تحميل البيانات');
    }
}

function resetCompactMode() {
    const container = document.getElementById('leaderboardContainer');
    if (!container) return;

    const playersList = container.querySelector('.players-list');
    const championCard = container.querySelector('.champion-card');

    if (playersList) {
        isCompactMode = false;
        playersList.classList.remove('compact-mode');
        if (championCard) {
            championCard.style.transform = 'scale(1)';
            championCard.style.margin = '0';
        }
        const btn = document.getElementById('toggleCompactBtn');
        btn.innerHTML = '📐 تصغير للتصوير';
        btn.style.background = 'var(--gold-gradient)';
        showCopyToast('🔄 تم إعادة الحجم الطبيعي');
    }
}

function toggleModalCompact() {
    const modalContent = document.getElementById('matchPredictionsContent');
    const btn = document.getElementById('modalCompactBtn');
    if (!modalContent || !btn) return;

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

function runTests() {
    const modal = document.getElementById('testResultsModal');
    const content = document.getElementById('testResultsContent');
    if (!modal || !content) return;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    content.innerHTML = `<div class="empty-state"><span class="icon">⏳</span> جاري تشغيل الاختبارات...</div>`;

    setTimeout(() => {
        const results = [];
        let pass = 0,
            fail = 0;

        try {
            const future = new Date(Date.now() + 10 * 60 * 1000).toISOString();
            const near = new Date(Date.now() + 2 * 60 * 1000).toISOString();
            const past = new Date(Date.now() - 10 * 60 * 1000).toISOString();
            const r1 = canPredict(future) === true;
            const r2 = canPredict(near) === false;
            const r3 = canPredict(past) === false;
            if (r1 && r2 && r3) { pass++;
                results.push('✅ canPredict - صحيح'); } else { fail++;
                results.push('❌ canPredict - فشل'); }
        } catch (e) { fail++;
            results.push('❌ canPredict - استثناء: ' + e.message); }

        try {
            const t1 = translateToArabic('Argentina') === 'الأرجنتين';
            const t2 = translateToArabic('Germany') === 'ألمانيا';
            if (t1 && t2) { pass++;
                results.push('✅ translateToArabic - صحيح'); } else { fail++;
                results.push('❌ translateToArabic - فشل'); }
        } catch (e) { fail++;
            results.push('❌ translateToArabic - استثناء: ' + e.message); }

        try {
            const fakeGames = [{ homeAr: 'البرازيل', awayAr: 'الأرجنتين', homeScore: 2, awayScore: 1 }];
            const original = state ? state.previousGamesData : [];
            if (state) state.previousGamesData = fakeGames;
            const res = findMatchResult('البرازيل', 'الأرجنتين');
            if (state) state.previousGamesData = original;
            if (res && res.homeScore === 2 && res.awayScore === 1) { pass++;
                results.push('✅ findMatchResult - صحيح'); } else { fail++;
                results.push('❌ findMatchResult - فشل'); }
        } catch (e) { fail++;
            results.push('❌ findMatchResult - استثناء: ' + e.message); }

        try {
            const key = 'submitted_matches';
            const old = localStorage.getItem(key);
            localStorage.setItem(key, JSON.stringify(['test1', 'test2']));
            const list = getSubmittedMatches();
            localStorage.setItem(key, old || '[]');
            if (Array.isArray(list) && list.length === 2 && list.includes('test1')) { pass++;
                results.push('✅ getSubmittedMatches - صحيح'); } else { fail++;
                results.push('❌ getSubmittedMatches - فشل'); }
        } catch (e) { fail++;
            results.push('❌ getSubmittedMatches - استثناء: ' + e.message); }

        try {
            const f1 = getFlag('البرازيل') === '🇧🇷';
            const f2 = getFlag('فرنسا') === '🇫🇷';
            if (f1 && f2) { pass++;
                results.push('✅ getFlag - صحيح'); } else { fail++;
                results.push('❌ getFlag - فشل'); }
        } catch (e) { fail++;
            results.push('❌ getFlag - استثناء: ' + e.message); }

        const total = results.length;
        content.innerHTML = `
              <div style="text-align:center;margin-bottom:16px;">
                <div style="font-size:1.2rem;font-weight:800;color:var(--gold-light);">
                  ${pass} ✅ نجاح / ${fail} ❌ فشل
                </div>
                <div style="font-size:0.8rem;color:var(--text-secondary);">من أصل ${total} اختبار</div>
              </div>
              <div style="max-height:300px;overflow-y:auto;text-align:right;">
                ${results.map(r => `<div style="padding:4px 8px;border-bottom:1px solid var(--border-subtle);font-size:0.8rem;">${r}</div>`).join('')}
              </div>
              <div style="text-align:center;margin-top:16px;">
                <button class="tab-btn" onclick="document.getElementById('testResultsModal').classList.remove('active');document.body.style.overflow='';" style="background:var(--gold-glow);border-color:var(--border-gold);color:var(--gold-light);">إغلاق</button>
              </div>
            `;
    }, 500);
}

function loadDuplicates() {
    const section = document.getElementById('duplicatesSection');
    const container = document.getElementById('duplicatesContainer');
    const badge = document.getElementById('dupCountBadge');
    if (!section || !container || !badge) return;

    if (section.classList.contains('visible')) {
        section.classList.remove('visible');
        return;
    }

    section.classList.add('visible');
    container.innerHTML = `<div class="duplicates-empty">⏳ جاري البحث عن التكرارات...</div>`;

    if (!supabaseClient) {
        container.innerHTML = `<div class="duplicates-empty">❌ Supabase غير متصل</div>`;
        return;
    }

    supabaseClient
        .from("predictions")
        .select("user_name, match_id, prediction, created_at")
        .order("created_at", { ascending: false })
        .limit(500)
        .then(({ data, error }) => {
            if (error) throw error;

            if (!data || data.length === 0) {
                container.innerHTML = `<div class="duplicates-empty">📭 لا توجد توقعات مسجلة</div>`;
                badge.textContent = '0';
                return;
            }

            const groups = {};
            for (let p of data) {
                const key = `${p.user_name}|${p.match_id}`;
                if (!groups[key]) {
                    groups[key] = [];
                }
                groups[key].push(p);
            }

            const duplicates = {};
            for (let [key, items] of Object.entries(groups)) {
                if (items.length > 1) {
                    const [userName, matchId] = key.split('|');
                    duplicates[key] = {
                        user_name: userName,
                        match_id: matchId,
                        count: items.length,
                        predictions: items.map(p => p.prediction),
                        created_at: items[0].created_at
                    };
                }
            }

            const dupKeys = Object.keys(duplicates);
            badge.textContent = dupKeys.length;

            if (dupKeys.length === 0) {
                container.innerHTML = `<div class="duplicates-empty">✅ لا توجد توقعات مكررة</div>`;
                return;
            }

            let html =
                `<table class="duplicates-table"><thead><tr><th>المستخدم</th><th>المباراة</th><th>التكرار</th><th>التوقعات</th></tr></thead><tbody>`;
            for (let key of dupKeys) {
                const d = duplicates[key];
                const parts = d.match_id ? d.match_id.split('_') : [];
                const team1 = parts.length > 1 ? parts[1] : '?';
                const team2 = parts.length > 2 ? parts[2] : '?';
                const preds = d.predictions.map(p => p === 'DRAW' ? 'تعادل' : p).join(' / ');
                html += `<tr>
                <td class="dup-user">${d.user_name}</td>
                <td class="dup-match">${getFlag(team1)} ${team1} 🆚 ${getFlag(team2)} ${team2}</td>
                <td class="dup-count">${d.count}</td>
                <td class="dup-preds">${preds}</td>
              </tr>`;
            }
            html += `</tbody></table>`;
            container.innerHTML = html;
        })
        .catch(e => {
            console.error("❌ جلب التكرارات:", e);
            container.innerHTML = `<div class="duplicates-empty">❌ حدث خطأ: ${e.message}</div>`;
        });
}

function openAnalytics() {
    const modal = document.getElementById('analyticsModal');
    if (!modal) return;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    populatePlayerAnalyticsSelect();
    renderMatchAnalytics();

    setTimeout(() => {
        generateAnalyticsCharts();
        const select = document.getElementById('playerAnalyticsSelect');
        if (select && select.value) {
            updatePlayerAnalytics();
        }
    }, 300);
}

function populatePlayerAnalyticsSelect() {
    const select = document.getElementById('playerAnalyticsSelect');
    if (!select) return;

    const predictions = state ? state.predictions : [];
    const players = [...new Set(predictions.map(p => p.user_name).filter(Boolean))];
    select.innerHTML = '<option value="">-- اختر لاعباً --</option>';
    players.forEach(p => {
        select.innerHTML += `<option value="${p}">${p}</option>`;
    });
    const currentUser = getLastUserName();
    if (players.includes(currentUser)) {
        select.value = currentUser;
    }
}

function renderMatchAnalytics() {
    const grid = document.getElementById('matchAnalyticsGrid');
    if (!grid) return;

    const predictions = state ? state.predictions : [];
    const games = state && state.previousGamesData ? state.previousGamesData : [];

    if (!predictions.length || !games.length) {
        grid.innerHTML = `<div class="empty-state"><span class="icon">📊</span> لا توجد بيانات كافية</div>`;
        return;
    }

    const matchStats = {};
    for (let p of predictions) {
        const parts = p.match_id ? p.match_id.split('_') : [];
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

function generateAnalyticsCharts() {
    const predictions = state ? state.predictions : [];
    const games = state && state.previousGamesData ? state.previousGamesData : [];

    if (!predictions.length || !games.length) {
        const content = document.getElementById('analyticsContent');
        if (content) {
            content.innerHTML = `
              <div class="empty-state"><span class="icon">📊</span> لا توجد بيانات كافية للتحليل</div>
              <div style="text-align:center;margin-top:12px;">
                <button class="tab-btn" onclick="document.getElementById('analyticsModal').classList.remove('active');document.body.style.overflow='';" style="background:var(--gold-glow);border-color:var(--border-gold);color:var(--gold-light);">إغلاق</button>
              </div>
            `;
        }
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
        const parts = p.match_id ? p.match_id.split('_') : [];
        if (parts.length < 3) continue;
        const team1 = parts[1],
            team2 = parts[2];
        const result = findMatchResult(team1, team2);
        let winner = null;
        if (result) {
            winner = determineWinner(result);
        }
        let isCorrect = false;
        if (winner === null && result) {
            isCorrect = p.prediction === 'DRAW';
        } else if (winner) {
            isCorrect = p.prediction === winner;
        }
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
        const parts = p.match_id ? p.match_id.split('_') : [];
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
        const parts = p.match_id ? p.match_id.split('_') : [];
        if (parts.length < 3) continue;
        const team1 = parts[1],
            team2 = parts[2];
        const result = findMatchResult(team1, team2);
        let winner = null;
        if (result) {
            winner = determineWinner(result);
        }
        let isCorrect = false;
        if (winner === null && result) {
            isCorrect = p.prediction === 'DRAW';
        } else if (winner) {
            isCorrect = p.prediction === winner;
        }
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

    // حفظ مراجع الرسوم البيانية
    if (chartInstancesLocal.predDist) chartInstancesLocal.predDist.destroy();
    if (chartInstancesLocal.points) chartInstancesLocal.points.destroy();
    if (chartInstancesLocal.pop) chartInstancesLocal.pop.destroy();
    if (chartInstancesLocal.acc) chartInstancesLocal.acc.destroy();

    const ctx1 = document.getElementById('chartPlayerDistribution');
    if (ctx1) {
        chartInstancesLocal.predDist = new Chart(ctx1.getContext('2d'), {
            type: 'bar',
            data: {
                labels: predLabels,
                datasets: [{
                    label: 'عدد التوقعات',
                    data: predData,
                    backgroundColor: 'rgba(212, 167, 69, 0.6)',
                    borderColor: 'rgba(212, 167, 69, 1)',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: { color: '#8a9bb5', font: { family: 'Cairo' } }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#8a9bb5', font: { family: 'Cairo', size: 9 } },
                        grid: { color: 'rgba(255,255,255,0.04)' }
                    },
                    y: {
                        ticks: { color: '#8a9bb5' },
                        grid: { color: 'rgba(255,255,255,0.04)' },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    const ctx2 = document.getElementById('chartPoints');
    if (ctx2) {
        const colors = ['#d4a745', '#4a9eff', '#2ecc71', '#e74c3c', '#9b59b6'];
        const datasets = topUsers.map((user, idx) => ({
            label: user[0],
            data: user[1],
            borderColor: colors[idx % colors.length],
            backgroundColor: colors[idx % colors.length] + '33',
            fill: true,
            tension: 0.3,
            pointRadius: 2,
            pointBackgroundColor: colors[idx % colors.length]
        }));

        chartInstancesLocal.points = new Chart(ctx2.getContext('2d'), {
            type: 'line',
            data: {
                labels: pointLabels,
                datasets: datasets
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: { color: '#8a9bb5', font: { family: 'Cairo', size: 10 } }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#8a9bb5', font: { family: 'Cairo', size: 8 } },
                        grid: { color: 'rgba(255,255,255,0.04)' }
                    },
                    y: {
                        ticks: { color: '#8a9bb5' },
                        grid: { color: 'rgba(255,255,255,0.04)' },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    const ctx3 = document.getElementById('chartPopular');
    if (ctx3) {
        chartInstancesLocal.pop = new Chart(ctx3.getContext('2d'), {
            type: 'bar',
            data: {
                labels: popLabels,
                datasets: [{
                    label: 'عدد التوقعات',
                    data: popData,
                    backgroundColor: 'rgba(212, 167, 69, 0.5)',
                    borderColor: 'rgba(212, 167, 69, 1)',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: { color: '#8a9bb5', font: { family: 'Cairo' } }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#8a9bb5', font: { family: 'Cairo', size: 9 } },
                        grid: { color: 'rgba(255,255,255,0.04)' }
                    },
                    y: {
                        ticks: { color: '#8a9bb5' },
                        grid: { color: 'rgba(255,255,255,0.04)' },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    const ctx4 = document.getElementById('chartAccuracy');
    if (ctx4) {
        chartInstancesLocal.acc = new Chart(ctx4.getContext('2d'), {
            type: 'bar',
            data: {
                labels: accLabels,
                datasets: [{
                    label: 'نسبة التوقعات الصحيحة (%)',
                    data: accData,
                    backgroundColor: 'rgba(46, 204, 113, 0.6)',
                    borderColor: 'rgba(46, 204, 113, 1)',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: { color: '#8a9bb5', font: { family: 'Cairo' } }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#8a9bb5', font: { family: 'Cairo', size: 9 } },
                        grid: { color: 'rgba(255,255,255,0.04)' }
                    },
                    y: {
                        ticks: { color: '#8a9bb5' },
                        grid: { color: 'rgba(255,255,255,0.04)' },
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    // تحديث المحتوى مع الرسوم البيانية
    const content = document.getElementById('analyticsContent');
    if (content) {
        content.innerHTML = `
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
              <div class="match-analytics-grid" id="matchAnalyticsGrid"></div>
            </div>
            <div style="text-align:center;margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">
              <button class="tab-btn" onclick="document.getElementById('analyticsModal').classList.remove('active');document.body.style.overflow='';" style="background:var(--gold-glow);border-color:var(--border-gold);color:var(--gold-light);">إغلاق</button>
            </div>
          `;

        // إعادة إنشاء الرسوم البيانية بعد تحديث المحتوى
        setTimeout(() => {
            generateAnalyticsCharts();
            populatePlayerAnalyticsSelect();
            renderMatchAnalytics();
            const select = document.getElementById('playerAnalyticsSelect');
            if (select && select.value) {
                updatePlayerAnalytics();
            }
        }, 100);
    }
}

function updatePlayerAnalytics() {
    const select = document.getElementById('playerAnalyticsSelect');
    const playerName = select ? select.value : '';
    const detailsDiv = document.getElementById('playerAnalyticsDetails');
    if (!detailsDiv) return;

    if (!playerName) {
        detailsDiv.style.display = 'none';
        return;
    }

    const predictions = state ? state.predictions : [];
    const games = state && state.previousGamesData ? state.previousGamesData : [];

    const playerPreds = predictions.filter(p => p.user_name === playerName);
    if (playerPreds.length === 0) {
        detailsDiv.innerHTML = `<div class="empty-state"><span class="icon">📭</span> لا توجد توقعات لهذا اللاعب</div>`;
        detailsDiv.style.display = 'block';
        return;
    }

    let total = playerPreds.length;
    let correct = 0,
        wrong = 0,
        points = 0;
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
    const remainingMatches = typeof matchesData !== 'undefined' ? matchesData.filter(m => (matchTime(m.timeISO) + MATCH_DURATION) > now()).length : 0;
    const avgPointsPerPred = total > 0 ? points / total : 0;
    const futurePoints = points + (avgPointsPerPred * remainingMatches);

    const futureRanks = Object.values(allStats).map(p => {
        const pAvg = p.total > 0 ? p.points / p.total : 0;
        const pFuture = p.points + (pAvg * remainingMatches);
        return { name: p.name, futurePoints: pFuture };
    }).sort((a, b) => b.futurePoints - a.futurePoints);

    const predictedRank = futureRanks.findIndex(p => p.name === playerName) + 1;
    const currentRank = Object.values(allStats).sort((a, b) => b.points - a.points).findIndex(p => p.name === playerName) + 1;

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

function getAllPlayersStats() {
    const stats = {};
    const predictions = state ? state.predictions : [];

    for (let p of predictions) {
        if (!stats[p.user_name]) {
            stats[p.user_name] = { name: p.user_name, points: 0, correct: 0, wrong: 0, total: 0, predictions: [] };
        }
        stats[p.user_name].total++;
        const parts = (p.match_id || "").split("_");
        if (parts.length < 3) continue;
        const team1 = parts[1],
            team2 = parts[2];

        const result = findMatchResult(team1, team2);
        let winner = null;
        if (result) {
            winner = determineWinner(result);
        }
        let isCorrect = false;
        if (winner === null && result) {
            isCorrect = p.prediction === 'DRAW';
        } else if (winner) {
            isCorrect = p.prediction === winner;
        }
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

function openCompareModal(selectedPlayer) {
    const modal = document.getElementById('compareModal');
    if (!modal) return;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const players = Object.keys(getAllPlayersStats());
    const select1 = document.getElementById('compareSelect1');
    const select2 = document.getElementById('compareSelect2');

    if (select1) {
        select1.innerHTML = '<option value="">اختر لاعباً</option>';
        players.forEach(p => {
            select1.innerHTML += `<option value="${p}">${p}</option>`;
        });
    }

    if (select2) {
        select2.innerHTML = '<option value="">اختر لاعباً</option>';
        players.forEach(p => {
            select2.innerHTML += `<option value="${p}">${p}</option>`;
        });
    }

    if (selectedPlayer && select1) {
        select1.value = selectedPlayer;
        const other = players.find(p => p !== selectedPlayer) || '';
        if (select2) select2.value = other;
    }

    renderCompare();
}

function closeCompareModal() {
    document.getElementById('compareModal').classList.remove('active');
    document.body.style.overflow = '';
}

function renderCompare() {
    const p1 = document.getElementById('compareSelect1') ? document.getElementById('compareSelect1').value : '';
    const p2 = document.getElementById('compareSelect2') ? document.getElementById('compareSelect2').value : '';
    const stats = getAllPlayersStats();

    const div1 = document.getElementById('compareStats1');
    const name1 = document.getElementById('compareName1');

    if (p1 && stats[p1]) {
        const s = stats[p1];
        const acc = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
        if (name1) name1.innerHTML = `👤 ${p1}`;
        if (div1) {
            div1.innerHTML = `
              <div class="stat-row"><span class="label">🏆 النقاط</span><span class="value gold">${s.points}</span></div>
              <div class="stat-row"><span class="label">✅ صحيحة</span><span class="value green">${s.correct}</span></div>
              <div class="stat-row"><span class="label">❌ خاطئة</span><span class="value red">${s.wrong}</span></div>
              <div class="stat-row"><span class="label">📊 عدد التوقعات الكلي</span><span class="value">${s.total}</span></div>
              <div class="stat-row"><span class="label">🎯 نسبة النجاح</span><span class="value gold">${acc}%</span></div>
            `;
        }
    } else {
        if (name1) name1.innerHTML = '👤 لاعب 1';
        if (div1) div1.innerHTML = `<div class="empty-state"><span class="icon">⏳</span> اختر لاعباً</div>`;
    }

    const div2 = document.getElementById('compareStats2');
    const name2 = document.getElementById('compareName2');

    if (p2 && stats[p2]) {
        const s = stats[p2];
        const acc = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
        if (name2) name2.innerHTML = `👤 ${p2}`;
        if (div2) {
            div2.innerHTML = `
              <div class="stat-row"><span class="label">🏆 النقاط</span><span class="value gold">${s.points}</span></div>
              <div class="stat-row"><span class="label">✅ صحيحة</span><span class="value green">${s.correct}</span></div>
              <div class="stat-row"><span class="label">❌ خاطئة</span><span class="value red">${s.wrong}</span></div>
              <div class="stat-row"><span class="label">📊 عدد التوقعات الكلي</span><span class="value">${s.total}</span></div>
              <div class="stat-row"><span class="label">🎯 نسبة النجاح</span><span class="value gold">${acc}%</span></div>
            `;
        }
    } else {
        if (name2) name2.innerHTML = '👤 لاعب 2';
        if (div2) div2.innerHTML = `<div class="empty-state"><span class="icon">⏳</span> اختر لاعباً</div>`;
    }
}

// ربط أحداث لوحة الإدارة
document.addEventListener('DOMContentLoaded', function() {
    // زر كلمة السر
    const submitBtn = document.getElementById('passwordSubmitBtn');
    if (submitBtn) submitBtn.addEventListener('click', checkPassword);

    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') checkPassword();
            if (e.key === 'Escape') hidePasswordOverlay();
        });
    }

    const closeBtn = document.getElementById('passwordCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', hidePasswordOverlay);

    const overlay = document.getElementById('passwordOverlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) hidePasswordOverlay();
        });
    }

    // زر تحليل
    const analyticsBtn = document.querySelector('.admin-btn[onclick="openAnalytics()"]');
    if (analyticsBtn) analyticsBtn.addEventListener('click', openAnalytics);

    // زر مقارنة
    const compareBtn = document.querySelector('.admin-btn[onclick="openCompareModal()"]');
    if (compareBtn) compareBtn.addEventListener('click', openCompareModal);

    // إغلاق نافذة التحليلات
    const analyticsClose = document.getElementById('analyticsCloseBtn');
    if (analyticsClose) {
        analyticsClose.addEventListener('click', function() {
            document.getElementById('analyticsModal').classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    const analyticsModal = document.getElementById('analyticsModal');
    if (analyticsModal) {
        analyticsModal.addEventListener('click', function(e) {
            if (e.target === this) {
                document.getElementById('analyticsModal').classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // إغلاق نافذة المقارنة
    const compareClose = document.getElementById('compareModalCloseBtn');
    if (compareClose) compareClose.addEventListener('click', closeCompareModal);

    const compareModal = document.getElementById('compareModal');
    if (compareModal) {
        compareModal.addEventListener('click', function(e) {
            if (e.target === this) closeCompareModal();
        });
    }

    // إغلاق نافذة الاختبارات
    const testClose = document.getElementById('testResultsCloseBtn');
    if (testClose) {
        testClose.addEventListener('click', function() {
            document.getElementById('testResultsModal').classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // زر إظهار كلمة السر عند النقر على الفوتر
    const footer = document.getElementById('footerTrigger');
    if (footer) {
        footer.addEventListener('click', function(e) {
            e.preventDefault();
            if (isAuthorized) {
                const shareContainer = document.getElementById('shareAllContainer');
                const adminControls = document.getElementById('adminControls');
                if (shareContainer) shareContainer.classList.toggle('visible');
                if (adminControls) adminControls.classList.toggle('visible');
                if (shareContainer && shareContainer.classList.contains('visible')) {
                    updateShareAllCount();
                    showCopyToast('🔓 تم إظهار لوحة الإدارة');
                } else {
                    showCopyToast('🔒 تم إخفاء لوحة الإدارة');
                }
            } else {
                showPasswordOverlay();
            }
        });
    }
});