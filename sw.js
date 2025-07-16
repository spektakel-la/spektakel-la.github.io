const SW_VERSION = '1.5.0';

importScripts('/assets/3rd-party/workbox-v7.3.0/workbox-sw.js');
workbox.setConfig({
    debug: false,
    modulePathPrefix: '/assets/3rd-party/workbox-v7.3.0/',
});

self.addEventListener('message', (event) => {
  if (event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage(SW_VERSION);
  }

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

const { precacheAndRoute } = workbox.precaching;
const { registerRoute } = workbox.routing;
const { CacheFirst } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;

precacheAndRoute(self.__WB_MANIFEST || []);

// Cache tiles for the map
registerRoute(
  ({url}) => url.pathname.startsWith('/assets/img/map/tiles/'),
  new CacheFirst({
    cacheName: 'map-tiles-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200, 404],
      }),
      new ExpirationPlugin({
        maxEntries: 300, // maximale Anzahl von gecachten Einträgen
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Tage
      }),
    ],
  })
);

// Delete old caches on activation of a new serviceWorker
self.addEventListener('activate', (event) => {
  const currentCaches = ['map-tiles-cache'];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return cacheNames.filter((cacheName) => currentCaches.includes(cacheName));
    }).then((cachesToDelete) => {
      return Promise.all(cachesToDelete.map((cacheToDelete) => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});
