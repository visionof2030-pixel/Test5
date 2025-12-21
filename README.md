<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>أداة إعداد التقارير التعليمية</title>

<style>
/* ===== العرض العادي ===== */
body {
  font-family: Tahoma, Arial, sans-serif;
  background: #eef7f5;
  margin: 0;
  padding: 20px;
  font-size: 14px;
}

.tool {
  max-width: 900px;
  margin: auto;
  background: white;
  padding: 22px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,.1);
}

.tool h2 {
  text-align: center;
  color: #0a3b40;
  margin-bottom: 20px;
}

label {
  font-weight: 700;
  margin-top: 15px;
  display: block;
  color: #0a3b40;
}

input, textarea, select {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.small-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 15px 0;
}

.auto-row {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.auto-btn {
  flex: 1;
  background: #e0f2f1;
  border: 1px solid #0a3b40;
  color: #0a3b40;
  font-size: 13px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.auto-btn:hover {
  background: #b2dfdb;
}

.clear-btn {
  background: #fdecea;
  border: 1px solid #c62828;
  color: #c62828;
}

.clear-btn:hover {
  background: #ffcdd2;
}

button#printBtn {
  margin-top: 20px;
  padding: 12px;
  width: 100%;
  background: #0a3b40;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

button#printBtn:hover {
  background: #1a4b50;
}

.checkbox-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 15px 0;
  padding: 12px;
  background: #f5f9ff;
  border-radius: 8px;
}

.checkbox-row input[type="checkbox"] {
  width: 20px;
  height: 20px;
  margin: 0;
}

.optional-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin: 15px 0;
}

.optional-field {
  background: #fff8cc;
  border: 1px dashed #e6b800;
  padding: 12px;
  border-radius: 6px;
}

/* ===== الطباعة ===== */
.report {
  display: none;
}

@media print {
  body {
    background: white;
    padding: 0;
    font-size: 11pt !important;
  }
  
  .tool {
    display: none !important;
  }
  
  .report {
    display: block !important;
    font-size: 11pt !important;
    max-width: 210mm;
    margin: 0 auto;
    padding: 0;
  }

  .section,
  .goal-section,
  .images,
  .signatures {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .images img {
    height: auto;
    max-height: 120px;
    width: 100%;
    object-fit: contain;
  }
  
  .optional {
    display: block !important;
  }
  
  /* إصلاح الطباعة في صفحة واحدة */
  .grid2 {
    page-break-inside: avoid;
  }
  
  .section {
    min-height: 100px !important;
    max-height: 120px !important;
    font-size: 10pt !important;
  }
}

/* ===== التقرير - التصميم الأصلي ===== */
.header {
  background: #0a3b40;
  color: white;
  text-align: center;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 8px;
  font-size: 12pt;
}

.header div {
  margin: 4px 0;
  font-weight: bold;
}

.header .hijri {
  font-size: 10pt;
  margin-top: 6px;
  font-weight: normal;
}

.top-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.box {
  border: 2px solid #0a3b40;
  padding: 10px;
  text-align: center;
  font-size: 10pt;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: #f8f9fa;
}

.box strong {
  display: block;
  margin-bottom: 5px;
  font-size: 11pt;
  color: #0a3b40;
}

.goal-section {
  background: #e8f5e9;
  border-right: 4px solid #2e7d32;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 10pt;
}

.goal-section strong {
  display: block;
  margin-bottom: 8px;
  font-size: 11pt;
  color: #0a3b40;
}

/* الشبكة الأصلية - مربعات جنباً إلى جنب */
.grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

.section {
  border: 2px solid #0a3b40;
  padding: 12px;
  font-size: 10pt;
  min-height: 120px;
  max-height: 130px;
  border-radius: 8px;
  background: white;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.section strong {
  display: block;
  border-bottom: 2px solid #0a3b40;
  margin-bottom: 8px;
  padding-bottom: 6px;
  font-size: 11pt;
  color: #0a3b40;
  flex-shrink: 0;
}

.section div:not(strong) {
  line-height: 1.5;
  flex-grow: 1;
  overflow: hidden;
  font-size: 10pt;
}

.optional {
  background: #fff8cc;
  border: 2px dashed #e6b800;
}

.images {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin: 15px 0;
}

.images img {
  width: 100%;
  height: auto;
  max-height: 150px;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.signatures {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 25px;
  font-size: 10pt;
  text-align: center;
}

.signatures div {
  min-height: 70px;
}

.line {
  border-bottom: 2px dashed #000;
  height: 25px;
  margin-top: 10px;
  width: 100%;
}

/* تحسينات خاصة للطباعة في صفحة واحدة */
@media print {
  .goal-section {
    padding: 8px;
    margin-bottom: 10px;
  }
  
  .goal-section div {
    font-size: 10pt;
    line-height: 1.4;
  }
  
  .section {
    padding: 8px;
    min-height: 100px;
    max-height: 110px;
  }
  
  .section div:not(strong) {
    font-size: 9.5pt;
    line-height: 1.4;
  }
  
  .images {
    gap: 10px;
    margin: 10px 0;
  }
  
  .images img {
    max-height: 120px;
  }
  
  .signatures {
    gap: 30px;
    margin-top: 15px;
  }
  
  /* تقليل المسافات لتوفير المساحة */
  .header {
    padding: 8px;
    margin-bottom: 10px;
  }
  
  .top-info {
    gap: 8px;
    margin-bottom: 10px;
  }
  
  .box {
    padding: 6px;
    min-height: 50px;
  }
}

/* تحسينات عامة */
#fields {
  display: block;
  margin-bottom: 20px;
}

#fields label {
  margin-top: 20px;
}

#fields textarea {
  margin-bottom: 10px;
}

