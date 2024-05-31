importScripts('./assets/3rd-party/workbox-v7.1.0/workbox-sw.js');

workbox.setConfig({
    debug: false,
    modulePathPrefix: './assets/3rd-party/workbox-v7.1.0/',
});

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);