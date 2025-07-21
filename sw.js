const SW_VERSION = '1.7.0';
const CACHE_MAP_TILES = 'map-tiles-cache';
const CACHE_IMAGES = 'images-cache';

importScripts('/assets/3rd-party/workbox-v7.3.0/workbox-sw.js');
workbox.setConfig({
    debug: false,
    modulePathPrefix: '/assets/3rd-party/workbox-v7.3.0/',
});

const { precacheAndRoute } = workbox.precaching;
const { registerRoute } = workbox.routing;
const { CacheFirst } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;

precacheAndRoute(self.__WB_MANIFEST || []);

/**
 * Cache images
 */
registerRoute(
  ({url}) => url.pathname.startsWith('/assets/img/') && !url.pathname.startsWith('/assets/img/map/tiles/'),
  new CacheFirst({
    cacheName: CACHE_IMAGES,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200, 404],
      }),
      new ExpirationPlugin({
        maxEntries: 300,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);


/**
 * Cache tiles for the map
 */
registerRoute(
  ({url}) => url.pathname.startsWith('/assets/img/map/tiles/'),
  new CacheFirst({
    cacheName: CACHE_MAP_TILES,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200, 404],
      }),
      new ExpirationPlugin({
        maxEntries: 300,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

/**
 * Register custom message handler to get the current service worker version
 * and to skip waiting when a new service worker is installed.
 */
self.addEventListener('message', (event) => {
  if (event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage(SW_VERSION);
  }

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * Delete old caches on activation of a new serviceWorker
 */
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_IMAGES, CACHE_MAP_TILES];
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
