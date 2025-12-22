
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
    font-size: 10pt !important;
  }
  
  .tool {
    display: none !important;
  }
  
  .report {
    display: block !important;
    font-size: 10pt !important;
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
  
  /* تكبير حجم الصور بنسبة 20% للطباعة */
  .images img {
    height: auto;
    max-height: 144px !important;
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
  
  /* تصغير المربعات بنسبة 25% للحقول الأساسية */
  .section:not(.optional) {
    min-height: 90px !important;
    max-height: 100px !important;
    font-size: 9pt !important;
  }
  
  /* تصغير المربعات الاختيارية بنسبة 5% إضافية (أصغر من 50%) */
  .section.optional {
    min-height: 57px !important; /* تصغير 5% إضافية من 60px */
    max-height: 66.5px !important; /* تصغير 5% إضافية من 70px */
    font-size: 7.5pt !important;
  }
}

/* ===== التقرير - مع تصغير المربعات ===== */
.header {
  background: #0a3b40;
  color: white;
  text-align: center;
  padding: 10px;
  margin-bottom: 12px;
  border-radius: 6px;
  font-size: 11pt;
}

.header div {
  margin: 3px 0;
  font-weight: bold;
}

.header .hijri {
  font-size: 9pt;
  margin-top: 4px;
  font-weight: normal;
}

.top-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.box {
  border: 1px solid #0a3b40;
  padding: 8px;
  text-align: center;
  font-size: 9pt;
  min-height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  background: #f8f9fa;
}

.box strong {
  display: block;
  margin-bottom: 4px;
  font-size: 10pt;
  color: #0a3b40;
}

.goal-section {
  background: #e8f5e9;
  border-right: 3px solid #2e7d32;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 12px;
  text-align: center;
  font-size: 9pt;
}

.goal-section strong {
  display: block;
  margin-bottom: 6px;
  font-size: 10pt;
  color: #0a3b40;
}

/* الشبكة الأصلية - مربعات جنباً إلى جنب */
.grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

/* الحقول الأساسية: تصغير بنسبة 25% */
.section:not(.optional) {
  border: 1px solid #0a3b40;
  padding: 8px;
  font-size: 9pt;
  min-height: 90px;
  max-height: 100px;
  border-radius: 6px;
  background: white;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.section:not(.optional) strong {
  display: block;
  border-bottom: 1px solid #0a3b40;
  margin-bottom: 6px;
  padding-bottom: 4px;
  font-size: 10pt;
  color: #0a3b40;
  flex-shrink: 0;
  line-height: 1.2;
}

.section:not(.optional) div:not(strong) {
  line-height: 1.4;
  flex-grow: 1;
  overflow: hidden;
  font-size: 9pt;
  max-height: 70px;
}

/* الحقول الاختيارية: تصغير بنسبة 50% + 5% إضافية = 55% */
.section.optional {
  border: 1px dashed #e6b800;
  padding: 5px;
  font-size: 7.5pt;
  min-height: 57px; /* تصغير 5% إضافية من 60px */
  max-height: 66.5px; /* تصغير 5% إضافية من 70px */
  border-radius: 5px;
  background: #fff8cc;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.section.optional strong {
  display: block;
  border-bottom: 1px dashed #e6b800;
  margin-bottom: 3px;
  padding-bottom: 2px;
  font-size: 8pt;
  color: #0a3b40;
  flex-shrink: 0;
  line-height: 1;
}

.section.optional div:not(strong) {
  line-height: 1.2;
  flex-grow: 1;
  overflow: hidden;
  font-size: 7.5pt;
  max-height: 42px;
}

/* تكبير مربعات الصور بنسبة 20% */
.images {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin: 15px 0;
}

.images img {
  width: 100%;
  height: auto;
  max-height: 144px;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 5px;
}

/* منطقة التوقيعات المعدلة */
.signatures {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 25px;
  font-size: 10pt;
  text-align: right;
}

.signature-box {
  min-height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 10px;
}

/* توقيعات جديدة - بدون نقاط وبدون أسماء */
.signature-title {
  text-align: center;
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 11pt;
}

.signature-text {
  text-align: center;
  font-size: 9pt;
  color: #333;
  margin-top: 15px;
  font-weight: normal;
}

.signature-line {
  border-bottom: 2px solid #000;
  height: 25px;
  width: 100%;
  margin-top: 5px;
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
  line-height: 1.4;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* معالجة خاصة لإجراءات التنفيذ */
#desc2 {
  line-height: 1.3 !important;
}

/* تحسينات الطباعة لتوفير المساحة */
@media print {
  /* تقليل المسافات أكثر للطباعة */
  .header {
    padding: 8px;
    margin-bottom: 8px;
  }
  
  .top-info {
    gap: 6px;
    margin-bottom: 8px;
  }
  
  .box {
    padding: 6px;
    min-height: 45px;
  }
  
  .goal-section {
    padding: 8px;
    margin-bottom: 8px;
  }
  
  .grid2 {
    gap: 8px;
    margin-bottom: 8px;
  }
  
  .section:not(.optional) {
    padding: 6px;
    min-height: 85px;
    max-height: 95px;
  }
  
  .section.optional {
    padding: 4px;
    min-height: 54px;
    max-height: 63px;
  }
  
  .images {
    gap: 10px;
    margin: 12px 0;
  }
  
  .signatures {
    gap: 30px;
    margin-top: 20px;
  }
  
  .signature-box {
    min-height: 65px;
  }
  
  .signature-line {
    height: 22px;
  }
}

/* تحسينات للعرض على الشاشة */
@media screen {
  .section:not(.optional) {
    transition: all 0.2s ease;
  }
  
  .section:not(.optional):hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
  
  .section.optional {
    transition: all 0.2s ease;
  }
  
  .section.optional:hover {
    box-shadow: 0 2px 8px rgba(230,184,0,0.2);
    transform: translateY(-1px);
  }
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
  <div id="hijriDate" class="hijri">جاري تحميل التاريخ الهجري...</div>
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

<!-- التحديات ونقاط القوة جنباً إلى جنب (مصغرة بنسبة 5% إضافية) -->
<div class="grid2">
  <div class="section optional" id="challengesSection"><strong>التحديات</strong><div id="challenges">ضيق الوقت</div></div>
  <div class="section optional" id="strengthsSection"><strong>نقاط القوة</strong><div id="strengths">تنمية شاملة</div></div>
</div>

<!-- الصور (مكبرة بنسبة 20%) -->
<div class="images" id="imagesBox">
  <!-- سيتم إضافة الصور هنا -->
</div>

<!-- منطقة التوقيعات المعدلة -->
<div class="signatures">
  <div class="signature-box">
    <div class="signature-title">المعلم /</div>
    <div class="signature-line"></div>
    <div class="signature-text">التوقيع</div>
  </div>
  <div class="signature-box">
    <div class="signature-title">مدير المدرسة /</div>
    <div class="signature-line"></div>
    <div class="signature-text">التوقيع</div>
  </div>
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

// دالة للحصول على التاريخ الهجري من API
async function getHijriDate() {
  const hijriDateElement = document.getElementById('hijriDate');
  
  try {
    // استخدام API من موقع التقويم الهجري الموثوق
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    // محاولة استخدام أول API
    try {
      const response = await fetch(`https://api.aladhan.com/v1/gToH/${day}-${month}-${year}`);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        const hijri = data.data.hijri;
        const hijriDate = `${hijri.day} ${hijri.month.ar} ${hijri.year}هـ`;
        const gregorianDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        hijriDateElement.textContent = `التاريخ الهجري: ${hijriDate} | الميلادي: ${gregorianDate}`;
        return;
      }
    } catch (e) {
      console.log('الـAPI الأول غير متوفر، جاري المحاولة بـAPI آخر...');
    }
    
    // محاولة استخدام API بديل
    try {
      const response = await fetch(`https://api.islamic-datetime.com/v1/gregorian-to-hijri?year=${year}&month=${month}&day=${day}`);
      const data = await response.json();
      
      if (data.hijri) {
        const hijri = data.hijri;
        const hijriMonths = [
          'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة',
          'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
        ];
        const hijriDate = `${hijri.day} ${hijriMonths[hijri.month - 1]} ${hijri.year}هـ`;
        const gregorianDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        hijriDateElement.textContent = `التاريخ الهجري: ${hijriDate} | الميلادي: ${gregorianDate}`;
        return;
      }
    } catch (e) {
      console.log('الـAPI البديل غير متوفر، جاري استخدام طريقة تقريبية...');
    }
    
    // استخدام الطريقة التقريبية إذا فشلت جميع الـAPIs
    const hijriYear = Math.floor((year - 622) * (33/32));
    const hijriMonth = month;
    const hijriDay = day;
    
    const hijriMonths = [
      'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة',
      'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
    ];
    
    const hijriDate = `${hijriDay} ${hijriMonths[hijriMonth-1]} ${hijriYear}هـ`;
    const gregorianDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    hijriDateElement.textContent = `التاريخ الهجري: ${hijriDate} | الميلادي: ${gregorianDate}`;
    
  } catch (error) {
    console.error('خطأ في جلب التاريخ الهجري:', error);
    // استخدام التاريخ الحالي كبديل
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    // طريقة تقريبية للتاريخ الهجري
    const hijriYear = Math.floor((year - 622) * (33/32));
    const hijriMonths = [
      'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة',
      'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
    ];
    
    const hijriDate = `${day} ${hijriMonths[month-1]} ${hijriYear}هـ`;
    const gregorianDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    hijriDateElement.textContent = `التاريخ الهجري: ${hijriDate} | الميلادي: ${gregorianDate}`;
  }
}

// تهيئة الصفحة
async function initializePage() {
  // تعيين القيم الافتراضية
  currentReport = "تقرير نشاط إثرائي";
  syncReport();
  
  // مزامنة القيم الافتراضية مع التقرير
  sync('edu', document.getElementById('eduSelect').value);
  sync('school', document.getElementById('schoolInput').value);
  sync('target', document.getElementById('targetInput').value);
  sync('count', document.getElementById('countInput').value);
  
  // تعبئة الحقول بالنصوص التلقائية الأولى
  fill('goal');
  fill('desc1');
  fill('desc2');
  fill('desc3');
  fill('desc4');
  fill('challenges');
  fill('strengths');
  
  // جلب التاريخ الهجري الدقيق من API
  await getHijriDate();
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

// طباعة التقرير
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

// تحسين التقرير ليكون في صفحة واحدة
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
  adjustFontSize(goalElement, 80, '9pt', '10pt');
  
  // ضبط أحجام الخطوط للحقول الأساسية
  const mainFields = ['desc1', 'desc2', 'desc3', 'desc4'];
  mainFields.forEach(field => {
    const element = document.getElementById(field);
    adjustFontSize(element, 30, '8.5pt', '9pt');
  });
  
  // ضبط أحجام الخطوط للحقول الاختيارية (أصغر)
  const optionalFields = ['challenges', 'strengths'];
  optionalFields.forEach(field => {
    const element = document.getElementById(field);
    adjustFontSize(element, 15, '7pt', '7.5pt');
  });
  
  // تقليل المسافات إذا لزم الأمر
  const sections = document.querySelectorAll('.section div:not(strong)');
  sections.forEach(section => {
    if (section.scrollHeight > section.clientHeight) {
      section.style.lineHeight = '1.2';
      section.style.paddingTop = '1px';
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