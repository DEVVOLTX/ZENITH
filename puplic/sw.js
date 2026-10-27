// BASE = مسار الموقع (مثلاً https://user.github.io/repo/) بيتاخد تلقائياً من مكان تسجيل الـ SW
const C = 'zenith-v2';
const BASE = self.registration.scope;
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(C).then((c) => c.addAll([BASE, BASE + 'manifest.json', BASE + 'icon-192.png'])));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== C).map((x) => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(fetch(r).then((res) => { const copy = res.clone(); caches.open(C).then((c) => c.put(r, copy)); return res; })
    .catch(() => caches.match(r).then((m) => m || caches.match(BASE))));
});
