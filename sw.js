const CACHE_NAME = 'manager-pro-cache-v1';
const urlsToCache = [
  './Index.html',
  './Manifest.json'
];

// Instala o motor no celular e salva os arquivos iniciais
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Responde rápido usando os arquivos salvos se o celular estiver sem rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Retorna o cache se encontrar
        }
        return fetch(event.request); // Se não, busca na internet
      })
  );
});

// Limpa caches antigos quando houver atualização
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
