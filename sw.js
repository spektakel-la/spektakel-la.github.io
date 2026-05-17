/* sw.js
 *
 * Cleanup-Service-Worker zur Entfernung eines bestehenden Offline-/Workbox-Setups.
 *
 * Zweck:
 * - alten Service Worker ersetzen
 * - alle Cache-Storage-Caches dieses Origins löschen
 * - Service Worker deregistrieren
 * - offene Tabs neu laden, damit sie ohne Service Worker laufen
 *
 * Wichtig:
 * - Diese Datei muss unter derselben URL ausgeliefert werden wie der bisherige Service Worker,
 *   z. B. /sw.js oder /ServiceWorker.js.
 * - Nicht durch Workbox injectManifest/generateSW verändern lassen.
 */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        // Alle Cache-Storage-Caches dieses Origins löschen:
        // Precache, Workbox Runtime Caches, dynamische Bild-Caches etc.
        const cacheNames = await caches.keys();

        await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));

        // Bestehende offene Clients übernehmen
        await self.clients.claim();

        // Offene Fenster neu laden, damit sie ohne Service Worker laufen.
        // Muss vor unregister() erfolgen, da navigate() einen aktiv kontrollierten
        // Client erfordert – nach unregister() ist das browserabhängig nicht mehr gewährleistet.
        const windowClients = await self.clients.matchAll({
          type: 'window',
        });

        await Promise.all(windowClients.map((client) => client.navigate(client.url)));

        // Diesen Cleanup-Service-Worker deregistrieren
        await self.registration.unregister();
      } catch (error) {
        // Keine harte Fehlerbehandlung nötig.
        // Der Worker soll nicht in einen kaputten Runtime-Zustand geraten.
        console.error('[ServiceWorker cleanup] Failed:', error);
      }
    })(),
  );
});

self.addEventListener('fetch', () => {
  // Absichtlich leer:
  // Keine Requests mehr abfangen, kein Offline-Caching, keine Runtime-Strategien.
});