/* تحسين النصوص */
#goal, #desc1, #desc2, #desc3, #desc4, #challenges, #strengths,
#target, #count, #reportTitle, #school, #edu,
#teacher, #principal {
  line-height: 1.5;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* معالجة خاصة لإجراءات التنفيذ */
#desc2 {
  line-height: 1.4 !important;
}
</style>
</head>

<body>

<div class="tool">
<h2>أداة إعداد التقارير التعليمية</h2>

<label>إدارة التعليم</label>
<select id="eduSelect" onchange="sync('edu',this.value)">
  <option value="">اختر إدارة التعليم</option>
  <option value="الإدارة العامة للتعليم بمنطقة مكة المكرمة">الإدارة العامة للتعليم بمنطقة مكة المكرمة</option>
  <option value="الإدارة العامة للتعليم بمنطقة الرياض" selected>الإدارة العامة للتعليم بمنطقة الرياض</option>
</select>

<label>اسم المدرسة</label>
<input id="schoolInput" placeholder="أدخل اسم المدرسة" oninput="sync('school',this.value)" value="مدرسة النموذجية الابتدائية">

<div class="small-grid">
<select id="reportSelect" onchange="syncReport()">
  <option value="">اختر التقرير</option>
  <option value="تقرير نشاط إثرائي" selected>تقرير نشاط إثرائي</option>
</select>
<input id="targetInput" placeholder="المستهدفون" oninput="sync('target',this.value)" value="طلاب الصف الثالث">
<input id="countInput" placeholder="العدد" oninput="sync('count',this.value)" value="25 طالب">
</div>

<!-- الحقول الأساسية -->
<div id="fields">
  <label>الهدف التربوي (10 كلمات)</label>
  <textarea id="goalInput" placeholder="أدخل الهدف التربوي" oninput="sync('goal',this.value)"></textarea>
  <div class="auto-row">
    <button class="auto-btn" onclick="fill('goal')">نص تلقائي</button>
    <button class="auto-btn clear-btn" onclick="clearText('goal')">مسح النص</button>
  </div>

  <label>وصف مختصر (5 كلمات)</label>
  <textarea id="desc1Input" placeholder="أدخل وصف مختصر" oninput="sync('desc1',this.value)"></textarea>
  <div class="auto-row">
    <button class="auto-btn" onclick="fill('desc1')">نص تلقائي</button>
    <button class="auto-btn clear-btn" onclick="clearText('desc1')">مسح النص</button>
  </div>

  <label>إجراءات التنفيذ (3 خطوات)</label>
  <textarea id="desc2Input" placeholder="أدخل إجراءات التنفيذ" oninput="sync('desc2',this.value)"></textarea>
  <div class="auto-row">
    <button class="auto-btn" onclick="fill('desc2')">نص تلقائي</button>
    <button class="auto-btn clear-btn" onclick="clearText('desc2')">مسح النص</button>
  </div>

  <label>النتائج (4 كلمات)</label>
  <textarea id="desc3Input" placeholder="أدخل نتائج النشاط" oninput="sync('desc3',this.value)"></textarea>
  <div class="auto-row">
    <button class="auto-btn" onclick="fill('desc3')">نص تلقائي</button>
    <button class="auto-btn clear-btn" onclick="clearText('desc3')">مسح النص</button>
  </div>

  <label>التوصيات (5 كلمات)</label>
  <textarea id="desc4Input" placeholder="أدخل التوصيات" oninput="sync('desc4',this.value)"></textarea>
  <div class="auto-row">
    <button class="auto-btn" onclick="fill('desc4')">نص تلقائي</button>
    <button class="auto-btn clear-btn" onclick="clearText('desc4')">مسح النص</button>
  </div>
