// ==========================================
// 1. FIREBASE PUSH
// ==========================================
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDk3HfCEalNjDbvx67HHdMybaAIpNw1IWY",
  authDomain: "pstorechat.firebaseapp.com",
  projectId: "pstorechat",
  storageBucket: "pstorechat.firebasestorage.app",
  messagingSenderId: "274979276949",
  appId: "1:274979276949:web:9d1b9412db8b627d2bb39c"
});

const messaging = firebase.messaging();

// Los envíos de tu Apps Script son "data-only": el título y el texto vienen en payload.data.
// Si llegara un mensaje con bloque "notification" (p. ej. desde la consola de Firebase),
// el navegador ya lo muestra solo; por eso aquí no se duplica.
messaging.onBackgroundMessage((payload) => {
  if (payload.notification) return;
  const d = payload.data || {};
  self.registration.showNotification(d.title || "Pstore", {
    body: d.body || "",
    icon: d.icon || '/assets/pstore.jpg',
    badge: '/assets/pstore.jpg',
    data: { url: d.url || '/' }
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = new URL(event.notification.data?.url || '/', self.location.origin).href;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(urlToOpen);
    })
  );
});

// ==========================================
// 2. CACHÉ OFFLINE
// ==========================================
const CACHE_NAME = 'pstore-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './pstore.css',
  './pstore.js',
  './manifest.json',
  './config.js',
  './firebase-config.js',
  './terminos.html',
  './assets/pstore.jpg'
];

self.addEventListener('install', (e) => {
  // Un archivo que falte ya NO rompe la instalación del service worker
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(ASSETS_TO_CACHE.map((url) => cache.add(url).catch(() => console.warn('No se cacheó:', url))))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => key !== CACHE_NAME ? caches.delete(key) : null)))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = e.request.url;
  if (url.includes('firestore') || url.includes('googleapis') || url.includes('script.google.com') || url.includes('docs.google.com')) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
