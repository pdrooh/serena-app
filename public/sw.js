const CACHE_NAME = 'serena-v1';

// Install event
self.addEventListener('install', (event) => {
  // Skip waiting to activate immediately
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Only cache essential files, ignore failures
        return Promise.allSettled([
          cache.add('/').catch(() => {}),
          cache.add('/manifest.json').catch(() => {}),
          cache.add('/favicon.ico').catch(() => {})
        ]);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Don't cache API requests
  if (url.pathname.startsWith('/api/') || url.hostname !== self.location.hostname) {
    event.respondWith(fetch(request).catch(() => {
      // Return a basic response if fetch fails
      return new Response('Network error', { status: 408 });
    }));
    return;
  }

  // For other requests, try cache first, then network
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then((response) => {
            // Only cache successful GET requests
            if (response.status === 200 && request.method === 'GET') {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache).catch(() => {});
              });
            }
            return response;
          })
          .catch((error) => {
            console.error('Fetch failed:', error);
            // Return a basic offline page or error response
            return new Response('Offline', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
      .catch(() => {
        // Fallback if everything fails
        return new Response('Service unavailable', {
          status: 503,
          headers: { 'Content-Type': 'text/plain' }
        });
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});



