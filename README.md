<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>أداة إعداد التقارير التعليمية</title>

<style>
/* ===== العرض العادي ===== */
body{
  font-family:Tahoma,Arial,sans-serif;
  background:#eef7f5;
  margin:0;
  padding:20px;
}
.tool{
  max-width:900px;
  margin:auto;
  background:white;
  padding:22px;
  border-radius:16px;
  box-shadow:0 10px 25px rgba(0,0,0,.1);
}
.tool h2{text-align:center;color:#0a3b40}
label{font-weight:700;margin-top:10px;display:block}
input,textarea,select{
  width:100%;
  padding:9px;
  margin-top:5px;
  border-radius:8px;
  border:1px solid #ccc;
  font-size:14px;
}
textarea{resize:none}
.small-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:8px;
}
.auto-row{display:flex;gap:6px;margin-top:4px}
.auto-btn{
  flex:1;
  background:#e0f2f1;
  border:1px solid #0a3b40;
  color:#0a3b40;
  font-size:12px;
  padding:5px;
  border-radius:6px;
  cursor:pointer;
}
.clear-btn{
  background:#fdecea;
  border:1px solid #c62828;
  color:#c62828;
}
button{
  margin-top:14px;
  padding:11px;
  width:100%;
  background:#0a3b40;
  color:white;
  border:none;
  border-radius:10px;
  font-size:14px;
  cursor:pointer;
}
.checkbox-row{
  display:flex;
  align-items:center;
  gap:10px;
  margin:10px 0;
  padding:10px;
  background:#f5f9ff;
  border-radius:8px;
}
.checkbox-row input[type="checkbox"]{
  width:20px;
  margin:0;
}

/* ===== الطباعة ===== */
.report{display:none}

@page{
  size:A4;
  margin:12mm;
}

@media print{
  body{background:white;padding:0}
  .tool{display:none}
  .report{display:block}

  .section,
  .goal-section,
  .images,
  .signatures{
    page-break-inside:avoid;
    break-inside:avoid;
  }

  .images img{
    height:auto;
    max-height:160px;
  }
  
  .optional{
    display:block !important;
  }
}

/* ===== التقرير ===== */
.header{
  background:#0a3b40;
  color:white;
  text-align:center;
  padding:8px;
  margin-bottom:10px;
  font-size:12px;
}
.header .hijri{font-size:11px;margin-top:4px}

.top-info{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:8px;
  margin-bottom:10px;
}
.box{
  border:1px solid #ccc;
  padding:6px;
  text-align:center;
  font-size:11pt;
}

.goal-section{
  background:#e8f5e9;
  border-right:5px solid #2e7d32;
  border-radius:8px;
  padding:8px;
  margin-bottom:10px;
  text-align:center;
}

.section{
  border:1px solid #ccc;
  padding:8px;
  font-size:11pt;
}
.section strong{
  display:block;
  border-bottom:1px solid #0a3b40;
  margin-bottom:6px;
}

.grid2{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
  margin-bottom:10px;
}

.optional{
  background:#fff8cc;
  border:1px dashed #e6b800;
}

.images{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
  margin-top:10px;
}

.signatures{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:40px;
  margin-top:20px;
  font-size:10pt;
}
.line{
  border-bottom:1px dashed #000;
  height:20px;
  margin-top:5px;
}
</style>
</head>

<body>

<div class="tool">
<h2>أداة إعداد التقارير التعليمية</h2>

<label>إدارة التعليم</label>
<select id="eduSelect" onchange="sync('edu',this.value)">
  <option value="">اختر إدارة التعليم</option>
</select>

<label>اسم المدرسة</label>
<input oninput="sync('school',this.value)">

<div class="small-grid">
<select id="reportSelect" onchange="syncReport()">
  <option value="">اختر التقرير</option>
</select>
<input placeholder="المستهدفون" oninput="sync('target',this.value)">
<input placeholder="العدد" oninput="sync('count',this.value)">
</div>

<div id="fields"></div>

<div class="checkbox-row">
  <input type="checkbox" id="includeChallenges" checked onchange="toggleOptional('challenges')">
  <label for="includeChallenges" style="margin:0">تضمين "التحديات" في التقرير</label>
