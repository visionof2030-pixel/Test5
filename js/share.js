// ============================================================
//  إدارة المشاركة والروابط
// ============================================================

function shareAllTodayTomorrow() {
    if (!isAuthorized) { 
        showPasswordOverlay(); 
        return; 
    }

    const today = getSaudiNow();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const activeMatches = typeof matchesData !== 'undefined' ? 
        matchesData.filter(m => (matchTime(m.timeISO) + MATCH_DURATION) > now()) : [];
    
    const todayTomorrowMatches = activeMatches.filter(m => {
        const d = toSaudiTime(m.timeISO);
        return (d.getDate() === today.getDate() && d.getMonth() === today.getMonth()) ||
            (d.getDate() === tomorrow.getDate() && d.getMonth() === tomorrow.getMonth());
    });

    if (!todayTomorrowMatches.length) { 
        showCopyToast('⚠️ لا توجد مباريات اليوم أو غداً'); 
        return; 
    }

    todayTomorrowMatches.sort((a, b) => matchTime(a.timeISO) - matchTime(b.timeISO));
    const baseUrl = window.location.origin + window.location.pathname;
    let shareText = '🏆 كأس العالم 2026 - روابط توقع مباريات اليوم والغد\n\n';
    shareText +=
        `📅 اليوم: ${formatSaudiDate(new Date().toISOString())}\n📅 غداً: ${formatSaudiDate(tomorrow.toISOString())}\n━\n\n`;

    todayTomorrowMatches.forEach((m, index) => {
        const dayLabel = isTodaySaudi(m.timeISO) ? '📌 اليوم' : '📌 غداً';
        const timeStr = getTimeFromISO(m.timeISO);
        const link = `${baseUrl}?m=${m.id}`;
        shareText +=
            `${index+1}. ${getFlag(m.team1)} ${m.team1} 🆚 ${getFlag(m.team2)} ${m.team2}\n🕒 ${dayLabel} - ${timeStr}\n🔗 <${link}>\n\n`;
    });

    shareText += '━\n✨ توقع · تنافس · اربح ✨\n#كأس_العالم_2026 #توقعات';

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareText).then(() => 
            showCopyToast(`✅ تم نسخ روابط ${todayTomorrowMatches.length} مباراة!`)
        ).catch(() => fallbackCopy(shareText));
    } else { 
        fallbackCopy(shareText); 
    }
}

function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showCopyToast('✅ تم نسخ جميع الروابط!');
    } catch (e) {
        prompt('انسخ النص التالي للمشاركة:', text);
    }
    document.body.removeChild(textArea);
}

function updateShareAllCount() {
    if (!isAuthorized) {
        const countSpan = document.getElementById('shareAllCount');
        if (countSpan) countSpan.textContent = '🔒';
        return;
    }

    const today = getSaudiNow();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const activeMatches = typeof matchesData !== 'undefined' ? 
        matchesData.filter(m => (matchTime(m.timeISO) + MATCH_DURATION) > now()) : [];
    
    const count = activeMatches.filter(m => {
        const d = toSaudiTime(m.timeISO);
        return (d.getDate() === today.getDate() && d.getMonth() === today.getMonth()) ||
            (d.getDate() === tomorrow.getDate() && d.getMonth() === tomorrow.getMonth());
    }).length;
    
    const countSpan = document.getElementById('shareAllCount');
    if (countSpan) countSpan.textContent = count;
}

