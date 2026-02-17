<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Interactive Grammar Quiz – Drive Slowly / Unit 8 (must, should, adverbs)">
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
<script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
<style>
/* جميع الأنماط كما هي محفوظة بالكامل من الإصدار السابق */
:root {
  --primary: #1A5F7A;
  --primary-glow: #2D8F9D;
  --primary-light: #57C3C2;
  --accent: #159895;
  --accent-glow: #1DB9B6;
  --accent-light: #57C3C2;
  --secondary: #4CAF50;
  --secondary-glow: #66BB6A;
  --secondary-light: #81C784;
  --tertiary: #FF9800;
  --tertiary-glow: #FFB74D;
  --tertiary-light: #FFCC80;
  --quaternary: #9C27B0;
  --quaternary-glow: #BA68C8;
  --quaternary-light: #CE93D8;
  --islamic-green: #228B22;
  --islamic-blue: #1A5F7A;
  --islamic-gold: #D4AF37;
  --islamic-teal: #159895;
  --primary-gradient: linear-gradient(135deg, var(--primary) 0%, var(--primary-glow) 50%, var(--primary-light) 100%);
  --accent-gradient: linear-gradient(135deg, var(--accent) 0%, var(--accent-glow) 50%, var(--islamic-teal) 100%);
  --secondary-gradient: linear-gradient(135deg, var(--secondary) 0%, var(--secondary-glow) 50%, var(--islamic-green) 100%);
  --tertiary-gradient: linear-gradient(135deg, var(--tertiary) 0%, var(--tertiary-glow) 50%, var(--islamic-gold) 100%);
  --islamic-gradient: linear-gradient(135deg, var(--islamic-blue) 0%, var(--islamic-teal) 50%, var(--islamic-green) 100%);
  --glow-primary: 0 0 20px rgba(26, 95, 122, 0.7), 0 0 40px rgba(26, 95, 122, 0.5), 0 0 60px rgba(26, 95, 122, 0.3);
  --glow-accent: 0 0 20px rgba(21, 152, 149, 0.7), 0 0 40px rgba(21, 152, 149, 0.5), 0 0 60px rgba(21, 152, 149, 0.3);
  --glow-secondary: 0 0 20px rgba(76, 175, 80, 0.7), 0 0 40px rgba(76, 175, 80, 0.5), 0 0 60px rgba(76, 175, 80, 0.3);
  --glow-tertiary: 0 0 20px rgba(255, 152, 0, 0.7), 0 0 40px rgba(255, 152, 0, 0.5), 0 0 60px rgba(255, 152, 0, 0.3);
  --glow-islamic: 0 0 20px rgba(26, 95, 122, 0.8), 0 0 40px rgba(21, 152, 149, 0.6), 0 0 60px rgba(34, 139, 34, 0.4);
  --bg: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  --card-bg: rgba(255, 255, 255, 0.95);
  --text: #1F2937;
  --light-text: #6B7280;
  --border: rgba(26, 95, 122, 0.2);
  --shadow: 0 8px 32px rgba(26, 95, 122, 0.1);
  --shadow-hover: 0 20px 40px rgba(26, 95, 122, 0.2);
}
.dark-theme {
  --bg: linear-gradient(135deg, #0A3D62 0%, #1A5F7A 100%);
  --card-bg: rgba(15, 30, 45, 0.95);
  --text: #F1F5F9;
  --light-text: #CBD5E1;
  --border: rgba(26, 95, 122, 0.1);
  --shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  --shadow-hover: 0 20px 40px rgba(0, 0, 0, 0.4);
}
* {
  box-sizing: border-box;
  font-family: 'Tajawal', Tahoma, Arial, sans-serif;
  margin: 0;
  padding: 0;
}
body {
  background: var(--bg);
  color: var(--text);
  line-height: 1.7;
  overflow-x: hidden;
  padding-top: 80px;
  transition: all 0.5s ease;
  min-height: 100vh;
  direction: ltr;
  text-align: left;
}
header {
  background: rgba(26, 95, 122, 0.1);
  backdrop-filter: blur(20px);
  color: white;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: var(--shadow);
  border-bottom: 1px solid var(--border);
  padding: 15px 0;
}
.header-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.title-section h1 {
  font-size: 1.5rem;
  font-weight: 800;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 10px rgba(26, 95, 122, 0.3);
}
.header-actions {
  display: flex;
  gap: 10px;
}
.theme-btn {
  background: rgba(26, 95, 122, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 10px 20px;
  border-radius: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(20px);
  box-shadow: 0 0 15px rgba(26, 95, 122, 0.3);
}
.theme-btn:hover {
  background: rgba(26, 95, 122, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 0 25px rgba(26, 95, 122, 0.5), 0 5px 20px rgba(0,0,0,0.2);
  border-color: rgba(255,255,255,0.5);
}
main {
  max-width: 1000px;
  margin: 30px auto;
  padding: 0 20px;
}
.hero-section {
  background: linear-gradient(135deg, rgba(26, 95, 122, 0.15), rgba(21, 152, 149, 0.15));
  backdrop-filter: blur(30px);
  color: white;
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 30px;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(26,95,122,0.15), inset 0 1px 0 rgba(255,255,255,0.2);
  border: 2px solid rgba(255,255,255,0.1);
}
.hero-section::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: var(--accent-gradient);
  opacity: 0.1;
  z-index: -1;
}
.hero-content {
  position: relative;
  z-index: 1;
}
.hero-title {
  font-size: 2.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-subtitle {
  font-size: 1.1rem;
  margin-bottom: 25px;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
.teacher-name {
  font-size: 1.2rem;
  margin-top: 10px;
  background: var(--primary-gradient);
  display: inline-block;
  padding: 5px 20px;
  border-radius: 30px;
  color: white;
  font-weight: 500;
  box-shadow: var(--glow-primary);
}
.card {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(30px);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 25px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1);
  transition: all 0.4s ease;
  border: 1px solid rgba(255,255,255,0.1);
  position: relative;
  overflow: hidden;
}
.card::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 5px;
  background: var(--islamic-gradient);
}
.card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-hover);
}
.section-title {
  text-align: center;
  color: var(--text);
  margin-bottom: 30px;
  font-size: 2rem;
  font-weight: 800;
  position: relative;
  padding-bottom: 15px;
}
.section-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  right: 50%;
  transform: translateX(50%);
  width: 100px;
  height: 4px;
  background: var(--accent-gradient);
  border-radius: 2px;
}
.question-box {
  background: var(--card-bg);
  backdrop-filter: blur(20px);
  padding: 30px;
  margin-bottom: 25px;
  border-radius: 20px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}
