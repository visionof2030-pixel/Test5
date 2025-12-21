
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
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
  height: 80px;
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
.checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}
.checkbox-container input[type="checkbox"] {
  width: auto;
  margin-top: 0;
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
    width: 85%;
    height: 153px; /* تم التخفيض بنسبة 15% */
    object-fit: cover;
    border: 1px solid #ccc;
    margin: auto;
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
    border-bottom: 1px dashed #333;
    width: 80%;
    margin: 5px auto 0 auto;
    height: 1px;
  }
  .optional-print {
    display: none !important;
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
</select>
<input id="targetInput" placeholder="المستهدفون">
<input id="countInput" placeholder="العدد" type="number">
</div>

<div id="fieldsContainer"></div>

<div class="checkbox-container">
  <input type="checkbox" id="showChallenges" checked>
  <label for="showChallenges">إظهار قسم التحديات في التقرير</label>
</div>

<div class="checkbox-container">
  <input type="checkbox" id="showStrengths" checked>
  <label for="showStrengths">إظهار قسم نقاط القوة في التقرير</label>
</div>

<label>إرفاق الصور (حد أقصى صورتين)</label>
<input type="file" id="imageUpload" multiple accept="image/*">

<label>اسم المعلم</label>
<input id="teacherInput" placeholder="أدخل اسم المعلم">

<label>اسم مدير المدرسة</label>
<input id="principalInput" placeholder="أدخل اسم مدير المدرسة">

<button onclick="generateReport()">معاينة وتصدير PDF</button>
</div>

<div class="report" id="reportPreview">
<div class="header">
  <div id="eduDisplay"></div>
  <div id="schoolDisplay"></div>
  <div id="hijriDate" class="hijri"></div>
</div>

<div class="top-info">
  <div class="box"><strong>التقرير</strong><div id="reportTitle"></div></div>
  <div class="box"><strong>المستهدفون</strong><div id="targetDisplay"></div></div>
  <div class="box"><strong>العدد</strong><div id="countDisplay"></div></div>
</div>

<div class="goal-section">
  <strong>الهدف التربوي</strong>
  <div id="goalDisplay"></div>
</div>

<div class="grid2">
  <div class="section"><strong>وصف مختصر</strong><div id="desc1Display"></div></div>
  <div class="section"><strong>إجراءات التنفيذ</strong><div id="desc2Display"></div></div>
</div>

<div class="grid2">
  <div class="section"><strong>النتائج</strong><div id="desc3Display"></div></div>
  <div class="section"><strong>التوصيات</strong><div id="desc4Display"></div></div>
</div>

<div class="grid2 optional-print" id="optionalSections">
  <div class="section optional-section" id="challengesSection">
    <strong>التحديات</strong>
    <div id="challengesDisplay"></div>
  </div>
  <div class="section optional-section" id="strengthsSection">
    <strong>نقاط القوة</strong>
    <div id="strengthsDisplay"></div>
  </div>
</div>

<div class="images" id="imagesDisplay"></div>

<div class="signatures">
  <div>
    <div id="teacherDisplay"></div>
    <div class="signature-line"></div>
  </div>
  <div>
    <div id="principalDisplay"></div>
    <div class="signature-line"></div>
  </div>
</div>
</div>

<script>
// بيانات تقرير واحد للتجربة (تقرير نشاط إثرائي)
const sampleReport = {
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

// عناصر DOM
const fieldsContainer = document.getElementById('fieldsContainer');
const reportSelect = document.getElementById('reportSelect');
const reportPreview = document.getElementById('reportPreview');
const optionalSections = document.getElementById('optionalSections');
const challengesSection = document.getElementById('challengesSection');
const strengthsSection = document.getElementById('strengthsSection');

// تهيئة حقول النص
function initializeFields() {
  const fields = [
    {id: 'goalInput', label: 'الهدف التربوي'},
    {id: 'desc1Input', label: 'وصف مختصر'},
    {id: 'desc2Input', label: 'إجراءات التنفيذ'},
    {id: 'desc3Input', label: 'النتائج'},
    {id: 'desc4Input', label: 'التوصيات'},
    {id: 'challengesInput', label: 'التحديات'},
    {id: 'strengthsInput', label: 'نقاط القوة'}
  ];

  fields.forEach(field => {
    const div = document.createElement('div');
    div.innerHTML = `
      <label>${field.label}</label>
      <textarea id="${field.id}"></textarea>
      <div class="auto-row">
        <button class="auto-btn" onclick="fillField('${field.id}')">نص تلقائي</button>
        <button class="auto-btn clear-btn" onclick="clearField('${field.id}')">مسح النص</button>
      </div>
    `;
    fieldsContainer.appendChild(div);
  });
}

// تعبئة الحقل بنص تلقائي
function fillField(fieldId) {
  const reportType = reportSelect.value;
  if (sampleReport[reportType]) {
    const fieldName = fieldId.replace('Input', '');
    if (sampleReport[reportType][fieldName]) {
      document.getElementById(fieldId).value = sampleReport[reportType][fieldName];
      updatePreview();
    }
  }
}

// مسح نص الحقل
function clearField(fieldId) {
  document.getElementById(fieldId).value = '';
  updatePreview();
}

// تحديث المعاينة
function updatePreview() {
  // معلومات المدرسة والتقرير
  document.getElementById('eduDisplay').textContent = document.getElementById('eduInput').value;
  document.getElementById('schoolDisplay').textContent = document.getElementById('schoolInput').value;
  document.getElementById('reportTitle').textContent = reportSelect.value;
  document.getElementById('targetDisplay').textContent = document.getElementById('targetInput').value;
  document.getElementById('countDisplay').textContent = document.getElementById('countInput').value;
  
  // المحتوى
  document.getElementById('goalDisplay').textContent = document.getElementById('goalInput').value;
  document.getElementById('desc1Display').textContent = document.getElementById('desc1Input').value;
  document.getElementById('desc2Display').textContent = document.getElementById('desc2Input').value;
  document.getElementById('desc3Display').textContent = document.getElementById('desc3Input').value;
  document.getElementById('desc4Display').textContent = document.getElementById('desc4Input').value;
  document.getElementById('challengesDisplay').textContent = document.getElementById('challengesInput').value;
  document.getElementById('strengthsDisplay').textContent = document.getElementById('strengthsInput').value;
  
  // التوقيعات
  document.getElementById('teacherDisplay').textContent = document.getElementById('teacherInput').value;
  document.getElementById('principalDisplay').textContent = document.getElementById('principalInput').value;
  
  // التحكم في الأقسام الاختيارية
  const showChallenges = document.getElementById('showChallenges').checked;
  const showStrengths = document.getElementById('showStrengths').checked;
  
  if (!showChallenges && !showStrengths) {
    optionalSections.style.display = 'none';
  } else {
    optionalSections.style.display = 'grid';
    challengesSection.style.display = showChallenges ? 'block' : 'none';
    strengthsSection.style.display = showStrengths ? 'block' : 'none';
  }
}

// تحميل الصور
function loadImages() {
  const input = document.getElementById('imageUpload');
  const imagesDisplay = document.getElementById('imagesDisplay');
  imagesDisplay.innerHTML = '';
  
  if (input.files.length > 0) {
    const files = Array.from(input.files).slice(0, 2);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = 'صورة النشاط';
        imagesDisplay.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  }
}

// الحصول على التاريخ الهجري
async function getHijriDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  
  try {
    const response = await fetch(`https://api.aladhan.com/v1/gToH/${day}-${month}-${year}`);
    const data = await response.json();
    const hijri = data.data.hijri;
    return `${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`;
  } catch (error) {
    return 'التاريخ الهجري غير متوفر';
  }
}

// توليد التقرير
async function generateReport() {
  // تحديث المعاينة أولاً
  updatePreview();
  
  // تحديث التاريخ الهجري
  const hijriDate = await getHijriDate();
  document.getElementById('hijriDate').textContent = hijriDate;
  
  // إعداد الطباعة
  setTimeout(() => {
    window.print();
  }, 500);
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', () => {
  // إضافة خيار التقرير الوحيد
  reportSelect.innerHTML = '<option value="تقرير نشاط إثرائي">تقرير نشاط إثرائي</option>';
  
  // تهيئة الحقول
  initializeFields();
  
  // إضافة مستمعي الأحداث
  document.getElementById('imageUpload').addEventListener('change', loadImages);
  
  // تحديث المعاينة عند تغيير أي حقل
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('input', updatePreview);
  });
  
  // تحديث المعاينة عند تغيير خيارات التحديات ونقاط القوة
  document.getElementById('showChallenges').addEventListener('change', updatePreview);
  document.getElementById('showStrengths').addEventListener('change', updatePreview);
  
  // تعبئة بيانات تجريبية
  setTimeout(() => {
    document.getElementById('eduInput').value = 'إدارة التعليم بمنطقة الرياض';
    document.getElementById('schoolInput').value = 'مدرسة النخبة الابتدائية';
    document.getElementById('targetInput').value = 'طلاب الصف الخامس';
    document.getElementById('countInput').value = '25';
    document.getElementById('teacherInput').value = 'أحمد محمد العتيبي';
    document.getElementById('principalInput').value = 'خالد عبدالله الحربي';
    
    // تعبئة النص التلقائي
    reportSelect.value = 'تقرير نشاط إثرائي';
    fillField('goalInput');
    fillField('desc1Input');
    fillField('desc2Input');
    fillField('desc3Input');
    fillField('desc4Input');
    fillField('challengesInput');
    fillField('strengthsInput');
    
    updatePreview();
  }, 100);
});
</script>

</body>
</html>