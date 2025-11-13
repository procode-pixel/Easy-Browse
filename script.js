// **ملف script.js** - (تأكد من أنه موجود في نفس مجلد index.html)

document.getElementById('searchButton').addEventListener('click', function() {
    executeSearch();
});

document.getElementById('urlInput').addEventListener('keypress', function(e) {
    // تفعيل البحث عند الضغط على زر Enter (رمز 13)
    if (e.key === 'Enter') {
        executeSearch();
    }
});

function executeSearch() {
    const input = document.getElementById('urlInput').value.trim();
    
    if (input === "") {
        return; // لا تفعل شيئاً إذا كان الحقل فارغاً
    }

    let url;
    
    // فحص إذا كان المستخدم قد كتب عنوان URL كاملاً أو جزئياً
    if (input.startsWith('http://') || input.startsWith('https://')) {
        url = input;
    } 
    else if (input.includes('.')) {
        url = 'https://' + input; // إضافة https:// فقط
    } 
    else {
        // إذا كان نصاً عادياً، نبحث عنه في جوجل
        url = 'https://www.google.com/search?q=' + encodeURIComponent(input);
    }

    // فتح الرابط في علامة تبويب جديدة
    window.open(url, '_blank');
}
// **إضافة وظيفة الساعة والتاريخ**
function updateClock() {
    const now = new Date();
    
    // خيارات تنسيق الوقت
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
    };
    
    // خيارات تنسيق التاريخ
    const dateOptions = { 
        weekday: 'long', // اليوم (الاثنين، الثلاثاء...)
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };

    const time = now.toLocaleTimeString('ar-EG', timeOptions);
    const date = now.toLocaleDateString('ar-EG', dateOptions);
    
    const clockElement = document.getElementById('liveClock');
    // دمج الوقت والتاريخ وعرضهما
    clockElement.textContent = `${time} | ${date}`;
}

// تشغيل الدالة فوراً لتجنب التأخير
updateClock(); 

// تحديث الدالة كل 1000 ميلي ثانية (كل ثانية)
setInterval(updateClock, 1000);
// **إضافة وظيفة تبديل الوضع (Dark/Light Mode)**

const toggleButton = document.getElementById('modeToggle');
const body = document.body;

function switchMode() {
    // تبديل الكلاس "light-mode" في وسم body
    body.classList.toggle('light-mode');
    
    // تحديث الأيقونة حسب الوضع الحالي
    if (body.classList.contains('light-mode')) {
        // إذا كان الوضع فاتحاً، نعرض أيقونة الهلال (للتذكير بالوضع الداكن)
        toggleButton.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('mode', 'light');
    } else {
        // إذا كان الوضع داكناً، نعرض أيقونة الشمس (للتذكير بالوضع الفاتح)
        toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('mode', 'dark');
    }
}

// ربط الدالة بحدث النقر على الزر
toggleButton.addEventListener('click', switchMode);

// *ميزة إضافية: حفظ تفضيلات المستخدم عند إعادة تحميل الصفحة*
// عند تحميل الصفحة، نتحقق من التفضيل المحفوظ
document.addEventListener('DOMContentLoaded', (event) => {
    const savedMode = localStorage.getItem('mode');
    
    // إذا كان الوضع المحفوظ هو فاتح، نقوم بتبديل الوضع تلقائياً
    if (savedMode === 'light') {
        // نستخدم switchMode لإجراء التبديل وتحديث الأيقونة
        switchMode(); 
    } 
    // إذا كان الوضع المحفوظ هو داكن، نتأكد من وضع أيقونة الشمس
    else if (savedMode === 'dark') {
         toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
    }
});