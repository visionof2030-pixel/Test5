
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>🏆 كأس العالم 2026 – المتتبع التفاعلي</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    /* ============================================================
       الأنماط الأساسية
       ============================================================ */
    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    
    :root {
      --primary: #0a1628;
      --secondary: #111f33;
      --card-bg: rgba(18, 30, 50, 0.85);
      --gold: #f0b429;
      --gold-glow: rgba(240, 180, 41, 0.25);
      --gold-light: #ffd966;
      --success: #2ecc71;
      --danger: #e74c3c;
      --text-primary: #f0f4ff;
      --text-secondary: #8899bb;
      --border-gold: rgba(240, 180, 41, 0.25);
      --shadow-gold: 0 8px 32px rgba(240, 180, 41, 0.08);
      --radius-lg: 28px;
      --radius-md: 18px;
      --radius-sm: 12px;
      --transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      --bg-body: radial-gradient(ellipse at 20% 20%, #0f1f3a, #060e1a);
      --bg-header: rgba(10, 22, 40, 0.92);
      --bg-card: rgba(18, 30, 50, 0.85);
      --border-color: rgba(255,255,255,0.05);
    }
    
    [data-theme="light"] {
      --primary: #f0f4ff;
      --secondary: #e8edf5;
      --card-bg: rgba(255, 255, 255, 0.92);
      --text-primary: #1a2332;
      --text-secondary: #5a6a7e;
      --bg-body: radial-gradient(ellipse at 20% 20%, #e8edf5, #d5dce6);
      --bg-header: rgba(255, 255, 255, 0.92);
      --bg-card: rgba(255, 255, 255, 0.92);
      --border-color: rgba(0,0,0,0.06);
      --shadow-gold: 0 8px 32px rgba(240, 180, 41, 0.12);
    }
    
    html { scroll-behavior: smooth; }
    
    body {
      background: var(--bg-body);
      font-family: 'Cairo', 'Segoe UI', sans-serif;
      padding: 16px 12px 40px;
      min-height: 100vh;
      color: var(--text-primary);
      font-size: 14px;
      line-height: 1.6;
      transition: var(--transition);
    }
    
    .app-container { max-width: 1200px; margin: 0 auto; width: 100%; }
    
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); border-radius: 10px; }
    ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 10px; }
    
    /* ============================================================
       الهيدر
       ============================================================ */
    .sticky-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--bg-header);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-radius: 0 0 32px 32px;
      padding: 14px 20px;
      margin: -16px -12px 20px;
      border-bottom: 1px solid var(--border-gold);
      box-shadow: 0 4px 30px rgba(0,0,0,0.4);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      transition: var(--transition);
    }
    
    .sticky-header .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .sticky-header .brand .icon { font-size: 1.8rem; }
    .sticky-header .brand h1 {
      font-size: 1.2rem;
      font-weight: 900;
      background: linear-gradient(135deg, var(--gold-light), var(--gold));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      letter-spacing: -0.5px;
    }
    
    .sticky-header .brand .sub {
      font-size: 0.6rem;
      color: var(--text-secondary);
      font-weight: 400;
      display: block;
      margin-top: -2px;
    }
    
    .sticky-header .header-actions {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }
    
    .sticky-header .header-btn {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.08);
      color: var(--text-secondary);
      padding: 8px 14px;
      border-radius: 40px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: inherit;
    }
    
    .sticky-header .header-btn:hover {
      background: rgba(240, 180, 41, 0.12);
      border-color: var(--gold);
      color: var(--gold-light);
      transform: translateY(-1px);
    }
    
    /* ============================================================
       شريط الأخبار
       ============================================================ */
    .news-ticker-wrapper {
      background: rgba(240, 180, 41, 0.06);
      border: 1px solid var(--border-gold);
      border-radius: 60px;
      padding: 6px 18px;
      margin-bottom: 20px;
      overflow: hidden;
      box-shadow: var(--shadow-gold);
    }
    
    .news-ticker {
      display: inline-block;
      white-space: nowrap;
      animation: tickerScroll 45s linear infinite;
      font-size: 0.75rem;
      color: var(--text-secondary);
      font-weight: 500;
    }
    
    .news-ticker span { display: inline-block; padding: 0 14px; }
    .news-ticker .sep { color: var(--gold); opacity: 0.3; }
    .news-ticker .highlight { color: var(--gold-light); font-weight: 700; }
    
    @keyframes tickerScroll {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    .news-ticker-wrapper:hover .news-ticker { animation-play-state: paused; }
    
    /* ============================================================
       شريط التحكم (مبسط)
       ============================================================ */
    .controls-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
      background: var(--card-bg);
      backdrop-filter: blur(12px);
      border-radius: var(--radius-lg);
      padding: 16px 20px;
      border: 1px solid var(--border-color);
      transition: var(--transition);
    }
    
    .controls-bar .control-group {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      flex: 1;
      min-width: 140px;
    }
    
    .controls-bar .control-group label {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .controls-bar select, .controls-bar input {
      padding: 8px 14px;
      border-radius: 40px;
      border: 2px solid var(--border-color);
      background: rgba(255,255,255,0.04);
      color: var(--text-primary);
      font-size: 0.8rem;
      outline: none;
      transition: var(--transition);
      font-family: inherit;
      flex: 1;
      min-width: 100px;
    }
    
    .controls-bar select:focus, .controls-bar input:focus {
      border-color: var(--gold);
      background: rgba(240, 180, 41, 0.04);
    }
    
    .controls-bar select option {
      background: var(--primary);
      color: var(--text-primary);
    }
    
    /* ============================================================
       أزرار التبويب مع فلتر اليوم
       ============================================================ */
    .tabs-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 16px 0 20px;
      align-items: center;
    }
    
    .tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      flex: 1;
    }
    
    .tab-btn {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.06);
      padding: 10px 20px;
      border-radius: 60px;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      color: var(--text-secondary);
      transition: var(--transition);
      font-family: inherit;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    
    .tab-btn:hover { background: rgba(255,255,255,0.08); color: var(--text-primary); }
    .tab-btn.active {
      background: linear-gradient(135deg, rgba(240, 180, 41, 0.2), rgba(240, 180, 41, 0.05));
      border-color: var(--gold);
      color: var(--gold-light);
      box-shadow: 0 0 30px rgba(240, 180, 41, 0.05);
    }
    
    .day-filter-tabs {
      display: flex;
      gap: 6px;
      background: rgba(255,255,255,0.04);
      padding: 4px;
      border-radius: 40px;
      border: 1px solid var(--border-color);
    }
    
    .day-filter-tabs .day-btn {
      padding: 6px 14px;
      border-radius: 30px;
      border: none;
      background: transparent;
      color: var(--text-secondary);
      font-size: 0.7rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
      font-family: inherit;
    }
    
    .day-filter-tabs .day-btn:hover {
      color: var(--text-primary);
      background: rgba(255,255,255,0.04);
    }
    
    .day-filter-tabs .day-btn.active {
      background: rgba(240, 180, 41, 0.15);
      color: var(--gold-light);
    }
    
    .tab-content { display: none; animation: fadeUp 0.4s ease; }
    .tab-content.active { display: block; }
    
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .section-title {
      font-size: 1.3rem;
      font-weight: 800;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    .section-title .gold { color: var(--gold); }
    .section-title .badge-count {
      background: rgba(240, 180, 41, 0.15);
      color: var(--gold-light);
      font-size: 0.7rem;
      padding: 2px 12px;
      border-radius: 40px;
      font-weight: 600;
    }
    
    /* ============================================================
       LEADERBOARD
       ============================================================ */
    .leaderboard-section {
      background: linear-gradient(145deg, rgba(10, 22, 40, 0.95), rgba(20, 40, 70, 0.9));
      border: 1px solid var(--border-gold);
      border-radius: var(--radius-lg);
      padding: 24px;
      margin: 0 0 28px 0;
      box-shadow: 0 12px 48px rgba(240, 180, 41, 0.06), inset 0 1px 0 rgba(240, 180, 41, 0.1);
      position: relative;
      overflow: hidden;
      transition: var(--transition);
    }
    
    [data-theme="light"] .leaderboard-section {
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(240, 245, 250, 0.9));
      border-color: rgba(240, 180, 41, 0.3);
    }
    
    .leaderboard-section .lb-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 20px;
      position: relative;
      z-index: 1;
    }
    
    .leaderboard-section .lb-header .title {
      font-size: 1.4rem;
      font-weight: 900;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .leaderboard-section .lb-header .title .trophy { font-size: 1.8rem; }
    .leaderboard-section .lb-header .title span { background: linear-gradient(135deg, var(--gold-light), var(--gold)); -webkit-background-clip: text; background-clip: text; color: transparent; }
    
    .leaderboard-section .lb-header .lb-stats {
      display: flex;
      gap: 16px;
      font-size: 0.75rem;
      color: var(--text-secondary);
      align-items: center;
      flex-wrap: wrap;
    }
    
    .leaderboard-section .lb-header .lb-stats .stat { display: flex; align-items: center; gap: 4px; }
    .leaderboard-section .lb-header .lb-stats .stat .num { color: var(--gold-light); font-weight: 800; }
    
    .share-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 40px;
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.04);
      color: var(--text-secondary);
      font-size: 0.7rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
      font-family: inherit;
    }
    
    .share-btn:hover {
      border-color: var(--gold);
      color: var(--gold-light);
      background: rgba(240, 180, 41, 0.06);
    }
    
    .champion-card {
      background: linear-gradient(135deg, rgba(240, 180, 41, 0.12), rgba(240, 180, 41, 0.03));
      border: 1px solid var(--gold);
      border-radius: var(--radius-lg);
      padding: 24px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
      position: relative;
      overflow: hidden;
      transition: var(--transition);
      box-shadow: 0 0 40px rgba(240, 180, 41, 0.05);
    }
    
    .champion-card .rank-badge { font-size: 2.8rem; min-width: 60px; text-align: center; }
    
    .champion-card .avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--gold), #d49a1a);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      font-weight: 900;
      color: #0a1628;
      box-shadow: 0 0 30px rgba(240, 180, 41, 0.2);
      flex-shrink: 0;
    }
    
    .champion-card .info { flex: 1; min-width: 150px; }
    
    .champion-card .info .name {
      font-size: 1.3rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    .champion-card .info .name .badge {
      font-size: 0.55rem;
      padding: 2px 12px;
      border-radius: 40px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .champion-card .info .name .badge.gold { background: rgba(240, 180, 41, 0.2); color: var(--gold-light); border: 1px solid rgba(240, 180, 41, 0.2); }
    .champion-card .info .name .badge.precision { background: rgba(46, 204, 113, 0.15); color: var(--success); border: 1px solid rgba(46, 204, 113, 0.15); }
    .champion-card .info .name .badge.speed { background: rgba(52, 152, 219, 0.15); color: #5dade2; border: 1px solid rgba(52, 152, 219, 0.15); }
    
    .champion-card .info .stats-row {
      display: flex;
      gap: 20px;
      margin-top: 8px;
      flex-wrap: wrap;
    }
    
    .champion-card .info .stats-row .item {
      font-size: 0.8rem;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .champion-card .info .stats-row .item strong { color: var(--text-primary); font-weight: 700; }
    .champion-card .info .stats-row .item .highlight { color: var(--gold-light); }
    
    .champion-card .progress-wrapper { width: 100%; margin-top: 12px; }
    
    .champion-card .progress-wrapper .progress-label {
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      color: var(--text-secondary);
      margin-bottom: 4px;
    }
    
    .champion-card .progress-bar {
      width: 100%;
      height: 6px;
      background: rgba(255,255,255,0.06);
      border-radius: 10px;
      overflow: hidden;
    }
    
    .champion-card .progress-bar .fill {
      height: 100%;
      background: linear-gradient(90deg, var(--gold), var(--gold-light));
      border-radius: 10px;
      transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      width: 0%;
      position: relative;
    }
    
    .players-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
      position: relative;
      z-index: 1;
    }
    
    .player-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: var(--radius-md);
      padding: 14px 18px;
      display: flex;
      align-items: center;
      gap: 14px;
      transition: var(--transition);
      cursor: pointer;
      position: relative;
    }
    
    .player-card:hover {
      background: rgba(255,255,255,0.06);
      border-color: var(--border-gold);
      transform: translateX(-4px);
    }
    
    .player-card .rank {
      font-size: 1.1rem;
      font-weight: 800;
      min-width: 32px;
      color: var(--text-secondary);
    }
    
    .player-card .rank.gold { color: #FFD700; }
    .player-card .rank.silver { color: #C0C0C0; }
    .player-card .rank.bronze { color: #CD7F32; }
    
    .player-card .avatar-sm {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(240, 180, 41, 0.2), rgba(240, 180, 41, 0.05));
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 0.9rem;
      color: var(--text-primary);
      flex-shrink: 0;
      border: 2px solid transparent;
      transition: var(--transition);
    }
    
    .player-card .avatar-sm.gold-border { border-color: var(--gold); }
    .player-card .avatar-sm.silver-border { border-color: #C0C0C0; }
    .player-card .avatar-sm.bronze-border { border-color: #CD7F32; }
    
    .player-card .info-sm { flex: 1; min-width: 0; }
    
    .player-card .info-sm .name-sm {
      font-weight: 700;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    
    .player-card .info-sm .name-sm .mini-badge {
      font-size: 0.45rem;
      padding: 1px 8px;
      border-radius: 40px;
      font-weight: 700;
    }
    
    .player-card .info-sm .name-sm .mini-badge.gold { background: rgba(240, 180, 41, 0.15); color: var(--gold-light); }
    .player-card .info-sm .name-sm .mini-badge.green { background: rgba(46, 204, 113, 0.12); color: var(--success); }
    .player-card .info-sm .name-sm .mini-badge.blue { background: rgba(52, 152, 219, 0.12); color: #5dade2; }
    
    .player-card .info-sm .sub-sm {
      font-size: 0.65rem;
      color: var(--text-secondary);
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .player-card .info-sm .sub-sm .highlight { color: var(--gold-light); font-weight: 600; }
    
    .player-card .points-sm {
      background: linear-gradient(135deg, var(--gold), #d49a1a);
      padding: 2px 14px;
      border-radius: 40px;
      font-weight: 800;
      font-size: 0.85rem;
      color: #0a1628;
      min-width: 40px;
      text-align: center;
    }
    
    .player-card .progress-mini {
      width: 60px;
      height: 4px;
      background: rgba(255,255,255,0.06);
      border-radius: 10px;
      overflow: hidden;
      margin-top: 4px;
    }
    
    .player-card .progress-mini .fill-mini {
      height: 100%;
      background: linear-gradient(90deg, var(--gold), var(--gold-light));
      border-radius: 10px;
      transition: width 0.6s ease;
      width: 0%;
    }
    
    .player-card .current-user-indicator {
      position: absolute;
      top: -1px;
      left: -1px;
      right: -1px;
      bottom: -1px;
      border: 2px solid var(--gold);
      border-radius: var(--radius-md);
      pointer-events: none;
      opacity: 0;
      transition: var(--transition);
      box-shadow: 0 0 30px rgba(240, 180, 41, 0.05);
    }
    
    .player-card .current-user-indicator.active { opacity: 1; }
    
    .player-card .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--success);
      animation: pulseDot 1.5s infinite;
    }
    
    @keyframes pulseDot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.8); }
    }
    
    /* ============================================================
       المباريات
       ============================================================ */
    .matches-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 18px;
    }
    
    .match-card {
      background: var(--card-bg);
      backdrop-filter: blur(12px);
      border-radius: var(--radius-lg);
      padding: 18px;
      border: 1px solid var(--border-color);
      transition: var(--transition);
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    }
    
    .match-card:hover { transform: translateY(-3px); border-color: var(--border-gold); }
    .match-card.live { border-color: var(--danger); box-shadow: 0 0 30px rgba(231, 76, 60, 0.15); }
    
    .match-teams {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      background: rgba(0,0,0,0.25);
      padding: 12px 14px;
      border-radius: 60px;
    }
    
    .match-team {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 0.85rem;
      flex: 1;
      justify-content: center;
    }
    
    .match-team .flag { font-size: 1.3rem; }
    
    .match-score {
      background: linear-gradient(135deg, var(--gold), #d49a1a);
      padding: 2px 16px;
      border-radius: 40px;
      font-weight: 800;
      font-size: 0.95rem;
      color: #0a1628;
      min-width: 50px;
      text-align: center;
    }
    
    .match-score.live { background: linear-gradient(135deg, var(--danger), #c0392b); animation: pulseScore 1.2s infinite; color: white; }
    .match-score.finished { background: linear-gradient(135deg, var(--success), #27ae60); color: white; }
    
    @keyframes pulseScore {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(231,76,60,0.3); }
    }
    
    .match-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .match-meta .tag {
      background: rgba(255,255,255,0.05);
      padding: 4px 14px;
      border-radius: 40px;
      font-size: 0.65rem;
      font-weight: 600;
      color: var(--text-secondary);
    }
    
    .match-meta .timer {
      font-family: 'Courier New', monospace;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-secondary);
    }
    
    .match-meta .timer.live { color: var(--danger); animation: pulseText 1s infinite; }
    
    @keyframes pulseText {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    /* ============================================================
       المجموعات
       ============================================================ */
    .groups-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 20px;
    }
    
    .group-card {
      background: var(--card-bg);
      backdrop-filter: blur(12px);
      border-radius: var(--radius-lg);
      padding: 18px;
      border: 1px solid var(--border-color);
      transition: var(--transition);
    }
    
    .group-card:hover { border-color: var(--border-gold); }
    
    .group-card .group-title {
      font-size: 1.2rem;
      font-weight: 800;
      text-align: center;
      margin-bottom: 14px;
      color: var(--gold-light);
    }
    
    .standings-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.7rem;
    }
    
    .standings-table th {
      background: rgba(255,255,255,0.04);
      color: var(--text-secondary);
      padding: 8px 4px;
      text-align: center;
      font-weight: 700;
      border-radius: 8px 8px 0 0;
    }
    
    .standings-table td {
      padding: 6px 4px;
      text-align: center;
      border-bottom: 1px solid rgba(255,255,255,0.03);
      color: #000000;
      font-weight: 600;
    }
    
    .standings-table .team-cell {
      display: flex;
      align-items: center;
      gap: 6px;
      justify-content: flex-start;
      font-weight: 700;
      color: #000000;
    }
    
    .standings-table .team-cell span:last-child { color: #000000; }
    .standings-table td:last-child { color: #000000; font-weight: 800; }
    
    /* ============================================================
       التوقعات
       ============================================================ */
    .predictions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }
    
    .prediction-card {
      background: var(--card-bg);
      backdrop-filter: blur(12px);
      border-radius: var(--radius-md);
      padding: 16px;
      border: 1px solid var(--border-color);
      transition: var(--transition);
    }
    
    .prediction-card:hover { border-color: var(--border-gold); transform: translateY(-2px); }
    
    .prediction-card .user {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }
    
    .prediction-card .user .avatar-p {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--gold), #d49a1a);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      color: #0a1628;
      font-size: 0.8rem;
    }
    
    .prediction-card .user .name-p { font-weight: 700; }
    .prediction-card .prediction-text { font-size: 0.85rem; color: var(--text-secondary); }
    .prediction-card .prediction-text .highlight { color: var(--gold-light); font-weight: 700; }
    
    /* ============================================================
       حالة عدم وجود بيانات
       ============================================================ */
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: var(--text-secondary);
      background: rgba(255,255,255,0.02);
      border-radius: var(--radius-lg);
      border: 1px dashed rgba(255,255,255,0.06);
      grid-column: 1/-1;
    }
    
    .empty-state .icon { font-size: 2.5rem; display: block; margin-bottom: 12px; }
    
    /* ============================================================
       النوافذ المنبثقة
       ============================================================ */
    .modal-overlay {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.75);
      backdrop-filter: blur(16px);
      z-index: 9999;
      justify-content: center;
      align-items: center;
      animation: fadeInModal 0.3s ease;
    }
    
    .modal-overlay.active { display: flex; }
    
    @keyframes fadeInModal {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    
    .modal-content {
      background: linear-gradient(145deg, rgba(12, 28, 50, 0.97), rgba(6, 16, 30, 0.98));
      border: 1px solid var(--border-gold);
      border-radius: var(--radius-lg);
      padding: 28px;
      max-width: 460px;
      width: 95%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 30px 80px rgba(0,0,0,0.6);
      position: relative;
    }
    
    .modal-close {
      position: absolute;
      top: 12px;
      left: 16px;
      background: rgba(255,255,255,0.04);
      border: none;
      color: var(--text-secondary);
      font-size: 1.4rem;
      cursor: pointer;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition);
    }
    
    .modal-close:hover { background: rgba(231,76,60,0.15); color: var(--danger); }
    
    .modal-title {
      text-align: center;
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--gold-light);
      margin-bottom: 16px;
      padding-top: 6px;
    }
    
    .modal-teams {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
      background: rgba(0,0,0,0.2);
      padding: 12px;
      border-radius: 60px;
      margin-bottom: 16px;
    }
    
    .modal-teams .m-team { font-weight: 700; display: flex; align-items: center; gap: 6px; }
    .modal-teams .m-team .flag { font-size: 1.4rem; }
    .modal-teams .m-vs { color: var(--text-secondary); font-size: 0.7rem; }
    
    .modal-options {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }
    
    .modal-options label {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 60px;
      background: rgba(255,255,255,0.03);
      border: 2px solid transparent;
      cursor: pointer;
      transition: var(--transition);
    }
    
    .modal-options label:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.06); }
    .modal-options input[type="radio"] {
      appearance: none;
      width: 18px;
      height: 18px;
      border: 2px solid var(--text-secondary);
      border-radius: 50%;
      flex-shrink: 0;
      cursor: pointer;
      transition: var(--transition);
      position: relative;
    }
    
    .modal-options input[type="radio"]:checked {
      border-color: var(--gold);
      background: var(--gold);
    }
    
    .modal-options input[type="radio"]:checked::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #0a1628;
      font-weight: 900;
      font-size: 10px;
    }
    
    .modal-options .opt-label { font-weight: 600; }
    .modal-options .opt-sub { font-size: 0.65rem; color: var(--text-secondary); }
    
    .modal-input { margin-bottom: 16px; }
    
    .modal-input input {
      width: 100%;
      padding: 12px 18px;
      border-radius: 60px;
      border: 2px solid rgba(255,255,255,0.06);
      background: rgba(255,255,255,0.03);
      color: var(--text-primary);
      font-size: 0.9rem;
      outline: none;
      transition: var(--transition);
      font-family: inherit;
    }
    
    .modal-input input:focus { border-color: var(--gold); background: rgba(255,255,255,0.05); }
    .modal-input input::placeholder { color: var(--text-secondary); }
    
    .modal-submit {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: 60px;
      background: linear-gradient(135deg, var(--gold), #d49a1a);
      color: #0a1628;
      font-weight: 800;
      font-size: 1rem;
      cursor: pointer;
      transition: var(--transition);
      font-family: inherit;
    }
    
    .modal-submit:hover { transform: scale(1.02); box-shadow: 0 0 30px rgba(240, 180, 41, 0.2); }
    .modal-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .modal-submit:active { transform: scale(0.97); }
    
    .modal-message {
      margin-top: 12px;
      text-align: center;
      font-size: 0.85rem;
      padding: 8px 12px;
      border-radius: 40px;
      font-weight: 600;
    }
    
    .modal-message.success { color: var(--success); background: rgba(46,204,113,0.08); }
    .modal-message.error { color: var(--danger); background: rgba(231,76,60,0.08); }
    .modal-message.warning { color: var(--gold-light); background: rgba(240,180,41,0.08); }
    
    /* ============================================================
       المسابقات (معدلة)
       ============================================================ */
    .competitions-section {
      background: var(--card-bg);
      backdrop-filter: blur(12px);
      border-radius: var(--radius-lg);
      padding: 20px;
      border: 1px solid var(--border-gold);
      margin-bottom: 20px;
    }
    
    .competitions-section .comp-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 16px;
    }
    
    .competitions-section .comp-header h3 {
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--gold-light);
    }
    
    .competitions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 12px;
    }
    
    .competition-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 14px;
      text-align: center;
      transition: var(--transition);
    }
    
    .competition-card:hover {
      border-color: var(--gold);
      transform: translateY(-2px);
    }
    
    .competition-card .comp-icon { font-size: 2rem; display: block; margin-bottom: 4px; }
    .competition-card .comp-name { font-weight: 700; font-size: 0.85rem; }
    .competition-card .comp-desc { font-size: 0.65rem; color: var(--text-secondary); margin: 4px 0; }
    .competition-card .comp-prize { font-size: 0.7rem; color: var(--gold-light); font-weight: 600; }
    
    .footer {
      margin-top: 48px;
      text-align: center;
      font-size: 0.65rem;
      color: var(--text-secondary);
      border-top: 1px solid rgba(255,255,255,0.04);
      padding-top: 20px;
    }
    
    .footer .gold-text { color: var(--gold-light); }
    
    /* ============================================================
       استعلامات الوسائط
       ============================================================ */
    @media (max-width: 640px) {
      body { padding: 10px 8px 30px; }
      
      .sticky-header {
        padding: 10px 14px;
        margin: -10px -8px 16px;
        border-radius: 0 0 24px 24px;
      }
      
      .sticky-header .brand h1 { font-size: 1rem; }
      .sticky-header .brand .sub { font-size: 0.5rem; }
      .sticky-header .header-btn { padding: 6px 10px; font-size: 0.6rem; }
      
      .controls-bar { padding: 12px 14px; }
      .controls-bar .control-group { min-width: 100%; }
      .controls-bar select, .controls-bar input { font-size: 0.7rem; padding: 6px 10px; }
      
      .tabs-container { flex-direction: column; align-items: stretch; }
      .tabs { justify-content: center; }
      .day-filter-tabs { justify-content: center; }
      
      .leaderboard-section { padding: 16px; margin: 0 0 20px 0; }
      .leaderboard-section .lb-header .title { font-size: 1.1rem; }
      .leaderboard-section .lb-header .lb-stats { font-size: 0.65rem; gap: 8px; flex-wrap: wrap; }
      
      .champion-card {
        padding: 18px;
        flex-direction: column;
        text-align: center;
        gap: 12px;
      }
      
      .champion-card .rank-badge { font-size: 2.2rem; min-width: auto; }
      .champion-card .avatar { width: 60px; height: 60px; font-size: 1.4rem; }
      .champion-card .info .name { font-size: 1.1rem; justify-content: center; }
      .champion-card .info .stats-row { justify-content: center; gap: 12px; }
      
      .players-list { grid-template-columns: 1fr; gap: 8px; }
      .player-card { padding: 12px 14px; }
      .player-card .info-sm .name-sm { font-size: 0.8rem; }
      .player-card .points-sm { font-size: 0.75rem; padding: 2px 10px; }
      .player-card .progress-mini { width: 40px; }
      
      .tab-btn { padding: 8px 14px; font-size: 0.7rem; }
      .day-filter-tabs .day-btn { padding: 4px 10px; font-size: 0.65rem; }
      
      .matches-grid { grid-template-columns: 1fr; gap: 14px; }
      .match-team { font-size: 0.75rem; }
      .match-team .flag { font-size: 1.1rem; }
      
      .groups-container { grid-template-columns: 1fr; }
      .standings-table { font-size: 0.6rem; }
      .standings-table th, .standings-table td { padding: 4px 2px; }
      
      .predictions-grid { grid-template-columns: 1fr; }
      
      .modal-content { padding: 20px; }
      .modal-teams { flex-wrap: wrap; gap: 6px; }
      .modal-teams .m-team { font-size: 0.85rem; }
      .modal-options label { padding: 10px 14px; }
      
      .competitions-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
    }
    
    @media (min-width: 768px) {
      .matches-grid { grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); }
      .players-list { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
    }
    
    @media (min-width: 1024px) {
      .matches-grid { grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); }
    }
  </style>
