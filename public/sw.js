// Версия кеша - обновляйте при каждом деплое
const CACHE_NAME = 'cafe-menu-pwa-v3';
const STATIC_CACHE = 'cafe-menu-static-v3';

// Статические ресурсы, которые редко меняются
const STATIC_URLS = [
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    Promise.all([
      // Кешируем только статические ресурсы
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_URLS);
      }),
      // Сразу активируем новый Service Worker
      self.skipWaiting()
    ])
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    Promise.all([
      // Удаляем старые кеши
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      }),
      // Сразу берем контроль над всеми клиентами
      self.clients.claim()
    ]).then(() => {
      // Уведомляем все открытые вкладки об обновлении
      return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'SW_UPDATED' });
        });
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  
  // Для HTML страниц используем network-first стратегию
  if (event.request.mode === 'navigate' || 
      event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Если получили ответ, кешируем его
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Если сеть недоступна, возвращаем из кеша
          return caches.match('/index.html').then((cachedResponse) => {
            return cachedResponse || new Response('Offline', { status: 503 });
          });
        })
    );
    return;
  }

  // Для JS, CSS и других ресурсов - network-first с коротким TTL
  if (url.pathname.match(/\.(js|css|json)$/)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Кешируем только успешные ответы
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback на кеш только если сеть недоступна
          return caches.match(event.request);
        })
    );
    return;
  }

  // Для статических ресурсов (иконки и т.д.) - cache-first
  if (STATIC_URLS.some((staticUrl) => url.pathname.includes(staticUrl))) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
    return;
  }

  // Для остальных запросов - network-first
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// Обработка сообщений от клиента
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