function copyMatchLink(matchId, team1, team2) {
    const shareUrl = `${window.location.origin}${window.location.pathname}?m=${matchId}`;
    
    if (navigator.share) {
        navigator.share({
            title: `🏆 توقع مباراة ${team1} 🆚 ${team2}`,
            text: `🔮 توقع نتيجة مباراة ${team1} 🆚 ${team2} في كأس العالم 2026\n\n🔗 ${shareUrl}`,
            url: shareUrl
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(shareUrl).then(() => 
            showCopyToast('✅ تم نسخ رابط المباراة!')
        ).catch(() => {
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

function shareResults() {
    const currentUser = getLastUserName() || 'لاعب';
    const userScore = document.querySelector('.champion-card .info .stats-row .item:first-child strong')?.textContent || '0';
    const userRank = document.querySelector('.champion-card .rank-badge')?.textContent || '🥇';
    const totalPlayers = document.getElementById('lbTotalPlayers')?.textContent || '0';
    
    const shareText = `🏆 كأس العالم 2026\n\n👤 ${currentUser}\n📊 النقاط: ${userScore}\n🏅 الترتيب: ${userRank}\n👥 عدد اللاعبين: ${totalPlayers}\n\n✨ توقع · تنافس · اربح ✨\n#كأس_العالم_2026 #توقعات`;
    
    if (navigator.share) {
        navigator.share({ title: 'نتائجي في كأس العالم 2026', text: shareText }).catch(() => {});
    } else {
        navigator.clipboard.writeText(shareText).then(() => 
            showCopyToast('✅ تم نسخ النتائج!')
        ).catch(() => prompt('انسخ النص التالي للمشاركة:', shareText));
    }
}

function shareMatchLink(matchId) {
    const match = typeof matchesData !== 'undefined' ? 
        matchesData.find(m => `${m.timeISO}_${m.team1}_${m.team2}` === matchId) : null;
    
    if (!match) {
        showCopyToast('⚠️ المباراة غير موجودة');
        return;
    }
    
    copyMatchLink(match.id, match.team1, match.team2);
}

function sharePrediction(userName, matchId) {
    const match = typeof matchesData !== 'undefined' ? 
        matchesData.find(m => `${m.timeISO}_${m.team1}_${m.team2}` === matchId) : null;
    
    if (!match) {
        showCopyToast('⚠️ المباراة غير موجودة');
        return;
    }
    
    const shareUrl = `${window.location.origin}${window.location.pathname}?m=${matchId}`;
    const text = `🔮 توقع ${userName} لمباراة ${match.team1} 🆚 ${match.team2} في كأس العالم 2026\n\n🔗 ${shareUrl}`;
    
    if (navigator.share) {
        navigator.share({ title: 'توقع كأس العالم', text, url: shareUrl }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text).then(() => 
            showCopyToast('✅ تم نسخ رابط التوقع!')
        ).catch(() => prompt('انسخ النص التالي للمشاركة:', text));
    }
}

function getShareLinksForDay(day = 'today') {
    const today = getSaudiNow();
    const targetDate = day === 'today' ? today : new Date(today);
    if (day === 'tomorrow') targetDate.setDate(targetDate.getDate() + 1);
    
    const activeMatches = typeof matchesData !== 'undefined' ? 
        matchesData.filter(m => (matchTime(m.timeISO) + MATCH_DURATION) > now()) : [];
    
    const dayMatches = activeMatches.filter(m => {
        const d = toSaudiTime(m.timeISO);
        return d.getDate() === targetDate.getDate() && 
               d.getMonth() === targetDate.getMonth() &&
               d.getFullYear() === targetDate.getFullYear();
    });
    
    const baseUrl = window.location.origin + window.location.pathname;
    return dayMatches.map(m => ({
        match: m,
        link: `${baseUrl}?m=${m.id}`,
        time: getTimeFromISO(m.timeISO),
        teams: `${getFlag(m.team1)} ${m.team1} 🆚 ${getFlag(m.team2)} ${m.team2}`
    }));
}

function copyDayLinks(day = 'today') {
    const links = getShareLinksForDay(day);
    if (links.length === 0) {
        showCopyToast(`⚠️ لا توجد مباريات ${day === 'today' ? 'اليوم' : 'غداً'}`);
        return;
    }
    
    let text = `🏆 كأس العالم 2026 - مباريات ${day === 'today' ? 'اليوم' : 'غداً'}\n\n`;
    links.forEach((item, index) => {
        text += `${index+1}. ${item.teams}\n🕒 ${item.time}\n🔗 <${item.link}>\n\n`;
    });
    text += '✨ توقع · تنافس · اربح ✨\n#كأس_العالم_2026 #توقعات';
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => 
            showCopyToast(`✅ تم نسخ روابط ${links.length} مباراة!`)
        ).catch(() => fallbackCopy(text));
    } else {
        fallbackCopy(text);
    }
}

// ربط أحداث المشاركة
document.addEventListener('DOMContentLoaded', function() {
    const shareAllBtn = document.querySelector('.share-all-btn');
    if (shareAllBtn) {
        shareAllBtn.addEventListener('click', shareAllTodayTomorrow);
    }
    
    const shareResultsBtn = document.querySelector('.header-btn[onclick="shareResults()"]');
    if (shareResultsBtn) {
        shareResultsBtn.addEventListener('click', shareResults);
    }
});