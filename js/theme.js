// ============================================================
//  إدارة الثيم (الوضع المظلم/الفاتح)
// ============================================================

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme === 'light' ? 'light' : '');
    setTheme(newTheme);
    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
        btn.textContent = newTheme === 'light' ? '☀️ الوضع الفاتح' : '🌙 الوضع المظلم';
    }
}

function initTheme() {
    const savedTheme = getTheme();
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        const btn = document.getElementById('themeToggleBtn');
        if (btn) btn.textContent = '☀️ الوضع الفاتح';
    }
}

// تطبيق الثيم عند التحميل
document.addEventListener('DOMContentLoaded', initTheme);