const CACHE_NAME = 'achadinhos-v3';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

// Instala o motor no navegador do celular
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(assets);
      })
  );
});

// Serve os arquivos do cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
