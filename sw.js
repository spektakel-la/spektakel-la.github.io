importScripts('./assets/3rd-party/workbox-v7.1.0/workbox-sw.js');
workbox.setConfig({
    debug: false,
    modulePathPrefix: './assets/3rd-party/workbox-v7.1.0/',
});

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

// Use a stale-while-revalidate strategy to handle requests by default.
// workbox.routing.setDefaultHandler(new workbox.strategies.StaleWhileRevalidate());