</div>

<!-- الحقول الاختيارية -->
<div class="optional-fields">
  <div class="optional-field">
    <div class="checkbox-row">
      <input type="checkbox" id="includeChallenges" checked onchange="toggleOptional('challenges')">
      <label for="includeChallenges" style="margin:0">تضمين "التحديات" في التقرير</label>
    </div>
    <textarea id="challengesInput" rows="2" placeholder="التحديات (كلمتين)" oninput="sync('challenges',this.value)"></textarea>
    <div class="auto-row">
      <button class="auto-btn" onclick="fill('challenges')">نص تلقائي</button>
      <button class="auto-btn clear-btn" onclick="clearText('challenges')">مسح النص</button>
    </div>
  </div>
  
  <div class="optional-field">
    <div class="checkbox-row">
      <input type="checkbox" id="includeStrengths" checked onchange="toggleOptional('strengths')">
      <label for="includeStrengths" style="margin:0">تضمين "نقاط القوة" في التقرير</label>
    </div>
    <textarea id="strengthsInput" rows="2" placeholder="نقاط القوة (كلمتين)" oninput="sync('strengths',this.value)"></textarea>
    <div class="auto-row">
      <button class="auto-btn" onclick="fill('strengths')">نص تلقائي</button>
      <button class="auto-btn clear-btn" onclick="clearText('strengths')">مسح النص</button>
    </div>
  </div>
</div>

<label>إرفاق الصور (حد أقصى صورتين)</label>
<input type="file" multiple accept="image/*" onchange="loadImages(this)">

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
  <div>
    <label>اسم المعلم</label>
    <input id="teacherInput" placeholder="اسم المعلم" oninput="sync('teacher',this.value)" value="أحمد محمد">
  </div>
  <div>
    <label>اسم مدير المدرسة</label>
    <input id="principalInput" placeholder="اسم المدير" oninput="sync('principal',this.value)" value="خالد عبدالله">
  </div>
</div>

<button id="printBtn" onclick="printReport()">تصدير PDF</button>
</div>

<!-- قسم التقرير للطباعة -->
<div class="report">
<div class="header">
  <div id="edu">الإدارة العامة للتعليم بمنطقة الرياض</div>
  <div id="school">مدرسة النموذجية الابتدائية</div>
  <div id="hijriDate" class="hijri">التاريخ الهجري: 15 ربيع الأول 1446هـ</div>
</div>

<div class="top-info">
  <div class="box"><strong>التقرير</strong><div id="reportTitle">تقرير نشاط إثرائي</div></div>
  <div class="box"><strong>المستهدفون</strong><div id="target">طلاب الصف الثالث</div></div>
  <div class="box"><strong>العدد</strong><div id="count">25 طالب</div></div>
</div>

<div class="goal-section">
<strong>الهدف التربوي</strong>
<div id="goal">تنمية المواهب والقدرات الإبداعية لدى الطلاب وتطوير مهاراتهم في مجالات متنوعة</div>
</div>

<!-- وصف مختصر وإجراءات التنفيذ جنباً إلى جنب -->
<div class="grid2">
  <div class="section"><strong>وصف مختصر</strong><div id="desc1">تنمية مواهب وقدرات طلابية متنوعة</div></div>
  <div class="section"><strong>إجراءات التنفيذ</strong><div id="desc2">تخطيط الأنشطة تنفيذ ورش التقييم</div></div>
</div>

<!-- النتائج والتوصيات جنباً إلى جنب -->
<div class="grid2">
  <div class="section"><strong>النتائج</strong><div id="desc3">اكتشاف مواهب طلابية جديدة</div></div>
  <div class="section"><strong>التوصيات</strong><div id="desc4">زيادة الأنشطة الإثرائية المتنوعة</div></div>
</div>

