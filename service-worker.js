const APP_VERSION = 'v21.0.0';
const BASE = new URL('./', self.location.href);
const CACHE_PREFIX = `a6000-field-${BASE.pathname}-`;
const CACHE_NAME = CACHE_PREFIX + APP_VERSION;
const APP_FILES = ['./','index.html','app.css','field-tools.css','legacy-app.js','field-cases.js','field-tools.js','pwa.js','release.js','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_FILES.map(file => new Request(new URL(file, BASE), {cache:'reload'})));
    const legacy = (await caches.keys()).some(name => /^a6000-os-v(?:18|19|20)\./.test(name));
    if (legacy) await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if ((name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME) || /^a6000-os-v(?:18|19|20)\./.test(name)) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') event.waitUntil(self.skipWaiting());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || !['http:','https:'].includes(url.protocol) || url.origin !== BASE.origin || !url.pathname.startsWith(BASE.pathname)) return;
  if (url.pathname === new URL('version.json', BASE).pathname) {
    event.respondWith(fetch(request, {cache:'no-store'}));
    return;
  }
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const isAppNavigation = request.mode === 'navigate' && (url.pathname === BASE.pathname || url.pathname === new URL('index.html',BASE).pathname);
    const cached = await cache.match(isAppNavigation ? new URL('index.html',BASE).href : request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok && response.type === 'basic' && !url.search && APP_FILES.some(file => new URL(file, BASE).href === url.href)) {
      try { await cache.put(request, response.clone()); } catch (error) { console.warn('[A6000] Offline cache write failed:', error); }
    }
    return response;
  })());
});