</head>
<body>

<div class="app-container">
  
  <!-- ===== الهيدر الثابت ===== -->
  <header class="sticky-header">
    <div class="brand">
      <span class="icon">🏆</span>
      <div>
        <h1>كأس العالم 2026</h1>
        <span class="sub">⚡ المتتبع التفاعلي · غرفة معلمي سعيد بن العاص</span>
      </div>
    </div>
    <div class="header-actions">
      <button class="header-btn" id="themeToggleBtn" onclick="toggleTheme()">
        🌙 الوضع المظلم
      </button>
      <button class="header-btn" onclick="shareResults()">
        📤 مشاركة
      </button>
      <button class="header-btn" onclick="location.reload()">
        🔄 تحديث
      </button>
    </div>
  </header>
  
  <!-- ===== شريط الأخبار ===== -->
  <div class="news-ticker-wrapper">
    <div class="news-ticker">
      <span>🏆 <span class="highlight">كأس العالم 2026</span> — تابع المباريات، توقع النتائج، وتنافس مع الأصدقاء</span>
      <span class="sep">|</span>
      <span>🗳️ <span class="highlight">طريقة التوقع:</span> اختر المباراة → اختر الفائز أو التعادل → أدخل اسمك → احفظ التوقع</span>
      <span class="sep">|</span>
      <span>🏅 كل توقع صحيح = <span class="highlight">نقطة</span> · تصدر لوحة المتصدرين!</span>
      <span class="sep">|</span>
      <span>⛔ لا يمكن التوقع على المباريات الجارية</span>
    </div>
  </div>
  
  <!-- ============================================================
       🏆 LEADERBOARD
       ============================================================ -->
  <div class="leaderboard-section" id="leaderboardSection">
    <div class="lb-header">
      <div class="title">
        <span class="trophy">🏆</span>
        <span>لوحة المتصدرين</span>
      </div>
      <div class="lb-stats">
        <span class="stat">👥 <span class="num" id="lbTotalPlayers">0</span> لاعب</span>
        <span class="stat">📊 <span class="num" id="lbTotalPredictions">0</span> توقع</span>
        <button class="share-btn" onclick="shareResults()">📤 مشاركة</button>
      </div>
    </div>
    <div id="leaderboardContainer">
      <div class="empty-state"><span class="icon">⏳</span> جاري تحميل الترتيب...</div>
    </div>
  </div>
  
  <!-- ============================================================
       شريط التحكم (مبسط - فقط مجموعة وبحث)
       ============================================================ -->
  <div class="controls-bar">
    <div class="control-group">
      <label>🏷️ المجموعة</label>
      <select id="groupFilter">
        <option value="all">جميع المجموعات</option>
        <option value="A">المجموعة A</option>
        <option value="B">المجموعة B</option>
        <option value="C">المجموعة C</option>
        <option value="D">المجموعة D</option>
        <option value="E">المجموعة E</option>
        <option value="F">المجموعة F</option>
        <option value="G">المجموعة G</option>
        <option value="H">المجموعة H</option>
        <option value="I">المجموعة I</option>
        <option value="J">المجموعة J</option>
        <option value="K">المجموعة K</option>
        <option value="L">المجموعة L</option>
      </select>
    </div>
    <div class="control-group">
      <label>🔍 بحث</label>
      <input type="text" id="matchSearchInput" placeholder="ابحث عن فريق...">
    </div>
  </div>
  
  <!-- ============================================================
       المسابقات (معدلة - ألغيت السرعة القصوى)
       ============================================================ -->
  <div class="competitions-section" id="competitionsSection">
    <div class="comp-header">
      <h3>🏆 المسابقات والفعاليات</h3>
      <span style="font-size:0.7rem;color:var(--text-secondary);">انضم وتنافس!</span>
    </div>
    <div class="competitions-grid" id="competitionsContainer">
      <div class="competition-card">
        <span class="comp-icon">🔥</span>
        <div class="comp-name">سلسلة الانتصارات</div>
        <div class="comp-desc">أطول سلسلة توقعات صحيحة</div>
        <div class="comp-prize">🏅 5 نقاط إضافية</div>
      </div>
      <div class="competition-card">
        <span class="comp-icon">🎯</span>
        <div class="comp-name">خبير التوقعات</div>
        <div class="comp-desc">80%+ دقة مع 20+ توقع</div>
        <div class="comp-prize">⭐ شارة "خبير"</div>
      </div>
      <div class="competition-card">
        <span class="comp-icon">👑</span>
        <div class="comp-name">ملك التوقعات</div>
        <div class="comp-desc">أفضل لاعب في البطولة</div>
        <div class="comp-prize">👑 شارة "ملك"</div>
      </div>
      <div class="competition-card">
        <span class="comp-icon">📊</span>
        <div class="comp-name">المحلل الذكي</div>
        <div class="comp-desc">100+ توقع</div>
        <div class="comp-prize">📊 شارة "محلل"</div>
      </div>
      <div class="competition-card">
        <span class="comp-icon">🎲</span>
        <div class="comp-name">الحظ السعيد</div>
        <div class="comp-desc">جائزة عشوائية للمتوقعين</div>
        <div class="comp-prize">🎁 جائزة مفاجئة</div>
      </div>
    </div>
  </div>
  
  <!-- ============================================================
       التبويبات مع فلتر اليوم
       ============================================================ -->
  <div class="tabs-container">
    <div class="tabs">
      <button class="tab-btn active" data-tab="upcoming">⚡ القادمة والجارية</button>
      <button class="tab-btn" data-tab="previous">📋 السابقة</button>
      <button class="tab-btn" data-tab="standings">📊 ترتيب المجموعات</button>
      <button class="tab-btn" data-tab="predictions">🗳️ جميع التوقعات</button>
    </div>
    
    <!-- فلتر اليوم بجانب التبويبات -->
    <div class="day-filter-tabs" id="dayFilterTabs">
      <button class="day-btn active" data-day="all">📅 الكل</button>
      <button class="day-btn" data-day="today">📌 اليوم</button>
      <button class="day-btn" data-day="tomorrow">📌 غداً</button>
      <button class="day-btn" data-day="week">📅 هذا الأسبوع</button>
    </div>
  </div>
  
  <!-- ===== تبويب المباريات القادمة ===== -->
  <div id="upcomingTab" class="tab-content active">
    <div class="section-title">
      ⚡ المباريات القادمة والجارية
      <span class="badge-count" id="upcomingCount">0</span>
    </div>
    <div id="matchesContainer" class="matches-grid">
      <div class="empty-state"><span class="icon">⏳</span> جاري تحميل المباريات...</div>
    </div>
  </div>
  
  <!-- ===== تبويب المباريات السابقة ===== -->
  <div id="previousTab" class="tab-content">
    <div class="section-title">📋 المباريات السابقة</div>
    <div style="margin-bottom: 16px;">
      <input type="text" id="prevSearchInput" placeholder="🔍 بحث في المباريات السابقة..." style="
        width: 100%;
        padding: 12px 20px;
        border-radius: 60px;
        border: 2px solid rgba(255,255,255,0.06);
        background: rgba(255,255,255,0.03);
        color: var(--text-primary);
        font-size: 0.85rem;
        outline: none;
        transition: var(--transition);
        font-family: inherit;
      ">
    </div>
    <div id="previousMatchesContainer" class="matches-grid">
      <div class="empty-state"><span class="icon">⏳</span> جاري تحميل المباريات السابقة...</div>
    </div>
  </div>
  
  <!-- ===== تبويب ترتيب المجموعات ===== -->
  <div id="standingsTab" class="tab-content">
    <div class="section-title">📊 ترتيب المجموعات</div>
    <div id="standingsContainer" class="groups-container">
      <div class="empty-state"><span class="icon">⏳</span> جاري حساب الترتيب...</div>
    </div>
  </div>
  
  <!-- ===== تبويب جميع التوقعات ===== -->
  <div id="predictionsTab" class="tab-content">
    <div class="section-title">🗳️ جميع التوقعات <span class="badge-count" id="predictionsCount">0</span></div>
    <div id="allPredictions" class="predictions-grid">
      <div class="empty-state"><span class="icon">⏳</span> جاري تحميل التوقعات...</div>
    </div>
  </div>
  
  <footer class="footer">
    🏆 كأس العالم 2026 · غرفة معلمي سعيد بن العاص<br>
    <span class="gold-text">✨ توقع · تنافس · اربح ✨</span>
  </footer>
