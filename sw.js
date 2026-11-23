// نسخهٔ ذخیره‌سازی را با هر انتشار مهم افزایش دهید
const CACHE = 'coldchain-v14';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', 'index.html', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png'])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// ابتدا شبکه (برای دریافت آخرین نسخه)، در صورت نبودن اینترنت نسخهٔ ذخیره‌شده
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return; // درخواست‌های Google Apps Script دخالت داده نمی‌شود
  e.respondWith(
    fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); return res; })
      .catch(() => caches.match(r).then(m => m || caches.match('index.html')))
  );
});