<!-- التحديات ونقاط القوة جنباً إلى جنب -->
<div class="grid2">
  <div class="section optional" id="challengesSection"><strong>التحديات</strong><div id="challenges">ضيق الوقت</div></div>
  <div class="section optional" id="strengthsSection"><strong>نقاط القوة</strong><div id="strengths">تنمية شاملة</div></div>
</div>

<div class="images" id="imagesBox">
  <!-- سيتم إضافة الصور هنا -->
</div>

<div class="signatures">
  <div><div id="teacher">أحمد محمد</div><div class="line"></div>توقيع المعلم</div>
  <div><div id="principal">خالد عبدالله</div><div class="line"></div>توقيع مدير المدرسة</div>
</div>
</div>

<script>
// البيانات النموذجية لتقرير واحد فقط
const reportsData = {
  "تقرير نشاط إثرائي": {
    goal: [
      "تنمية المواهب والقدرات الإبداعية لدى الطلاب وتطوير مهاراتهم في مجالات متنوعة",
      "تشجيع المشاركة في الأنشطة اللاصفية وتنمية الجوانب الشخصية والاجتماعية للطلاب",
      "اكتشاف المواهب الطلابية وتطويرها وتوفير بيئة تعليمية شاملة ومتكاملة للجميع"
    ],
    desc1: [
      "تنمية مواهب وقدرات طلابية متنوعة",
      "أنشطة لاصفية إثرائية ممتعة",
      "ورش عمل تطوير مهارات إبداعية"
    ],
    desc2: [
      "تخطيط الأنشطة تنفيذ ورش التقييم",
      "إعداد المواد تشكيل مجموعات التنفيذ",
      "التخطيط التحضير المتابعة التقييم"
    ],
    desc3: [
      "اكتشاف مواهب طلابية جديدة",
      "تحسن مهارات التواصل الاجتماعي",
      "تنمية الثقة بالنفس والقدرات"
    ],
    desc4: [
      "زيادة الأنشطة الإثرائية المتنوعة",
      "توفير موارد تدريبية إضافية",
      "دعم وتشجيع المشاركة المستمرة"
    ],
    challenges: [
      "ضيق الوقت",
      "نقص التمويل",
      "صعوبة التنسيق"
    ],
    strengths: [
      "تنمية شاملة",
      "اكتشاف مواهب",
      "تشجيع مشاركة"
    ]
  }
};

// متغيرات عامة
let currentReport = "";
let autoTextIndex = {
  goal: 0, desc1: 0, desc2: 0, desc3: 0, desc4: 0, 
  challenges: 0, strengths: 0
};

// تهيئة الصفحة
function initializePage() {
  // تعيين القيم الافتراضية
  currentReport = "تقرير نشاط إثرائي";
  syncReport();
  
  // مزامنة القيم الافتراضية مع التقرير
  sync('edu', document.getElementById('eduSelect').value);
  sync('school', document.getElementById('schoolInput').value);
  sync('target', document.getElementById('targetInput').value);
  sync('count', document.getElementById('countInput').value);
  sync('teacher', document.getElementById('teacherInput').value);
  sync('principal', document.getElementById('principalInput').value);
  
  // تعبئة الحقول بالنصوص التلقائية الأولى
  fill('goal');
  fill('desc1');
  fill('desc2');
  fill('desc3');
  fill('desc4');
  fill('challenges');
  fill('strengths');
  
  // تهيئة التاريخ الهجري
  initializeHijriDate();
}

// تعيين التقرير
function syncReport() {
  const reportTitle = document.getElementById('reportTitle');
  if (reportTitle) {
    reportTitle.textContent = currentReport;
  }
}

// ملء النص التلقائي
function fill(fieldId) {
  if (!currentReport || !reportsData[currentReport]) return;
  
  const fieldData = reportsData[currentReport][fieldId];
  if (!fieldData) return;
  
  // الحصول على النص التالي في القائمة (دوراني)
  const index = autoTextIndex[fieldId] || 0;
  const text = fieldData[index];
  
  // تحديث الفهرس للدورة التالية
  autoTextIndex[fieldId] = (index + 1) % fieldData.length;
  
  // تعيين النص في الحقل المناسب
  const inputElement = document.getElementById(fieldId + 'Input');
  if (inputElement) {
    inputElement.value = text;
    sync(fieldId, text);
  }
}

// مسح النص
function clearText(fieldId) {
  const inputElement = document.getElementById(fieldId + 'Input');
  if (inputElement) {
    inputElement.value = '';
    sync(fieldId, '');
  }
}

