<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>أداة إعداد التقارير التعليمية</title>
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
  box-shadow: 0 10px 25px rgba(0,0,0,.1);
}
.tool h2 {
  text-align: center;
  color: #0a3b40;
  margin-bottom: 20px;
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
  min-height: 80px;
}
.small-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 15px;
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
.checkbox-group {
  display: flex;
  gap: 15px;
  margin: 10px 0;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 8px;
}
.checkbox-group label {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: normal;
}
.checkbox-group input {
  width: auto;
  margin: 0;
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
    font-size: 11pt;
  }
  
  .header {
    background: #0a3b40;
    color: white;
    text-align: center;
    padding: 8px;
    margin-bottom: 10px;
  }
  .header .hijri {
    font-size: 11px;
    margin-top: 4px;
    opacity: 0.9;
  }
  
  .top-info {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 15px;
  }
  .box {
    border: 1px solid #ccc;
    padding: 6px;
    text-align: center;
    font-size: 10pt;
  }
  
  /* الهدف التربوي */
  .goal-section {
    background: linear-gradient(135deg, #e8f5e9, #f4fbf6);
    border-right: 5px solid #2e7d32;
    border-radius: 8px;
    padding: 8px 10px;
    margin-bottom: 15px;
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
    font-size: 10pt;
    min-height: 120px;
  }
  .section strong {
    display: block;
    border-bottom: 1px solid #0a3b40;
    margin-bottom: 6px;
    padding-bottom: 3px;
  }
  .grid2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 10px;
  }
  
  .optional {
    display: none !important;
  }
  
  .show-optional {
    display: block !important;
  }
  
  .images {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 15px;
  }
  .images img {
    width: 100%;
    height: 153px; /* تم تخفيض 15% من 180px */
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
    border-bottom: 1px dashed #000;
    height: 30px;
    margin-top: 20px;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
</head>
<body>

<div class="tool">
  <h2>أداة إعداد التقارير التعليمية</h2>
  
  <label>إدارة التعليم</label>
  <input id="eduInput" placeholder="أدخل إدارة التعليم">
  
  <label>اسم المدرسة</label>
  <input id="schoolInput" placeholder="أدخل اسم المدرسة">
  
  <div class="small-grid">
    <select id="reportSelect">
      <option value="">اختر التقرير</option>
      <option value="تقرير نشاط إثرائي">تقرير نشاط إثرائي</option>
      <option value="تقرير خطة علاجية">تقرير خطة علاجية</option>
      <option value="تقرير تنفيذ درس تطبيقي">تقرير تنفيذ درس تطبيقي</option>
    </select>
    
    <input id="targetInput" placeholder="المستهدفون">
    <input id="countInput" placeholder="العدد" type="number">
  </div>
  
  <div id="fields"></div>
  
  <div class="checkbox-group">
    <label>
      <input type="checkbox" id="showChallenges" checked>
      عرض قسم التحديات
    </label>
    <label>
      <input type="checkbox" id="showStrengths" checked>
      عرض قسم نقاط القوة
    </label>
  </div>
  
  <label>إرفاق الصور (حد أقصى صورتين)</label>
  <input type="file" multiple accept="image/*" id="imageUpload">
  
  <label>اسم المعلم</label>
  <input id="teacherInput" placeholder="اسم المعلم">
  
  <label>اسم مدير المدرسة</label>
  <input id="principalInput" placeholder="اسم مدير المدرسة">
  
  <button onclick="generateReport()">معاينة وتصدير PDF</button>
</div>

<div class="report" id="reportPreview">
  <div class="header">
    <div id="edu"></div>
    <div id="school"></div>
    <div id="hijriDate" class="hijri"></div>
  </div>
  
  <div class="top-info">
    <div class="box">
      <strong>التقرير</strong>
      <div id="reportTitle"></div>
    </div>
    <div class="box">
      <strong>المستهدفون</strong>
      <div id="target"></div>
    </div>
    <div class="box">
      <strong>العدد</strong>
      <div id="count"></div>
    </div>
  </div>
  
  <div class="goal-section">
    <strong>الهدف التربوي</strong>
    <div id="goal"></div>
  </div>
  
  <div class="grid2">
    <div class="section">
      <strong>وصف مختصر</strong>
      <div id="desc1"></div>
    </div>
    <div class="section">
      <strong>إجراءات التنفيذ</strong>
      <div id="desc2"></div>
    </div>
  </div>
  
  <div class="grid2">
    <div class="section">
      <strong>النتائج</strong>
      <div id="desc3"></div>
    </div>
    <div class="section">
      <strong>التوصيات</strong>
      <div id="desc4"></div>
    </div>
  </div>
  
  <div class="grid2">
    <div class="section optional" id="challengesSection">
      <strong>التحديات</strong>
      <div id="challenges"></div>
    </div>
    <div class="section optional" id="strengthsSection">
      <strong>نقاط القوة</strong>
      <div id="strengths"></div>
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
// بيانات النصوص التلقائية
const reportData = {
  "تقرير نشاط إثرائي": {
    goal: "تنمية المهارات المعرفية والإبداعية للطلاب وتوسيع مداركهم خارج المنهج الدراسي.",
    desc1: "تم تنفيذ نشاط إثرائي في مادة العلوم بعنوان 'رحلة داخل الخلية الحية' حيث قام الطلاب ببناء نماذج ثلاثية الأبعاد للخلايا النباتية والحيوانية باستخدام مواد معاد تدويرها.",
    desc2: "1. تقسيم الطلاب إلى مجموعات عمل\n2. توزيع المواد التعليمية والمواد الخام\n3. شرح المبادئ العلمية الأساسية\n4. متابعة بناء النماذج\n5. عرض ومناقشة النتائج",
    desc3: "1. زيادة فهم الطلاب لتركيب الخلية بنسبة 40%\n2. تطوير مهارات العمل الجماعي\n3. تنمية الإبداع والابتكار لدى الطلاب\n4. رفع دافعية التعلم في مادة العلوم",
    desc4: "1. تكرار النشاط مع مواضيع علمية أخرى\n2. تخصيص مساحة لعرض النماذج المتميزة\n3. إشراك أولياء الأمور في فعاليات مماثلة\n4. توثيق النشاط في قناة المدرسة على اليوتيوب",
    challenges: "1. نقص بعض المواد الخام اللازمة\n2. ضيق الوقت المخصص للنشاط\n3. تفاوت مستوى المهارات اليدوية بين الطلاب",
    strengths: "1. تفاعل الطلاب الإيجابي مع النشاط\n2. تنوع المواد المستخدمة في التنفيذ\n3. دعم إدارة المدرسة للمبادرة\n4. ارتباط النشاط بالمنهج الدراسي"
  }
};

// عناصر DOM
const elements = {
  eduInput: document.getElementById('eduInput'),
  schoolInput: document.getElementById('schoolInput'),
  reportSelect: document.getElementById('reportSelect'),
  targetInput: document.getElementById('targetInput'),
  countInput: document.getElementById('countInput'),
  teacherInput: document.getElementById('teacherInput'),
  principalInput: document.getElementById('principalInput'),
  imageUpload: document.getElementById('imageUpload'),
  showChallenges: document.getElementById('showChallenges'),
  showStrengths: document.getElementById('showStrengths'),
  fields: document.getElementById('fields'),
  
  // عناصر التقرير
  edu: document.getElementById('edu'),
  school: document.getElementById('school'),
  hijriDate: document.getElementById('hijriDate'),
  reportTitle: document.getElementById('reportTitle'),
  target: document.getElementById('target'),
  count: document.getElementById('count'),
  goal: document.getElementById('goal'),
  desc1: document.getElementById('desc1'),
  desc2: document.getElementById('desc2'),
  desc3: document.getElementById('desc3'),
  desc4: document.getElementById('desc4'),
  challenges: document.getElementById('challenges'),
  strengths: document.getElementById('strengths'),
  teacher: document.getElementById('teacher'),
  principal: document.getElementById('principal'),
  imagesBox: document.getElementById('imagesBox'),
  challengesSection: document.getElementById('challengesSection'),
  strengthsSection: document.getElementById('strengthsSection'),
  reportPreview: document.getElementById('reportPreview')
};

// تهيئة حقول النص
function initializeFields() {
  const fields = [
    {id: 'goal', label: 'الهدف التربوي'},
    {id: 'desc1', label: 'وصف مختصر'},
    {id: 'desc2', label: 'إجراءات التنفيذ'},
    {id: 'desc3', label: 'النتائج'},
    {id: 'desc4', label: 'التوصيات'},
    {id: 'challenges', label: 'التحديات'},
    {id: 'strengths', label: 'نقاط القوة'}
  ];
  
  fields.forEach(field => {
    const div = document.createElement('div');
    div.innerHTML = `
      <label>${field.label}</label>
      <textarea id="${field.id}Input" rows="4"></textarea>
      <div class="auto-row">
        <button type="button" class="auto-btn" onclick="autoFill('${field.id}')">نص تلقائي</button>
        <button type="button" class="auto-btn clear-btn" onclick="clearField('${field.id}')">مسح النص</button>
      </div>
    `;
    elements.fields.appendChild(div);
  });
}

// تعبئة النص تلقائياً
function autoFill(fieldId) {
  const selectedReport = elements.reportSelect.value;
  if (reportData[selectedReport] && reportData[selectedReport][fieldId]) {
    document.getElementById(`${fieldId}Input`).value = reportData[selectedReport][fieldId];
  }
}

// مسح حقل
function clearField(fieldId) {
  document.getElementById(`${fieldId}Input`).value = '';
}

// تحميل التاريخ الهجري
async function loadHijriDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  
  try {
    const response = await fetch(`https://api.aladhan.com/v1/gToH/${day}-${month}-${year}`);
    const data = await response.json();
    if (data.data && data.data.hijri) {
      const hijri = data.data.hijri;
      elements.hijriDate.textContent = `${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`;
    }
  } catch (error) {
    elements.hijriDate.textContent = 'التاريخ الهجري غير متوفر حالياً';
  }
}

