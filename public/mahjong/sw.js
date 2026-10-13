// Service worker for the installed app: everything is cached at install, then served from the cache.
// A new version waits for the page to ask (src/pwa.js), or for every window of the old one to close.
const CACHE = 'mahjong-80f0849a6aaf';
const FILES = ["index.html", "manifest.webmanifest", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(names.filter(n => n !== CACHE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data === 'activate') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request, { ignoreSearch: true }).then(hit => hit || fetch(event.request)));
});
