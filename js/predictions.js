// ============================================================
//  إدارة التوقعات
// ============================================================

const SUPABASE_URL = "https://szjxwhsmefqpfcebtvei.supabase.co";
const SUPABASE_KEY = "sb_publishable_0um28lgPMHcjDOThT0UgDA_K-Y7Wmx3";

let supabaseClient = null;
try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (e) {
    console.error("Supabase init error", e);
}

let userPredictionsMap = {};
let allPredictionsCache = [];

async function getAllPredictions() {
    const cached = getCache("predictions");
    if (cached && state) {
        state.predictions = cached;
        allPredictionsCache = cached;
        return;
    }
    if (!supabaseClient) {
        if (state) state.predictions = [];
        return;
    }
    try {
        const { data } = await supabaseClient
            .from("predictions")
            .select("*")
            .limit(500);
        const preds = data || [];
        if (state) state.predictions = preds;
        allPredictionsCache = preds;
        setCache("predictions", preds);
    } catch (e) {
        console.warn("⚠️ فشل تحميل التوقعات:", e);
        if (state) state.predictions = [];
    }
}

async function savePrediction(userName, matchId, prediction) {
    if (!supabaseClient) return { success: false, message: "Supabase غير متصل" };

    if (typeof matchesData !== 'undefined') {
        const match = matchesData.find(m => `${m.timeISO}_${m.team1}_${m.team2}` === matchId);
        if (match) {
            if (!canPredict(match.timeISO)) {
                return { success: false,
                    message: "⛔ لا يمكن التوقع الآن، المباراة على وشك البدء أو بدأت بالفعل (يُسمح حتى 5 دقائق قبل البداية)." };
            }
        } else {
            return { success: false, message: "⛔ مباراة غير معروفة" };
        }
    } else {
        return { success: false, message: "⛔ بيانات المباريات غير متوفرة" };
    }

    async function isUserNameExists(userName) {
        if (!supabaseClient || !userName) return false;
        try {
            const { data, error } = await supabaseClient.from("predictions").select("user_name").eq("user_name",
                userName).limit(1);
            if (error) throw error;
            return data && data.length > 0;
        } catch (e) { console.error("❌ التحقق من الاسم:", e); return false; }
    }

    const existing = await getUserPrediction(userName, matchId);

    if (existing) {
        try {
            const { error } = await supabaseClient
                .from("predictions")
                .update({ prediction: prediction, updated_at: new Date().toISOString() })
                .eq("id", existing.id);
            if (error) throw error;
            saveLocalPrediction(userName, matchId, prediction);
            addSubmittedMatch(matchId);
            localStorage.removeItem("predictions");
            await getAllPredictions();
            return { success: true, updated: true };
        } catch (e) { return { success: false, message: e.message }; }
    } else {
        if (isMatchSubmitted(matchId)) {
            return { success: false, message: `⚠️ توقعت مسبقاً هذه المباراة`, duplicate: true };
        }

        const exists = await isUserNameExists(userName);
        if (exists) {
            const storedUserName = localStorage.getItem('lastUserName') || '';
            if (storedUserName !== userName) {
                return { success: false,
                    message: `⚠️ هذا الاسم "${userName}" مسجل لمستخدم آخر. الرجاء استخدام اسم مختلف أو تأكيد أنك أنت صاحب الاسم.` };
            }
        }

        try {
            const { error } = await supabaseClient.from("predictions").insert([{ user_name: userName,
                match_id: matchId, prediction }]);
            if (error) throw error;
            saveLocalPrediction(userName, matchId, prediction);
            addSubmittedMatch(matchId);
            localStorage.removeItem("predictions");
            await getAllPredictions();
            return { success: true, updated: false };
        } catch (e) { return { success: false, message: e.message }; }
    }
}

async function getUserPrediction(userName, matchId) {
    if (!supabaseClient || !userName || !matchId) return null;
    try {
        const { data, error } = await supabaseClient
            .from("predictions")
            .select("*")
            .eq("user_name", userName)
            .eq("match_id", matchId)
            .order("created_at", { ascending: false })
            .limit(1);
        if (error) throw error;
        return data && data.length > 0 ? data[0] : null;
    } catch (e) {
        console.error("❌ جلب توقع المستخدم:", e);
        return null;
    }
}

