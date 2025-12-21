<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>أداة إعداد التقارير التعليمية</title>

<style>
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

/* ===== التقرير ===== */
.report{display:none}
@media print{
body{background:white;padding:0}
.tool{display:none}
.report{display:block}

/* منع تقسيم المحتوى بين الصفحات */
.header, .top-info, .goal-section, .section, .signatures, .images {
  page-break-inside: avoid;
  break-inside: avoid;
}

/* إخفاء الأقسام غير المطلوبة */
.optional.hide-in-pdf {
  display: none !important;
}

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

/* الهدف التربوي */
.goal-section{
  background:linear-gradient(135deg,#e8f5e9,#f4fbf6);
  border-right:5px solid #2e7d32;
  border-radius:8px;
  padding:8px 10px;
  margin-bottom:10px;
  min-height:70px;
  text-align:center;
  line-height:1.7;
}
.goal-section strong{
  color:#1b5e20;
  margin-bottom:6px;
  display:block;
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
  margin-top:12px;
}
.images img{
  width:100%;
  height:180px;
  object-fit:cover;
  border:1px solid #ccc;
}
.signatures{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:40px;
  margin-top:20px;
  font-size:10pt;
}
.signatures div{text-align:center}
.line{
  border-bottom:1px dashed #000;
  height:20px;
  margin-top:5px;
}
}

/* تنسيق خيارات الاختيار */
.checkbox-option {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
  padding: 5px;
  background: #f5f5f5;
  border-radius: 6px;
}
.checkbox-option input {
  width: auto;
  margin: 0;
}
</style>
</head>

<body>

<div class="tool">
<h2>أداة إعداد التقارير التعليمية</h2>

<label>إدارة التعليم</label>
<select id="eduSelect" oninput="sync('edu',this.value); saveData()">
  <option value="">اختر إدارة التعليم</option>
  <option value="الإدارة العامة للتعليم بمنطقة مكة المكرمة">الإدارة العامة للتعليم بمنطقة مكة المكرمة</option>
  <option value="الإدارة العامة للتعليم بمنطقة الرياض">الإدارة العامة للتعليم بمنطقة الرياض</option>
  <option value="الإدارة العامة للتعليم بمنطقة المدينة المنورة">الإدارة العامة للتعليم بمنطقة المدينة المنورة</option>
  <option value="الإدارة العامة للتعليم بالمنطقة الشرقية">الإدارة العامة للتعليم بالمنطقة الشرقية</option>
  <option value="الإدارة العامة للتعليم بمنطقة القصيم">الإدارة العامة للتعليم بمنطقة القصيم</option>
  <option value="الإدارة العامة للتعليم بمنطقة عسير">الإدارة العامة للتعليم بمنطقة عسير</option>
  <option value="الإدارة العامة للتعليم بمنطقة تبوك">الإدارة العامة للتعليم بمنطقة تبوك</option>
  <option value="الإدارة العامة للتعليم بمنطقة حائل">الإدارة العامة للتعليم بمنطقة حائل</option>
  <option value="الإدارة العامة للتعليم بمنطقة الحدود الشمالية">الإدارة العامة للتعليم بمنطقة الحدود الشمالية</option>
  <option value="الإدارة العامة للتعليم بمنطقة جازان">الإدارة العامة للتعليم بمنطقة جازان</option>
  <option value="الإدارة العامة للتعليم بمنطقة نجران">الإدارة العامة للتعليم بمنطقة نجران</option>
  <option value="الإدارة العامة للتعليم بمنطقة الباحة">الإدارة العامة للتعليم بمنطقة الباحة</option>
  <option value="الإدارة العامة للتعليم بمنطقة الجوف">الإدارة العامة للتعليم بمنطقة الجوف</option>
  <option value="الإدارة العامة للتعليم بمحافظة الأحساء">الإدارة العامة للتعليم بمحافظة الأحساء</option>
  <option value="الإدارة العامة للتعليم بمحافظة الطائف">الإدارة العامة للتعليم بمحافظة الطائف</option>
  <option value="الإدارة العامة للتعليم بمحافظة جدة">الإدارة العامة للتعليم بمحافظة جدة</option>
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

<label>إرفاق الصور (حد أقصى صورتين)</label>
<input type="file" multiple accept="image/*" onchange="loadImages(this)">

<label>اسم المعلم</label>
<input id="teacherInput" oninput="sync('teacher',this.value); saveData()">

<label>اسم مدير المدرسة</label>
<input id="principalInput" oninput="sync('principal',this.value); saveData()">

<button onclick="preparePrint()">تصدير PDF</button>
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
const fields=[
 ['goal','الهدف التربوي'],
 ['desc1','وصف مختصر'],
 ['desc2','إجراءات التنفيذ'],
 ['desc3','النتائج'],
 ['desc4','التوصيات'],
 ['challenges','التحديات'],
 ['strengths','نقاط القوة']
];

/* ===== جميع التقارير بنصوص تلقائية مخصصة ===== */
const data = {
  "تقرير نشاط إثرائي": {
    goal: ["تنمية المهارات المعرفية والإبداعية للطلاب وتوسيع مداركهم خارج المنهج الدراسي."],
    desc1: ["نشاط تعليمي تكميلي يهدف إلى إثراء المعرفة وتنمية المواهب لدى الطلاب."],
    desc2: ["تحضير المواد التعليمية، تقسيم الطلاب إلى مجموعات، تنفيذ الأنشطة العملية."],
    desc3: ["زيادة حماس الطلاب للتعلم وتحسن مهارات التفكير الناقد والإبداعي."],
    desc4: ["تكرار النشاط مع توسيع نطاقه ليشمل مجالات أخرى وتضمين المزيد من الطلاب."],
    challenges: ["نقص الموارد والوقت الكافي لتنفيذ جميع الأنشطة المقترحة."],
    strengths: ["تفاعل الطلاب الإيجابي وتنوع الأنشطة المنفذة."]
  },
  "تقرير خطة علاجية": {
    goal: ["معالجة نقاط الضعف الأكاديمي للطلاب وتحسين مستواهم الدراسي."],
    desc1: ["خطة منهجية لتشخيص ومعالجة الصعوبات التعليمية للطلاب المتعثرين."],
    desc2: ["تحديد مستوى كل طالب، تصميم أنشطة علاجية، تطبيق الاختبارات التشخيصية."],
    desc3: ["تحسن ملحوظ في مستوى الطلاب المستهدفين وارتفاع درجاتهم."],
    desc4: ["استمرار المتابعة وتطوير الخطة العلاجية حسب نتائج المتابعة."],
    challenges: ["تفاوت مستويات الطلاب وصعوبة تلبية جميع الاحتياجات الفردية."],
    strengths: ["الدعم الفردي المكثف والمرونة في أساليب العلاج."]
  },
  "تقرير تنفيذ اختبار تحسن": {
    goal: ["قياس مدى تحسن مستوى الطلاب بعد تطبيق البرامج العلاجية والتطويرية."],
    desc1: ["اختبار لتقييم فعالية البرامج العلاجية وتحسين الأداء الأكاديمي."],
    desc2: ["إعداد الاختبار، تطبيقه في وقت محدد، تصحيح النتائج وتحليلها."],
    desc3: ["بيانات دقيقة عن مدى التحسن تساعد في اتخاذ القرارات التطويرية."],
    desc4: ["استخدام نتائج الاختبار في تحسين البرامج التعليمية والعلاجية."],
    challenges: ["ضيق الوقت وصعوبة إعداد اختبارات تغطي جميع الجوانب."],
    strengths: ["موثوقية النتائج وقابليتها للقياس والمقارنة."]
  },
  // ... (جميع التقارير الأخرى كما هي)
};

// إضافة مربعات الاختيار للتحديات ونقاط القوة
function renderFields(){
 fields.forEach(f=>{
  const fieldId = f[0];
  const fieldLabel = f[1];
  const isOptional = fieldId === 'challenges' || fieldId === 'strengths';
  
  let checkboxHtml = '';
  if (isOptional) {
    checkboxHtml = `
      <div class="checkbox-option">
        <input type="checkbox" id="${fieldId}Checkbox" checked onchange="toggleOptionalSection('${fieldId}')">
        <label for="${fieldId}Checkbox" style="font-weight: normal; margin: 0;">إظهار ${fieldLabel} في التقرير</label>
      </div>
    `;
  }
  
  fieldsBox.innerHTML+=`
   <label>${fieldLabel}</label>
   ${checkboxHtml}
   <textarea id="${fieldId}Input"></textarea>
   <div class="auto-row">
    <button class="auto-btn" onclick="fill('${fieldId}')">نص تلقائي</button>
    <button class="auto-btn clear-btn" onclick="clearText('${fieldId}')">مسح النص</button>
   </div>`;
 });
}

// تبديل إظهار/إخفاء الأقسام الاختيارية
function toggleOptionalSection(fieldId) {
  const checkbox = document.getElementById(`${fieldId}Checkbox`);
  const section = document.getElementById(`${fieldId}Section`);
  
  if (checkbox && section) {
    if (!checkbox.checked) {
      section.classList.add('hide-in-pdf');
    } else {
      section.classList.remove('hide-in-pdf');
    }
  }
}

// التحضير للطباعة
function preparePrint() {
  // تحديث حالة الأقسام الاختيارية قبل الطباعة
  toggleOptionalSection('challenges');
  toggleOptionalSection('strengths');
  
  // تحميل التاريخ الهجري
  loadHijri();
  
  // الانتظار قليلاً ثم الطباعة
  setTimeout(() => {
    window.print();
  }, 100);
}

function syncReport(){
 reportTitle.textContent=reportSelect.value;
}
function fill(k){
 const report = reportSelect.value;
 if (data[report] && data[report][k]) {
  const t = data[report][k][0];
  document.getElementById(k+'Input').value = t;
  sync(k,t);
 }
}
function clearText(k){
 document.getElementById(k+'Input').value='';
 sync(k,'');
}
function sync(id,v){
 const el=document.getElementById(id);
 if(el) el.textContent=v;
}
function loadImages(input){
 imagesBox.innerHTML='';
 [...input.files].slice(0,2).forEach(f=>{
  const r=new FileReader();
  r.onload=e=>{
   const img=document.createElement('img');
   img.src=e.target.result;
   imagesBox.appendChild(img);
  };
  r.readAsDataURL(f);
 });
}
async function loadHijri(){
 const d=new Date();
 const day=String(d.getDate()).padStart(2,'0');
 const month=String(d.getMonth()+1).padStart(2,'0');
 const year=d.getFullYear();
 try{
  const res=await fetch(`https://api.aladhan.com/v1/gToH/${day}-${month}-${year}`);
  const j=await res.json();
  hijriDate.textContent=`${j.data.hijri.day} ${j.data.hijri.month.ar} ${j.data.hijri.year} هـ`;
 }catch{
  hijriDate.textContent='التاريخ الهجري غير متوفر';
 }
}

// حفظ البيانات في localStorage
function saveData() {
  const dataToSave = {
    teacher: document.getElementById('teacherInput')?.value || '',
    principal: document.getElementById('principalInput')?.value || '',
    edu: document.getElementById('eduSelect')?.value || ''
  };
  localStorage.setItem('reportToolData', JSON.stringify(dataToSave));
}

// تحميل البيانات من localStorage
function loadData() {
  const savedData = localStorage.getItem('reportToolData');
  if (savedData) {
    try {
      const data = JSON.parse(savedData);
      
      if (data.teacher) {
        document.getElementById('teacherInput').value = data.teacher;
        sync('teacher', data.teacher);
      }
      
      if (data.principal) {
        document.getElementById('principalInput').value = data.principal;
        sync('principal', data.principal);
      }
      
      if (data.edu) {
        document.getElementById('eduSelect').value = data.edu;
        sync('edu', data.edu);
      }
    } catch (e) {
      console.error('خطأ في تحميل البيانات المحفوظة:', e);
    }
  }
}

document.addEventListener('DOMContentLoaded',()=>{
 fieldsBox=document.getElementById('fields');
 reportSelect=document.getElementById('reportSelect');
 Object.keys(data).forEach(r=>{
  reportSelect.innerHTML+=`<option>${r}</option>`;
 });
 
 renderFields();
 loadData(); // تحميل البيانات المحفوظة
 loadHijri();
 
 // إضافة مستمعي الأحداث لحفظ التغييرات
 document.getElementById('teacherInput')?.addEventListener('input', saveData);
 document.getElementById('principalInput')?.addEventListener('input', saveData);
 document.getElementById('eduSelect')?.addEventListener('change', saveData);
});
</script>

</body>
</html>