</div>

<div class="checkbox-row">
  <input type="checkbox" id="includeStrengths" checked onchange="toggleOptional('strengths')">
  <label for="includeStrengths" style="margin:0">تضمين "نقاط القوة" في التقرير</label>
</div>

<label>إرفاق الصور (حد أقصى صورتين)</label>
<input type="file" multiple accept="image/*" onchange="loadImages(this)">

<label>اسم المعلم</label>
<input oninput="sync('teacher',this.value)">

<label>اسم مدير المدرسة</label>
<input oninput="sync('principal',this.value)">

<button onclick="window.print()">تصدير PDF</button>
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

<div class="grid2">
  <div class="section optional" id="challengesSection"><strong>التحديات</strong><div id="challenges"></div></div>
  <div class="section optional" id="strengthsSection"><strong>نقاط القوة</strong><div id="strengths"></div></div>
</div>

<div class="images" id="imagesBox"></div>

<div class="signatures">
  <div><div id="teacher"></div><div class="line"></div>توقيع المعلم</div>
  <div><div id="principal"></div><div class="line"></div>توقيع مدير المدرسة</div>
</div>
</div>

<script>
// البيانات الأساسية
const fields = [
  ['goal','الهدف التربوي'],
  ['desc1','وصف مختصر'],
  ['desc2','إجراءات التنفيذ'],
  ['desc3','النتائج'],
  ['desc4','التوصيات'],
  ['challenges','التحديات'],
  ['strengths','نقاط القوة']
];

// قائمة إدارات التعليم
const educationDepartments = [
  "الإدارة العامة للتعليم بمنطقة مكة المكرمة",
  "الإدارة العامة للتعليم بمنطقة الرياض",
  "الإدارة العامة للتعليم بمنطقة المدينة المنورة",
  "الإدارة العامة للتعليم بالمنطقة الشرقية",
  "الإدارة العامة للتعليم بمنطقة القصيم",
  "الإدارة العامة للتعليم بمنطقة عسير",
  "الإدارة العامة للتعليم بمنطقة تبوك",
  "الإدارة العامة للتعليم بمنطقة حائل",
  "الإدارة العامة للتعليم بمنطقة الحدود الشمالية",
  "الإدارة العامة للتعليم بمنطقة جازان",
  "الإدارة العامة للتعليم بمنطقة نجران",
  "الإدارة العامة للتعليم بمنطقة الباحة",
  "الإدارة العامة للتعليم بمنطقة الجوف",
  "الإدارة العامة للتعليم بمحافظة الأحساء",
  "الإدارة العامة للتعليم بمحافظة الطائف",
  "الإدارة العامة للتعليم بمحافظة جدة"
];