</div>

<!-- ===== نافذة التوقع ===== -->
<div class="modal-overlay" id="predictionModal">
  <div class="modal-content">
    <button class="modal-close" id="modalCloseBtn">✕</button>
    <div class="modal-title">📝 توقع نتيجة المباراة</div>
    
    <div class="modal-teams" id="modalTeams">
      <div class="m-team"><span class="flag" id="modalFlag1">🏁</span> <span id="modalTeam1">الفريق الأول</span></div>
      <div class="m-vs">🆚</div>
      <div class="m-team"><span class="flag" id="modalFlag2">🏁</span> <span id="modalTeam2">الفريق الثاني</span></div>
    </div>
    
    <div style="text-align:center; font-size:0.75rem; color:var(--text-secondary); margin-bottom:14px;" id="modalDateTime">📅 التاريخ والوقت</div>
    
    <div class="modal-options" id="modalOptions">
      <label>
        <input type="radio" name="prediction" value="HOME">
        <span class="opt-label">🏆 <span id="optTeam1">الفريق الأول</span></span>
        <span class="opt-sub">فوز</span>
      </label>
      <label>
        <input type="radio" name="prediction" value="AWAY">
        <span class="opt-label">🏆 <span id="optTeam2">الفريق الثاني</span></span>
        <span class="opt-sub">فوز</span>
      </label>
      <label>
        <input type="radio" name="prediction" value="DRAW">
        <span class="opt-label">🤝 تعادل</span>
        <span class="opt-sub">النتيجة متساوية</span>
      </label>
    </div>
    
    <div class="modal-input">
      <input type="text" id="modalUserName" placeholder="👤 أدخل اسمك" maxlength="30">
    </div>
    
    <button class="modal-submit" id="modalSubmitBtn">💾 حفظ التوقع</button>
    <div class="modal-message" id="modalMessage"></div>
  </div>
