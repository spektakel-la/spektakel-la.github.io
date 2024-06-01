const SW_VERSION = '1.0.0';

importScripts('/assets/3rd-party/workbox-v7.1.0/workbox-sw.js');
workbox.setConfig({
    // debug: true,
    modulePathPrefix: '/assets/3rd-party/workbox-v7.1.0/',
});

self.addEventListener('message', (event) => {
  if (event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage(SW_VERSION);
  }

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

const {precacheAndRoute} = workbox.precaching;
precacheAndRoute(self.__WB_MANIFEST || []);


// Use a stale-while-revalidate strategy to handle requests by default.
// workbox.routing.setDefaultHandler(new workbox.strategies.StaleWhileRevalidate());