// بيانات التقارير مع النصوص التلقائية (3 نصوص لكل حقل)
const reportsData = {
  "تقرير استخدام التقنية في التدريس": {
    goal: [
      "تحسين جودة العملية التعليمية",
      "تطوير مهارات التعلم الرقمي",
      "رفع كفاءة التحصيل الدراسي"
    ],
    desc1: [
      "استخدام أجهزة وتطبيقات حديثة",
      "تطوير المحتوى التعليمي الرقمي",
      "دمج التقنية في خطط الدروس"
    ],
    desc2: [
      "توفير أجهزة حاسوب للطلاب",
      "تدريب المعلمين على البرامج",
      "تجهيز البيئة التقنية المناسبة"
    ],
    desc3: [
      "تحسن مستوى التفاعل الصفي",
      "زيادة دافعية الطلاب للتعلم",
      "تحسين نتائج الاختبارات"
    ],
    desc4: [
      "توسيع نطاق استخدام التقنية",
      "تدريب مستمر للمعلمين",
      "توفير أجهزة إضافية"
    ],
    challenges: [
      "ضعف الاتصال بالإنترنت",
      "نقص الأجهزة المتاحة",
      "قلة الخبرة التقنية"
    ],
    strengths: [
      "تفاعل الطلاب الإيجابي",
      "دعم الإدارة المدرسية",
      "توفر المواد التدريبية"
    ]
  },
  "تقرير توظيف الأدوات الرقمية في التعليم": {
    goal: [
      "تعزيز التعلم التفاعلي",
      "تنويع أساليب التدريس",
      "تحقيق التمايز التعليمي"
    ],
    desc1: [
      "استخدام منصات تعليمية متنوعة",
      "تطبيقات تفاعلية للطلاب",
      "مواد رقمية مخصصة"
    ],
    desc2: [
      "تسجيل الدروس على المنصات",
      "إنشاء أنشطة تفاعلية",
      "متابعة تقدم الطلاب"
    ],
    desc3: [
      "زيادة مشاركة الطلاب",
      "تحسن الفهم والاستيعاب",
      "تقليل الوقت والجهد"
    ],
    desc4: [
      "دمج المزيد من الأدوات",
      "تطوير المهارات الرقمية",
      "تقييم الأداء باستمرار"
    ],
    challenges: [
      "صعوبة بعض التطبيقات",
      "حاجة للتدريب المستمر",
      "فروق فردية بين الطلاب"
    ],
    strengths: [
      "تنوع الخيارات المتاحة",
      "مرونة في التطبيق",
      "نتائج إيجابية سريعة"
    ]
  },
  "تقرير استخدام السبورة الذكية": {
    goal: [
      "تحسين الشرح والتوضيح",
      "جذب انتباه الطلاب",
      "توفير الوقت والجهد"
    ],
    desc1: [
      "استخدام السبورة في الدروس",
      "عرض الوسائط المتعددة",
      "تفاعل مباشر مع المحتوى"
    ],
    desc2: [
      "تجهيز الدروس مسبقاً",
      "تدريب الطلاب على الاستخدام",
      "دمج الأنشطة التفاعلية"
    ],
    desc3: [
      "زيادة التركيز والانتباه",
      "تحسن الاستيعاب والفهم",
      "تفاعل أكبر في الصف"
    ],
    desc4: [
      "توفير ألواح إضافية",
      "تدريب منتظم للمعلمين",
      "صيانة دورية للأجهزة"
    ],
    challenges: [
      "أعطال فنية متكررة",
      "حاجة لصيانة مستمرة",
      "تكاليف الصيانة العالية"
    ],
    strengths: [
      "سهولة الاستخدام",
      "تفاعل الطلاب الكبير",
      "توفير الوقت"
    ]
  },
  "تقرير نشاط إثرائي": {
    goal: [
      "تنمية المهارات الإبداعية",
      "تعزيز الثقة بالنفس",
      "اكتشاف المواهب الطلابية"
    ],
    desc1: [
      "أنشطة متنوعة خارج المنهج",
      "ورش عمل ومشاريع جماعية",
      "مسابقات وعروض تقديمية"
    ],
    desc2: [
      "تخطيط الأنشطة مسبقاً",
      "توفير المواد والأدوات",
      "تنظيم المجموعات"
    ],
    desc3: [
      "ظهور مواهب جديدة",
      "تحسن المهارات الاجتماعية",
      "زيادة الحماس للتعلم"
    ],
    desc4: [
      "زيادة عدد الأنشطة",
      "تنويع المجالات",
      "تشجيع المشاركة"
    ],
    challenges: [
      "ضيق الوقت المتاح",
      "نقص التمويل المالي",
      "صعوبة التنسيق"
    ],
    strengths: [
      "تفعيل طاقات الطلاب",
      "دعم أولياء الأمور",
      "مرونة في التنفيذ"
    ]
  },
  "تقرير خطة علاجية": {
    goal: [
      "تحسين مستوى الضعاف",
      "سد الفجوات التعليمية",
      "رفع الكفاءة الدراسية"
    ],
    desc1: [
      "تشخيص صعوبات التعلم",
      "وضع برامج علاجية",
      "متابعة التقدم أسبوعياً"
    ],
    desc2: [
      "تحديد الطلاب الضعاف",
      "إعداد مواد علاجية",
      "جلسات علاجية فردية"
    ],
    desc3: [
      "تحسن ملحوظ في المستوى",
      "زيادة الثقة بالنفس",
      "تقليل نسبة الضعاف"
    ],
    desc4: [
      "استمرار البرامج العلاجية",
      "تطوير آليات التشخيص",
      "تدريب المعلمين"
    ],
    challenges: [
      "نقص الوقت الكافي",
      "صعوبة متابعة الجميع",
      "فروق فردية كبيرة"
    ],
    strengths: [
      "تحسن سريع للمستوى",
      "دعم أولياء الأمور",
      "تعاون الطلاب"
    ]
  }
};

