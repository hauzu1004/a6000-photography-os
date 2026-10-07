const APP_VERSION = 'v19.0.0';
const CACHE_NAME = `a6000-os-${APP_VERSION}`;

// Files to cache
const BASE_PATH = new URL('./', self.location).pathname;
const urlsToCache = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'manifest.json',
  BASE_PATH + 'icon-192.png',
  BASE_PATH + 'icon-512.png'
];

// Install event - cache files
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName.startsWith('a6000-os-') && cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Cache only same-origin HTTP(S) GET requests inside this app's scope.
// Browser extensions and other out-of-scope requests must be left to the browser.
self.addEventListener('fetch', event => {
  const request = event.request;
  const requestUrl = new URL(request.url);
  const scopeUrl = new URL(self.registration.scope);
  const isHttpRequest = requestUrl.protocol === 'http:' || requestUrl.protocol === 'https:';
  const isInScope = requestUrl.origin === self.location.origin &&
    requestUrl.pathname.startsWith(scopeUrl.pathname);

  if (!isHttpRequest || !isInScope || request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request).then(async cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      const response = await fetch(request);
      if (response && response.ok && response.type === 'basic') {
        try {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
        } catch (error) {
          console.warn('[ServiceWorker] Cache write failed:', error);
        }
      }
      return response;
    })
  );
});

// Check for updates every hour
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CHECK_UPDATE') {
    checkForUpdates();
  }
});

async function checkForUpdates() {
  try {
    const response = await fetch(new URL('version.json?' + Date.now(), self.registration.scope));
    const data = await response.json();

    if (data.version !== APP_VERSION) {
      // New version available
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'UPDATE_AVAILABLE',
            version: data.version
          });
        });
      });
    }
  } catch (error) {
    console.error('[ServiceWorker] Update check failed:', error);
  }
}
