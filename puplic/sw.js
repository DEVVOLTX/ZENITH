// BASE = مسار الموقع (مثلاً https://user.github.io/repo/) بيتاخد تلقائياً من مكان تسجيل الـ SW
const C = 'zenith-v2';
const BASE = self.registration.scope;
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(C).then((c) => Promise.all([BASE, BASE + 'manifest.json', BASE + 'icon-192.png'].map((u) => c.add(u).catch(() => {})))));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== C).map((x) => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(fetch(r).then((res) => { if (res.ok && res.status === 200) { const copy = res.clone(); caches.open(C).then((c) => c.put(r, copy)).catch(() => {}); } return res; })
    .catch(() => caches.match(r).then((m) => m || caches.match(BASE))));
});
