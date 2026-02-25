const CACHE_NAME = 'calce-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/icon.avif',
  '/manifest.json',
  '/robots.txt',
];

// Install event - cache initial resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.log('Error caching static assets:', err);
        // Continue even if some files fail to cache
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - cache assets, serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests to third-party services
  if (!url.origin.includes(self.location.origin)) {
    return;
  }

  // For assets (JS, CSS, images, fonts), use cache-first strategy
  if (url.pathname.startsWith('/assets/') || 
      url.pathname.startsWith('/icon') ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.woff') ||
      url.pathname.endsWith('.woff2') ||
      url.pathname.endsWith('.ttf') ||
      url.pathname.endsWith('.avif') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            console.log('Offline - asset not cached:', url.pathname);
            return null;
          });
        });
      })
    );
    return;
  }

  // For HTML and other requests, use network-first strategy
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      })
      .catch(() => {
        console.log('Network request failed, trying cache:', url.pathname);
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return cached index.html as fallback
          if (url.pathname === '/' || !url.pathname.includes('.')) {
            return caches.match('/index.html');
          }
          return null;
        });
      })
  );
});
