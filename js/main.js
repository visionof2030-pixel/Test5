// ============================================================
//  الملف الرئيسي - تهيئة التطبيق
// ============================================================

// حالة التطبيق العامة
const state = {
    previousGamesData: [],
    allGames: [],
    openfootballMatches: [],
    predictions: [],
    userPredictionsMap: {},
    loaded: false
};

// تصدير state للاستخدام في الملفات الأخرى
window.state = state;

// ============================================================
//  دوال تحميل البيانات
// ============================================================

async function fetchOpenfootballData() {
    const cached = getCache("openfootball");
    if (cached) {
        state.openfootballMatches = cached;
        return;
    }
    try {
        const res = await fetch("https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json");
        const data = await res.json();
        state.openfootballMatches = data.matches || [];
        setCache("openfootball", state.openfootballMatches);
    } catch (e) {
        console.warn("⚠️ فشل تحميل بيانات openfootball:", e);
        state.openfootballMatches = [];
    }
}

async function init() {
    console.log("🚀 INIT START (محسن)");
    
    // تهيئة الثيم
    initTheme();
    
    // تحميل البيانات
    await Promise.all([
        loadPreviousGamesFull(),
        fetchOpenfootballData(),
        getAllPredictions()
    ]);
    
    state.loaded = true;
    
    // تحديث جميع التوقعات فوراً
    await renderAllPredictions();
    updateScorers();
    renderUpcoming();
    calculateStandings();
    renderTeamStats();
    renderScorers();
    renderBracket();
    initTabs();
    checkUrlForMatch();
    startAutoUpdate();
    updateNewsTicker();
    
    // تحميل توقعات المستخدم إذا كان مسجلاً
    const lastUser = getLastUserName();
    if (lastUser) {
        await loadUserPredictions(lastUser);
    }
    
    console.log("✅ INIT DONE (محسن)");
}

function initTabs() {
    console.log("🔹 تفعيل التبويبات");
    const tabBtns = document.querySelectorAll('.tab-btn[data-tab]');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.tab;
            console.log("🔹 تبويب مختار:", id);
            
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            const target = document.getElementById(`${id}Tab`);
            if (target) target.classList.add('active');
            
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const dayFilter = document.getElementById('dayFilterTabs');
            if (id === 'upcoming') {
                if (dayFilter) dayFilter.classList.add('visible');
            } else {
                if (dayFilter) dayFilter.classList.remove('visible');
            }
            
            if (id === 'previous' && state.previousGamesData.length === 0) loadPreviousGamesFull();
            if (id === 'standings' && state.previousGamesData.length) calculateStandings();
            if (id === 'scorers') renderScorers();
            if (id === 'stats') renderTeamStats();
            if (id === 'predictions') renderAllPredictions();
        });
    });
    
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
        const id = activeTab.dataset.tab;
        const target = document.getElementById(`${id}Tab`);
        if (target) target.classList.add('active');
        if (id === 'upcoming') {
            const dayFilter = document.getElementById('dayFilterTabs');
            if (dayFilter) dayFilter.classList.add('visible');
        }
    }
    console.log("✅ التبويبات مفعلة");
}

function startAutoUpdate() {
    // تحديث المباريات كل ثانية
    setInterval(renderUpcoming, 1000);
    
    // تحديث البيانات كل 30 ثانية
    setInterval(async () => {
        const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab;
        if (activeTab === 'previous') loadPreviousGamesFull();
        if (activeTab === 'standings' && state.previousGamesData.length) calculateStandings();
        if (activeTab === 'scorers') renderScorers();
        if (activeTab === 'stats') renderTeamStats();
        if (activeTab === 'predictions') await