async function getPredictionsForMatchFull(matchId) {
    if (!supabaseClient || !matchId) return [];
    try {
        const { data, error } = await supabaseClient
            .from("predictions")
            .select("*")
            .eq("match_id", matchId)
            .order("created_at", { ascending: true });
        if (error) throw error;
        return data || [];
    } catch (e) {
        console.error("❌ جلب توقعات المباراة (جميعها):", e);
        return [];
    }
}

async function getPredictionsForUserFull(userName) {
    if (!supabaseClient || !userName) return [];
    try {
        const { data, error } = await supabaseClient
            .from("predictions")
            .select("*")
            .eq("user_name", userName)
            .order("created_at", { ascending: true });
        if (error) throw error;
        return data || [];
    } catch (e) {
        console.error("❌ جلب توقعات اللاعب (جميعها):", e);
        return [];
    }
}

function getPredictionStatus(prediction) {
    if (!prediction || !prediction.match_id) {
        return { status: 'pending', text: '⏳ مباراة غير معروفة', color: 'var(--gold-light)' };
    }

    const parts = prediction.match_id.split('_');
    if (parts.length < 3) {
        return { status: 'pending', text: '⏳ بيانات غير مكتملة', color: 'var(--gold-light)' };
    }

    const team1 = parts[1];
    const team2 = parts[2];

    const result = findMatchResult(team1, team2);

    if (!result) {
        if (typeof matchesData !== 'undefined') {
            const match = matchesData.find(m =>
                (m.team1 === team1 && m.team2 === team2) ||
                (m.team1 === team2 && m.team2 === team1)
            );
            if (match && isMatchFinished(match.timeISO)) {
                return { status: 'pending', text: '⏳ لم يتم تحديد النتيجة بعد', color: 'var(--gold-light)' };
            }
        }
        return { status: 'pending', text: '⏳ المباراة لم تلعب بعد', color: 'var(--gold-light)' };
    }

    const correctResult = determineWinner(result);

    if (!correctResult) {
        if (prediction.prediction === 'DRAW') {
            return { status: 'correct', text: '✅ توقع صحيح (تعادل)', color: 'var(--success)' };
        } else {
            return { status: 'wrong', text: `❌ خاطئ (النتيجة تعادل)`, color: 'var(--danger)' };
        }
    }

    const isCorrect = prediction.prediction === correctResult;

    if (isCorrect) {
        return { status: 'correct', text: '✅ توقع صحيح', color: 'var(--success)' };
    } else {
        return { status: 'wrong', text: `❌ خاطئ (الفائز: ${correctResult})`, color: 'var(--danger)' };
    }
}

async function loadUserPredictions(userName) {
    if (!supabaseClient || !userName) return;
    try {
        const { data, error } = await supabaseClient
            .from("predictions")
            .select("match_id")
            .eq("user_name", userName);
        if (error) throw error;
        userPredictionsMap = {};
        if (data && data.length) {
            data.forEach(p => {
                userPredictionsMap[p.match_id] = true;
            });
        }
        if (state) state.userPredictionsMap = userPredictionsMap;
        renderUpcoming();
    } catch (e) {
        console.error("❌ جلب توقعات المستخدم:", e);
        userPredictionsMap = {};
    }
}

