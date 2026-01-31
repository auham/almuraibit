const CACHE_NAME = 'almurabait-v19';
const urlsToCache = [
  './',
  './index.html',
  './admin.html',
  './news.html',
  './invitation.html',
  './css/style.css',
  './js/app.js',
  './js/supabase.js',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('Cache failed:', err);
      })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        });
      })
      .catch(() => {
        // Return offline fallback if available
        return caches.match('./index.html');
      })
  );
});

// Push notification event
self.addEventListener('push', event => {
  let notificationData = {
    title: 'دعوات المريبيط',
    body: 'إشعار جديد',
    url: './'
  };

  // Try to parse the push data
  if (event.data) {
    try {
      const data = event.data.json();
      // OneSignal sends data in specific format
      if (data.title) {
        notificationData.title = data.title;
      }
      if (data.alert) {
        notificationData.body = data.alert;
      } else if (data.body) {
        notificationData.body = data.body;
      } else if (data.message) {
        notificationData.body = data.message;
      }
      if (data.custom && data.custom.u) {
        notificationData.url = data.custom.u;
      } else if (data.url) {
        notificationData.url = data.url;
      }
    } catch (e) {
      // If not JSON, use as plain text
      notificationData.body = event.data.text();
    }
  }

  const options = {
    body: notificationData.body,
    icon: './icons/icon-192.png',
    badge: './icons/icon-72.png',
    vibrate: [100, 50, 100],
    dir: 'rtl',
    lang: 'ar',
    tag: 'almurabait-notification',
    renotify: true,
    data: {
      url: notificationData.url,
      dateOfArrival: Date.now()
    },
    actions: [
      { action: 'open', title: 'فتح' },
      { action: 'close', title: 'إغلاق' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('./')
    );
  }
});


