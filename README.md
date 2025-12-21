
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>أداة إعداد التقارير التعليمية - محسّنة</title>
<style>
body {
  font-family: Tahoma, Arial, sans-serif;
  background: #eef7f5;
  margin: 0;
  padding: 20px;
}
.tool {
  max-width: 900px;
  margin: auto;
  background: white;
  padding: 22px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, .1);
}
.tool h2 {
  text-align: center;
  color: #0a3b40;
}
label {
  font-weight: 700;
  margin-top: 10px;
  display: block;
}
input, textarea, select {
  width: 100%;
  padding: 9px;
  margin-top: 5px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
}
textarea {
  resize: none;
}
.small-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.auto-row {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}
.auto-btn {
  flex: 1;
  background: #e0f2f1;
  border: 1px solid #0a3b40;
  color: #0a3b40;
  font-size: 12px;
  padding: 5px;
  border-radius: 6px;
  cursor: pointer;
}
.clear-btn {
  background: #fdecea;
  border: 1px solid #c62828;
  color: #c62828;
}
.optional-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 5px;
  padding: 8px;
  background: #f8f8f8;
  border-radius: 6px;
}
.optional-checkbox label {
  margin: 0;
  font-weight: normal;
}
button {
  margin-top: 14px;
  padding: 11px;
  width: 100%;
  background: #0a3b40;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
}

/* ===== التقرير ===== */
.report {
  display: none;
}
@media print {
  body {
    background: white;
    padding: 0;
  }
  .tool {
    display: none;
  }
  .report {
    display: block;
  }
  .header {
    background: #0a3b40;
    color: white;
    text-align: center;
    padding: 8px;
    margin-bottom: 10px;
    font-size: 12px;
  }
  .header .hijri {
    font-size: 11px;
    margin-top: 4px;
  }
  .top-info {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 10px;
  }
  .box {
    border: 1px solid #ccc;
    padding: 6px;
    text-align: center;
    font-size: 11pt;
  }
  /* الهدف التربوي */
  .goal-section {
    background: linear-gradient(135deg, #e8f5e9, #f4fbf6);
    border-right: 5px solid #2e7d32;
    border-radius: 8px;
    padding: 8px 10px;
    margin-bottom: 10px;
    min-height: 70px;
    text-align: center;
    line-height: 1.7;
  }
  .goal-section strong {
    color: #1b5e20;
    margin-bottom: 6px;
    display: block;
  }
  .section {
    border: 1px solid #ccc;
    padding: 8px;
    font-size: 11pt;
  }
  .section strong {
    display: block;
    border-bottom: 1px solid #0a3b40;
    margin-bottom: 6px;
  }
  .grid2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 10px;
  }
  .optional-section {
    background: #fff8cc;
    border: 1px dashed #e6b800;
  }
  .images {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 12px;
  }
  .images img {
    width: 100%;
    height: 162px; /* تصغير 10% من 180px */
    object-fit: cover;
    border: 1px solid #ccc;
  }
  .signatures {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-top: 30px;
    font-size: 10pt;
  }
  .signatures div {
    text-align: center;
  }
  .signature-line {
    border-bottom: 1px dashed #666;
    height: 20px;
    margin-top: 5px;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
  }
  /* إخفاء الأقسام الاختيارية غير المحددة */
  .optional-section.hide-in-print {
    display: none !important;
  }
}
</style>
</head>

<body>

<div class="tool">
  <h2>أداة إعداد التقارير التعليمية - محسّنة</h2>

  <label>إدارة التعليم</label>
  <input id="eduInput" placeholder="أدخل إدارة التعليم">

  <label>اسم المدرسة</label>
  <input id="schoolInput" placeholder="أدخل اسم المدرسة">

  <div class="small-grid">
    <select id="reportSelect">
      <option value="">اختر التقرير</option>
      <option value="تقرير نشاط إثرائي" selected>تقرير نشاط إثرائي</option>
      <option value="تقرير خطة علاجية">تقرير خطة علاجية</option>
      <option value="تقرير تنفيذ اختبار تحسن">تقرير تنفيذ اختبار تحسن</option>
      <option value="تقرير تصنيف الطلاب">تقرير تصنيف الطلاب</option>
      <option value="تقرير تحليل النتائج">تقرير تحليل النتائج</option>
    </select>

    <input id="targetInput" placeholder="المستهدفون">
    <input id="countInput" placeholder="العدد">
  </div>

  <div id="fields"></div>

  <!-- قسم الاختيارات الاختيارية -->
  <div class="optional-checkbox">
    <input type="checkbox" id="includeChallenges" checked>
    <label for="includeChallenges">تضمين قسم "التحديات" في التقرير</label>
  </div>
  
  <div class="optional-checkbox">
    <input type="checkbox" id="includeStrengths" checked>
    <label for="includeStrengths">تضمين قسم "نقاط القوة" في التقرير</label>
  </div>

  <label>إرفاق الصور (حد أقصى صورتين)</label>
  <input type="file" id="imageInput" multiple accept="image/*">

  <label>اسم المعلم</label>
  <input id="teacherInput" placeholder="اسم المعلم">

  <label>اسم مدير المدرسة</label>
  <input id="principalInput" placeholder="اسم مدير المدرسة">

  <button onclick="generateReport()">معاينة وتصدير PDF</button>
