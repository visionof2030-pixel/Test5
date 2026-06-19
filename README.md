<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>🏆 كأس العالم 2026</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <!-- ===== مكتبة ضغط LZString ===== -->
  <script src="https://cdn.jsdelivr.net/npm/lz-string@1.5.0/lz-string.min.js"></script>
  <style>
    /* ... كل الأنماط كما هي ... */
    /* (احتفظ بالأنماط السابقة كاملة) */
  </style>
</head>
<body>
<!-- ... كل HTML كما هو ... -->

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  // ============================================================
  //  Supabase الاتصال
  // ============================================================
  const SUPABASE_URL = "https://szjxwhsmefqpfcebtvei.supabase.co";
  const SUPABASE_KEY = "sb_publishable_0um28lgPMHcjDOThT0UgDA_K-Y7Wmx3";
  
  let supabaseClient;
  try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("✅ Supabase متصل");
  } catch (e) {
    console.error("❌ Supabase فشل:", e);
    supabaseClient = null;
  }
  
  // ============================================================
  //  التخزين المحلي
  // ============================================================
  function getLocalPredictions() {
    try {
      const data = localStorage.getItem('predictions');
      return data ? JSON.parse(data) : {};
    } catch (e) { return {}; }
  }
  
  function saveLocalPrediction(userName, matchId, prediction) {
    try {
      const predictions = getLocalPredictions();
      predictions[`${userName}_${matchId}`] = { userName, matchId, prediction, timestamp: new Date().toISOString() };
      localStorage.setItem('predictions', JSON.stringify(predictions));
      return true;
    } catch (e) { return false; }
  }
  
  function hasUserPredicted(userName, matchId) {
    if (!userName) return false;
    return !!getLocalPredictions()[`${userName}_${matchId}`];
  }
  
  function getUserPrediction(userName, matchId) {
    if (!userName) return null;
    return getLocalPredictions()[`${userName}_${matchId}`] || null;
  }
  
  // ============================================================
  //  دوال API مع تخزين مؤقت
  // ============================================================
  const CACHE_KEY = 'worldcup_data';
  const CACHE_DURATION = 5 * 60 * 1000;
  
  function getCachedData(key) {
    try {
      const cached = localStorage.getItem(`${CACHE_KEY}_${key}`);
      if (cached) {
        const data = JSON.parse(cached);
        if (Date.now() - data.timestamp < CACHE_DURATION) {
          return data.value;
        }
      }
    } catch (e) {}
    return null;
  }
  
  function setCachedData(key, value) {
    try {
      localStorage.setItem(`${CACHE_KEY}_${key}`, JSON.stringify({
        value: value,
        timestamp: Date.now()
      }));
    } catch (e) {}
  }
  
  async function getAllPredictions() {
    if (!supabaseClient) return [];
    const cached = getCachedData('predictions');
    if (cached) {
      console.log("📦 جلب التوقعات من cache");
      return cached;
    }
    try {
      const { data, error } = await supabaseClient
        .from("predictions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      const result = data || [];
      setCachedData('predictions', result);
      return result;
    } catch (e) {
      console.error("❌ جلب التوقعات:", e);
      return [];
    }
  }
  
  async function getPredictionsForMatch(matchId) {
    if (!supabaseClient) return [];
    try {
      const { data, error } = await supabaseClient
        .from("predictions")
        .select("*")
        .eq("match_id", matchId)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error("❌ جلب توقعات المباراة:", e);
      return [];
    }
  }
  
  async function getPredictionsForUser(userName) {
    if (!supabaseClient || !userName) return [];
    try {
      const { data, error } = await supabaseClient
        .from("predictions")
        .select("*")
        .eq("user_name", userName)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error("❌ جلب توقعات اللاعب:", e);
      return [];
    }
  }
  
  async function savePrediction(userName, matchId, prediction) {
    if (!supabaseClient) return { success: false, message: "Supabase غير متصل" };
    if (hasUserPredicted(userName, matchId)) {
      const existing = getUserPrediction(userName, matchId);
      return { success: false, message: `⚠️ توقعت مسبقاً: ${existing.prediction === 'DRAW' ? 'تعادل' : existing.prediction}`, duplicate: true };
    }
    try {
      const { error } = await supabaseClient
        .from("predictions")
        .insert([{ user_name: userName, match_id: matchId, prediction }]);
      if (error) throw error;
      saveLocalPrediction(userName, matchId, prediction);
      localStorage.removeItem(`${CACHE_KEY}_predictions`);
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }
  
  // ============================================================
  //  دوال الوقت والمباريات
  // ============================================================
  function now() { return Date.now(); }
  function matchTime(t) { return new Date(t).getTime(); }
  const MATCH_DURATION = 105 * 60 * 1000;
  
  function isMatchLive(timeISO) {
    const start = matchTime(timeISO);
    const end = start + MATCH_DURATION;
    const cur = now();
    return cur >= start && cur <= end;
  }
  
  function getMatchStatus(m) {
    const start = matchTime(m.timeISO);
    const end = start + MATCH_DURATION;
    const cur = now();
    if (cur < start) {
      const diff = start - cur;
      const h = Math.floor(diff / 3600000);
      const min = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      return { live: false, text: `⏱️ ${h}h ${min}m ${s}s` };
    } else if (cur <= end) {
      return { live: true, text: "🔴 تُلعب الآن" };
    }
    return { live: false, text: "✅ انتهت" };
  }
  
  function upcomingMatches(arr) {
    return arr.filter(m => (matchTime(m.timeISO) + MATCH_DURATION) > now());
  }
  
  // ============================================================
  //  التحقق من أيام المباريات (اليوم وغداً)
  // ============================================================
  function isMatchTodayOrTomorrow(timeISO) {
    const matchDate = new Date(timeISO);
    matchDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return matchDate.getTime() === today.getTime() || matchDate.getTime() === tomorrow.getTime();
  }
  
  // ============================================================
  //  ترجمة الأسماء والأعلام
  // ============================================================
  const nameMapping = new Map([
    ["مکزیک", "المكسيك"], ["Mexico", "المكسيك"],
    ["آفریقای جنوبی", "جنوب أفريقيا"], ["South Africa", "جنوب أفريقيا"],
    ["آرژانتین", "الأرجنتين"], ["Argentina", "الأرجنتين"],
    ["الجزایر", "الجزائر"], ["Algeria", "الجزائر"],
    ["اتریش", "النمسا"], ["Austria", "النمسا"],
    ["اردن", "الأردن"], ["Jordan", "الأردن"],
    ["پرتغال", "البرتغال"], ["Portugal", "البرتغال"],
    ["کنگو دمکراتیک", "الكونغو الديمقراطية"], ["DR Congo", "الكونغو الديمقراطية"],
    ["کره جنوبی", "كوريا الجنوبية"], ["South Korea", "كوريا الجنوبية"],
    ["جمهوری چک", "التشيك"], ["Czech Republic", "التشيك"],
    ["کانادا", "كندا"], ["Canada", "كندا"],
    ["بوسنی و هرزگوین", "البوسنة والهرسك"], ["Bosnia and Herzegovina", "البوسنة والهرسك"],
    ["آمریکا", "أمريكا"], ["United States", "أمريكا"], ["US", "أمريكا"],
    ["عراق", "العراق"], ["Iraq", "العراق"],
    ["سوئیس", "سويسرا"], ["Switzerland", "سويسرا"],
    ["قطر", "قطر"], ["Qatar", "قطر"],
    ["برزیل", "البرازيل"], ["Brazil", "البرازيل"],
    ["مراکش", "المغرب"], ["Morocco", "المغرب"],
    ["هائیتی", "هايتي"], ["Haiti", "هايتي"],
    ["اسکاتلند", "إسكتلندا"], ["Scotland", "إسكتلندا"],
    ["استرالیا", "أستراليا"], ["Australia", "أستراليا"],
    ["ترکیه", "تركيا"], ["Turkey", "تركيا"],
    ["آلمان", "ألمانيا"], ["Germany", "ألمانيا"],
    ["کوراساو", "كوراساو"], ["Curaçao", "كوراساو"],
    ["ژاپن", "اليابان"], ["Japan", "اليابان"],
    ["هلند", "هولندا"], ["Netherlands", "هولندا"],
    ["اکوادور", "الإكوادور"], ["Ecuador", "الإكوادور"],
    ["ساحل عاج", "ساحل العاج"], ["Ivory Coast", "ساحل العاج"],
    ["سوئد", "السويد"], ["Sweden", "السويد"],
    ["تونس", "تونس"], ["Tunisia", "تونس"],
    ["اسپانیا", "إسبانيا"], ["Spain", "إسبانيا"],
    ["کیپ ورد", "الرأس الأخضر"], ["Cape Verde", "الرأس الأخضر"],
    ["مصر", "مصر"], ["Egypt", "مصر"],
    ["بلژیک", "بلجيكا"], ["Belgium", "بلجيكا"],
    ["عربستان سعودی", "السعودية"], ["Saudi Arabia", "السعودية"],
    ["اروگوئه", "أوروغواي"], ["Uruguay", "أوروغواي"],
    ["ایران", "إيران"], ["Iran", "إيران"],
    ["نیوزیلند", "نيوزيلندا"], ["New Zealand", "نيوزيلندا"],
    ["سنگال", "السنغال"], ["Senegal", "السنغال"],
    ["فرانسه", "فرنسا"], ["France", "فرنسا"],
    ["نروژ", "النرويج"], ["Norway", "النرويج"],
    ["انگلستان", "إنجلترا"], ["England", "إنجلترا"],
    ["کرواسی", "كرواتيا"], ["Croatia", "كرواتيا"],
    ["پاناما", "بنما"], ["Panama", "بنما"],
    ["کلمبیا", "كولومبيا"], ["Colombia", "كولومبيا"],
    ["ازبکستان", "أوزبكستان"], ["Uzbekistan", "أوزبكستان"],
    ["غنا", "غانا"], ["Ghana", "غانا"],
    ["پاراگوئه", "باراغواي"], ["Paraguay", "باراغواي"],
  ]);
  
  function translateToArabic(raw) {
    if (!raw) return raw;
    const trimmed = raw.trim();
    if (nameMapping.has(trimmed)) return nameMapping.get(trimmed);
    const lower = trimmed.toLowerCase();
    for (const [key, value] of nameMapping) {
      if (key.toLowerCase() === lower) return value;
    }
    return trimmed;
  }
  
  function getFlag(name) {
    const map = {
      "المكسيك":"🇲🇽","جنوب أفريقيا":"🇿🇦","الأرجنتين":"🇦🇷","الجزائر":"🇩🇿","النمسا":"🇦🇹","الأردن":"🇯🇴","البرتغال":"🇵🇹","الكونغو الديمقراطية":"🇨🇩","كوريا الجنوبية":"🇰🇷","التشيك":"🇨🇿","كندا":"🇨🇦","البوسنة والهرسك":"🇧🇦","أمريكا":"🇺🇸","العراق":"🇮🇶","سويسرا":"🇨🇭","قطر":"🇶🇦","البرازيل":"🇧🇷","المغرب":"🇲🇦","هايتي":"🇭🇹","إسكتلندا":"🏴󠁧󠁢󠁳󠁣󠁴󠁿","أستراليا":"🇦🇺","تركيا":"🇹🇷","ألمانيا":"🇩🇪","كوراساو":"🇨🇼","اليابان":"🇯🇵","هولندا":"🇳🇱","الإكوادور":"🇪🇨","ساحل العاج":"🇨🇮","السويد":"🇸🇪","تونس":"🇹🇳","إسبانيا":"🇪🇸","الرأس الأخضر":"🇨🇻","مصر":"🇪🇬","بلجيكا":"🇧🇪","السعودية":"🇸🇦","أوروغواي":"🇺🇾","إيران":"🇮🇷","نيوزيلندا":"🇳🇿","السنغال":"🇸🇳","فرنسا":"🇫🇷","النرويج":"🇳🇴","إنجلترا":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","كرواتيا":"🇭🇷","بنما":"🇵🇦","كولومبيا":"🇨🇴","أوزبكستان":"🇺🇿","غانا":"🇬🇭","باراغواي":"🇵🇾"
    };
    return map[name] || "🏁";
  }
  
  function getDay(t) { return ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'][new Date(t).getDay()]; }
  function getDateFmt(t) {
    const d = new Date(t);
    const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }
  function getTimeFromISO(t) {
    const d = new Date(t);
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }
  function getDateTimeDisplay(t) { return `${getDateFmt(t)} - ${getTimeFromISO(t)}`; }
  
  // ============================================================
  //  بيانات المباريات القادمة
  // ============================================================
  const rawMatches = [
    { team1:"المكسيك", team2:"جنوب أفريقيا", time:"2026-06-11T22:00:00", round:"first" },{ team1:"الأرجنتين", team2:"الجزائر", time:"2026-06-11T04:00:00", round:"first" },
    { team1:"النمسا", team2:"الأردن", time:"2026-06-11T07:00:00", round:"first" },{ team1:"البرتغال", team2:"الكونغو الديمقراطية", time:"2026-06-11T20:00:00", round:"first" },
    { team1:"كوريا الجنوبية", team2:"التشيك", time:"2026-06-12T05:00:00", round:"first" },{ team1:"كندا", team2:"البوسنة والهرسك", time:"2026-06-12T22:00:00", round:"first" },
    { team1:"أمريكا", team2:"العراق", time:"2026-06-13T04:00:00", round:"first" },{ team1:"سويسرا", team2:"قطر", time:"2026-06-13T22:00:00", round:"first" },
    { team1:"البرازيل", team2:"المغرب", time:"2026-06-14T01:00:00", round:"first" },{ team1:"هايتي", team2:"إسكتلندا", time:"2026-06-14T04:00:00", round:"first" },
    { team1:"أستراليا", team2:"تركيا", time:"2026-06-14T07:00:00", round:"first" },{ team1:"ألمانيا", team2:"كوراساو", time:"2026-06-14T20:00:00", round:"first" },
    { team1:"اليابان", team2:"هولندا", time:"2026-06-14T23:00:00", round:"first" },{ team1:"الإكوادور", team2:"ساحل العاج", time:"2026-06-15T02:00:00", round:"first" },
    { team1:"السويد", team2:"تونس", time:"2026-06-15T05:00:00", round:"first" },{ team1:"إسبانيا", team2:"الرأس الأخضر", time:"2026-06-15T19:00:00", round:"first" },
    { team1:"مصر", team2:"بلجيكا", time:"2026-06-15T22:00:00", round:"first" },{ team1:"السعودية", team2:"أوروغواي", time:"2026-06-16T01:00:00", round:"first" },
    { team1:"إيران", team2:"نيوزيلندا", time:"2026-06-16T04:00:00", round:"first" },{ team1:"السنغال", team2:"فرنسا", time:"2026-06-16T22:00:00", round:"first" },
    { team1:"النرويج", team2:"العراق", time:"2026-06-17T01:00:00", round:"first" },{ team1:"الجزائر", team2:"الأرجنتين", time:"2026-06-17T04:00:00", round:"first" },
    { team1:"الأردن", team2:"النمسا", time:"2026-06-17T07:00:00", round:"first" },{ team1:"البرتغال", team2:"كرواتيا", time:"2026-06-17T20:00:00", round:"first" },
    { team1:"إنجلترا", team2:"كرواتيا", time:"2026-06-17T23:00:00", round:"first" },{ team1:"جنوب أفريقيا", team2:"التشيك", time:"2026-06-18T19:00:00", round:"second" },
    { team1:"سويسرا", team2:"البوسنة والهرسك", time:"2026-06-18T22:00:00", round:"second" },{ team1:"قطر", team2:"كندا", time:"2026-06-19T01:00:00", round:"second" },
    { team1:"المكسيك", team2:"كوريا الجنوبية", time:"2026-06-19T04:00:00", round:"second" },{ team1:"أستراليا", team2:"أمريكا", time:"2026-06-19T22:00:00", round:"second" },
    { team1:"المغرب", team2:"إسكتلندا", time:"2026-06-20T01:00:00", round:"second" },{ team1:"البرازيل", team2:"هايتي", time:"2026-06-20T03:30:00", round:"second" },
    { team1:"تركيا", team2:"باراغواي", time:"2026-06-20T06:00:00", round:"second" },{ team1:"السويد", team2:"هولندا", time:"2026-06-20T20:00:00", round:"second" },
    { team1:"ساحل العاج", team2:"ألمانيا", time:"2026-06-20T23:00:00", round:"second" },{ team1:"الإكوادور", team2:"كوراساو", time:"2026-06-21T03:00:00", round:"second" },
    { team1:"اليابان", team2:"تونس", time:"2026-06-21T07:00:00", round:"second" },{ team1:"إسبانيا", team2:"السعودية", time:"2026-06-21T19:00:00", round:"second" },
    { team1:"بلجيكا", team2:"إيران", time:"2026-06-21T22:00:00", round:"second" },{ team1:"أوروغواي", team2:"الرأس الأخضر", time:"2026-06-22T01:00:00", round:"second" },
    { team1:"مصر", team2:"نيوزيلندا", time:"2026-06-22T04:00:00", round:"second" },{ team1:"الأرجنتين", team2:"النمسا", time:"2026-06-22T20:00:00", round:"second" },
    { team1:"العراق", team2:"فرنسا", time:"2026-06-23T00:00:00", round:"second" },{ team1:"النرويج", team2:"السنغال", time:"2026-06-23T03:00:00", round:"second" },
    { team1:"الأردن", team2:"الجزائر", time:"2026-06-23T06:00:00", round:"second" },{ team1:"البرتغال", team2:"أوزبكستان", time:"2026-06-23T20:00:00", round:"second" },
    { team1:"إنجلترا", team2:"غانا", time:"2026-06-23T23:00:00", round:"second" },{ team1:"بنما", team2:"كرواتيا", time:"2026-06-24T02:00:00", round:"second" },
    { team1:"كولومبيا", team2:"الكونغو الديمقراطية", time:"2026-06-24T05:00:00", round:"second" },{ team1:"كندا", team2:"سويسرا", time:"2026-06-24T22:00:00", round:"third" },
    { team1:"قطر", team2:"البوسنة والهرسك", time:"2026-06-24T22:00:00", round:"third" },{ team1:"المغرب", team2:"هايتي", time:"2026-06-25T01:00:00", round:"third" },
    { team1:"إسكتلندا", team2:"البرازيل", time:"2026-06-25T01:00:00", round:"third" },{ team1:"جنوب أفريقيا", team2:"كوريا الجنوبية", time:"2026-06-25T04:00:00", round:"third" },
    { team1:"المكسيك", team2:"التشيك", time:"2026-06-25T04:00:00", round:"third" },{ team1:"كوراساو", team2:"ساحل العاج", time:"2026-06-25T23:00:00", round:"third" },
    { team1:"ألمانيا", team2:"الإكوادور", time:"2026-06-25T23:00:00", round:"third" },{ team1:"هولندا", team2:"تونس", time:"2026-06-26T02:00:00", round:"third" },
    { team1:"اليابان", team2:"السويد", time:"2026-06-26T02:00:00", round:"third" },{ team1:"أمريكا", team2:"تركيا", time:"2026-06-26T05:00:00", round:"third" },
    { team1:"أستراليا", team2:"باراغواي", time:"2026-06-26T05:00:00", round:"third" },{ team1:"فرنسا", team2:"النرويج", time:"2026-06-26T22:00:00", round:"third" },
    { team1:"السنغال", team2:"العراق", time:"2026-06-26T22:00:00", round:"third" },{ team1:"السعودية", team2:"الرأس الأخضر", time:"2026-06-27T03:00:00", round:"third" },
    { team1:"إسبانيا", team2:"أوروغواي", time:"2026-06-27T03:00:00", round:"third" },{ team1:"إيران", team2:"مصر", time:"2026-06-27T06:00:00", round:"third" },
    { team1:"نيوزيلندا", team2:"بلجيكا", time:"2026-06-27T06:00:00", round:"third" },{ team1:"إنجلترا", team2:"بنما", time:"2026-06-28T00:00:00", round:"third" },
    { team1:"كرواتيا", team2:"غانا", time:"2026-06-28T00:00:00", round:"third" },{ team1:"البرتغال", team2:"كولومبيا", time:"2026-06-28T02:30:00", round:"third" },
    { team1:"الكونغو الديمقراطية", team2:"أوزبكستان", time:"2026-06-28T02:30:00", round:"third" },{ team1:"الجزائر", team2:"النمسا", time:"2026-06-28T05:00:00", round:"third" },
    { team1:"الأردن", team2:"الأرجنتين", time:"2026-06-28T05:00:00", round:"third" }
  ];
  
  const matchesData = rawMatches.map(m => ({
    ...m,
    timeISO: m.time + "+03:00",
    roundLabel: m.round === 'first' ? 'الجولة الأولى' : (m.round === 'second' ? 'الجولة الثانية' : 'الجولة الثالثة')
  }));
  
  // ============================================================
  //  المجموعات
  // ============================================================
  const finalGroups = {
    "A": ["المكسيك","جنوب أفريقيا","كوريا الجنوبية","التشيك"],
    "B": ["كندا","البوسنة والهرسك","قطر","سويسرا"],
    "C": ["البرازيل","المغرب","هايتي","إسكتلندا"],
    "D": ["أمريكا","باراغواي","أستراليا","تركيا"],
    "E": ["ألمانيا","كوراساو","ساحل العاج","الإكوادور"],
    "F": ["هولندا","اليابان","السويد","تونس"],
    "G": ["بلجيكا","مصر","إيران","نيوزيلندا"],
    "H": ["إسبانيا","الرأس الأخضر","السعودية","أوروغواي"],
    "I": ["فرنسا","السنغال","النرويج","العراق"],
    "J": ["الأرجنتين","الجزائر","النمسا","الأردن"],
    "K": ["البرتغال","الكونغو الديمقراطية","أوزبكستان","كولومبيا"],
    "L": ["إنجلترا","كرواتيا","غانا","بنما"]
  };
  
  // ============================================================
  //  المتغيرات العامة
  // ============================================================
  let previousGamesData = [];
  let allPredictionsCache = [];
  let currentMatchId = null;
  let currentTeam1 = '';
  let currentTeam2 = '';
  let currentTimeISO = '';
  let currentUserName = localStorage.getItem('lastUserName') || '';
  let currentDayFilter = 'all';
  
  // ============================================================
  //  إظهار/إخفاء فلتر اليوم حسب التبويب النشط
  // ============================================================
  function toggleDayFilter(tabId) {
    const dayFilterTabs = document.getElementById('dayFilterTabs');
    if (tabId === 'upcoming') {
      dayFilterTabs.classList.add('visible');
    } else {
      dayFilterTabs.classList.remove('visible');
    }
  }
  
  // ============================================================
  //  دوال ضغط البيانات (لجعل الرابط قصيراً جداً)
  // ============================================================
  function compressData(data) {
    const json = JSON.stringify(data);
    const compressed = LZString.compressToEncodedURIComponent(json);
    return compressed;
  }
  
  function decompressData(compressed) {
    try {
      const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
      if (!decompressed) return null;
      return JSON.parse(decompressed);
    } catch (e) {
      return null;
    }
  }
  
  // ============================================================
  //  دوال مشاركة الرابط (نسخة مضغوطة جداً)
  // ============================================================
  function copyMatchLink(encodedData, team1, team2) {
    const shareUrl = `${window.location.origin}${window.location.pathname}?m=${encodedData}`;
    
    if (navigator.share && window.innerWidth < 768) {
      navigator.share({
        title: `🏆 توقع مباراة ${team1} 🆚 ${team2}`,
        text: `🔮 توقع نتيجة مباراة ${team1} 🆚 ${team2} في كأس العالم 2026`,
        url: shareUrl
      }).catch(() => {});
    } else {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          showCopyToast(`✅ تم نسخ الرابط!\n📋 ${shareUrl}`);
        }).catch(() => {
          fallbackCopy(shareUrl);
        });
      } else {
        fallbackCopy(shareUrl);
      }
    }
  }
  
  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showCopyToast('✅ تم نسخ الرابط!');
    } catch (e) {
      prompt('انسخ الرابط يدوياً:', text);
    }
    document.body.removeChild(textArea);
  }
  
  function showCopyToast(message) {
    const toast = document.getElementById('copyToast');
    toast.textContent = message;
    toast.style.whiteSpace = 'pre-wrap';
    toast.style.textAlign = 'center';
    toast.style.fontSize = '0.8rem';
    toast.style.maxWidth = '90%';
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }
  
  // ============================================================
  //  فحص الرابط عند التحميل (نسخة مضغوطة)
  // ============================================================
  function checkUrlForMatch() {
    const params = new URLSearchParams(window.location.search);
    const encodedData = params.get('m');
    
    if (encodedData) {
      try {
        const decoded = decompressData(encodedData);
        if (decoded && decoded.matchId && decoded.team1 && decoded.team2 && decoded.timeISO) {
          setTimeout(() => {
            openPredictionModal(decoded.matchId, decoded.team1, decoded.team2, decoded.timeISO);
          }, 800);
        }
      } catch (e) {
        console.error('❌ فشل فك تشفير الرابط:', e);
      }
    }
  }
  
  // ============================================================
  //  عرض المباريات القادمة
  // ============================================================
  function renderUpcoming() {
    try {
      let active = upcomingMatches(matchesData);
      
      const groupFilter = document.getElementById('groupFilter')?.value || 'all';
      if (groupFilter !== 'all') {
        const teams = finalGroups[groupFilter] || [];
        active = active.filter(m => teams.includes(m.team1) || teams.includes(m.team2));
      }
      
      if (currentDayFilter === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        active = active.filter(m => {
          const matchDate = new Date(m.timeISO);
          matchDate.setHours(0, 0, 0, 0);
          return matchDate.getTime() === today.getTime();
        });
      } else if (currentDayFilter === 'tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        active = active.filter(m => {
          const matchDate = new Date(m.timeISO);
          matchDate.setHours(0, 0, 0, 0);
          return matchDate.getTime() === tomorrow.getTime();
        });
      } else if (currentDayFilter === 'week') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weekLater = new Date(today);
        weekLater.setDate(weekLater.getDate() + 7);
        active = active.filter(m => {
          const matchDate = new Date(m.timeISO);
          matchDate.setHours(0, 0, 0, 0);
          return matchDate >= today && matchDate <= weekLater;
        });
      }
      
      active.sort((a,b) => matchTime(a.timeISO) - matchTime(b.timeISO));
      
      const searchQuery = document.getElementById('matchSearchInput')?.value || '';
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        active = active.filter(m => 
          m.team1.toLowerCase().includes(q) || 
          m.team2.toLowerCase().includes(q)
        );
      }
      
      const container = document.getElementById('matchesContainer');
      const countSpan = document.getElementById('upcomingCount');
      countSpan.textContent = active.length;
      
      if (!active.length) {
        container.innerHTML = `<div class="empty-state"><span class="icon">📭</span> لا توجد مباريات تطابق الفلاتر</div>`;
        return;
      }
      
      container.innerHTML = active.map(m => {
        const st = getMatchStatus(m);
        const isLive = st.live;
        const matchId = `${m.timeISO}_${m.team1}_${m.team2}`;
        const isLiveMatch = isMatchLive(m.timeISO);
        const savedUserName = localStorage.getItem('lastUserName') || '';
        const hasPredicted = savedUserName && hasUserPredicted(savedUserName, matchId);
        
        const showActions = isMatchTodayOrTomorrow(m.timeISO);
        
        let scoreDisplay = '🆚';
        let scoreClass = '';
        if (isLive) { scoreDisplay = '🔴 LIVE'; scoreClass = 'live'; }
        
        let predictBtnHtml = `<span>📝</span> توقع الآن`;
        let predictDisabled = false;
        let predictBtnClass = '';
        
        if (!showActions) {
          predictDisabled = true;
          predictBtnHtml = `<span>⏳</span> قريباً`;
          predictBtnClass = 'style="opacity:0.4;cursor:default;"';
        } else if (isLiveMatch) {
          predictDisabled = true;
          predictBtnHtml = `<span>⛔</span> جارية`;
          predictBtnClass = 'style="opacity:0.5;cursor:not-allowed;"';
        } else if (hasPredicted) {
          const existing = getUserPrediction(savedUserName, matchId);
          predictDisabled = true;
          predictBtnHtml = `<span>✅</span> تم التوقع: ${existing.prediction === 'DRAW' ? 'تعادل' : existing.prediction}`;
          predictBtnClass = 'style="border-color:#2ecc71;color:#2ecc71;cursor:default;"';
        }
        
        const groupName = Object.keys(finalGroups).find(g => finalGroups[g].includes(m.team1)) || '';
        
        // تشفير بيانات المباراة للرابط - باستخدام ضغط LZString
        const encodedData = compressData({
          matchId: matchId,
          team1: m.team1,
          team2: m.team2,
          timeISO: m.timeISO
        });
        
        return `
          <div class="match-card ${isLive ? 'live' : ''}">
            <div class="match-teams">
              <div class="match-team"><span class="flag">${getFlag(m.team1)}</span> ${m.team1}</div>
              <div class="match-score ${scoreClass}">${scoreDisplay}</div>
              <div class="match-team"><span class="flag">${getFlag(m.team2)}</span> ${m.team2}</div>
            </div>
            <div class="match-meta">
              <span class="tag">🏅 ${m.roundLabel}</span>
              <span class="tag">${groupName ? `المجموعة ${groupName}` : ''}</span>
              <span class="timer ${isLive ? 'live' : ''}">${isLive ? '🔴 تُلعب الآن' : st.text}</span>
            </div>
            <div class="match-meta" style="margin-top:4px;">
              <span class="tag">${getDay(m.timeISO)}</span>
              <span class="tag">${getDateTimeDisplay(m.timeISO)}</span>
            </div>
            <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;">
              <button class="tab-btn" style="flex:1;justify-content:center;padding:10px 12px;font-size:0.75rem;background:rgba(240,180,41,0.08);border-color:rgba(240,180,41,0.2);color:var(--gold-light);" 
                      data-matchid="${matchId}" data-team1="${m.team1}" data-team2="${m.team2}" data-timeiso="${m.timeISO}"
                      ${predictDisabled ? 'disabled' : ''} ${predictBtnClass}>
                ${predictBtnHtml}
              </button>
              <button class="tab-btn" style="flex:1;justify-content:center;padding:10px 12px;font-size:0.75rem;background:rgba(52,152,219,0.06);border-color:rgba(52,152,219,0.15);color:#5dade2;${!showActions ? 'opacity:0.4;cursor:default;' : ''}"
                      data-matchid="${matchId}" data-team1="${m.team1}" data-team2="${m.team2}" 
                      ${!showActions ? 'disabled' : ''}
                      onclick="${showActions ? `openViewPredictionsModal('${matchId}','${m.team1}','${m.team2}')` : ''}">
                <span>📋</span> استعراض التوقعات
              </button>
              <button class="share-link-btn" onclick="copyMatchLink('${encodedData}', '${m.team1}', '${m.team2}')">
                <span class="icon">🔗</span> مشاركة الرابط
              </button>
            </div>
          </div>
        `;
      }).join('');
      
      document.querySelectorAll('[data-matchid][data-team1]').forEach(btn => {
        if (!btn.disabled && !btn.onclick) {
          btn.addEventListener('click', function() {
            openPredictionModal(this.dataset.matchid, this.dataset.team1, this.dataset.team2, this.dataset.timeiso);
          });
        }
      });
      
    } catch (e) {
      console.error("renderUpcoming:", e);
      document.getElementById('matchesContainer').innerHTML = `<div class="empty-state"><span class="icon">⚠️</span> حدث خطأ</div>`;
    }
  }
  
  // ============================================================
  //  أحداث فلتر اليوم
  // ============================================================
  document.querySelectorAll('.day-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentDayFilter = this.dataset.day;
      renderUpcoming();
    });
  });
  
  // ============================================================
  //  ربط أحداث الفلاتر الأخرى
  // ============================================================
  document.getElementById('groupFilter')?.addEventListener('change', renderUpcoming);
  document.getElementById('matchSearchInput')?.addEventListener('input', renderUpcoming);
  
  // ============================================================
  //  🏆 LEADERBOARD
  // ============================================================
  function calculateLeaderboard(predictions, matches) {
    const scores = {};
    predictions.forEach(p => {
      if (!scores[p.user_name]) scores[p.user_name] = { name: p.user_name, points: 0, correct: 0, total: 0 };
      scores[p.user_name].total += 1;
    });
    
    predictions.forEach(p => {
      const parts = p.match_id.split('_');
      if (parts.length < 3) return;
      const team1 = parts[1], team2 = parts[2];
      const match = matches.find(m => (m.homeAr === team1 && m.awayAr === team2) || (m.homeAr === team2 && m.awayAr === team1));
      if (!match) return;
      let result = match.homeScore > match.awayScore ? match.homeAr : (match.homeScore < match.awayScore ? match.awayAr : "DRAW");
      if (p.prediction === result) {
        scores[p.user_name].points += 1;
        scores[p.user_name].correct += 1;
      }
    });
    
    return Object.values(scores).sort((a,b) => b.points - a.points);
  }
  
  function getBadges(index, accuracy, total) {
    const badges = [];
    if (index === 0) badges.push({ text: '🏆 البطل', cls: 'gold' });
    if (accuracy >= 80 && total >= 3) badges.push({ text: '🎯 دقيق', cls: 'precision' });
    if (total >= 10) badges.push({ text: '⚡ سريع', cls: 'speed' });
    if (accuracy >= 60 && total >= 5) badges.push({ text: '📊 محلل', cls: 'gold' });
    return badges;
  }
  
  async function renderLeaderboard() {
    const container = document.getElementById('leaderboardContainer');
    const totalPlayersSpan = document.getElementById('lbTotalPlayers');
    const totalPredictionsSpan = document.getElementById('lbTotalPredictions');
    
    const predictions = await getAllPredictions();
    allPredictionsCache = predictions;
    
    if (!previousGamesData || previousGamesData.length === 0) {
      container.innerHTML = `<div class="empty-state"><span class="icon">⏳</span> جاري تحميل النتائج...</div>`;
      return;
    }
    
    if (!predictions || predictions.length === 0) {
      container.innerHTML = `<div class="empty-state"><span class="icon">📭</span> لا توجد توقعات بعد</div>`;
      totalPlayersSpan.textContent = '0';
      totalPredictionsSpan.textContent = '0';
      return;
    }
    
    const board = calculateLeaderboard(predictions, previousGamesData);
    totalPlayersSpan.textContent = board.length;
    totalPredictionsSpan.textContent = predictions.length;
    
    if (board.length === 0) {
      container.innerHTML = `<div class="empty-state"><span class="icon">📭</span> لا توجد بيانات كافية</div>`;
      return;
    }
    
    const currentUser = localStorage.getItem('lastUserName') || '';
    const topThree = board.slice(0, 3);
    const rest = board.slice(3, 10);
    
    let html = '';
    
    if (topThree.length > 0) {
      const champ = topThree[0];
      const accuracy = champ.total > 0 ? Math.round((champ.correct / champ.total) * 100) : 0;
      const badges = getBadges(0, accuracy, champ.total);
      const isCurrentUser = champ.name === currentUser;
      
      html += `
        <div class="champion-card" style="${isCurrentUser ? 'border-color:#f0b429;box-shadow:0 0 40px rgba(240,180,41,0.12);' : ''}">
          <div class="rank-badge">🥇</div>
          <div class="avatar">${champ.name.charAt(0).toUpperCase()}</div>
          <div class="info">
            <div class="name">
              ${champ.name} ${isCurrentUser ? '👤' : ''}
              ${badges.map(b => `<span class="badge ${b.cls}">${b.text}</span>`).join('')}
            </div>
            <div class="stats-row">
              <span class="item">🏆 <strong>${champ.points}</strong> نقطة</span>
              <span class="item">✅ <strong class="highlight">${champ.correct}</strong> / ${champ.total}</span>
              <span class="item">📊 <strong>${accuracy}%</strong> نجاح</span>
            </div>
            <div class="progress-wrapper">
              <div class="progress-label">
                <span>نسبة النجاح</span>
                <span>${accuracy}%</span>
              </div>
              <div class="progress-bar">
                <div class="fill" style="width:${Math.min(accuracy, 100)}%;"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    
    if (rest.length > 0 || topThree.length > 1) {
      const allPlayers = [...topThree.slice(1), ...rest];
      const medals = ['🥈', '🥉', ...Array(rest.length).fill('')];
      
      html += `<div class="players-list">`;
      
      allPlayers.forEach((player, idx) => {
        const rank = idx + 2;
        const accuracy = player.total > 0 ? Math.round((player.correct / player.total) * 100) : 0;
        const isCurrentUser = player.name === currentUser;
        const medal = medals[idx] || `#${rank}`;
        let rankClass = '';
        if (rank === 2) rankClass = 'silver';
        else if (rank === 3) rankClass = 'bronze';
        
        let borderClass = '';
        if (rank === 2) borderClass = 'silver-border';
        else if (rank === 3) borderClass = 'bronze-border';
        
        const badges = getBadges(rank, accuracy, player.total);
        
        html += `
          <div class="player-card" onclick="openPlayerPredictions('${player.name}')" style="${isCurrentUser ? 'border-color:rgba(240,180,41,0.3);' : ''}">
            <div class="rank ${rankClass}">${medal}</div>
            <div class="avatar-sm ${borderClass}">${player.name.charAt(0).toUpperCase()}</div>
            <div class="info-sm">
              <div class="name-sm">
                ${player.name} ${isCurrentUser ? '👤' : ''}
                ${badges.slice(0, 2).map(b => `<span class="mini-badge ${b.cls}">${b.text}</span>`).join('')}
              </div>
              <div class="sub-sm">
                <span>✅ <span class="highlight">${player.correct}</span>/${player.total}</span>
                <span>📊 ${accuracy}%</span>
              </div>
              <div class="progress-mini">
                <div class="fill-mini" style="width:${Math.min(accuracy, 100)}%;"></div>
              </div>
            </div>
            <div class="points-sm">${player.points}</div>
            ${isCurrentUser ? `<div class="current-user-indicator active"></div>` : ''}
            ${isCurrentUser ? `<div class="pulse-dot"></div>` : ''}
          </div>
        `;
      });
      
      html += `</div>`;
    }
    
    container.innerHTML = html;
  }
  
  // ============================================================
  //  النوافذ المنبثقة
  // ============================================================
  function openPredictionModal(matchId, team1, team2, timeISO) {
    currentMatchId = matchId;
    currentTeam1 = team1;
    currentTeam2 = team2;
    currentTimeISO = timeISO;
    
    document.getElementById('modalTeam1').textContent = team1;
    document.getElementById('modalTeam2').textContent = team2;
    document.getElementById('optTeam1').textContent = team1;
    document.getElementById('optTeam2').textContent = team2;
    document.getElementById('modalFlag1').textContent = getFlag(team1);
    document.getElementById('modalFlag2').textContent = getFlag(team2);
    document.getElementById('modalDateTime').textContent = `📅 ${getDateTimeDisplay(timeISO)}`;
    document.getElementById('modalUserName').value = localStorage.getItem('lastUserName') || '';
    
    const savedUserName = localStorage.getItem('lastUserName') || '';
    if (savedUserName && hasUserPredicted(savedUserName, matchId)) {
      const existing = getUserPrediction(savedUserName, matchId);
      document.getElementById('modalMessage').textContent = `⚠️ توقعت سابقاً: ${existing.prediction === 'DRAW' ? 'تعادل' : existing.prediction}`;
      document.getElementById('modalMessage').className = 'modal-message warning';
      document.getElementById('modalSubmitBtn').disabled = true;
    } else {
      document.getElementById('modalMessage').textContent = '';
      document.getElementById('modalMessage').className = 'modal-message';
      document.getElementById('modalSubmitBtn').disabled = false;
    }
    
    document.querySelectorAll('input[name="prediction"]').forEach(el => el.checked = false);
    document.getElementById('predictionModal').classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  async function openViewPredictionsModal(matchId, team1, team2) {
    document.getElementById('viewTeam1').textContent = team1;
    document.getElementById('viewTeam2').textContent = team2;
    document.getElementById('viewFlag1').textContent = getFlag(team1);
    document.getElementById('viewFlag2').textContent = getFlag(team2);
    
    const listContainer = document.getElementById('viewPredictionsList');
    const countSpan = document.getElementById('viewPredictionsCount');
    
    listContainer.innerHTML = `<div class="empty-state"><span class="icon">⏳</span> جاري التحميل...</div>`;
    countSpan.textContent = '...';
    
    const predictions = await getPredictionsForMatch(matchId);
    countSpan.textContent = predictions.length;
    
    if (!predictions || predictions.length === 0) {
      listContainer.innerHTML = `<div class="empty-state"><span class="icon">📭</span> لا توجد توقعات لهذه المباراة</div>`;
    } else {
      listContainer.innerHTML = predictions.map(p => {
        let text = p.prediction === 'DRAW' ? '🤝 تعادل الفريقين' : `🏆 فوز ${getFlag(p.prediction)} ${p.prediction}`;
        return `
          <div class="prediction-card">
            <div class="user">
              <div class="avatar-p">${p.user_name ? p.user_name.charAt(0).toUpperCase() : '👤'}</div>
              <span class="name-p">${p.user_name || 'مجهول'}</span>
            </div>
            <div class="prediction-text">🔮 ${text}</div>
            <div style="font-size:0.65rem;color:var(--text-secondary);margin-top:4px;">🕒 ${p.created_at ? new Date(p.created_at).toLocaleString('ar') : 'تاريخ غير معروف'}</div>
          </div>
        `;
      }).join('');
    }
    
    document.getElementById('viewPredictionsModal').classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  async function openPlayerPredictions(userName) {
    document.getElementById('playerModalName').textContent = userName;
    const listContainer = document.getElementById('playerPredictionsList');
    
    listContainer.innerHTML = `<div class="empty-state"><span class="icon">⏳</span> جاري التحميل...</div>`;
    
    const predictions = await getPredictionsForUser(userName);
    
    if (!predictions || predictions.length === 0) {
      listContainer.innerHTML = `<div class="empty-state"><span class="icon">📭</span> لا توجد توقعات لهذا اللاعب</div>`;
    } else {
      listContainer.innerHTML = predictions.map(p => {
        const parts = p.match_id.split('_');
        const team1 = parts[1] || '?';
        const team2 = parts[2] || '?';
        let text = p.prediction === 'DRAW' ? '🤝 تعادل' : `🏆 فوز ${getFlag(p.prediction)} ${p.prediction}`;
        return `
          <div class="prediction-card">
            <div class="prediction-text">${team1} 🆚 ${team2}</div>
            <div class="prediction-text" style="color:var(--gold-light);">🔮 ${text}</div>
            <div style="font-size:0.6rem;color:var(--text-secondary);">🕒 ${p.created_at ? new Date(p.created_at).toLocaleString('ar') : 'تاريخ غير معروف'}</div>
          </div>
        `;
      }).join('');
    }
    
    document.getElementById('playerPredictionsModal').classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  // ============================================================
  //  إغلاق النوافذ
  // ============================================================
  function closePredictionModal() {
    document.getElementById('predictionModal').classList.remove('active');
    document.body.style.overflow = '';
  }
  
  function closeViewPredictionsModal() {
    document.getElementById('viewPredictionsModal').classList.remove('active');
    document.body.style.overflow = '';
  }
  
  function closePlayerPredictionsModal() {
    document.getElementById('playerPredictionsModal').classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // ============================================================
  //  حفظ التوقع
  // ============================================================
  document.getElementById('modalSubmitBtn').addEventListener('click', async function() {
    const userName = document.getElementById('modalUserName').value.trim();
    const selected = document.querySelector('input[name="prediction"]:checked');
    const msgEl = document.getElementById('modalMessage');
    
    if (!userName) {
      msgEl.textContent = '⚠️ الرجاء إدخال اسمك';
      msgEl.className = 'modal-message warning';
      return;
    }
    
    localStorage.setItem('lastUserName', userName);
    
    if (!selected) {
      msgEl.textContent = '⚠️ الرجاء اختيار توقع';
      msgEl.className = 'modal-message warning';
      return;
    }
    
    let prediction;
    if (selected.value === 'HOME') prediction = currentTeam1;
    else if (selected.value === 'AWAY') prediction = currentTeam2;
    else prediction = 'DRAW';
    
    if (isMatchLive(currentTimeISO)) {
      msgEl.textContent = '⛔ لا يمكن التوقع على مباراة جارية';
      msgEl.className = 'modal-message error';
      return;
    }
    
    if (hasUserPredicted(userName, currentMatchId)) {
      const existing = getUserPrediction(userName, currentMatchId);
      msgEl.textContent = `⚠️ توقعت مسبقاً: ${existing.prediction === 'DRAW' ? 'تعادل' : existing.prediction}`;
      msgEl.className = 'modal-message warning';
      this.disabled = true;
      return;
    }
    
    this.disabled = true;
    msgEl.textContent = '⏳ جاري الحفظ...';
    msgEl.className = 'modal-message';
    
    const result = await savePrediction(userName, currentMatchId, prediction);
    
    if (result.success) {
      msgEl.textContent = '✅ تم حفظ التوقع بنجاح! 🎉';
      msgEl.className = 'modal-message success';
      this.disabled = false;
      await renderAllPredictions();
      await renderLeaderboard();
      setTimeout(() => { renderUpcoming(); }, 300);
      setTimeout(closePredictionModal, 1200);
    } else {
      msgEl.textContent = result.message || '❌ فشل الحفظ';
      msgEl.className = 'modal-message error';
      this.disabled = false;
    }
  });
  
  // ============================================================
  //  عرض جميع التوقعات
  // ============================================================
  async function renderAllPredictions() {
    const container = document.getElementById('allPredictions');
    const countSpan = document.getElementById('predictionsCount');
    
    const predictions = await getAllPredictions();
    allPredictionsCache = predictions;
    countSpan.textContent = predictions.length;
    
    if (!predictions || predictions.length === 0) {
      container.innerHTML = `<div class="empty-state"><span class="icon">📭</span> لا توجد توقعات بعد</div>`;
      return;
    }
    
    container.innerHTML = predictions.slice(0, 20).map(p => {
      const parts = p.match_id.split('_');
      const team1 = parts[1] || '?';
      const team2 = parts[2] || '?';
      let text = p.prediction === 'DRAW' ? '🤝 تعادل' : `🏆 فوز ${getFlag(p.prediction)} ${p.prediction}`;
      return `
        <div class="prediction-card">
          <div class="user">
            <div class="avatar-p">${p.user_name ? p.user_name.charAt(0).toUpperCase() : '👤'}</div>
            <span class="name-p">${p.user_name || 'مجهول'}</span>
          </div>
          <div class="prediction-text">${team1} 🆚 ${team2}</div>
          <div class="prediction-text" style="color:var(--gold-light);">🔮 ${text}</div>
          <div style="font-size:0.6rem;color:var(--text-secondary);">🕒 ${p.created_at ? new Date(p.created_at).toLocaleString('ar') : 'تاريخ غير معروف'}</div>
        </div>
      `;
    }).join('');
  }
  
  // ============================================================
  //  المباريات السابقة
  // ============================================================
  let isLoadingPrevious = false;
  let retryCount = 0;
  const MAX_RETRIES = 2;
  
  function loadFromCache() {
    try {
      const cached = localStorage.getItem('previousGamesData');
      if (cached) {
        const data = JSON.parse(cached);
        if (data && data.length) { previousGamesData = data; return true; }
      }
    } catch (e) {}
    return false;
  }
  
  function saveToCache(data) {
    try { localStorage.setItem('previousGamesData', JSON.stringify(data)); } catch (e) {}
  }
  
  async function loadPreviousGames() {
    if (isLoadingPrevious) return;
    isLoadingPrevious = true;
    
    if (previousGamesData.length > 0) {
      renderPreviousGamesFiltered();
    } else {
      loadFromCache() && renderPreviousGamesFiltered();
    }
    
    try {
      const response = await fetch('https://worldcup26.ir/get/games');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!data?.games) throw new Error('تنسيق غير صحيح');
      
      const finished = data.games.filter(g => g.finished === "TRUE");
      const newData = finished.map(game => {
        const homeAr = translateToArabic(game.home_team_name_fa || game.home_team_name_en || '');
        const awayAr = translateToArabic(game.away_team_name_fa || game.away_team_name_en || '');
        const homeScore = parseInt(game.home_score, 10);
        const awayScore = parseInt(game.away_score, 10);
        let dateStr = game.local_date || '';
        let dayName = '', formattedDate = '', timeMatch = '';
        if (dateStr) {
          const parts = dateStr.split(' ');
          const dateParts = parts[0]?.split('/');
          if (dateParts && dateParts.length === 3) {
            const d = new Date(`${dateParts[2]}-${dateParts[0]}-${dateParts[1]}T12:00:00`);
            if (!isNaN(d)) {
              dayName = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'][d.getDay()];
              formattedDate = `${d.getDate()} ${['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'][d.getMonth()]} ${d.getFullYear()}`;
            }
          }
          if (parts.length > 1 && parts[1]?.match(/\d{2}:\d{2}/)) timeMatch = parts[1];
        }
        return { homeAr, awayAr, homeScore, awayScore, dayName, formattedDate, timeMatch };
      });
      
      previousGamesData = newData;
      saveToCache(newData);
      retryCount = 0;
      renderPreviousGamesFiltered();
      calculateStandings();
      await renderLeaderboard();
      
    } catch (e) {
      console.error("❌ تحميل السابقة:", e);
      if (previousGamesData.length === 0) {
        document.getElementById('previousMatchesContainer').innerHTML = `
          <div class="empty-state">
            <span class="icon">⚠️</span> فشل التحميل
            <button onclick="loadPreviousGames()" style="display:block;margin:12px auto 0;background:var(--gold);border:none;padding:8px 24px;border-radius:40px;font-weight:700;color:#0a1628;cursor:pointer;font-family:inherit;">🔄 إعادة المحاولة</button>
          </div>
        `;
      }
    } finally {
      isLoadingPrevious = false;
    }
  }
  
  function renderPreviousGamesFiltered() {
    const searchText = document.getElementById('prevSearchInput')?.value.trim().toLowerCase() || '';
    let filtered = previousGamesData;
    if (searchText) filtered = filtered.filter(g => g.homeAr.includes(searchText) || g.awayAr.includes(searchText));
    
    const container = document.getElementById('previousMatchesContainer');
    if (!filtered.length) {
      container.innerHTML = `<div class="empty-state"><span class="icon">📋</span> ${previousGamesData.length ? 'لا توجد مباريات مطابقة' : 'جاري التحميل...'}</div>`;
      return;
    }
    
    container.innerHTML = filtered.map(g => `
      <div class="match-card">
        <div class="match-teams">
          <div class="match-team"><span class="flag">${getFlag(g.homeAr)}</span> ${g.homeAr}</div>
          <div class="match-score finished">${g.homeScore} - ${g.awayScore}</div>
          <div class="match-team"><span class="flag">${getFlag(g.awayAr)}</span> ${g.awayAr}</div>
        </div>
        <div class="match-meta">
          <span class="tag">${g.dayName || 'تاريخ'}</span>
          <span class="tag">${g.formattedDate || ''} ${g.timeMatch || ''}</span>
          <span class="tag" style="color:var(--success);">✅ انتهت</span>
        </div>
      </div>
    `).join('');
  }
  
  // ============================================================
  //  ترتيب المجموعات
  // ============================================================
  function calculateStandings() {
    try {
      const standings = {};
      for (const [group, teams] of Object.entries(finalGroups)) {
        standings[group] = {};
        teams.forEach(team => { standings[group][team] = { played:0, wins:0, draws:0, losses:0, goalsFor:0, goalsAgainst:0, points:0 }; });
      }
      
      previousGamesData.forEach(game => {
        const { homeAr, awayAr, homeScore, awayScore } = game;
        let groupName = null;
        for (const [g, teams] of Object.entries(finalGroups)) {
          if (teams.includes(homeAr) && teams.includes(awayAr)) { groupName = g; break; }
        }
        if (!groupName) return;
        const stats = standings[groupName];
        if (!stats[homeAr] || !stats[awayAr]) return;
        
        stats[homeAr].played++; stats[awayAr].played++;
        stats[homeAr].goalsFor += homeScore; stats[homeAr].goalsAgainst += awayScore;
        stats[awayAr].goalsFor += awayScore; stats[awayAr].goalsAgainst += homeScore;
        if (homeScore > awayScore) {
          stats[homeAr].wins++; stats[homeAr].points += 3;
          stats[awayAr].losses++;
        } else if (awayScore > homeScore) {
          stats[awayAr].wins++; stats[awayAr].points += 3;
          stats[homeAr].losses++;
        } else {
          stats[homeAr].draws++; stats[awayAr].draws++;
          stats[homeAr].points++; stats[awayAr].points++;
        }
      });
      
      const container = document.getElementById('standingsContainer');
      let html = '';
      for (const [group, teamsStats] of Object.entries(standings)) {
        const tableRows = [];
        for (const [team, stat] of Object.entries(teamsStats)) {
          tableRows.push({ team, ...stat, diff: stat.goalsFor - stat.goalsAgainst });
        }
        tableRows.sort((a,b) => b.points - a.points || b.diff - a.diff || b.goalsFor - a.goalsFor);
        
        html += `
          <div class="group-card">
            <div class="group-title">المجموعة ${group}</div>
            <table class="standings-table">
              <thead><tr><th>#</th><th>الفريق</th><th>ل</th><th>ف</th><th>ت</th><th>خ</th><th>له</th><th>ع</th><th>±</th><th>ن</th></tr></thead>
              <tbody>
                ${tableRows.map((row, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td><div class="team-cell"><span>${getFlag(row.team)}</span> <span>${row.team}</span></div></td>
                    <td>${row.played}</td><td>${row.wins}</td><td>${row.draws}</td><td>${row.losses}</td>
                    <td>${row.goalsFor}</td><td>${row.goalsAgainst}</td>
                    <td>${row.diff}</td>
                    <td style="color:#000000;font-weight:800;">${row.points}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      }
      container.innerHTML = html || `<div class="empty-state"><span class="icon">📊</span> لا توجد نتائج كافية</div>`;
    } catch (e) {
      console.error("calculateStandings:", e);
      document.getElementById('standingsContainer').innerHTML = `<div class="empty-state"><span class="icon">⚠️</span> خطأ في حساب الترتيب</div>`;
    }
  }
  
  // ============================================================
  //  إدارة التبويبات
  // ============================================================
  function initTabs() {
    const btns = document.querySelectorAll('.tab-btn[data-tab]');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.getElementById(`${id}Tab`).classList.add('active');
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        toggleDayFilter(id);
        
        if (id === 'previous' && !previousGamesData.length) loadPreviousGames();
        if (id === 'standings' && !previousGamesData.length) loadPreviousGames();
        if (id === 'standings' && previousGamesData.length) calculateStandings();
        if (id === 'predictions') renderAllPredictions();
      });
    });
  }
  
  // ============================================================
  //  أحداث النوافذ
  // ============================================================
  document.getElementById('modalCloseBtn').addEventListener('click', closePredictionModal);
  document.getElementById('viewModalCloseBtn').addEventListener('click', closeViewPredictionsModal);
  document.getElementById('playerModalCloseBtn').addEventListener('click', closePlayerPredictionsModal);
  
  document.getElementById('predictionModal').addEventListener('click', function(e) {
    if (e.target === this) closePredictionModal();
  });
  document.getElementById('viewPredictionsModal').addEventListener('click', function(e) {
    if (e.target === this) closeViewPredictionsModal();
  });
  document.getElementById('playerPredictionsModal').addEventListener('click', function(e) {
    if (e.target === this) closePlayerPredictionsModal();
  });
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closePredictionModal();
      closeViewPredictionsModal();
      closePlayerPredictionsModal();
    }
  });
  
  // ============================================================
  //  البحث السريع
  // ============================================================
  document.getElementById('prevSearchInput')?.addEventListener('input', renderPreviousGamesFiltered);
  
  // ============================================================
  //  التحديث التلقائي
  // ============================================================
  function startAutoUpdate() {
    setInterval(renderUpcoming, 1000);
    setInterval(async () => {
      const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab;
      if (activeTab === 'previous') loadPreviousGames();
      if (activeTab === 'standings' && previousGamesData.length) calculateStandings();
      if (activeTab === 'predictions') await renderAllPredictions();
      await renderLeaderboard();
    }, 60000);
  }
  
  // ============================================================
  //  الوضع المظلم/الفاتح
  // ============================================================
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme === 'light' ? 'light' : '');
    localStorage.setItem('theme', newTheme);
    document.getElementById('themeToggleBtn').textContent = newTheme === 'light' ? '☀️ الوضع الفاتح' : '🌙 الوضع المظلم';
  }
  
  if (localStorage.getItem('theme') === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    document.getElementById('themeToggleBtn').textContent = '☀️ الوضع الفاتح';
  }
  
  // ============================================================
  //  مشاركة النتائج
  // ============================================================
  function shareResults() {
    const currentUser = localStorage.getItem('lastUserName') || 'لاعب';
    const userScore = document.querySelector('.champion-card .info .stats-row .item:first-child strong')?.textContent || '0';
    const userRank = document.querySelector('.champion-card .rank-badge')?.textContent || '🥇';
    const totalPlayers = document.getElementById('lbTotalPlayers')?.textContent || '0';
    
    const shareText = `🏆 كأس العالم 2026\n\n👤 ${currentUser}\n📊 النقاط: ${userScore}\n🏅 الترتيب: ${userRank}\n👥 عدد اللاعبين: ${totalPlayers}\n\n✨ توقع · تنافس · اربح ✨\n#كأس_العالم_2026 #توقعات`;
    
    if (navigator.share) {
      navigator.share({
        title: 'نتائجي في كأس العالم 2026',
        text: shareText,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        alert('✅ تم نسخ النتائج إلى الحافظة!');
      }).catch(() => {
        prompt('انسخ النص التالي للمشاركة:', shareText);
      });
    }
  }
  
  // ============================================================
  //  التهيئة
  // ============================================================
  async function init() {
    console.log("🚀 تهيئة التطبيق...");
    initTabs();
    renderUpcoming();
    startAutoUpdate();
    
    toggleDayFilter('upcoming');
    
    if (!loadFromCache()) {
      console.log("📭 لا توجد بيانات في الكاش");
    }
    
    setTimeout(loadPreviousGames, 500);
    await renderAllPredictions();
    await renderLeaderboard();
    
    // فحص الرابط عند التحميل
    checkUrlForMatch();
    
    console.log("✅ التطبيق جاهز");
  }
  
  window.openViewPredictionsModal = openViewPredictionsModal;
  window.openPlayerPredictions = openPlayerPredictions;
  window.loadPreviousGames = loadPreviousGames;
  window.toggleTheme = toggleTheme;
  window.shareResults = shareResults;
  window.copyMatchLink = copyMatchLink;
  
  init();
</script>
</body>
</html>