// مزامنة البيانات مع التقرير
function sync(id, value) {
  const el = document.getElementById(id);
  if (el) {
    // معالجة خاصة لحقل إجراءات التنفيذ
    if (id === 'desc2') {
      el.innerHTML = value.replace(/ /g, '<br>');
    } else {
      el.textContent = value;
    }
  }
}

// تبديل عرض الحقول الاختيارية
function toggleOptional(fieldId) {
  const checkbox = document.getElementById(`include${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)}`);
  const section = document.getElementById(`${fieldId}Section`);
  
  if (checkbox && section) {
    section.style.display = checkbox.checked ? 'block' : 'none';
  }
}

// تحميل الصور
function loadImages(input) {
  const imagesBox = document.getElementById('imagesBox');
  imagesBox.innerHTML = '';
  
  Array.from(input.files).slice(0, 2).forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.alt = 'صورة النشاط';
      imagesBox.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

// تهيئة التاريخ الهجري
function initializeHijriDate() {
  const hijriDateElement = document.getElementById('hijriDate');
  const today = new Date();
  
  // تحويل التاريخ الميلادي إلى هجري (تقريبي)
  const hijriYear = Math.floor((today.getFullYear() - 622) * (33/32));
  const hijriMonth = today.getMonth() + 1;
  const hijriDay = today.getDate();
  
  const hijriMonths = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة',
    'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];
  
  const hijriDate = `${hijriDay} ${hijriMonths[hijriMonth-1]} ${hijriYear}هـ`;
  const gregorianDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  if (hijriDateElement) {
    hijriDateElement.textContent = `التاريخ الهجري: ${hijriDate} | الميلادي: ${gregorianDate}`;
  }
}

// طباعة التقرير مع ضبط للحفاظ على صفحة واحدة
function printReport() {
  // التحقق من تعبئة الحقول الأساسية
  const requiredFields = ['goal', 'desc1', 'desc2', 'desc3', 'desc4'];
  let allFilled = true;
  
  for (const field of requiredFields) {
    const element = document.getElementById(field);
    if (element && element.textContent.trim() === '') {
      allFilled = false;
      const fieldNames = {
        'goal': 'الهدف التربوي',
        'desc1': 'الوصف المختصر',
        'desc2': 'إجراءات التنفيذ',
        'desc3': 'النتائج',
        'desc4': 'التوصيات'
      };
      alert(`يرجى تعبئة حقل ${fieldNames[field]}`);
      break;
    }
  }
  
  if (allFilled) {
    // إظهار/إخفاء الحقول الاختيارية بناءً على التحديد
    toggleOptional('challenges');
    toggleOptional('strengths');
    
    // ضبط أحجام الخطوط للحفاظ على صفحة واحدة
    optimizeForSinglePage();
    
    // الانتظار قليلاً لضمان تحديث العرض ثم الطباعة
    setTimeout(() => {
      window.print();
    }, 100);
  }
}

// تحسين التقرير ليكون في صفحة واحدة مع الحفاظ على التصميم الأصلي
function optimizeForSinglePage() {
  // تقليل حجم الخط للنصوص الطويلة
  const adjustFontSize = (element, maxLength, smallSize, normalSize) => {
    if (element && element.textContent.length > maxLength) {
      element.style.fontSize = smallSize;
    } else if (element) {
      element.style.fontSize = normalSize;
    }
  };
  
  // ضبط حجم خط الهدف التربوي
  const goalElement = document.getElementById('goal');
  adjustFontSize(goalElement, 80, '10pt', '11pt');
  
  // ضبط أحجام الخطوط للحقول
  const fields = ['desc1', 'desc2', 'desc3', 'desc4', 'challenges', 'strengths'];
  fields.forEach(field => {
    const element = document.getElementById(field);
    adjustFontSize(element, 30, '9.5pt', '10pt');
  });
  
  // تقليل المسافات إذا لزم الأمر
  const sections = document.querySelectorAll('.section div:not(strong)');
  sections.forEach(section => {
    if (section.scrollHeight > section.clientHeight) {
      section.style.lineHeight = '1.3';
    }
  });
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
  initializePage();
  
  // إضافة مستمعين للحقول النصية
  const fields = ['goal', 'desc1', 'desc2', 'desc3', 'desc4', 'challenges', 'strengths'];
  fields.forEach(field => {
    const inputElement = document.getElementById(field + 'Input');
    if (inputElement) {
      inputElement.addEventListener('input', function() {
        sync(field, this.value);
      });
    }
  });
});
</script>

</body>
</html>