.question-box::before {
  content: "";
  position: absolute;
  top: 0; right: 0;
  width: 100%;
  height: 5px;
  background: var(--primary-gradient);
}
.question-box:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-hover);
}
.question-number {
  font-size: 1.3em;
  color: var(--primary);
  margin-bottom: 15px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
}
.question-text {
  font-size: 1.2em;
  margin-bottom: 25px;
  line-height: 1.7;
  color: var(--text);
  font-weight: 500;
}
.options label {
  display: flex;
  align-items: center;
  padding: 18px 20px;
  margin: 12px 0;
  border: 2px solid var(--border);
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--card-bg);
  position: relative;
  overflow: hidden;
  font-weight: 500;
}
.options label::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0;
  background: var(--primary-gradient);
  transition: width 0.3s ease;
  z-index: 0;
}
.options label:hover:not(.locked) {
  border-color: var(--primary);
  transform: translateX(-8px);
  box-shadow: 0 5px 15px rgba(26,95,122,0.2);
}
.options label:hover:not(.locked)::before {
  width: 4px;
}
.options input[type="radio"] {
  margin-left: 12px;
  transform: scale(1.3);
  z-index: 1;
}
.options label.locked {
  cursor: not-allowed;
  opacity: 0.8;
  pointer-events: none;
}
.options label.selected {
  background: linear-gradient(135deg, rgba(26,95,122,0.15), rgba(21,152,149,0.15));
  border: 2px solid var(--accent);
  box-shadow: 0 0 15px rgba(21,152,149,0.3);
}
.options label.correct-answer {
  background: linear-gradient(135deg, rgba(76,175,80,0.2), rgba(102,187,106,0.2));
  border: 2px solid var(--secondary);
  box-shadow: 0 0 15px rgba(76,175,80,0.3);
  animation: correctPulse 0.5s ease;
}
@keyframes correctPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}
.options label.wrong-answer {
  background: linear-gradient(135deg, rgba(239,68,68,0.2), rgba(248,113,113,0.2));
  border: 2px solid #ef4444;
  box-shadow: 0 0 15px rgba(239,68,68,0.3);
  animation: wrongShake 0.5s ease;
}
@keyframes wrongShake {
  0%,100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
.explanation {
  margin-top: 25px;
  padding: 25px;
  border-radius: 15px;
  display: none;
  background: linear-gradient(135deg, rgba(26,95,122,0.05), rgba(21,152,149,0.05));
  border-left: 4px solid var(--secondary);
  animation: slideDown 0.5s ease;
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-15px); }
  to { opacity: 1; transform: translateY(0); }
}
.explanation-line {
  padding: 15px;
  margin: 10px 0;
  border-radius: 10px;
  transition: all 0.3s ease;
}
.explanation-correct {
  background: linear-gradient(135deg, rgba(76,175,80,0.1), rgba(102,187,106,0.1));
  border-right: 3px solid var(--secondary);
}
.explanation-wrong-1 {
  background: linear-gradient(135deg, rgba(21,152,149,0.1), rgba(45,143,157,0.1));
  border-right: 3px solid var(--accent);
}
.explanation-wrong-2 {
  background: linear-gradient(135deg, rgba(255,152,0,0.1), rgba(255,183,77,0.1));
  border-right: 3px solid var(--tertiary);
}
.explanation-wrong-3 {
  background: linear-gradient(135deg, rgba(156,39,176,0.1), rgba(186,104,200,0.1));
  border-right: 3px solid var(--quaternary);
}
.btn-primary {
  background: var(--accent-gradient);
  color: white;
  box-shadow: var(--glow-accent), 0 8px 25px rgba(21,152,149,0.4);
  border: 2px solid rgba(255,255,255,0.3);
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: all 0.4s ease;
}
.btn-primary::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transition: left 0.7s;
  z-index: -1;
}
.btn-primary:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: var(--glow-accent), 0 15px 40px rgba(21,152,149,0.6);
  border-color: rgba(255,255,255,0.5);
}
.btn-primary:hover::before { left: 100%; }
.btn-secondary {
  background: var(--primary-gradient);
  color: white;
  box-shadow: var(--glow-primary), 0 8px 25px rgba(26,95,122,0.4);
  border: 2px solid rgba(255,255,255,0.3);
  position: relative;
  overflow: hidden;
}
.btn-secondary:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: var(--glow-primary), 0 15px 40px rgba(26,95,122,0.6);
  border-color: rgba(255,255,255,0.5);
}
.btn-warning {
  background: var(--tertiary-gradient);
  color: white;
  box-shadow: var(--glow-tertiary), 0 8px 25px rgba(255,152,0,0.4);
  border: 2px solid rgba(255,255,255,0.3);
}
.btn-islamic {
  background: var(--islamic-gradient);
  color: white;
  box-shadow: var(--glow-islamic), 0 8px 25px rgba(26,95,122,0.4);
  border: 2px solid rgba(255,255,255,0.3);
}
.btn-success {
  background: var(--secondary-gradient);
  color: white;
  box-shadow: var(--glow-secondary), 0 8px 25px rgba(76,175,80,0.4);
  border: 2px solid rgba(255,255,255,0.3);
}
.navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  gap: 20px;
}
.btn {
  padding: 15px 30px;
  border-radius: 15px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.btn:disabled {
  background: #9CA3AF;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  opacity: 0.6;
}
.progress-bar {
  height: 15px;
  background: rgba(255,255,255,0.2);
  border-radius: 10px;
  margin-bottom: 30px;
  overflow: hidden;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
}
.progress {
  height: 100%;
  background: var(--islamic-gradient);
  box-shadow: 0 0 15px rgba(26,95,122,0.5);
  width: 0%;
  transition: width 0.5s ease;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}
.progress::after {
  content: "";
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}
#result-box {
  background: var(--card-bg);
  backdrop-filter: blur(20px);
  padding: 30px;
  margin-top: 30px;
  border-radius: 20px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  display: none;
  animation: slideUp 0.6s ease;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  flex-wrap: wrap;
  gap: 20px;
}
.quiz-info {
  font-size: 1rem;
  color: var(--light-text);
  background: linear-gradient(135deg, rgba(26,95,122,0.1), rgba(21,152,149,0.1));
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 600;
  backdrop-filter: blur(10px);
}
#timer {
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  margin-left: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(26,95,122,0.2);
  backdrop-filter: blur(20px);
  padding: 10px 20px;
  border-radius: 25px;
  border: 2px solid rgba(26,95,122,0.3);
  box-shadow: 0 0 15px rgba(26,95,122,0.2);
}
.timer-warning {
  background: rgba(255,152,0,0.2) !important;
  border-color: rgba(255,152,0,0.3) !important;
  box-shadow: 0 0 20px rgba(255,152,0,0.3) !important;
  animation: warning-pulse 0.8s infinite alternate;
}
@keyframes warning-pulse {
  from { box-shadow: 0 0 15px rgba(255,152,0,0.3); }
  to { box-shadow: 0 0 25px rgba(255,152,0,0.5), 0 0 40px rgba(255,152,0,0.3); }
}
.dark-theme .btn-primary, .dark-theme .btn-secondary {
  border-color: rgba(255,255,255,0.2);
}
.modal {
  display: none;
  position: fixed;
  z-index: 2000;
  left: 0; top: 0;
  width: 100%; height: 100%;
  background-color: rgba(0,0,0,0.7);
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease;
}
.modal-content {
  background: var(--card-bg);
  margin: 5% auto;
  padding: 30px;
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: var(--shadow-hover);
  border: 1px solid var(--border);
  position: relative;
  animation: slideUp 0.5s ease;
}
.close-modal {
  position: absolute;
  left: 20px;
  top: 20px;
  color: var(--primary);
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  width: 40px; height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(26,95,122,0.1);
  transition: all 0.3s ease;
}
.close-modal:hover {
  background: rgba(26,95,122,0.2);
  transform: rotate(90deg);
}
.question-status-grid-modal {
  width: 60px; height: 60px;
  border: 2px solid rgba(26,95,122,0.3);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.3s ease;
  background: var(--card-bg);
}
.question-status-grid-modal.current {
  background: var(--accent-gradient);
  border-color: rgba(255,255,255,0.5);
  box-shadow: var(--glow-accent);
}
.question-status-grid-modal.answered {
  background: var(--secondary-gradient);
  border-color: rgba(255,255,255,0.5);
  box-shadow: var(--glow-secondary);
}
.question-status-grid-modal.flagged {
  background: var(--tertiary-gradient);
  border-color: rgba(255,255,255,0.5);
  box-shadow: var(--glow-tertiary);
}
#questions-grid-modal {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px,1fr));
  gap: 12px;
  margin: 25px 0;
}
.legend-modal {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 20px 0;
  justify-content: center;
}
.legend-item-modal {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
}
.chart-container {
  position: relative;
  height: 300px;
  margin: 30px 0;
  background: var(--card-bg);
  border-radius: 15px;
  padding: 20px;
}
.tips-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px,1fr));
  gap: 20px;
  margin: 30px 0;
}
.tip-card {
  background: var(--card-bg);
  border-radius: 15px;
  padding: 25px;
  transition: all 0.3s ease;
  border-left: 5px solid var(--primary);
}
.tip-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-hover);
}
.sound-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
  justify-content: center;
}
.sound-btn {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 50%;
  width: 40px; height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
}
.sound-btn:hover {
  background: rgba(255,255,255,0.2);
  transform: scale(1.1);
}
.sound-btn.muted { opacity: 0.5; }
@media (max-width: 768px) {
  body { padding-top: 70px; }
  .header-container { flex-direction: column; gap: 15px; }
  .hero-title { font-size: 1.8rem; }
  .navigation { flex-direction: column; }
  .btn { width: 100%; justify-content: center; }
}
</style>
</head>
<body>
<div class="bg-animation"><div class="floating-shapes"><div class="shape"></div><div class="shape"></div><div class="shape"></div></div></div>
<header class="glass-effect">
<div class="header-container">
<div class="title-section"><h1>Interactive Grammar Quiz – Drive Slowly / Unit 8</h1></div>
<div class="header-actions"><button class="theme-btn" id="themeBtn"><i class="fas fa-moon"></i></button></div>
</div>
</header>
<main>
<section class="hero-section glass-effect">
<div class="hero-content">
<h1 class="hero-title">Grammar Worksheet – Drive Slowly / Unit 8</h1>
<p class="hero-subtitle">Test your knowledge of 'must', 'should', and adverbs with instant feedback and explanations.</p>
<div class="teacher-name">👨‍🏫 Teacher: Fahad Al-Khaldi</div>
<div class="quiz-info" style="margin-top:15px;">Questions: 15 | Time: 15 minutes</div>
<div class="sound-controls">
<button class="sound-btn" id="soundToggleBtn" title="Toggle sound"><i class="fas fa-volume-up"></i></button>
<span style="font-size:0.9rem;">Sound On</span>
</div>
</div>
</section>
<div class="progress-bar glass-effect"><div class="progress" id="progress"></div></div>
<div id="quiz"></div>
<div class="controls">
<div class="quiz-info" id="quiz-info"></div>
<div id="timer">⏱️ <span id="time-display">15:00</span></div>
<div style="display:flex; gap:15px; flex-wrap:wrap;">
<button class="btn btn-primary" onclick="openQuestionsModal()"><i class="fas fa-list"></i> Question list</button>
<button class="btn btn-warning" onclick="toggleMarkForReview()" id="mark-review-btn"><i class="fas fa-flag"></i> Mark for review</button>
<button class="btn btn-islamic" onclick="finishQuiz()"><i class="fas fa-flag-checkered"></i> Finish</button>
<button class="btn btn-secondary" onclick="openCurrentScoreModal()"><i class="fas fa-chart-bar"></i> Current score</button>
</div>
</div>
<div id="result-box" class="card">
<h3 id="result" style="color:var(--text); margin-bottom:20px;"></h3>
<p id="percentage" style="font-size:1.4rem;"></p>
<p id="evaluation" style="font-weight:bold; font-size:1.3rem;"></p>
<div id="advanced-results" style="display:none;">
<div class="chart-container"><canvas id="performanceChart"></canvas></div>
<div class="tips-container" id="tips-container"></div>
<div class="share-results">
<h4 style="color:var(--text); margin-bottom:20px;"><i class="fas fa-file-pdf"></i> Report</h4>
<div class="share-buttons" style="display:flex; gap:15px; justify-content:center;">
<button class="btn btn-success" onclick="generatePDF()"><i class="fas fa-file-pdf"></i> Download PDF</button>
<button class="btn btn-secondary" onclick="restartQuiz()"><i class="fas fa-redo"></i> Restart</button>
</div>
</div>
</div>
</div>
</main>
<!-- Modal windows -->
<div id="currentScoreModal" class="modal"><div class="modal-content"><span class="close-modal" onclick="closeCurrentScoreModal()">&times;</span><div class="modal-header"><h3><i class="fas fa-chart-bar"></i> Current score</h3></div><div class="current-score-content"><div class="score-circle"><svg width="150" height="150"><circle class="score-bg" cx="75" cy="75" r="70"></circle><circle class="score-fill" cx="75" cy="75" r="70" id="score-circle-fill"></circle></svg><div class="score-text" id="score-percentage">0%</div></div><div class="score-details"><p id="current-score-details"></p><p id="current-correct-details"></p><p id="current-progress-details"></p></div></div></div></div>
<div id="questionsModal" class="modal"><div class="modal-content"><span class="close-modal" onclick="closeQuestionsModal()">&times;</span><div class="modal-header"><h3><i class="fas fa-th-list"></i> Question list</h3></div><div id="questions-grid-modal"></div><div class="legend-modal"><div class="legend-item-modal"><div class="question-status-grid-modal" style="background:var(--accent-gradient); color:white;"></div><span>Current</span></div><div class="legend-item-modal"><div class="question-status-grid-modal" style="background:var(--secondary-gradient); color:white;"></div><span>Answered</span></div><div class="legend-item-modal"><div class="question-status-grid-modal" style="background:var(--tertiary-gradient); color:var(--text);"></div><span>Flagged</span></div><div class="legend-item-modal"><div class="question-status-grid-modal" style="background:var(--card-bg); border-color:var(--border);"></div><span>Not answered</span></div></div><button class="btn btn-primary" onclick="closeQuestionsModal()" style="margin-top:20px; width:100%;"><i class="fas fa-times"></i> Close</button></div></div>

