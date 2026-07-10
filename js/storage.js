// ============================================================
//  إدارة التخزين المحلي
// ============================================================

function getSubmittedMatches() {
    try {
        const raw = localStorage.getItem('submitted_matches');
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
}

function addSubmittedMatch(matchId) {
    const current = getSubmittedMatches();
    if (!current.includes(matchId)) {
        current.push(matchId);
        localStorage.setItem('submitted_matches', JSON.stringify(current));
    }
}

function removeSubmittedMatch(matchId) {
    const current = getSubmittedMatches();
    const filtered = current.filter(id => id !== matchId);
    localStorage.setItem('submitted_matches', JSON.stringify(filtered));
}

function isMatchSubmitted(matchId) {
    return getSubmittedMatches().includes(matchId);
}

function getLocalPredictions() {
    try {
        const data = localStorage.getItem('predictions');
        return data ? JSON.parse(data) : {};
    } catch (e) { return {}; }
}

function saveLocalPrediction(userName, matchId, prediction) {
    try {
        const predictions = getLocalPredictions();
        predictions[`${userName}_${matchId}`] = {
            userName,
            matchId,
            prediction,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('predictions', JSON.stringify(predictions));
        return true;
    } catch (e) { return false; }
}

function getUserPredictionFromLocal(userName, matchId) {
    if (!userName) return null;
    return getLocalPredictions()[`${userName}_${matchId}`] || null;
}

function getLastUserName() {
    return localStorage.getItem('lastUserName') || '';
}

function setLastUserName(name) {
    if (name) localStorage.setItem('lastUserName', name);
}

function getTheme() {
    return localStorage.getItem('theme') || 'dark';
}

function setTheme(theme) {
    localStorage.setItem('theme', theme);
}

function getUserPredictionsMap() {
    try {
        const data = localStorage.getItem('user_predictions_map');
        return data ? JSON.parse(data) : {};
    } catch { return {}; }
}

function setUserPredictionsMap(map) {
    localStorage.setItem('user_predictions_map', JSON.stringify(map));
}

function clearAllCache() {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem('games');
    localStorage.removeItem('openfootball');
    localStorage.removeItem('predictions');
    localStorage.removeItem('user_predictions_map');
}