// تحميل الصور
function loadImages() {
  elements.imagesBox.innerHTML = '';
  const files = elements.imageUpload.files;
  const maxImages = Math.min(files.length, 2);
  
  for (let i = 0; i < maxImages; i++) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement('img');
      img.src = e.target.result;
      elements.imagesBox.appendChild(img);
    };
    reader.readAsDataURL(files[i]);
  }
}

// توليد التقرير
function generateReport() {
  // تحديث البيانات من الحقول
  elements.edu.textContent = elements.eduInput.value || 'إدارة التعليم';
  elements.school.textContent = elements.schoolInput.value || 'اسم المدرسة';
  elements.reportTitle.textContent = elements.reportSelect.value || 'تقرير';
  elements.target.textContent = elements.targetInput.value || 'الطلاب';
  elements.count.textContent = elements.countInput.value || '--';
  elements.teacher.textContent = elements.teacherInput.value || 'اسم المعلم';
  elements.principal.textContent = elements.principalInput.value || 'اسم مدير المدرسة';
  
  // تحديث الحقول النصية
  const fields = ['goal', 'desc1', 'desc2', 'desc3', 'desc4', 'challenges', 'strengths'];
  fields.forEach(field => {
    const input = document.getElementById(`${field}Input`);
    const output = elements[field];
    if (input && output) {
      output.textContent = input.value || '---';
      // تحويل الأسطر الجديدة إلى فواصل
      output.innerHTML = output.textContent.replace(/\n/g, '<br>');
    }
  });
  
  // إظهار أو إخفاء الأقسام الاختيارية
  if (elements.showChallenges.checked) {
    elements.challengesSection.classList.add('show-optional');
  } else {
    elements.challengesSection.classList.remove('show-optional');
  }
  
  if (elements.showStrengths.checked) {
    elements.strengthsSection.classList.add('show-optional');
  } else {
    elements.strengthsSection.classList.remove('show-optional');
  }
  
  // تحميل التاريخ الهجري
  loadHijriDate();
  
  // تحميل الصور
  loadImages();
  
  // الانتقال للمعاينة والطباعة
  setTimeout(() => {
    window.print();
  }, 500);
}