<script>
// ========== الأسئلة مع شرح عربي وإنجليزي وافي ==========
const questions = [
  // Section 1
  { id:1, q:"You __ eat healthy foods to stay strong.",
    options: ["should", "must", "must not", "shouldn’t"],
    answer:0,
    explanations: {
      en: "✅ should – Advice: eating healthy is recommended, not an obligation.",
      ar: "✅ should – نصيحة: تناول الطعام الصحي أمر موصى به وليس إلزامياً."
    },
    wrong_explanations: {
      en: ["❌ must – Too strong; it's not a strict rule but a healthy habit.",
           "❌ must not – Means prohibited; healthy food is not forbidden.",
           "❌ shouldn’t – Negative advice; you should eat healthy, not avoid it."],
      ar: ["❌ must – قوي جداً؛ إنها عادة صحية وليست قاعدة صارمة.",
           "❌ must not – تعني محظور؛ الطعام الصحي ليس ممنوعاً.",
           "❌ shouldn’t – نصيحة سلبية؛ يجب أن تأكل طعاماً صحياً، لا أن تتجنبه."]
    }
  },
  { id:2, q:"You __ cross the street when the light is red.",
    options: ["must", "should", "must not", "shouldn’t"],
    answer:2,
    explanations: {
      en: "✅ must not – Strong prohibition; it's illegal and dangerous.",
      ar: "✅ must not – منع قوي؛ إنه غير قانوني وخطير."
    },
    wrong_explanations: {
      en: ["❌ must – Would mean you have to cross, which is wrong.",
           "❌ should – Advice, but this is a strict rule.",
           "❌ shouldn’t – Soft advice; rule is stronger."],
      ar: ["❌ must – تعني أنه يجب عليك العبور، وهذا خطأ.",
           "❌ should – نصيحة، لكن هذه قاعدة صارمة.",
           "❌ shouldn’t – نصيحة خفيفة؛ القاعدة أقوى."]
    }
  },
  { id:3, q:"We __ respect our teachers and classmates.",
    options: ["should", "must", "must not", "shouldn’t"],
    answer:1,
    explanations: {
      en: "✅ must – Moral duty/obligation; respect is essential.",
      ar: "✅ must – واجب أخلاقي / التزام؛ الاحترام أساسي."
    },
    wrong_explanations: {
      en: ["❌ should – Acceptable but must expresses stronger duty.",
           "❌ must not – Opposite meaning.",
           "❌ shouldn’t – Opposite meaning."],
      ar: ["❌ should – مقبول لكن must تعبر عن واجب أقوى.",
           "❌ must not – معنى معاكس.",
           "❌ shouldn’t – معنى معاكس."]
    }
  },
  { id:4, q:"You __ run in the hallway at school.",
    options: ["must", "should", "shouldn’t", "must not"],
    answer:2,
    explanations: {
      en: "✅ shouldn’t – Advice against running for safety.",
      ar: "✅ shouldn’t – نصيحة بعدم الركض حفاظاً على السلامة."
    },
    wrong_explanations: {
      en: ["❌ must – Positive obligation (wrong).",
           "❌ should – Positive advice (wrong).",
           "❌ must not – Too strong; it's not a strict rule but a safety advice."],
      ar: ["❌ must – التزام إيجابي (خطأ).",
           "❌ should – نصيحة إيجابية (خطأ).",
           "❌ must not – قوي جداً؛ إنها ليست قاعدة صارمة بل نصيحة للسلامة."]
    }
  },
  { id:5, q:"We __ wear a helmet when riding a bike.",
    options: ["should", "must", "shouldn’t", "must not"],
    answer:1,
    explanations: {
      en: "✅ must – Safety rule; it's obligatory for protection.",
      ar: "✅ must – قاعدة سلامة؛ إنها إلزامية للحماية."
    },
    wrong_explanations: {
      en: ["❌ should – Possible but must is stronger for safety.",
           "❌ shouldn’t – Opposite.",
           "❌ must not – Opposite."],
      ar: ["❌ should – ممكن لكن must أقوى للسلامة.",
           "❌ shouldn’t – عكس.",
           "❌ must not – عكس."]
    }
  },
  // Section 2
  { id:6, q:"You ______ wash your hands before eating.",
    options: ["must", "should", "must not", "shouldn’t"],
    answer:0,
    explanations: {
      en: "✅ must – Hygiene rule; it's necessary.",
      ar: "✅ must – قاعدة نظافة؛ إنها ضرورية."
    },
    wrong_explanations: {
      en: ["❌ should – Also possible but must is more appropriate for hygiene rule.",
           "❌ must not – Wrong meaning.",
           "❌ shouldn’t – Wrong meaning."],
      ar: ["❌ should – ممكن أيضاً لكن must أنسب لقاعدة النظافة.",
           "❌ must not – معنى خاطئ.",
           "❌ shouldn’t – معنى خاطئ."]
    }
  },
  { id:7, q:"We ______ not touch the hot stove.",
    options: ["must", "should", "must not", "shouldn’t"],
    answer:0,
    explanations: {
      en: "✅ must – 'must not' expresses strong prohibition.",
      ar: "✅ must – 'must not' تعبر عن منع قوي."
    },
    wrong_explanations: {
      en: ["❌ should – 'should not' is weaker; this is a strong danger rule.",
           "❌ must not is the correct form; here we choose 'must' because the blank is before 'not'.",
           "❌ shouldn’t – weaker."],
      ar: ["❌ should – 'should not' أضعف؛ هذه قاعدة خطر قوية.",
           "❌ must not هي الصيغة الصحيحة؛ نختار 'must' لأن الفراغ قبل 'not'.",
           "❌ shouldn’t – أضعف."]
    }
  },
  { id:8, q:"You ______ try your best in school.",
    options: ["must", "should", "must not", "shouldn’t"],
    answer:1,
    explanations: {
      en: "✅ should – Encouragement/advice, not a strict rule.",
      ar: "✅ should – تشجيع / نصيحة، وليست قاعدة صارمة."
    },
    wrong_explanations: {
      en: ["❌ must – Too strong; trying your best is advice, not obligation.",
           "❌ must not – Opposite.",
           "❌ shouldn’t – Opposite."],
      ar: ["❌ must – قوي جداً؛ بذل قصارى جهدك نصيحة وليس التزاماً.",
           "❌ must not – عكس.",
           "❌ shouldn’t – عكس."]
    }
  },
  { id:9, q:"We ______ not litter in the park.",
    options: ["must", "should", "must not", "shouldn’t"],
    answer:1,
    explanations: {
      en: "✅ should – 'should not' is advice for good behavior.",
      ar: "✅ should – 'should not' نصيحة للسلوك الجيد."
    },
    wrong_explanations: {
      en: ["❌ must – 'must not' is stronger, but littering is usually discouraged by advice.",
           "❌ must not – Also possible but slightly too strong; here expected 'should'.",
           "❌ shouldn’t is the correct form; we need the modal before 'not'."],
      ar: ["❌ must – 'must not' أقوى، لكن إلقاء القمامة عادة ما يُثبط بالنصيحة.",
           "❌ must not – ممكن أيضاً لكنه قوي قليلاً؛ المتوقع 'should'.",
           "❌ shouldn’t هي الصيغة الصحيحة؛ نحتاج الفعل المساعد قبل 'not'."]
    }
  },
  { id:10, q:"You ______ wear a helmet when riding a bike.",
    options: ["must", "should", "must not", "shouldn’t"],
    answer:0,
    explanations: {
      en: "✅ must – Safety rule (as in Q5).",
      ar: "✅ must – قاعدة سلامة (كما في س5)."
    },
    wrong_explanations: {
      en: ["❌ should – Acceptable but must is stronger for safety.",
           "❌ must not – Wrong.",
           "❌ shouldn’t – Wrong."],
      ar: ["❌ should – مقبول لكن must أقوى للسلامة.",
           "❌ must not – خطأ.",
           "❌ shouldn’t – خطأ."]
    }
  },
  // Section 3: Adverbs
  { id:11, q:"The athlete ______ ran the marathon. (quickly, fast)",
    options: ["quickly", "fast", "quick", "fastly"],
    answer:0,
    explanations: {
      en: "✅ quickly – Adverb ending in -ly describing how he ran.",
      ar: "✅ quickly – ظرف ينتهي بـ -ly يصف كيف ركض."
    },
    wrong_explanations: {
      en: ["❌ fast – Also an adverb but 'fast' doesn't change; here both are possible, but 'quickly' is given in options.",
           "❌ quick – Adjective.",
           "❌ fastly – Not a word."],
      ar: ["❌ fast – ظرف أيضاً لكن 'fast' لا يتغير؛ كلاهما ممكن، لكن 'quickly' هو المعطى في الخيارات.",
           "❌ quick – صفة.",
           "❌ fastly – ليست كلمة."]
    }
  },
  { id:12, q:"The chef ______ cooked the meal. (carefully, loudly)",
    options: ["carefully", "loudly", "careful", "loud"],
    answer:0,
    explanations: {
      en: "✅ carefully – Describes the manner of cooking.",
      ar: "✅ carefully – يصف أسلوب الطهي."
    },
    wrong_explanations: {
      en: ["❌ loudly – Doesn't fit the context.",
           "❌ careful – Adjective.",
           "❌ loud – Adjective."],
      ar: ["❌ loudly – لا يتناسب مع السياق.",
           "❌ careful – صفة.",
           "❌ loud – صفة."]
    }
  },
  { id:13, q:"The teacher ______ explained the lesson. (clearly, wisely)",
    options: ["clearly", "wisely", "clear", "wise"],
    answer:0,
    explanations: {
      en: "✅ clearly – Describes how the explanation was given.",
      ar: "✅ clearly – يصف كيف تم الشرح."
    },
    wrong_explanations: {
      en: ["❌ wisely – Possible but less common; 'clearly' is best.",
           "❌ clear – Adjective.",
           "❌ wise – Adjective."],
      ar: ["❌ wisely – ممكن لكن أقل شيوعاً؛ 'clearly' هو الأفضل.",
           "❌ clear – صفة.",
           "❌ wise – صفة."]
    }
  },
  { id:14, q:"The driver ______ navigated the road. (skillfully, slowly)",
    options: ["skillfully", "slowly", "skillful", "slow"],
    answer:0,
    explanations: {
      en: "✅ skillfully – Shows driving skill.",
      ar: "✅ skillfully – يُظهر مهارة القيادة."
    },
    wrong_explanations: {
      en: ["❌ slowly – Possible but not the best; skillfully matches 'navigated'.",
           "❌ skillful – Adjective.",
           "❌ slow – Adjective."],
      ar: ["❌ slowly – ممكن لكن ليس الأفضل؛ skillfully تناسب 'navigated'.",
           "❌ skillful – صفة.",
           "❌ slow – صفة."]
    }
  },
  { id:15, q:"She sang ______ in the school play. (loudly, beautifully)",
    options: ["beautifully", "loudly", "beautiful", "loud"],
    answer:0,
    explanations: {
      en: "✅ beautifully – Describes the quality of singing.",
      ar: "✅ beautifully – يصف جودة الغناء."
    },
    wrong_explanations: {
      en: ["❌ loudly – Possible but not the best; beautifully is more natural.",
           "❌ beautiful – Adjective.",
           "❌ loud – Adjective."],
      ar: ["❌ loudly – ممكن لكن ليس الأفضل؛ beautifully أكثر طبيعية.",
           "❌ beautiful – صفة.",
           "❌ loud – صفة."]
    }
  }
];