</div>

<!-- ===== نافذة استعراض توقعات اللاعب ===== -->
<div class="modal-overlay" id="playerPredictionsModal">
  <div class="modal-content">
    <button class="modal-close" id="playerModalCloseBtn">✕</button>
    <div class="modal-title">📋 توقعات <span id="playerModalName"></span></div>
    <div id="playerPredictionsList" class="predictions-grid" style="max-height:400px; overflow-y:auto;">
      <div class="empty-state"><span class="icon">📭</span> لا توجد توقعات لهذا اللاعب</div>
    </div>
  </div>
</div>

<!-- ===== نافذة استعراض توقعات المباراة ===== -->
<div class="modal-overlay" id="viewPredictionsModal">
  <div class="modal-content">
    <button class="modal-close" id="viewModalCloseBtn">✕</button>
    <div class="modal-title">📋 توقعات المباراة</div>
    <div class="modal-teams" id="viewModalTeams">
      <div class="m-team"><span class="flag" id="viewFlag1">🏁</span> <span id="viewTeam1">الفريق الأول</span></div>
      <div class="m-vs">🆚</div>
      <div class="m-team"><span class="flag" id="viewFlag2">🏁</span> <span id="viewTeam2">الفريق الثاني</span></div>
    </div>
    <div style="text-align:center; font-size:0.8rem; color:var(--text-secondary); margin:8px 0 14px;">
      عدد التوقعات: <span id="viewPredictionsCount" style="color:var(--gold-light); font-weight:800;">0</span>
    </div>
    <div id="viewPredictionsList" style="max-height:400px; overflow-y:auto;">
      <div class="empty-state"><span class="icon">📭</span> لا توجد توقعات لهذه المباراة</div>
    </div>
  </div>