</div>

<div class="report">
  <div class="header">
    <div id="edu"></div>
    <div id="school"></div>
    <div id="hijriDate" class="hijri"></div>
  </div>

  <div class="top-info">
    <div class="box"><strong>التقرير</strong><div id="reportTitle"></div></div>
    <div class="box"><strong>المستهدفون</strong><div id="target"></div></div>
    <div class="box"><strong>العدد</strong><div id="count"></div></div>
  </div>

  <div class="goal-section">
    <strong>الهدف التربوي</strong>
    <div id="goal"></div>
  </div>

  <div class="grid2">
    <div class="section"><strong>وصف مختصر</strong><div id="desc1"></div></div>
    <div class="section"><strong>إجراءات التنفيذ</strong><div id="desc2"></div></div>
  </div>

  <div class="grid2">
    <div class="section"><strong>النتائج</strong><div id="desc3"></div></div>
    <div class="section"><strong>التوصيات</strong><div id="desc4"></div></div>
  </div>

  <div class="grid2" id="optionalSections">
    <div class="section optional-section" id="challengesSection">
      <strong>التحديات</strong><div id="challenges"></div>
    </div>
    <div class="section optional-section" id="strengthsSection">
      <strong>نقاط القوة</strong><div id="strengths"></div>
    </div>
  </div>

  <div class="images" id="imagesBox"></div>

  <div class="signatures">
    <div>
      <div id="teacher"></div>
      <div class="signature-line"></div>
    </div>
    <div>
      <div id="principal"></div>
      <div class="signature-line"></div>
    </div>
  </div>
</div>

<script>
// البيانات المتوفرة مسبقاً للنصوص التلقائية
const data = {
  "تقرير نشاط إثرائي": {
    goal: "تنمية المهارات المعرفية والإبداعية للطلاب وتوسيع مداركهم خارج المنهج الدراسي.",
    desc1: "نشاط تعليمي تكميلي يهدف إلى إثراء المعرفة وتنمية المواهب لدى الطلاب.",
    desc2: "تحضير المواد التعليمية، تقسيم الطلاب إلى مجموعات، تنفيذ الأنشطة العملية.",
    desc3: "زيادة حماس الطلاب للتعلم وتحسن مهارات التفكير الناقد والإبداعي.",
    desc4: "تكرار النشاط مع توسيع نطاقه ليشمل مجالات أخرى وتضمين المزيد من الطلاب.",
    challenges: "نقص الموارد والوقت الكافي لتنفيذ جميع الأنشطة المقترحة.",
    strengths: "تفاعل الطلاب الإيجابي وتنوع الأنشطة المنفذة."
  }
};

// تعريف المتغيرات العامة
let fieldsBox, reportSelect;