// ========== نظام الصوت باستخدام الروابط المطلوبة ==========
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.sounds = new Map();
        this.isInitialized = false;
        this.initializing = false;
    }
    async init() {
        if (this.isInitialized || this.initializing) return;
        this.initializing = true;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            // تحميل الأصوات المحددة
            await this.loadSound('correct', 'https://media.vocaroo.com/mp3/19lcrilHKuHR');
            await this.loadSound('wrong', 'https://media.vocaroo.com/mp3/1ooZTr9sHVXS');
            await this.loadSound('finish', 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');
            await this.loadSoundEffect('click', 'https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3');
            await this.loadSoundEffect('hover', 'https://assets.mixkit.co/sfx/preview/mixkit-hover-click-1198.mp3');
            await this.loadSoundEffect('pageTurn', 'https://assets.mixkit.co/sfx/preview/mixkit-book-page-turn-1180.mp3');
            await this.loadSoundEffect('success', 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');
            await this.loadSoundEffect('error', 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3');
            this.isInitialized = true;
        } catch (error) {
            console.warn('Sound loading failed, using fallback beeps', error);
            this.createFallbackSounds();
        } finally {
            this.initializing = false;
        }
    }
    async loadSound(name, url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.sounds.set(name, audioBuffer);
        } catch (error) {
            console.warn(`Failed to load ${name}`, error);
        }
    }
    async loadSoundEffect(name, url) {
        await this.loadSound(name, url);
    }
    createFallbackSounds() {
        // أصوات احتياطية في حال فشل التحميل
        this.sounds.set('click', this.generateBeep(440, 0.1));
        this.sounds.set('hover', this.generateBeep(220, 0.05));
        this.sounds.set('correct', this.generateBeep(523.25, 0.3));
        this.sounds.set('wrong', this.generateBeep(349.23, 0.3));
        this.sounds.set('finish', this.generateBeep(659.25, 0.5));
        this.sounds.set('success', this.generateBeep(523.25, 0.3));
        this.sounds.set('error', this.generateBeep(349.23, 0.3));
    }
    generateBeep(frequency, duration) {
        if (!this.audioContext) return null;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        return { oscillator, gainNode, duration };
    }
    play(name, volume = 0.5) {
        if (!soundEnabled || !this.isInitialized) return;
        try {
            if (this.audioContext.state === 'suspended') this.audioContext.resume();
            const sound = this.sounds.get(name);
            if (sound) {
                if (sound.oscillator) {
                    const { oscillator, gainNode, duration } = sound;
                    oscillator.start();
                    setTimeout(() => oscillator.stop(), duration * 1000);
                    this.sounds.set(name, this.generateBeep(oscillator.frequency.value, duration));
                } else {
                    const source = this.audioContext.createBufferSource();
                    const gainNode = this.audioContext.createGain();
                    source.buffer = sound;
                    gainNode.gain.value = volume;
                    source.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    source.start(0);
                    source.onended = () => { source.disconnect(); gainNode.disconnect(); };
                }
            }
        } catch (e) {}
    }
    playCorrect() { this.play('correct', 0.3); }
    playWrong() { this.play('wrong', 0.3); }
    playFinish() { this.play('finish', 0.5); }
    playClick() { this.play('click', 0.2); }
    playHover() { this.play('hover', 0.1); }
    playPageTurn() { this.play('pageTurn', 0.2); }
    playSuccess() { this.play('success', 0.3); }
    playError() { this.play('error', 0.3); }
}
const soundManager = new SoundManager();