</div>

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
  //  عرض المباريات القادمة (مع فلتر اليوم وأزرار التوقع/الاستعراض)
  // ============================================================
  function renderUpcoming() {
    try {
      let active = upcomingMatches(matchesData);
      
      // فلتر المجموعة
      const groupFilter = document.getElementById('groupFilter')?.value || 'all';
      if (groupFilter !== 'all') {
        const teams = finalGroups[groupFilter] || [];
        active = active.filter(m => teams.includes(m.team1) || teams.includes(m.team2));
      }
      
      // فلتر اليوم
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
      
      // ترتيب حسب الوقت
      active.sort((a,b) => matchTime(a.timeISO) - matchTime(b.timeISO));
      
      // بحث
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
        
        // التحقق إذا كانت المباراة اليوم أو غداً
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
            </div>
          </div>
        `;
      }).join('');
      
      // ربط أزرار التوقع
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
            <div class="prediction-text">🔮 <span class="highlight">${text}</span></div>
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
    
    if (!loadFromCache()) {
      console.log("📭 لا توجد بيانات في الكاش");
    }
    
    setTimeout(loadPreviousGames, 500);
    await renderAllPredictions();
    await renderLeaderboard();
    console.log("✅ التطبيق جاهز");
  }
  
  window.openViewPredictionsModal = openViewPredictionsModal;
  window.openPlayerPredictions = openPlayerPredictions;
  window.loadPreviousGames = loadPreviousGames;
  window.toggleTheme = toggleTheme;
  window.shareResults = shareResults;
  
  init();
</script>
</body>
</html>