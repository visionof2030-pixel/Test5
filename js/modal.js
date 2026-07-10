// ============================================================
//  إدارة النوافذ المنبثقة
// ============================================================

function closePredictionModal() {
    document.getElementById('predictionModal').classList.remove('active');
    document.body.style.overflow = '';
    window.isEditing = false;
}

function closeViewPredictionsModal() {
    document.getElementById('viewPredictionsModal').classList.remove('active');
    document.body.style.overflow = '';
}

function closePlayerPredictionsModal() {
    document.getElementById('playerPredictionsModal').classList.remove('active');
    document.body.style.overflow = '';
}

function closeMatchPredictionsModal() {
    document.getElementById('matchPredictionsModal').classList.remove('active');
    document.body.style.overflow = '';
}

function closeTeamStatsModal() {
    document.getElementById('teamStatsModal').classList.remove('active');
    document.body.style.overflow = '';
}

function openTeamStatsModal(team1, team2) {
    const modal = document.getElementById('teamStatsModal');
    const content = document.getElementById('teamStatsContent');
    if (!modal || !content) return;

    const stats1 = getTeamStatsFull(team1);
    const stats2 = getTeamStatsFull(team2);

    const getResultSymbol = (teamName, game) => {
        const result = findMatchResult(game.homeAr, game.awayAr);
        if (!result) return '⏳';
        const winner = determineWinner(result);
        if (winner === teamName) return '✅';
        else if (winner === null || winner === 'DRAW') return '➖';
        else return '❌';
    };

    const getStreakHtml = (teamName, games) => {
        const teamGames = games.filter(g => g.homeAr === teamName || g.awayAr === teamName);
        const recentGames = teamGames.slice(-10);
        return recentGames.map(g => getResultSymbol(teamName, g)).join(' ');
    };

    const getScorersHtml = (teamName) => {
        const scorers = getTeamScorers(teamName);
        if (scorers.length === 0) return '<span style="color:var(--text-secondary);font-size:0.6rem;">لا توجد أهداف مسجلة</span>';
        return scorers.map(s => 
            `<span class="scorer" style="display:inline-block;background:var(--gold-glow);padding:1px 8px;border-radius:20px;border:1px solid var(--border-gold);margin:2px;font-size:0.6rem;">⚽ ${s.name} <span class="goals" style="color:var(--gold-light);font-weight:700;">${s.goals}</span></span>`
        ).join('');
    };

    const allGames = state && state.previousGamesData ? state.previousGamesData : [];

    const streak1 = getStreakHtml(team1, allGames);
    const goalsFor1 = stats1.goalsFor || 0;
    const goalsAgainst1 = stats1.goalsAgainst || 0;
    const wins1 = stats1.wins || 0;
    const losses1 = stats1.losses || 0;
    const draws1 = stats1.draws || 0;
    const total1 = stats1.total || 0;

    const streak2 = getStreakHtml(team2, allGames);
    const goalsFor2 = stats2.goalsFor || 0;
    const goalsAgainst2 = stats2.goalsAgainst || 0;
    const wins2 = stats2.wins || 0;
    const losses2 = stats2.losses || 0;
    const draws2 = stats2.draws || 0;
    const total2 = stats2.total || 0;

    const scorers1 = getScorersHtml(team1);
    const scorers2 = getScorersHtml(team2);

    content.innerHTML = `
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:8px;">
                <div style="background:rgba(255,255,255,0.02);border-radius:var(--radius-md);padding:16px;border:1px solid var(--border-subtle);">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;border-bottom:1px solid var(--border-gold);padding-bottom:8px;">
                    <span style="font-size:1.5rem;">${getFlag(team1)}</span>
                    <span style="font-weight:800;font-size:1rem;color:var(--gold-light);">${team1}</span>
                  </div>
                  
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:0.7rem;margin-bottom:8px;">
                    <div><span style="color:var(--text-secondary);">🏆 فوز:</span> <strong style="color:var(--success);">${wins1}</strong></div>
                    <div><span style="color:var(--text-secondary);">❌ خسارة:</span> <strong style="color:var(--danger);">${losses1}</strong></div>
                    <div><span style="color:var(--text-secondary);">➖ تعادل:</span> <strong style="color:var(--gold-light);">${draws1}</strong></div>
                    <div><span style="color:var(--text-secondary);">📊 مباريات:</span> <strong>${total1}</strong></div>
                    <div><span style="color:var(--text-secondary);">⚽ أهداف له:</span> <strong style="color:var(--gold-light);">${goalsFor1}</strong></div>
                    <div><span style="color:var(--text-secondary);">⚽ أهداف عليه:</span> <strong style="color:var(--danger);">${goalsAgainst1}</strong></div>
                  </div>
                  
                  <div style="margin-top:8px;border-top:1px solid var(--border-subtle);padding-top:8px;">
                    <div style="font-size:0.6rem;color:var(--text-secondary);margin-bottom:4px;">📈 سلسلة النتائج (آخر 10 مباريات):</div>
                    <div style="font-size:1rem;letter-spacing:2px;word-break:break-all;">${streak1 || 'لا توجد مباريات سابقة'}</div>
                  </div>
                  
                  <div style="margin-top:8px;border-top:1px solid var(--border-subtle);padding-top:8px;">
                    <div style="font-size:0.6rem;color:var(--text-secondary);margin-bottom:4px;">⚽ الهدافون:</div>
                    <div style="display:flex;flex-wrap:wrap;gap:4px;">${scorers1}</div>
                  </div>
                </div>
                
                <div style="background:rgba(255,255,255,0.02);border-radius:var(--radius-md);padding:16px;border:1px solid var(--border-subtle);">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;border-bottom:1px solid var(--border-gold);padding-bottom:8px;">
                    <span style="font-size:1.5rem;">${getFlag(team2)}</span>
                    <span style="font-weight:800;font-size:1rem;color:var(--gold-light);">${team2}</span>
                  </div>
                  
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:0.7rem;margin-bottom:8px;">
                    <div><span style="color:var(--text-secondary);">🏆 فوز:</span> <strong style="color:var(--success);">${wins2}</strong></div>
                    <div><span style="color:var(--text-secondary);">❌ خسارة:</span> <strong style="color:var(--danger);">${losses2}</strong></div>
                    <div><span style="color:var(--text-secondary);">➖ تعادل:</span> <strong style="color:var(--gold-light);">${draws2}</strong></div>
                    <div><span style="color:var(--text-secondary);">📊 مباريات:</span> <strong>${total2}</strong></div>
                    <div><span style="color:var(--text-secondary);">⚽ أهداف له:</span> <strong style="color:var(--gold-light);">${goalsFor2}</strong></div>
                    <div><span style="color:var(--text-secondary);">⚽ أهداف عليه:</span> <strong style="color:var(--danger);">${goalsAgainst2}</strong></div>
                  </div>
                  
                  <div style="margin-top:8px;border-top:1px solid var(--border-subtle);padding-top:8px;">
                    <div style="font-size:0.6rem;color:var(--text-secondary);margin-bottom:4px;">📈 سلسلة النتائج (آخر 10 مباريات):</div>
                    <div style="font-size:1rem;letter-spacing:2px;word-break:break-all;">${streak2 || 'لا توجد مباريات سابقة'}</div>
                  </div>
                  
                  <div style="margin-top:8px;border-top:1px solid var(--border-subtle);padding-top:8px;">
                    <div style="font-size:0.6rem;color:var(--text-secondary);margin-bottom:4px;">⚽ الهدافون:</div>
                    <div style="display:flex;flex-wrap:wrap;gap:4px;">${scorers2}</div>
                  </div>
                </div>
              </div>
              <div style="text-align:center;margin-top:16px;">
                <button class="tab-btn" onclick="closeTeamStatsModal()" style="background:var(--gold-glow);border-color:var(--border-gold);color:var(--gold-light);">إغلاق</button>
              </div>
            `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ربط أحداث إغلاق النوافذ المنبثقة
document.addEventListener('DOMContentLoaded', function() {
    // إغلاق نافذة التوقع
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closePredictionModal);
    }

    const predictionModal = document.getElementById('predictionModal');
    if (predictionModal) {
        predictionModal.addEventListener('click', function(e) {
            if (e.target === this) closePredictionModal();
        });
    }

    // إغلاق نافذة استعراض التوقعات
    const viewCloseBtn = document.getElementById('viewModalCloseBtn');
    if (viewCloseBtn) {
        viewCloseBtn.addEventListener('click', closeViewPredictionsModal);
    }

    const viewModal = document.getElementById('viewPredictionsModal');
    if (viewModal) {
        viewModal.addEventListener('click', function(e) {
            if (e.target === this) closeViewPredictionsModal();
        });
    }

    // إغلاق نافذة توقعات اللاعب
    const playerCloseBtn = document.getElementById('playerModalCloseBtn');
    if (playerCloseBtn) {
        playerCloseBtn.addEventListener('click', closePlayerPredictionsModal);
    }

    const playerModal = document.getElementById('playerPredictionsModal');
    if (playerModal) {
        playerModal.addEventListener('click', function(e) {
            if (e.target === this) closePlayerPredictionsModal();
        });
    }

    // إغلاق نافذة توقعات المباراة
    const matchCloseBtn = document.getElementById('matchPredictionsCloseBtn');
    if (matchCloseBtn) {
        matchCloseBtn.addEventListener('click', closeMatchPredictionsModal);
    }

    const matchModal = document.getElementById('matchPredictionsModal');
    if (matchModal) {
        matchModal.addEventListener('click', function(e) {
            if (e.target === this) closeMatchPredictionsModal();
        });
    }

    // إغلاق نافذة إحصائيات الفريقين
    const teamStatsCloseBtn = document.getElementById('teamStatsCloseBtn');
    if (teamStatsCloseBtn) {
        teamStatsCloseBtn.addEventListener('click', closeTeamStatsModal);
    }

    const teamStatsModal = document.getElementById('teamStatsModal');
    if (teamStatsModal) {
        teamStatsModal.addEventListener('click', function(e) {
            if (e.target === this) closeTeamStatsModal();
        });
    }

    // إغلاق جميع النوافذ عند الضغط على Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePredictionModal();
            closeViewPredictionsModal();
            closePlayerPredictionsModal();
            closeMatchPredictionsModal();
            closeTeamStatsModal();
            closeBracketModal();
            closeCompareModal();
            closeNameModal();
            hidePasswordOverlay();
        }
    });
});