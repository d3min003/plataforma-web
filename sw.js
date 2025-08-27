const CACHE_NAME = 'crm-inmo-v2';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/assets/css/styles.css',
  '/assets/js/app.js',
  '/assets/js/core/router.js',
  '/assets/js/core/storage.js',
  '/assets/js/core/api.js',
  '/assets/js/features/index.js',
  '/assets/js/features/auth.js',
  '/assets/js/features/dashboard.js',
  '/assets/js/features/clientes.js',
  '/assets/js/features/propiedades.js',
  '/assets/js/features/asesores.js',
  '/assets/icons/icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Network-first for same-origin .json/.api calls, cache-first for app shell
  const url = new URL(request.url);
  if (url.origin === location.origin && /\.(json)$/i.test(url.pathname)) {
    event.respondWith(
      fetch(request).then(resp => {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(request, clone));
        return resp;
      }).catch(() => caches.match(request))
    );
    return;
  }
  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(resp => {
      // Cache new navigations/assets on the fly
      const clone = resp.clone();
      caches.open(CACHE_NAME).then(c => c.put(request, clone));
      return resp;
    }).catch(() => caches.match('/index.html')))
  );
});