// تهيئة التطبيق
function initApp() {
  fieldsBox = document.getElementById('fields');
  reportSelect = document.getElementById('reportSelect');
  
  // إضافة حقول النص
  const fields = [
    ['goal', 'الهدف التربوي'],
    ['desc1', 'وصف مختصر'],
    ['desc2', 'إجراءات التنفيذ'],
    ['desc3', 'النتائج'],
    ['desc4', 'التوصيات'],
    ['challenges', 'التحديات'],
    ['strengths', 'نقاط القوة']
  ];
  
  fields.forEach(f => {
    fieldsBox.innerHTML += `
      <label>${f[1]}</label>
      <textarea id="${f[0]}Input" rows="3"></textarea>
      <div class="auto-row">
        <button class="auto-btn" onclick="fillField('${f[0]}')">نص تلقائي</button>
        <button class="auto-btn clear-btn" onclick="clearField('${f[0]}')">مسح النص</button>
      </div>`;
  });
  
  // تعيين القيم الافتراضية لتقرير نشاط إثرائي
  setTimeout(() => {
    document.getElementById('reportSelect').value = 'تقرير نشاط إثرائي';
    document.getElementById('goalInput').value = data["تقرير نشاط إثرائي"].goal;
    document.getElementById('desc1Input').value = data["تقرير نشاط إثرائي"].desc1;
    document.getElementById('desc2Input').value = data["تقرير نشاط إثرائي"].desc2;
    document.getElementById('desc3Input').value = data["تقرير نشاط إثرائي"].desc3;
    document.getElementById('desc4Input').value = data["تقرير نشاط إثرائي"].desc4;
    document.getElementById('challengesInput').value = data["تقرير نشاط إثرائي"].challenges;
    document.getElementById('strengthsInput').value = data["تقرير نشاط إثرائي"].strengths;
    
    // تعيين قيم افتراضية للحقول الأخرى
    document.getElementById('eduInput').value = 'إدارة التعليم بمحافظة الرياض';
    document.getElementById('schoolInput').value = 'المدرسة الابتدائية الأولى';
    document.getElementById('targetInput').value = 'طلاب الصف الرابع';
    document.getElementById('countInput').value = '٢٥ طالباً';
    document.getElementById('teacherInput').value = 'أحمد محمد السعيد';
    document.getElementById('principalInput').value = 'خالد عبدالله الفهد';
  }, 100);
  
  // إعداد معالج اختيار الصور
  document.getElementById('imageInput').addEventListener('change', loadImages);
  
  // تحميل التاريخ الهجري
  loadHijriDate();
}

// ملء الحقل بنص تلقائي
function fillField(fieldId) {
  const reportType = reportSelect.value;
  if (reportType && data[reportType] && data[reportType][fieldId]) {
    document.getElementById(fieldId + 'Input').value = data[reportType][fieldId];
  }
}

// مسح نص الحقل
function clearField(fieldId) {
  document.getElementById(fieldId + 'Input').value = '';
}

// تحميل الصور
function loadImages(event) {
  const imagesBox = document.getElementById('imagesBox');
  imagesBox.innerHTML = '';
  
  const files = Array.from(event.target.files).slice(0, 2);
  
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement('img');
      img.src = e.target.result;
      imagesBox.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

// تحميل التاريخ الهجري
async function loadHijriDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  
  try {
    const response = await fetch(`https://api.aladhan.com/v1/gToH/${day}-${month}-${year}`);
    const result = await response.json();
    
    if (result.code === 200) {
      const hijri = result.data.hijri;
      document.getElementById('hijriDate').textContent = 
        `${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`;
    }
  } catch (error) {
    document.getElementById('hijriDate').textContent = 'التاريخ الهجري غير متوفر';
  }
}

// توليد التقرير
function generateReport() {
  // مزامنة البيانات من حقول الإدخال إلى التقرير
  syncField('eduInput', 'edu');
  syncField('schoolInput', 'school');
  syncField('targetInput', 'target');
  syncField('countInput', 'count');
  syncField('teacherInput', 'teacher');
  syncField('principalInput', 'principal');
  
  // تعيين عنوان التقرير
  document.getElementById('reportTitle').textContent = reportSelect.value;
  
  // مزامنة حقول النص
  syncField('goalInput', 'goal');
  syncField('desc1Input', 'desc1');
  syncField('desc2Input', 'desc2');
  syncField('desc3Input', 'desc3');
  syncField('desc4Input', 'desc4');
  syncField('challengesInput', 'challenges');
  syncField('strengthsInput', 'strengths');
  
  // التحكم في إظهار/إخفاء الأقسام الاختيارية
  const includeChallenges = document.getElementById('includeChallenges').checked;
  const includeStrengths = document.getElementById('includeStrengths').checked;
  
  const challengesSection = document.getElementById('challengesSection');
  const strengthsSection = document.getElementById('strengthsSection');
  
  if (includeChallenges) {
    challengesSection.classList.remove('hide-in-print');
  } else {
    challengesSection.classList.add('hide-in-print');
  }
  
  if (includeStrengths) {
    strengthsSection.classList.remove('hide-in-print');
  } else {
    strengthsSection.classList.add('hide-in-print');
  }
  
  // تحميل التاريخ الهجري
  loadHijriDate();
  
  // الانتقال إلى معاينة الطباعة
  setTimeout(() => {
    window.print();
  }, 500);
}

// مزامنة حقل من الإدخال إلى التقرير
function syncField(inputId, outputId) {
  const inputElement = document.getElementById(inputId);
  const outputElement = document.getElementById(outputId);
  
  if (inputElement && outputElement) {
    outputElement.textContent = inputElement.value;
  }
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initApp);
</script>

</body>
</html>