// أحداث الاستماع
elements.reportSelect.addEventListener('change', function() {
  if (this.value && reportData[this.value]) {
    // تعبئة تلقائية للحقول عند اختيار تقرير
    Object.keys(reportData[this.value]).forEach(field => {
      const input = document.getElementById(`${field}Input`);
      if (input) {
        input.value = reportData[this.value][field];
      }
    });
  }
});

elements.imageUpload.addEventListener('change', loadImages);

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
  initializeFields();
  loadHijriDate();
  
  // تعيين بيانات افتراضية للتجربة
  elements.eduInput.value = 'إدارة التعليم بمحافظة الرياض';
  elements.schoolInput.value = 'مدرسة اليرموك الأهلية';
  elements.reportSelect.value = 'تقرير نشاط إثرائي';
  elements.targetInput.value = 'طلاب الصف السادس';
  elements.countInput.value = '32';
  elements.teacherInput.value = 'أحمد محمد السعيد';
  elements.principalInput.value = 'د. خالد عبدالله الفهد';
  
  // تعبئة الحقول بالنصوص التلقائية
  autoFill('goal');
  autoFill('desc1');
  autoFill('desc2');
  autoFill('desc3');
  autoFill('desc4');
  autoFill('challenges');
  autoFill('strengths');
});
</script>
</body>
</html>