// متغيرات عامة
let currentReport = "";
let autoTextIndex = {
  goal: 0, desc1: 0, desc2: 0, desc3: 0, desc4: 0, challenges: 0, strengths: 0
};

// تهيئة القوائم المنسدلة
function initializeDropdowns() {
  const eduSelect = document.getElementById('eduSelect');
  const reportSelect = document.getElementById('reportSelect');
  
  // ملء قائمة إدارات التعليم
  educationDepartments.forEach(dept => {
    const option = document.createElement('option');
    option.value = dept;
    option.textContent = dept;
    eduSelect.appendChild(option);
  });
  
  // ملء قائمة التقارير
  Object.keys(reportsData).forEach(report => {
    const option = document.createElement('option');
    option.value = report;
    option.textContent = report;
    reportSelect.appendChild(option);
  });
}

// عرض الحقول
function renderFields() {
  const fieldsBox = document.getElementById('fields');
  fieldsBox.innerHTML = '';
  
  fields.forEach(f => {
    const fieldId = f[0];
    const fieldLabel = f[1];
    
    // لا نعرض حقلي التحديات ونقاط القوة هنا لأنهما اختياريان
    if (fieldId === 'challenges' || fieldId === 'strengths') return;
    
    fieldsBox.innerHTML += `
      <label>${fieldLabel}</label>
      <textarea id="${fieldId}Input" rows="3"></textarea>
      <div class="auto-row">
        <button class="auto-btn" onclick="fill('${fieldId}')">نص تلقائي</button>
        <button class="auto-btn clear-btn" onclick="clearText('${fieldId}')">مسح النص</button>
      </div>`;
  });
}

// تعيين التقرير
function syncReport() {
  const reportSelect = document.getElementById('reportSelect');
  const reportTitle = document.getElementById('reportTitle');
  currentReport = reportSelect.value;
  reportTitle.textContent = currentReport;
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
  if (fieldId === 'challenges' || fieldId === 'strengths') {
    document.getElementById(fieldId).textContent = text;
  } else {
    document.getElementById(fieldId + 'Input').value = text;
    sync(fieldId, text);
  }
}

// مسح النص
function clearText(fieldId) {
  if (fieldId === 'challenges' || fieldId === 'strengths') {
    document.getElementById(fieldId).textContent = '';
  } else {
    document.getElementById(fieldId + 'Input').value = '';
    sync(fieldId, '');
  }
}

// مزامنة البيانات مع التقرير
function sync(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// تبديل عرض الحقول الاختيارية
function toggleOptional(fieldId) {
  const checkbox = document.getElementById(`include${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)}`);
  const section = document.getElementById(`${fieldId}Section`);
  
  if (checkbox && section) {
    if (!checkbox.checked) {
      section.style.display = 'none';
    } else {
      section.style.display = 'block';
    }
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
      img.style.maxWidth = '100%';
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
  hijriDateElement.textContent = `التاريخ الهجري: ${hijriDate}`;
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', () => {
  initializeDropdowns();
  renderFields();
  initializeHijriDate();
  
  // تعيين القيم الافتراضية للحقول الاختيارية
  toggleOptional('challenges');
  toggleOptional('strengths');
  
  // إضافة مستمعين للحقول النصية
  fields.forEach(f => {
    const fieldId = f[0];
    if (fieldId !== 'challenges' && fieldId !== 'strengths') {
      const inputElement = document.getElementById(`${fieldId}Input`);
      if (inputElement) {
        inputElement.addEventListener('input', function() {
          sync(fieldId, this.value);
        });
      }
    }
  });
});
</script>

</body>
</html>