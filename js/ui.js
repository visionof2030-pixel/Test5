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

    if (userHasPrediction) {
        predictDisabled = true;
        predictBtnHtml = '✅ تم التوقع';
        predictBtnClass += ' submitted';
        predictBtnExtra = 'disabled';
    } else if (submitted) {
        predictDisabled = true;
        predictBtnHtml = 'تم التوقع ✅';
        predictBtnClass += ' submitted';
        predictBtnExtra = 'disabled';
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