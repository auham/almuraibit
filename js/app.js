// App.js - Main Application Logic

// Format date in Arabic
function formatArabicDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format time
function formatTime(timeString) {
    if (!timeString) return '';

    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'مساءً' : 'صباحاً';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);

    return `${displayHour}:${minutes} ${period}`;
}

// Show toast notification
function showToast(message, type = '') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = 'toast show ' + type;
    setTimeout(() => toast.className = 'toast', 3000);
}

// Check if running as PWA
function isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;
}

console.log('App.js loaded successfully');
