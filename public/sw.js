/* Cleanup service worker: removes previous service workers and caches for this origin. */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));

        await self.clients.claim();

        const clients = await self.clients.matchAll({ type: 'window' });
        await Promise.allSettled(clients.map((client) => client.navigate(client.url)));

        await self.registration.unregister();
      } catch (error) {
        console.error('[ServiceWorker cleanup] Failed:', error);
      }
    })(),
  );
});

self.addEventListener('fetch', () => {
  // Intentionally do not intercept requests.
});
