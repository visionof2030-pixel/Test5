<!DOCTYPE html>
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
</style>
</head>

<body>

<div class="tool">
<h2>أداة إعداد التقارير التعليمية</h2>

<label>إدارة التعليم</label>
<input oninput="sync('edu',this.value)">

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
<div class="section optional"><strong>التحديات</strong><div id="challenges"></div></div>
<div class="section optional"><strong>نقاط القوة</strong><div id="strengths"></div></div>
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

/* ===== جميع التقارير بنصوص تلقائية ===== */
const data = {};
[
"تقرير نشاط إثرائي",
"تقرير خطة علاجية",
"تقرير تنفيذ اختبار تحسن",
"تقرير تصنيف الطلاب",
"تقرير تحليل النتائج",
"تقرير سجل الخطط العلاجية",
"تقرير رعاية الطلاب المتأخرين دراسيا",
"تقرير دراسة حالة",
"تقرير التدريب على الاختبارات المعيارية",
"تقرير توزيع المنهج",
"تقرير توزيع وقت الحصة",
"تقرير درس تم تنفيذه",
"تقرير تنفيذ درس تطبيقي",
"تقرير أنشطة صفية",
"تقرير تعليم تعاوني بين الطلاب",
"تقرير الفصول المقلوبة",
"تقرير توظيف الذكاء الاصطناعي",
"تقرير الوسائل التعليمية المبتكرة",
"تقرير تطوير البيئة الصفية",
"تقرير تفعيل حصص النشاط",
"تقرير حصة النشاط",
"تقرير المجتمعات المهنية",
"تقرير مجتمعات التعلم",
"تقرير كشف المتابعة",
"تقرير سجل الدرجات الإلكتروني",
"تقرير سجل التغذية الراجعة من الطلاب",
"تقرير مقارنة السلاسل الزمنية",
"تقرير الاختبارات الذكية",
"تقرير تعزيز السلوك الإيجابي",
"تقرير تحفيز الطلاب",
"تقرير معرفة الميول والاتجاهات",
"تقرير حل مشكلة تربوية",
"تقرير تكريم المتميزين",
"تقرير الاحتفال باليوم الوطني",
"تقرير المبادرات والابتكار",
"تقرير مبادرة تطوعية",
"تقرير المعلم الصغير",
"تقرير تنفيذ إذاعة مدرسية",
"تقرير المشاركات بين الطلاب",
"تقرير التواصل مع ولي الأمر",
"تقرير إشعار ولي الأمر عن مستوى ابنه",
"تقرير حضور اجتماع أولياء الأمور",
"تقرير سجل التواصل مع أولياء الأمور",
"تقرير تبادل الزيارات",
"تقرير حضور دورات وورش تدريبية",
"تقرير نقل أثر التدريب",
"تقرير الورش التدريبية التي قدمتها",
"تقرير البحث الإجرائي",
"تقرير خطة أسبوعية",
"تقرير تفعيل الخطة الأسبوعية",
"تقرير الإشراف اليومي",
"تقرير إدارة الأزمات",
"تقرير إدارة الاجتماعات",
"تقرير المناوبة والفسحة",
"تقارير الجرد",
"تقرير تفعيل المنصات التعليمية",
"تقرير المحتوى الرقمي المنتج",
"تقرير عضوية لجنة التميز والجودة",
"تقرير عضوية لجنة التدقيق"
].forEach(name=>{
 data[name]={
  goal:["تحقيق أهداف تربوية محددة وفق الخطة المعتمدة واحتياجات المستفيدين."],
  desc1:["تنفيذ النشاط أو الإجراء وفق إطار منظم يخدم العملية التعليمية."],
  desc2:["تطبيق الخطوات المعتمدة ومتابعة التنفيذ ميدانيًا."],
  desc3:["تحقق الأهداف وتحسن مستوى الأداء والتفاعل."],
  desc4:["الاستمرار في التطبيق مع تطوير آليات التنفيذ."],
  challenges:["الحاجة إلى وقت إضافي أو موارد داعمة."],
  strengths:["التعاون، التنظيم، وضوح الأهداف."]
 };
});

function renderFields(){
 fields.forEach(f=>{
  fieldsBox.innerHTML+=`
   <label>${f[1]}</label>
   <textarea id="${f[0]}Input"></textarea>
   <div class="auto-row">
    <button class="auto-btn" onclick="fill('${f[0]}')">نص تلقائي</button>
    <button class="auto-btn clear-btn" onclick="clearText('${f[0]}')">مسح النص</button>
   </div>`;
 });
}

function syncReport(){
 reportTitle.textContent=reportSelect.value;
}
function fill(k){
 const t=data[reportSelect.value][k][0];
 document.getElementById(k+'Input').value=t;
 sync(k,t);
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

document.addEventListener('DOMContentLoaded',()=>{
 fieldsBox=document.getElementById('fields');
 reportSelect=document.getElementById('reportSelect');
 Object.keys(data).forEach(r=>{
  reportSelect.innerHTML+=`<option>${r}</option>`;
 });
 renderFields();
 loadHijri();
});
window.onbeforeprint=loadHijri;
</script>

</body>
</html>
