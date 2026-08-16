const CACHE_NAME = 'shopee-affiliates-v5';

// Recursos básicos que queremos salvar no cache do celular/navegador do usuário
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://img.icons8.com/color/512/shopee.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache aberto com sucesso no SW');
      // Usamos catch para não falhar a instalação caso algum link externo caia
      return cache.addAll(ASSETS_TO_CACHE).catch(err => console.warn('Aviso: Algum recurso não pôde ser cacheado na instalação', err));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Ignora requisições de outras origens ou de APIs que não queremos cachear agressivamente (como o Firebase)
  if (event.request.url.includes('firestore.googleapis.com') || event.request.url.includes('generativelanguage.googleapis.com')) {
      return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Se encontrou no cache, retorna. Senão, faz a requisição na rede.
      return cachedResponse || fetch(event.request).then(response => {
        // Opcional: Você pode clonar e adicionar novas requisições ao cache aqui se quiser um offline mais robusto
        return response;
      }).catch(() => {
          // Fallback genérico caso a rede caia e não tenha no cache
          console.warn('Você está offline e o recurso não está no cache:', event.request.url);
      });
    })
  );
});