async function renderAllPredictions() {
    const container = document.getElementById('allPredictions');
    const countSpan = document.getElementById('predictionsCount');
    if (!container) return;

    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from("predictions")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(200);
            if (!error && data) {
                if (state) state.predictions = data;
                allPredictionsCache = data;
                setCache("predictions", data);
            }
        } catch (e) {
            console.warn("⚠️ فشل جلب أحدث التوقعات:", e);
        }
    }

    let predictions = state ? state.predictions : [];
    if (!predictions || predictions.length === 0) {
        predictions = allPredictionsCache;
    }
    countSpan.textContent = predictions.length;

    if (!predictions || predictions.length === 0) {
        container.innerHTML = `<div class="empty-state"><span class="icon">📭</span> لا توجد توقعات بعد</div>`;
        return;
    }

    const sorted = [...predictions].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
        const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
        return dateB - dateA;
    });

    const displayPredictions = sorted.slice(0, 100);

    container.innerHTML = displayPredictions.map(p => {
        const parts = p.match_id ? p.match_id.split('_') : [];
        const team1 = parts.length > 1 ? parts[1] : '?';
        const team2 = parts.length > 2 ? parts[2] : '?';

        let predictionText = '';
        if (p.prediction === 'DRAW') {
            predictionText = `🤝 تعادل`;
        } else if (p.prediction === team1) {
            predictionText = `🏆 فوز ${getFlag(team1)} ${team1}`;
        } else if (p.prediction === team2) {
            predictionText = `🏆 فوز ${getFlag(team2)} ${team2}`;
        } else {
            predictionText = `🔮 ${p.prediction}`;
        }

        const status = getPredictionStatus(p);
        let cardClass = 'pending';
        let badgeClass = 'pending';
        if (status.status === 'correct') {
            cardClass = 'correct';
            badgeClass = 'correct';
        } else if (status.status === 'wrong') {
            cardClass = 'wrong';
            badgeClass = 'wrong';
        }

        const timeStr = p.created_at ? formatDate(p.created_at) : 'تاريخ غير معروف';

        return `<div class="prediction-card ${cardClass}" onclick="openPlayerPredictions('${p.user_name || ''}')" style="cursor:pointer;">
                    <div class="user">
                        <div class="avatar-p">${p.user_name ? p.user_name.charAt(0).toUpperCase() : '👤'}</div>
                        <span class="name-p">${p.user_name || 'مجهول'}</span>
                    </div>
                    <div class="prediction-text">${getFlag(team1)} ${team1} 🆚 ${getFlag(team2)} ${team2}</div>
                    <div class="prediction-text" style="color:var(--gold-light);">🔮 ${predictionText}</div>
                    <span class="status-badge ${badgeClass}">${status.text}</span>
                    <div style="font-size:0.6rem;color:var(--text-secondary);margin-top:4px;">🕒 ${timeStr}</div>
                </div>`;
    }).join('');
}

