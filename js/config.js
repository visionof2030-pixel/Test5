// ============================================================
//  الإعدادات العامة والثوابت
// ============================================================

export const SUPABASE_URL = "https://szjxwhsmefqpfcebtvei.supabase.co";
export const SUPABASE_KEY = "sb_publishable_0um28lgPMHcjDOThT0UgDA_K-Y7Wmx3";
export const SECRET_CODE = "1406";
export const CACHE_KEY = "wc_cache_v2";
export const CACHE_TIME = 5 * 60 * 1000;
export const MATCH_DURATION = 105 * 60 * 1000;

export let state = {
    previousGamesData: [],
    allGames: [],
    openfootballMatches: [],
    predictions: [],
    loaded: false
};

export let userPredictionsMap = {};
export let isAuthorized = false;
export let isCompactMode = false;
export let isModalCompact = false;
export let currentDayFilter = 'all';
export let currentLeaderboardPeriod = 'all';
export let currentUserName = '';
export let isEditing = false;
export let chartInstancesLocal = {};

export function setState(newState) { Object.assign(state, newState); }
export function setUserPredictionsMap(map) { userPredictionsMap = map; }
export function setIsAuthorized(val) { isAuthorized = val; }
export function setIsCompactMode(val) { isCompactMode = val; }
export function setIsModalCompact(val) { isModalCompact = val; }
export function setCurrentDayFilter(val) { currentDayFilter = val; }
export function setCurrentLeaderboardPeriod(val) { currentLeaderboardPeriod = val; }
export function setCurrentUserName(val) { currentUserName = val; }
export function setIsEditing(val) { isEditing = val; }
export function setChartInstancesLocal(val) { chartInstancesLocal = val; } 