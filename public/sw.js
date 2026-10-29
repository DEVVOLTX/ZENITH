// Zenith service worker: the whole app works offline after the first visit.
// BASE = site root (e.g. https://user.github.io/ZENITH/), taken from where this worker is registered.
const C = 'zenith-v3';
const BASE = self.registration.scope;
const ROUTES = ['', 'tasks/', 'habits/', 'calendar/', 'goals/', 'notes/', 'focus/', 'stats/', 'settings/', '404.html'];
const FILES = ['manifest.json', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png', 'favicon.ico'];

// Collect the scripts, styles and preloads a page references so every route works offline, not only the visited ones.
const assetsOf = (html) => {
  const out = new Set();
  for (const m of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
    try {
      const u = new URL(m[1], BASE);
      if (u.origin === self.location.origin && u.pathname.startsWith(new URL(BASE).pathname) && /\.(js|css|woff2?|png|svg|ico|json)$/.test(u.pathname)) out.add(u.href);
    } catch { /* ignore */ }
  }
  return out;
};

async function precache() {
  const cache = await caches.open(C);
  const assets = new Set(FILES.map((f) => BASE + f));
  await Promise.all(ROUTES.map(async (r) => {
    try {
      const res = await fetch(BASE + r, { cache: 'reload' });
      if (!res.ok) return;
      await cache.put(BASE + r, res.clone());
      assetsOf(await res.text()).forEach((a) => assets.add(a));
    } catch { /* a missing route must not break the install */ }
  }));
  await Promise.all([...assets].map((a) => cache.add(new Request(a, { cache: 'reload' })).catch(() => {})));
}

self.addEventListener('install', (e) => { e.waitUntil(precache()); self.skipWaiting(); });

self.addEventListener('activate', (e) => e.waitUntil(
  caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== C).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
));

const put = (req, res) => { if (res && res.ok && res.status === 200) { const copy = res.clone(); caches.open(C).then((c) => c.put(req, copy)).catch(() => {}); } return res; };

async function pageFallback(req) {
  const url = new URL(req.url);
  return (await caches.match(req, { ignoreSearch: true }))
    || (await caches.match(url.origin + url.pathname.replace(/\/?$/, '/'), { ignoreSearch: true }))
    || (await caches.match(BASE))
    || Response.error();
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  // Hashed build assets never change: cache first.
  if (url.pathname.includes('/_next/static/')) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => put(req, res))));
    return;
  }
  // Pages: network first so updates show up, cached copy when offline.
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((res) => put(req, res)).catch(() => pageFallback(req)));
    return;
  }
  // Everything else (manifest, icons, data files): network first, cache fallback.
  e.respondWith(fetch(req).then((res) => put(req, res)).catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || Response.error())));
});