// ========== متغيرات عامة ==========
let currentQuestionIndex = 0;
let userAnswers = Array(questions.length).fill(null);
let timeLeft = 15 * 60;
let timerInterval;
let markedQuestions = [];
let answerLocked = Array(questions.length).fill(false);
let performanceHistory = [];
let shuffledQuestions = [];
let soundEnabled = true;

// ========== دوال مساعدة ==========
function shuffleOptions(q) {
  let opts = [...q.options];
  let ans = q.answer;
  let indices = [...Array(opts.length).keys()];
  for(let i=indices.length-1; i>0; i--) {
    let j = Math.floor(Math.random()*(i+1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  let newOpts = indices.map(i=>opts[i]);
  let newAns = indices.indexOf(ans);
  return {...q, options:newOpts, answer:newAns};
}
function loadPerformanceHistory() {
  let saved = localStorage.getItem('grammarQuizHistory');
  if(saved) try { performanceHistory = JSON.parse(saved); } catch(e){}
}
function savePerformanceHistory() {
  localStorage.setItem('grammarQuizHistory', JSON.stringify(performanceHistory));
}
function playSound(name) {
  if(!soundEnabled) return;
  if(name==='click') soundManager.playClick();
  else if(name==='hover') soundManager.playHover();
  else if(name==='pageTurn') soundManager.playPageTurn();
  else if(name==='success') soundManager.playSuccess();
  else if(name==='error') soundManager.playError();
}
function playCorrectSound() { soundManager.playCorrect(); }
function playWrongSound() { soundManager.playWrong(); }
function playFinishSound() { soundManager.playFinish(); }

// ========== دوال الواجهة ==========
document.getElementById('themeBtn').addEventListener('click', function(){
  playSound('click');
  document.body.classList.toggle('dark-theme');
  let icon = this.querySelector('i');
  if(document.body.classList.contains('dark-theme')){
    icon.classList.remove('fa-moon'); icon.classList.add('fa-sun');
    localStorage.setItem('darkMode','enabled');
  } else {
    icon.classList.remove('fa-sun'); icon.classList.add('fa-moon');
    localStorage.setItem('darkMode','disabled');
  }
});
function checkDarkModePreference() {
  let dark = localStorage.getItem('darkMode');
  let icon = document.querySelector('#themeBtn i');
  if(dark==='enabled'){
    document.body.classList.add('dark-theme');
    icon.classList.remove('fa-moon'); icon.classList.add('fa-sun');
  } else {
    document.body.classList.remove('dark-theme');
    icon.classList.remove('fa-sun'); icon.classList.add('fa-moon');
  }
}
document.getElementById('soundToggleBtn').addEventListener('click', function(){
  soundEnabled = !soundEnabled;
  let icon = this.querySelector('i');
  let span = this.nextElementSibling;
  if(soundEnabled){
    icon.classList.remove('fa-volume-mute'); icon.classList.add('fa-volume-up');
    this.classList.remove('muted');
    span.textContent = 'Sound On';
  } else {
    icon.classList.remove('fa-volume-up'); icon.classList.add('fa-volume-mute');
    this.classList.add('muted');
    span.textContent = 'Sound Off';
  }
  localStorage.setItem('soundEnabled', soundEnabled);
});
function startTimer() {
  timerInterval = setInterval(()=>{
    timeLeft--;
    updateTimerDisplay();
    if(timeLeft<=0){ clearInterval(timerInterval); playSound('error'); finishQuiz(); }
  },1000);
}
function updateTimerDisplay() {
  let m = Math.floor(timeLeft/60);
  let s = timeLeft%60;
  document.getElementById('time-display').textContent = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  if(timeLeft<300) document.getElementById('timer').classList.add('timer-warning');
  else document.getElementById('timer').classList.remove('timer-warning');
}
function openCurrentScoreModal(){
  playSound('click');
  let score = calculateScore();
  let answered = userAnswers.filter(a=>a!==null).length;
  let percent = (score.correct/questions.length*100).toFixed(2);
  let circle = document.getElementById('score-circle-fill');
  let circumference = 440;
  let offset = circumference - (percent/100)*circumference;
  circle.style.strokeDashoffset = offset;
  document.getElementById('score-percentage').textContent = percent+'%';
  document.getElementById('current-score-details').innerHTML = `<strong>Score:</strong> ${score.correct}/${questions.length}`;
  document.getElementById('current-correct-details').innerHTML = `<strong>Correct:</strong> ${score.correct}`;
  document.getElementById('current-progress-details').innerHTML = `<strong>Progress:</strong> ${answered}/${questions.length} (${Math.round(answered/questions.length*100)}%)`;
  document.getElementById('currentScoreModal').style.display = 'block';
}
function closeCurrentScoreModal(){ playSound('click'); document.getElementById('currentScoreModal').style.display='none'; }
function openQuestionsModal(){
  playSound('click');
  let grid = document.getElementById('questions-grid-modal');
  grid.innerHTML = '';
  questions.forEach((_,i)=>{
    let btn = document.createElement('div');
    btn.className = `question-status-grid-modal ${i===currentQuestionIndex?'current':''} ${userAnswers[i]!==null?'answered':''} ${markedQuestions.includes(i)?'flagged':''}`;
    btn.innerHTML = `<span>${i+1}</span>`;
    btn.onclick = ()=>{ playSound('click'); currentQuestionIndex=i; loadQuiz(); closeQuestionsModal(); };
    grid.appendChild(btn);
  });
  document.getElementById('questionsModal').style.display = 'block';
}
function closeQuestionsModal(){ playSound('click'); document.getElementById('questionsModal').style.display='none'; }
function toggleMarkForReview(){
  playSound('click');
  let idx = markedQuestions.indexOf(currentQuestionIndex);
  let btn = document.getElementById('mark-review-btn');
  if(idx===-1){
    markedQuestions.push(currentQuestionIndex);
    btn.innerHTML = '<i class="fas fa-flag"></i> Remove flag';
    btn.style.background = 'var(--tertiary-gradient)';
  } else {
    markedQuestions.splice(idx,1);
    btn.innerHTML = '<i class="fas fa-flag"></i> Mark for review';
    btn.style.background = 'var(--secondary-gradient)';
  }
}
function loadQuiz(){
  if(shuffledQuestions.length===0) shuffledQuestions = questions.map(q=>shuffleOptions(q));
  let q = shuffledQuestions[currentQuestionIndex];
  let locked = answerLocked[currentQuestionIndex];
  let html = `<div class="question-box fade-in"><div class="question-number"><i class="fas fa-question-circle"></i> Question ${currentQuestionIndex+1} of ${questions.length} ${locked?'<span style="color:var(--accent); margin-right:10px;"><i class="fas fa-lock"></i> Locked</span>':''} ${markedQuestions.includes(currentQuestionIndex)?'<span style="background:var(--tertiary-gradient); color:white; padding:5px 10px; border-radius:10px;"><i class="fas fa-flag"></i> Flagged</span>':''}</div><div class="question-text">${q.q}</div><div class="options">`;
  q.options.forEach((opt,i)=>{
    let checked = userAnswers[currentQuestionIndex]===i;
    let disabled = locked;
    let labelClass = '';
    if(locked){
      labelClass = 'locked';
      if(checked) labelClass += userAnswers[currentQuestionIndex]===q.answer ? ' correct-answer' : ' wrong-answer';
      else if(i===q.answer) labelClass += ' correct-answer';
    } else if(checked) labelClass = 'selected';
    html += `<label class="${labelClass}"><input type="radio" name="q${currentQuestionIndex}" value="${i}" ${checked?'checked':''} ${disabled?'disabled':''} onchange="selectAnswer(${i})"> ${opt} ${locked && i===q.answer?' <i class="fas fa-check" style="color:var(--secondary);"></i>':''}</label>`;
  });
  html += `</div><div id="explanation" class="explanation"></div></div><div class="navigation"><button class="btn btn-secondary" onclick="previousQuestion()" ${currentQuestionIndex===0?'disabled':''}><i class="fas fa-arrow-left"></i> Previous</button><button class="btn btn-primary" onclick="nextQuestion()" ${currentQuestionIndex===questions.length-1?'disabled':''}>Next <i class="fas fa-arrow-right"></i></button></div>`;
  document.getElementById('quiz').innerHTML = html;
  document.getElementById('progress').style.width = `${((currentQuestionIndex+1)/questions.length)*100}%`;
  document.getElementById('quiz-info').innerHTML = `Question ${currentQuestionIndex+1} of ${questions.length}`;
  let markBtn = document.getElementById('mark-review-btn');
  if(markedQuestions.includes(currentQuestionIndex)){
    markBtn.innerHTML = '<i class="fas fa-flag"></i> Remove flag';
    markBtn.style.background = 'var(--tertiary-gradient)';
  } else {
    markBtn.innerHTML = '<i class="fas fa-flag"></i> Mark for review';
    markBtn.style.background = 'var(--secondary-gradient)';
  }
  if(userAnswers[currentQuestionIndex]!==null) showExplanation();
}
function selectAnswer(ans){
  if(answerLocked[currentQuestionIndex]) return;
  playSound('click');
  userAnswers[currentQuestionIndex] = ans;
  answerLocked[currentQuestionIndex] = true;
  let q = shuffledQuestions[currentQuestionIndex];
  if(ans===q.answer) { playCorrectSound(); playSound('success'); } else { playWrongSound(); playSound('error'); }
  let radios = document.querySelectorAll(`input[name="q${currentQuestionIndex}"]`);
  radios.forEach(r=>r.disabled=true);
  radios.forEach(r=>r.closest('label').classList.add('locked'));
  // إضافة الألوان بعد الإجابة
  let labels = document.querySelectorAll(`.options label`);
  labels.forEach((label, idx) => {
    if(idx === q.answer) label.classList.add('correct-answer');
    else if(idx === ans && ans !== q.answer) label.classList.add('wrong-answer');
  });
  showExplanation();
}
function showExplanation(){
  let q = shuffledQuestions[currentQuestionIndex];
  let originalQ = questions[currentQuestionIndex]; // للوصول للشروح الأصلية
  let expDiv = document.getElementById('explanation');
  let userAns = userAnswers[currentQuestionIndex];
  if(userAns===null) return;
  expDiv.style.display = 'block';
  
  // رسالة صحة/خطأ باللغتين
  let resultHTML = userAns===q.answer 
    ? `<p class="correct"><i class="fas fa-check-circle"></i> Correct! / أحسنت!</p>` 
    : `<p class="wrong"><i class="fas fa-times-circle"></i> Wrong — الإجابة الصحيحة: <span class="correct">${q.options[q.answer]}</span></p>`;
  
  // شرح الإجابة الصحيحة بالعربية والإنجليزية
  resultHTML += `<div class="explanation-line explanation-correct"><strong>📚 Explanation / شرح:</strong><br>🇬🇧 ${originalQ.explanations.en}<br>🇸🇦 ${originalQ.explanations.ar}</div>`;
  
  // إضافة شروح الخيارات الخاطئة إذا وجدت
  if (originalQ.wrong_explanations) {
    originalQ.wrong_explanations.en.forEach((enExp, i) => {
      let arExp = originalQ.wrong_explanations.ar[i] || '';
      resultHTML += `<div class="explanation-line explanation-wrong-${i+1}"><strong>💡 Note / ملاحظة:</strong><br>🇬🇧 ${enExp}<br>🇸🇦 ${arExp}</div>`;
    });
  }
  
  expDiv.innerHTML = resultHTML;
}
function nextQuestion(){ playSound('pageTurn'); if(currentQuestionIndex<questions.length-1){ currentQuestionIndex++; loadQuiz(); } }
function previousQuestion(){ playSound('pageTurn'); if(currentQuestionIndex>0){ currentQuestionIndex--; loadQuiz(); } }
function calculateScore(){
  let correct = 0;
  userAnswers.forEach((ans,i)=>{ if(ans===questions[i].answer) correct++; });
  let percent = (correct/questions.length*100).toFixed(2);
  let eval = '';
  if(percent>=90) eval = 'Excellent!';
  else if(percent>=75) eval = 'Very Good';
  else if(percent>=60) eval = 'Good';
  else if(percent>=50) eval = 'Pass';
  else eval = 'Needs Improvement';
  return {correct, total:questions.length, percentage:parseFloat(percent), evaluation:eval};
}
function finishQuiz(){
  clearInterval(timerInterval);
  let score = calculateScore();
  savePerformanceRecord();
  playFinishSound(); playSound('success');
  document.getElementById('result-box').style.display = 'block';
  document.getElementById('result').innerHTML = `Result: ${score.correct}/${score.total}`;
  document.getElementById('percentage').innerHTML = `Percentage: ${score.percentage}%`;
  document.getElementById('evaluation').innerHTML = `Evaluation: ${score.evaluation}`;
  document.getElementById('quiz').style.display = 'none';
  document.querySelector('.controls').style.display = 'none';
  document.getElementById('advanced-results').style.display = 'block';
  setTimeout(()=>{ createPerformanceChart(); createCustomTips(); },100);
}
function savePerformanceRecord(){
  let s = calculateScore();
  performanceHistory.push({date:new Date().toISOString(), score:s.correct, total:s.total, percentage:s.percentage});
  if(performanceHistory.length>10) performanceHistory = performanceHistory.slice(-10);
  savePerformanceHistory();
}
function createPerformanceChart(){
  let ctx = document.getElementById('performanceChart').getContext('2d');
  let dates = performanceHistory.map(a=>new Date(a.date).toLocaleDateString());
  let scores = performanceHistory.map(a=>a.percentage);
  let curr = calculateScore().percentage;
  dates.push('Now'); scores.push(curr);
  if(window.performanceChartInstance) window.performanceChartInstance.destroy();
  window.performanceChartInstance = new Chart(ctx, {
    type:'line', data:{ labels:dates, datasets:[{ label:'Percentage %', data:scores, borderColor:'#1A5F7A', backgroundColor:'rgba(26,95,122,0.1)', borderWidth:3, fill:true, tension:0.4 }] },
    options:{ responsive:true, maintainAspectRatio:false }
  });
}
function createCustomTips(){
  let score = calculateScore();
  let tips = document.getElementById('tips-container');
  let html = '';
  if(score.percentage>=90) html = `<div class="tip-card"><h4><i class="fas fa-star"></i> Outstanding</h4><p>You have a strong grasp of modals and adverbs.</p></div><div class="tip-card"><h4><i class="fas fa-lightbulb"></i> Keep practicing</h4><p>Try using these in your own sentences.</p></div>`;
  else if(score.percentage>=70) html = `<div class="tip-card"><h4><i class="fas fa-check-circle"></i> Good work</h4><p>Review the questions you missed, especially the differences between must/should.</p></div><div class="tip-card"><h4><i class="fas fa-book-open"></i> Focus on</h4><p>Adverb formation and when to use must vs should.</p></div>`;
  else html = `<div class="tip-card"><h4><i class="fas fa-exclamation-triangle"></i> Need practice</h4><p>Study the rules for must/should and adverbs again.</p></div><div class="tip-card"><h4><i class="fas fa-redo"></i> Keep trying</h4><p>Retake the quiz after reviewing the explanations.</p></div>`;
  tips.innerHTML = html;
}
function generatePDF(){
  playSound('click');
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFont('Tajawal');
  doc.setR2L(false);
  doc.setFontSize(22); doc.text('Grammar Quiz Report – Unit 8', 105, 20, null, null, 'center');
  doc.setFontSize(12); doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, 30, null, null, 'center');
  let score = calculateScore();
  doc.text(`Score: ${score.correct}/${score.total} (${score.percentage}%)`, 20, 50);
  doc.text(`Evaluation: ${score.evaluation}`, 20, 60);
  doc.save(`Grammar_Quiz_Report_${new Date().toISOString().slice(0,10)}.pdf`);
  alert('PDF report generated!');
}
function restartQuiz(){
  playSound('pageTurn');
  currentQuestionIndex=0;
  userAnswers=Array(questions.length).fill(null);
  timeLeft=15*60;
  markedQuestions=[];
  answerLocked=Array(questions.length).fill(false);
  shuffledQuestions=[];
  document.getElementById('quiz').style.display='block';
  document.querySelector('.controls').style.display='flex';
  document.getElementById('result-box').style.display='none';
  clearInterval(timerInterval);
  startTimer();
  loadQuiz();
  updateTimerDisplay();
}
window.onload = async function(){
  checkDarkModePreference();
  loadPerformanceHistory();
  let savedSound = localStorage.getItem('soundEnabled');
  if(savedSound!==null) soundEnabled = savedSound==='true';
  let soundBtn = document.getElementById('soundToggleBtn');
  let icon = soundBtn.querySelector('i');
  let span = soundBtn.nextElementSibling;
  if(soundEnabled){ icon.classList.remove('fa-volume-mute'); icon.classList.add('fa-volume-up'); soundBtn.classList.remove('muted'); span.textContent='Sound On'; }
  else { icon.classList.remove('fa-volume-up'); icon.classList.add('fa-volume-mute'); soundBtn.classList.add('muted'); span.textContent='Sound Off'; }
  await soundManager.init();
  loadQuiz();
  startTimer();
  window.onclick = (e)=>{
    if(e.target==document.getElementById('currentScoreModal')) closeCurrentScoreModal();
    if(e.target==document.getElementById('questionsModal')) closeQuestionsModal();
  };
}
</script>
</body>
</html>