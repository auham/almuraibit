// App.js - Main Application Logic

// Request notification permission
async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
}

// Subscribe to push notifications
async function subscribeToPush() {
    try {
        const registration = await navigator.serviceWorker.ready;

        // Check if already subscribed
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            // Subscribe to push
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    'YOUR_VAPID_PUBLIC_KEY' // Replace with your VAPID public key
                )
            });
        }

        console.log('Push subscription:', subscription);
        return subscription;
    } catch (error) {
        console.error('Error subscribing to push:', error);
        return null;
    }
}

// Convert VAPID key
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

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

// Initialize notification permission on first visit
document.addEventListener('DOMContentLoaded', async () => {
    // Only ask for notifications after user interaction
    document.body.addEventListener('click', async () => {
        if (localStorage.getItem('notificationAsked')) return;

        const hasPermission = await requestNotificationPermission();
        if (hasPermission) {
            await subscribeToPush();
        }
        localStorage.setItem('notificationAsked', 'true');
    }, { once: true });
});