async function openPlayerPredictions(userName) {
    if (!userName) { showCopyToast('⚠️ اسم المستخدم غير معروف'); return; }
    document.getElementById('playerModalName').textContent = userName;
    const listContainer = document.getElementById('playerPredictionsList');
    const correctSpan = document.getElementById('playerCorrectCount');
    const wrongSpan = document.getElementById('playerWrongCount');
    const totalSpan = document.getElementById('playerTotalCount');
    if (!listContainer) return;

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
        const parts = p.match_id ? p.match_id.split('_') : [];
        const team1 = parts.length > 1 ? parts[1] : '?';
        const team2 = parts.length > 2 ? parts[2] : '?';
        let predText = '';
        if (p.prediction === 'DRAW') {
            predText = `تعادل`;
        } else if (p.prediction === team1) {
            predText = `فوز ${team1}`;
        } else if (p.prediction === team2) {
            predText = `فوز ${team2}`;
        } else {
            predText = p.prediction;
        }
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

async function openMatchPredictions(matchId, team1, team2, homeScore, awayScore) {
    if (!state || !state.loaded) {
        await loadPreviousGamesFull();
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

    const isAuthorized = window.isAuthorized || false;
    if (isAuthorized) {
        document.getElementById('modalCompactBtn').classList.add('visible');
    } else {
        document.getElementById('modalCompactBtn').classList.remove('visible');
    }

    const scorersDiv = document.getElementById('mpScorersDetail');
    let scorersHtml = '';
    if (state && state.openfootballMatches) {
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
    }
    scorersDiv.innerHTML = scorersHtml;

    const correctSpan = document.getElementById('mpCorrectCount');
    const wrongSpan = document.getElementById('mpWrongCount');
    const totalSpan = document.getElementById('mpTotalCount');
    const tbody = document.getElementById('predictionsTableBody');
    if (!tbody) return;

    tbody.innerHTML =
        `<tr><td colspan="4" style="text-align:center;padding:20px;color:var(--text-secondary);">⏳ جاري التحميل...</td></tr>`;
    correctSpan.textContent = '...';
    wrongSpan.textContent = '...';
    totalSpan.textContent = '...';

    let predictions = state ? state.predictions : [];
    if (!predictions || !predictions.length) {
        await getAllPredictions();
        predictions = state ? state.predictions : [];
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

    let result2 = findMatchResult(team1, team2);
    let correctResult = null;
    if (result2) {
        correctResult = determineWinner(result2);
        if (!correctResult) correctResult = "DRAW";
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

function openEditPredictionModal(matchId, team1, team2, timeISO) {
    if (isMatchFinished(timeISO)) { showCopyToast('⛔ هذه المباراة انتهت، لا يمكن تعديل التوقع.'); return; }
    if (!canPredict(timeISO)) { showCopyToast(
            '⛔ لا يمكن تعديل التوقع الآن، المباراة على وشك البدء أو بدأت بالفعل (يُسمح حتى 5 دقائق قبل البداية).'
        ); return; }

    const savedUserName = getLastUserName();
    if (!savedUserName) {
        showCopyToast('⚠️ الرجاء تسجيل اسمك أولاً');
        return;
    }

    getUserPrediction(savedUserName, matchId).then(existing => {
        if (!existing) {
            showCopyToast('⚠️ لا يوجد توقع سابق لهذه المباراة');
            return;
        }

        window.isEditing = true;
        window.currentMatchId = matchId;
        window.currentTeam1 = team1;
        window.currentTeam2 = team2;
        window.currentTimeISO = timeISO;
        window.currentUserName = savedUserName;

        const match = getMatchById(matchId);
        const isKnockout = isKnockoutMatch(match);

        document.getElementById('modalTitle').textContent = '✏️ تعديل توقع المباراة';
        document.getElementById('greetingName').textContent = savedUserName;
        document.getElementById('modalUserGreeting').style.display = 'block';
        document.getElementById('modalTeam1').textContent = team1;
        document.getElementById('modalTeam2').textContent = team2;
        document.getElementById('optTeam1').textContent = team1;
        document.getElementById('optTeam2').textContent = team2;
        document.getElementById('modalFlag1').textContent = getFlag(team1);
        document.getElementById('modalFlag2').textContent = getFlag(team2);
        document.getElementById('modalDateTime').textContent = `📅 ${getDateTimeDisplay(timeISO)} (بتوقيت السعودية)`;

        const drawOption = document.getElementById('drawOption');
        if (isKnockout) {
            drawOption.style.display = 'none';
            const drawRadio = document.querySelector('input[name="prediction"][value="DRAW"]');
            if (drawRadio) drawRadio.checked = false;
        } else {
            drawOption.style.display = 'block';
        }

        const currentPrediction = existing.prediction;
        document.querySelectorAll('input[name="prediction"]').forEach(el => {
            const val = el.value;
            if (val === 'HOME' && currentPrediction === team1) el.checked = true;
            else if (val === 'AWAY' && currentPrediction === team2) el.checked = true;
            else if (val === 'DRAW' && currentPrediction === 'DRAW') el.checked = true;
        });

        const msgEl = document.getElementById('modalMessage');
        let predDisplay = currentPrediction === 'DRAW' ? 'تعادل' : currentPrediction;
        msgEl.textContent = `✏️ تعديل توقعك الحالي: ${predDisplay}`;
        msgEl.className = 'modal-message info';

        document.getElementById('modalSubmitBtn').disabled = false;
        document.getElementById('modalSubmitBtn').textContent = '💾 تحديث التوقع';

        document.getElementById('predictionModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

function openViewPredictionsModal(matchId, team1, team2) {
    document.getElementById('viewTeam1').textContent = team1;
    document.getElementById('viewTeam2').textContent = team2;
    document.getElementById('viewFlag1').textContent = getFlag(team1);
    document.getElementById('viewFlag2').textContent = getFlag(team2);
    document.getElementById('probTeam1').textContent = team1;
    document.getElementById('probTeam2').textContent = team2;
    const listContainer = document.getElementById('viewPredictionsList');
    const countSpan = document.getElementById('viewPredictionsCount');
    if (!listContainer) return;

    listContainer.innerHTML = `<div class="empty-state"><span class="icon">⏳</span> جاري التحميل...</div>`;
    countSpan.textContent = '...';

    getPredictionsForMatchFull(matchId).then(predictions => {
        countSpan.textContent = predictions.length;

        let homeCount = 0,
            awayCount = 0,
            drawCount = 0;
        for (let p of predictions) {
            if (p.prediction === team1) homeCount++;
            else if (p.prediction === team2) awayCount++;
            else if (p.prediction === 'DRAW') drawCount++;
        }
        const totalPreds = predictions.length;
        const homePercent = totalPreds > 0 ? (homeCount / totalPreds) * 100 : 0;
        const awayPercent = totalPreds > 0 ? (awayCount / totalPreds) * 100 : 0;

        document.getElementById('probHomePercent').textContent = homePercent.toFixed(1) + '%';
        document.getElementById('probAwayPercent').textContent = awayPercent.toFixed(1) + '%';

        const homeSegment = document.querySelector('#probBar .segment.home');
        const awaySegment = document.querySelector('#probBar .segment.away');
        if (homeSegment) {
            homeSegment.style.width = homePercent + '%';
            homeSegment.textContent = homePercent.toFixed(0) + '%';
        }
        if (awaySegment) {
            awaySegment.style.width = awayPercent + '%';
            awaySegment.textContent = awayPercent.toFixed(0) + '%';
        }

        const drawSegment = document.querySelector('#probBar .segment.draw');
        if (drawSegment) drawSegment.style.display = 'none';

        if (totalPreds === 0) {
            if (homeSegment) { homeSegment.style.width = '50%';
                homeSegment.textContent = '0%'; }
            if (awaySegment) { awaySegment.style.width = '50%';
                awaySegment.textContent = '0%'; }
        }

        if (!predictions || predictions.length === 0) {
            listContainer.innerHTML =
                `<div class="empty-state"><span class="icon">📭</span> لا توجد توقعات لهذه المباراة</div>`;
        } else {
            let html = '';
            predictions.forEach((p, idx) => {
                let text = '';
                if (p.prediction === 'DRAW') {
                    text = '🤝 تعادل الفريقين';
                } else {
                    text = `🏆 فوز ${getFlag(p.prediction)} ${p.prediction}`;
                }
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
    });
}

// نافذة إدخال الاسم
let nameModalMatchId = '',
    nameModalTeam1 = '',
    nameModalTeam2 = '',
    nameModalTimeISO = '';
let isNameVerified = false;

function openNameModal(matchId, team1, team2, timeISO) {
    if (isMatchFinished(timeISO)) { showCopyToast('⛔ هذه المباراة انتهت، لا يمكن التوقع.'); return; }
    if (!canPredict(timeISO)) { showCopyToast(
            '⛔ لا يمكن التوقع الآن، المباراة على وشك البدء أو بدأت بالفعل (يُسمح حتى 5 دقائق قبل البداية).'); return; }

    nameModalMatchId = matchId;
    nameModalTeam1 = team1;
    nameModalTeam2 = team2;
    nameModalTimeISO = timeISO;
    isNameVerified = false;

    const nameInput = document.getElementById('nameInput');
    if (nameInput) nameInput.value = getLastUserName();
    document.getElementById('nameStatus').style.display = 'none';
    document.getElementById('nameError').textContent = '';
    document.getElementById('nameSubmitBtn').disabled = false;
    document.getElementById('nameSubmitBtn').textContent = 'متابعة →';

    document.getElementById('nameModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        if (nameInput) nameInput.focus();
    }, 300);
}

function closeNameModal() {
    document.getElementById('nameModal').classList.remove('active');
    document.body.style.overflow = '';
    isNameVerified = false;
}

// ربط أحداث نافذة الاسم
document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.getElementById('nameCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeNameModal);

    const nameModal = document.getElementById('nameModal');
    if (nameModal) {
        nameModal.addEventListener('click', function(e) {
            if (e.target === this) closeNameModal();
        });
    }

    const submitBtn = document.getElementById('nameSubmitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', async function() {
            const name = document.getElementById('nameInput').value.trim();
            const errorEl = document.getElementById('nameError');
            const statusEl = document.getElementById('nameStatus');

            if (!name) { errorEl.textContent = '⚠️ الرجاء إدخال اسمك';
                return; }

            if (!supabaseClient) {
                errorEl.textContent = '❌ خطأ في الاتصال بقاعدة البيانات';
                return;
            }

            this.disabled = true;
            this.textContent = '⏳ جاري التحقق...';
            errorEl.textContent = '';
            statusEl.style.display = 'block';

            try {
                const { data, error } = await supabaseClient
                    .from("predictions")
                    .select("user_name")
                    .eq("user_name", name)
                    .limit(1);

                if (error) throw error;

                const isExisting = data && data.length > 0;

                if (isExisting) {
                    statusEl.className = 'user-status existing';
                    statusEl.textContent = `👤 مرحباً بعودتك "${name}"! سيتم إضافة التوقع إلى حسابك.`;
                    setLastUserName(name);
                    window.currentUserName = name;
                    isNameVerified = true;

                    await loadUserPredictions(name);

                    const existingPred = await getUserPrediction(name, nameModalMatchId);
                    if (existingPred) {
                        errorEl.textContent = `⚠️ لقد توقعت هذه المباراة مسبقاً: ${existingPred.prediction === 'DRAW' ? 'تعادل' : existingPred.prediction}`;
                        this.disabled = false;
                        this.textContent = 'متابعة →';
                        renderUpcoming();
                        return;
                    }

                    this.textContent = '✅ متابعة للتوقع';
                    setTimeout(() => {
                        closeNameModal();
                        openPredictionModal(nameModalMatchId, nameModalTeam1, nameModalTeam2, nameModalTimeISO,
                            name);
                    }, 600);
                } else {
                    statusEl.className = 'user-status new';
                    statusEl.textContent = `👤 مرحباً "${name}"! أنت لاعب جديد. سيتم تسجيل توقعاتك.`;
                    setLastUserName(name);
                    window.currentUserName = name;
                    isNameVerified = true;
                    userPredictionsMap = {};

                    this.textContent = '✅ متابعة للتوقع';
                    setTimeout(() => {
                        closeNameModal();
                        openPredictionModal(nameModalMatchId, nameModalTeam1, nameModalTeam2, nameModalTimeISO,
                            name);
                    }, 600);
                }
            } catch (e) {
                console.error("❌ التحقق من الاسم:", e);
                errorEl.textContent = '❌ حدث خطأ أثناء التحقق من الاسم';
                this.disabled = false;
                this.textContent = 'متابعة →';
                statusEl.style.display = 'none';
            }
        });
    }

    const nameInput = document.getElementById('nameInput');
    if (nameInput) {
        nameInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                document.getElementById('nameSubmitBtn').click();
            }
            if (e.key === 'Escape') {
                closeNameModal();
            }
        });
    }

    const modalSubmitBtn = document.getElementById('modalSubmitBtn');
    if (modalSubmitBtn) {
        modalSubmitBtn.addEventListener('click', async function() {
            const userName = window.currentUserName || getLastUserName() || '';
            const selected = document.querySelector('input[name="prediction"]:checked');
            const msgEl = document.getElementById('modalMessage');

            if (!userName) { msgEl.textContent = '⚠️ الرجاء إدخال اسمك';
                msgEl.className = 'modal-message warning'; return; }

            if (!selected) { msgEl.textContent = '⚠️ الرجاء اختيار توقع';
                msgEl.className = 'modal-message warning'; return; }

            let prediction = selected.value;

            if (prediction === 'HOME') {
                prediction = window.currentTeam1;
            } else if (prediction === 'AWAY') {
                prediction = window.currentTeam2;
            }

            if (isMatchFinished(window.currentTimeISO)) {
                msgEl.textContent = '⛔ هذه المباراة انتهت، لا يمكن حفظ التوقع.';
                msgEl.className = 'modal-message error';
                return;
            }
            if (isMatchLive(window.currentTimeISO)) {
                msgEl.textContent = '⛔ لا يمكن التوقع على مباراة جارية';
                msgEl.className = 'modal-message error';
                return;
            }
            if (!canPredict(window.currentTimeISO)) {
                msgEl.textContent =
                    '⛔ لا يمكن التوقع الآن، المباراة على وشك البدء أو بدأت بالفعل (يُسمح حتى 5 دقائق قبل البداية).';
                msgEl.className = 'modal-message error';
                return;
            }

            if (!window.isEditing && isMatchSubmitted(window.currentMatchId)) {
                msgEl.textContent = '⚠️ لقد توقعت هذه المباراة مسبقاً';
                msgEl.className = 'modal-message warning';
                return;
            }

            this.disabled = true;
            msgEl.textContent = '⏳ جاري الحفظ...';
            msgEl.className = 'modal-message';

            const result = await savePrediction(userName, window.currentMatchId, prediction);

            if (result.success) {
                msgEl.textContent = result.updated ? '✅ تم تحديث التوقع بنجاح! 🎉' : '✅ تم حفظ التوقع بنجاح! 🎉';
                msgEl.className = 'modal-message success';
                this.disabled = false;
                if (userName) {
                    await loadUserPredictions(userName);
                }
                await renderAllPredictions();
                renderUpcoming();
                if (typeof updateNewsTicker === 'function') updateNewsTicker();
                setTimeout(() => {
                    document.getElementById('predictionModal').classList.remove('active');
                    document.body.style.overflow = '';
                }, 1200);
            } else {
                msgEl.textContent = result.message || '❌ فشل الحفظ';
                msgEl.className = 'modal-message error';
                this.disabled = false;
            }
        });
    }
});

function openPredictionModal(matchId, team1, team2, timeISO, userName) {
    if (isMatchFinished(timeISO)) { showCopyToast('⛔ هذه المباراة انتهت، لا يمكن التوقع.'); return; }
    if (!canPredict(timeISO)) { showCopyToast(
            '⛔ لا يمكن التوقع الآن، المباراة على وشك البدء أو بدأت بالفعل (يُسمح حتى 5 دقائق قبل البداية).'); return; }

    window.isEditing = false;
    window.currentMatchId = matchId;
    window.currentTeam1 = team1;
    window.currentTeam2 = team2;
    window.currentTimeISO = timeISO;
    window.currentUserName = userName || getLastUserName() || '';

    const match = getMatchById(matchId);
    const isKnockout = isKnockoutMatch(match);

    document.getElementById('modalTitle').textContent = '📝 توقع نتيجة المباراة';
    document.getElementById('greetingName').textContent = window.currentUserName;
    document.getElementById('modalUserGreeting').style.display = 'block';
    document.getElementById('modalTeam1').textContent = team1;
    document.getElementById('modalTeam2').textContent = team2;
    document.getElementById('optTeam1').textContent = team1;
    document.getElementById('optTeam2').textContent = team2;
    document.getElementById('modalFlag1').textContent = getFlag(team1);
    document.getElementById('modalFlag2').textContent = getFlag(team2);
    document.getElementById('modalDateTime').textContent = `📅 ${getDateTimeDisplay(timeISO)} (بتوقيت السعودية)`;

    const drawOption = document.getElementById('drawOption');
    if (isKnockout) {
        drawOption.style.display = 'none';
        const drawRadio = document.querySelector('input[name="prediction"][value="DRAW"]');
        if (drawRadio) drawRadio.checked = false;
    } else {
        drawOption.style.display = 'block';
    }

    const msgEl = document.getElementById('modalMessage');
    msgEl.textContent = '';
    msgEl.className = 'modal-message';

    if (isMatchSubmitted(matchId)) {
        msgEl.textContent = `⚠️ توقعت مسبقاً هذه المباراة`;
        msgEl.className = 'modal-message warning';
        document.getElementById('modalSubmitBtn').disabled = true;
    } else {
        document.getElementById('modalSubmitBtn').disabled = false;
    }

    document.getElementById('modalSubmitBtn').textContent = '💾 حفظ التوقع';
    document.querySelectorAll('input[name="prediction"]').forEach(el => el.checked = false);

    document.getElementById('predictionModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}