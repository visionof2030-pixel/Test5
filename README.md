<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>أداة إعداد التقارير التعليمية - نسخة تجريبية</title>
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
        .tool h2{
            text-align:center;
            color:#0a3b40;
            margin-bottom: 25px;
        }
        label{
            font-weight:700;
            margin-top:15px;
            display:block;
            color:#0a3b40;
        }
        input,textarea,select{
            width:100%;
            padding:10px;
            margin-top:8px;
            border-radius:8px;
            border:1px solid #ccc;
            font-size:14px;
            box-sizing: border-box;
        }
        textarea{
            resize:vertical;
            min-height:80px;
        }
        .small-grid{
            display:grid;
            grid-template-columns:repeat(3,1fr);
            gap:10px;
            margin:15px 0;
        }
        .auto-row{
            display:flex;
            gap:8px;
            margin-top:8px;
        }
        .auto-btn{
            flex:1;
            background:#e0f2f1;
            border:1px solid #0a3b40;
            color:#0a3b40;
            font-size:13px;
            padding:8px;
            border-radius:6px;
            cursor:pointer;
            font-weight: bold;
            transition: all 0.3s;
        }
        .auto-btn:hover{
            background:#0a3b40;
            color:white;
        }
        .clear-btn{
            background:#fdecea;
            border:1px solid #c62828;
            color:#c62828;
        }
        .clear-btn:hover{
            background:#c62828;
            color:white;
        }
        .checkbox-row {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-top: 15px;
            padding: 12px;
            background: #f5f5f5;
            border-radius: 8px;
            border-right: 4px solid #0a3b40;
        }
        .checkbox-row input[type="checkbox"] {
            width: auto;
            margin: 0;
        }
        .checkbox-row label {
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        button{
            margin-top:20px;
            padding:14px;
            width:100%;
            background:#0a3b40;
            color:white;
            border:none;
            border-radius:10px;
            font-size:16px;
            cursor:pointer;
            font-weight: bold;
            transition: all 0.3s;
        }
        button:hover{
            background:#0c4a52;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        /* ===== التقرير ===== */
        .report{
            display:none;
            max-width: 900px;
            margin: auto;
            background: white;
            padding: 20px;
        }
        
        @media print{
            body{
                background:white;
                padding:0;
                margin:0;
                font-size: 12pt;
            }
            .tool{
                display:none;
            }
            .report{
                display:block !important;
                width: 100%;
                max-width: 100%;
                padding: 0;
                margin: 0;
            }
            
            /* إعدادات الصفحة */
            @page {
                size: A4;
                margin: 1.5cm;
            }
            
            .header{
                background:#0a3b40;
                color:white;
                text-align:center;
                padding:15px;
                margin-bottom:20px;
                border-radius: 8px;
            }
            .header div{
                font-size: 14pt;
                font-weight: bold;
                margin: 5px 0;
            }
            .header .hijri{
                font-size:11pt;
                margin-top:8px;
                opacity: 0.9;
            }

            .top-info{
                display:grid;
                grid-template-columns:repeat(3,1fr);
                gap:15px;
                margin-bottom:25px;
            }
            .box{
                border:2px solid #0a3b40;
                padding:12px;
                text-align:center;
                border-radius: 8px;
                background: #f8f9fa;
            }
            .box strong{
                display: block;
                margin-bottom: 8px;
                color: #0a3b40;
                font-size: 13pt;
            }

            /* الهدف التربوي */
            .goal-section{
                background:linear-gradient(135deg,#e8f5e9,#f4fbf6);
                border-right:5px solid #2e7d32;
                border-radius:10px;
                padding:15px;
                margin-bottom:25px;
                text-align:center;
                line-height:1.8;
            }
            .goal-section strong{
                color:#1b5e20;
                margin-bottom:10px;
                display:block;
                font-size: 14pt;
            }

            .section{
                border:2px solid #0a3b40;
                padding:15px;
                border-radius: 8px;
                background: #f8f9fa;
                margin-bottom: 15px;
                page-break-inside: avoid;
                break-inside: avoid;
            }
            .section strong{
                display:block;
                border-bottom:2px solid #0a3b40;
                margin-bottom:12px;
                padding-bottom: 8px;
                color: #0a3b40;
                font-size: 13pt;
            }
            .grid2{
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:20px;
                margin-bottom:25px;
                page-break-inside: avoid;
                break-inside: avoid;
            }
            
            /* إخفاء الحقول الاختيارية عند عدم التحديد */
            .optional.hidden {
                display: none !important;
            }
            
            .images{
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:20px;
                margin-top:25px;
                page-break-inside: avoid;
                break-inside: avoid;
            }
            .images img{
                width:100%;
                max-height:180px;
                object-fit:cover;
                border:2px solid #0a3b40;
                border-radius: 8px;
            }
            
            .signatures{
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:60px;
                margin-top:40px;
                margin-bottom: 20px;
                page-break-inside: avoid;
                break-inside: avoid;
            }
            .signatures div{
                text-align:center;
                padding: 15px;
                border-top: 2px dashed #0a3b40;
            }
            .signature-line{
                border-bottom:2px dashed #000;
                height:25px;
                margin-top:15px;
                width: 250px;
                display: inline-block;
            }
            
            /* إزالة عبارات التوقيع */
            .signatures .signature-label {
                display: none !important;
            }
            
            /* منع انقسام المحتوى داخل العناصر */
            .goal-section, .section, .grid2, .images, .signatures {
                page-break-inside: avoid;
                break-inside: avoid;
                -webkit-column-break-inside: avoid;
            }
        }
    </style>
</head>

<body>

<div class="tool">
    <h2>أداة إعداد التقارير التعليمية - نسخة تجريبية</h2>

    <label>إدارة التعليم</label>
    <select id="eduSelect" oninput="sync('edu',this.value)">
        <option value="الإدارة العامة للتعليم بمنطقة مكة المكرمة" selected>الإدارة العامة للتعليم بمنطقة مكة المكرمة</option>
    </select>

    <label>اسم المدرسة</label>
    <input id="schoolInput" oninput="sync('school',this.value)" value="المدرسة النموذجية الابتدائية بمكة المكرمة">

    <div class="small-grid">
        <select id="reportSelect" onchange="syncReport()">
            <option value="تقرير نشاط إثرائي" selected>تقرير نشاط إثرائي</option>
        </select>
        <input id="targetInput" placeholder="المستهدفون" oninput="sync('target',this.value)" value="طلاب الصف الخامس الابتدائي">
        <input id="countInput" placeholder="العدد" oninput="sync('count',this.value)" value="35 طالب">
    </div>

    <div id="fields"></div>

    <!-- خيارات إظهار/إخفاء التحديات ونقاط القوة -->
    <div class="checkbox-row">
        <label><input type="checkbox" id="showChallenges" checked onchange="toggleOptional('challenges')"> إظهار التحديات</label>
        <label><input type="checkbox" id="showStrengths" checked onchange="toggleOptional('strengths')"> إظهار نقاط القوة</label>
    </div>

    <label>إرفاق الصور (حد أقصى صورتين)</label>
    <input type="file" multiple accept="image/*" onchange="loadImages(this)">

    <label>اسم المعلم</label>
    <input id="teacherInput" oninput="sync('teacher',this.value)" value="أحمد بن محمد السلمي">

    <label>اسم مدير المدرسة</label>
    <input id="principalInput" oninput="sync('principal',this.value)" value="محمد بن عبدالله العتيبي">

    <button onclick="generatePDF()">تصدير PDF / طباعة التقرير</button>
</div>

<div class="report">
    <div class="header">
        <div id="edu">الإدارة العامة للتعليم بمنطقة مكة المكرمة</div>
        <div id="school">المدرسة النموذجية الابتدائية بمكة المكرمة</div>
        <div id="hijriDate" class="hijri"></div>
    </div>

    <div class="top-info">
        <div class="box"><strong>التقرير</strong><div id="reportTitle">تقرير نشاط إثرائي</div></div>
        <div class="box"><strong>المستهدفون</strong><div id="target">طلاب الصف الخامس الابتدائي</div></div>
        <div class="box"><strong>العدد</strong><div id="count">35 طالب</div></div>
    </div>

    <div class="goal-section">
        <strong>الهدف التربوي</strong>
        <div id="goal">تنمية المهارات المعرفية والإبداعية للطلاب وتوسيع مداركهم خارج المنهج الدراسي.</div>
    </div>

    <div class="grid2">
        <div class="section"><strong>وصف مختصر</strong><div id="desc1">نشاط تعليمي تكميلي يهدف إلى إثراء المعرفة وتنمية المواهب لدى الطلاب.</div></div>
        <div class="section"><strong>إجراءات التنفيذ</strong><div id="desc2">تحضير المواد التعليمية، تقسيم الطلاب إلى مجموعات، تنفيذ الأنشطة العملية.</div></div>
    </div>

    <div class="grid2">
        <div class="section"><strong>النتائج</strong><div id="desc3">زيادة حماس الطلاب للتعلم وتحسن مهارات التفكير الناقد والإبداعي.</div></div>
        <div class="section"><strong>التوصيات</strong><div id="desc4">تكرار النشاط مع توسيع نطاقه ليشمل مجالات أخرى وتضمين المزيد من الطلاب.</div></div>
    </div>

    <div class="grid2">
        <div class="section optional" id="challengesSection"><strong>التحديات</strong><div id="challenges">نقص الموارد والوقت الكافي لتنفيذ جميع الأنشطة المقترحة.</div></div>
        <div class="section optional" id="strengthsSection"><strong>نقاط القوة</strong><div id="strengths">تفاعل الطلاب الإيجابي وتنوع الأنشطة المنفذة.</div></div>
    </div>

    <div class="images" id="imagesBox">
        <!-- ستظهر الصور هنا عند رفعها -->
    </div>

    <div class="signatures">
        <div>
            <div id="teacher">أحمد بن محمد السلمي</div>
            <div class="signature-line"></div>
            <div class="signature-label">توقيع المعلم</div>
        </div>
        <div>
            <div id="principal">محمد بن عبدالله العتيبي</div>
            <div class="signature-line"></div>
            <div class="signature-label">توقيع مدير المدرسة</div>
        </div>
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

    // بيانات تقرير النشاط الإثرائي
    const reportData = {
        "تقرير نشاط إثرائي": {
            goal: "تنمية المهارات المعرفية والإبداعية للطلاب وتوسيع مداركهم خارج المنهج الدراسي.",
            desc1: "نشاط تعليمي تكميلي يهدف إلى إثراء المعرفة وتنمية المواهب لدى الطلاب. تم تنفيذ نشاط 'رحلة في عالم العلوم' الذي اشتمل على تجارب عملية وتطبيقات تفاعلية في مجالات الفيزياء والكيمياء والأحياء.",
            desc2: "1. تحضير المواد التعليمية والأدوات اللازمة.\n2. تقسيم الطلاب إلى 5 مجموعات عمل.\n3. تقديم شرح نظري موجز عن كل تجربة.\n4. تنفيذ الأنشطة العملية بتوجيه من المعلم.\n5. مناقشة النتائج والتطبيقات العملية.",
            desc3: "1. زيادة ملحوظة في حماس الطلاب للتعلم.\n2. تحسن مهارات التفكير الناقد والإبداعي.\n3. تنمية مهارات العمل الجماعي.\n4. تعزيز المفاهيم العلمية بشكل عملي.\n5. ارتفاع نسبة المشاركة الفعالة إلى 95%.",
            desc4: "1. تكرار النشاط كل فصل دراسي.\n2. توسيع نطاقه ليشمل مجالات أخرى كالرياضيات واللغة العربية.\n3. تضمين المزيد من الطلاب من الصفوف الأخرى.\n4. إشراك أولياء الأمور في بعض الأنشطة.\n5. توفير ميزانية خاصة للأنشطة الإثرائية.",
            challenges: "1. نقص بعض الموارد والأدوات المختبرية.\n2. ضيق الوقت المخصص للنشاط.\n3. صعوبة توفير جميع متطلبات الأنشطة المقترحة.\n4. اختلاف مستويات الطلاب في الفهم والتطبيق.",
            strengths: "1. تفاعل الطلاب الإيجابي والملحوظ.\n2. تنوع الأنشطة المنفذة وجاذبيتها.\n3. الدعم الكامل من إدارة المدرسة.\n4. توفر القاعة المجهزة للأنشطة.\n5. حماس المعلمين المشاركين في التنفيذ."
        }
    };

    // تخزين البيانات في localStorage
    function saveToStorage() {
        const dataToSave = {
            edu: document.getElementById('eduSelect').value,
            school: document.getElementById('schoolInput').value,
            teacher: document.getElementById('teacherInput').value,
            principal: document.getElementById('principalInput').value,
            report: document.getElementById('reportSelect').value,
            target: document.getElementById('targetInput').value,
            count: document.getElementById('countInput').value,
            showChallenges: document.getElementById('showChallenges').checked,
            showStrengths: document.getElementById('showStrengths').checked
        };
        
        // حفظ النصوص في الحقول
        fields.forEach(field => {
            const input = document.getElementById(field[0] + 'Input');
            if (input) {
                dataToSave[field[0]] = input.value;
            }
        });
        
        localStorage.setItem('reportToolData', JSON.stringify(dataToSave));
    }

    // تحميل البيانات من localStorage
    function loadFromStorage() {
        const savedData = localStorage.getItem('reportToolData');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // تحميل البيانات الأساسية
            if (data.edu) document.getElementById('eduSelect').value = data.edu;
            if (data.school) document.getElementById('schoolInput').value = data.school;
            if (data.teacher) document.getElementById('teacherInput').value = data.teacher;
            if (data.principal) document.getElementById('principalInput').value = data.principal;
            if (data.report) document.getElementById('reportSelect').value = data.report;
            if (data.target) document.getElementById('targetInput').value = data.target;
            if (data.count) document.getElementById('countInput').value = data.count;
            if (data.showChallenges !== undefined) document.getElementById('showChallenges').checked = data.showChallenges;
            if (data.showStrengths !== undefined) document.getElementById('showStrengths').checked = data.showStrengths;
            
            // تحميل النصوص في الحقول
            fields.forEach(field => {
                if (data[field[0]]) {
                    const input = document.getElementById(field[0] + 'Input');
                    if (input) {
                        input.value = data[field[0]];
                        sync(field[0], data[field[0]]);
                    }
                }
            });
            
            // مزامنة البيانات المحملة مع التقرير
            if (data.edu) sync('edu', data.edu);
            if (data.school) sync('school', data.school);
            if (data.teacher) sync('teacher', data.teacher);
            if (data.principal) sync('principal', data.principal);
            if (data.target) sync('target', data.target);
            if (data.count) sync('count', data.count);
            
            // تحديث عنوان التقرير
            syncReport();
            
            // تطبيق إظهار/إخفاء الحقول الاختيارية
            toggleOptional('challenges');
            toggleOptional('strengths');
        }
    }

    function renderFields(){
        const fieldsBox = document.getElementById('fields');
        fieldsBox.innerHTML = '';
        fields.forEach(f=>{
            fieldsBox.innerHTML += `
                <label>${f[1]}</label>
                <textarea id="${f[0]}Input" oninput="sync('${f[0]}',this.value); saveToStorage()"></textarea>
                <div class="auto-row">
                    <button class="auto-btn" onclick="fill('${f[0]}')">نص تلقائي</button>
                    <button class="auto-btn clear-btn" onclick="clearText('${f[0]}')">مسح النص</button>
                </div>`;
        });
    }

    function syncReport(){
        const reportTitle = document.getElementById('reportTitle');
        const selectedReport = document.getElementById('reportSelect').value;
        if (reportTitle) {
            reportTitle.textContent = selectedReport;
        }
    }

    function fill(k){
        const report = document.getElementById('reportSelect').value;
        if (reportData[report] && reportData[report][k]) {
            const t = reportData[report][k];
            const inputElement = document.getElementById(k+'Input');
            if (inputElement) {
                inputElement.value = t;
                sync(k,t);
                saveToStorage();
            }
        }
    }

    function clearText(k){
        const inputElement = document.getElementById(k+'Input');
        if (inputElement) {
            inputElement.value='';
            sync(k,'');
            saveToStorage();
        }
    }

    function sync(id,v){
        const el = document.getElementById(id);
        if(el) el.textContent = v;
    }

    // تبديل إظهار/إخفاء الحقول الاختيارية
    function toggleOptional(field) {
        const checkbox = document.getElementById('show' + field.charAt(0).toUpperCase() + field.slice(1));
        const section = document.getElementById(field + 'Section');
        
        if (checkbox && section) {
            if (!checkbox.checked) {
                section.classList.add('hidden');
            } else {
                section.classList.remove('hidden');
            }
        }
        saveToStorage();
    }

    function loadImages(input){
        const imagesBox = document.getElementById('imagesBox');
        if (imagesBox) {
            imagesBox.innerHTML='';
            [...input.files].slice(0,2).forEach(f=>{
                const r = new FileReader();
                r.onload = e => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = "صورة النشاط";
                    imagesBox.appendChild(img);
                };
                r.readAsDataURL(f);
            });
        }
    }

    async function loadHijri(){
        const d = new Date();
        const day = String(d.getDate()).padStart(2,'0');
        const month = String(d.getMonth()+1).padStart(2,'0');
        const year = d.getFullYear();
        try{
            const res = await fetch(`https://api.aladhan.com/v1/gToH/${day}-${month}-${year}`);
            const j = await res.json();
            const hijriDate = document.getElementById('hijriDate');
            if (hijriDate && j.data && j.data.hijri) {
                hijriDate.textContent = `${j.data.hijri.day} ${j.data.hijri.month.ar} ${j.data.hijri.year} هـ`;
            }
        }catch{
            const hijriDate = document.getElementById('hijriDate');
            if (hijriDate) {
                // تاريخ افتراضي في حالة فشل الاتصال
                hijriDate.textContent = '10 رجب 1445 هـ';
            }
        }
    }

    function generatePDF() {
        // تحديث حالة الحقول الاختيارية قبل الطباعة
        toggleOptional('challenges');
        toggleOptional('strengths');
        
        // حفظ البيانات قبل الطباعة
        saveToStorage();
        
        // تحميل التاريخ الهجري
        loadHijri();
        
        // الانتظار لضمان تحديث كل شيء قبل الطباعة
        setTimeout(() => {
            window.print();
        }, 300);
    }

    // تهيئة التطبيق عند تحميل الصفحة
    document.addEventListener('DOMContentLoaded', () => {
        // تعبئة الحقول
        renderFields();
        
        // تعبئة البيانات التلقائية في جميع الحقول
        setTimeout(() => {
            fields.forEach(field => {
                fill(field[0]);
            });
        }, 100);
        
        // تحميل البيانات المحفوظة
        loadFromStorage();
        
        // تحميل التاريخ الهجري
        loadHijri();
        
        // إضافة أحداث لحفظ البيانات عند التغيير
        document.getElementById('targetInput').addEventListener('input', saveToStorage);
        document.getElementById('countInput').addEventListener('input', saveToStorage);
        document.getElementById('eduSelect').addEventListener('change', function() {
            sync('edu', this.value);
            saveToStorage();
        });
        document.getElementById('schoolInput').addEventListener('input', saveToStorage);
        document.getElementById('teacherInput').addEventListener('input', saveToStorage);
        document.getElementById('principalInput').addEventListener('input', saveToStorage);
    });

    // حفظ البيانات عند مغادرة الصفحة
    window.addEventListener('beforeunload', saveToStorage);
</script>

</body>
</html>