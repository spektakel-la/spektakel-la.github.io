// https://developer.chrome.com/docs/workbox/modules/workbox-build#method-injectManifest
module.exports = {
  globDirectory: '_site/',
  globPatterns: ['**/*.{html,json,css,png,jpg,jpeg,webp,svg,js,mjs,ico,woff,woff2,ttf}'],
  globIgnores: [
    'workbox-config.js',

    // we only cache webp and ignore the jpg/png-siblings
    'assets/img/map/*.jpg',
    'assets/img/artists/*.jpg',
    'assets/img/youtube/*.jpg',
    'assets/img/youtube/*.png',

    // some sections/categories won't be precached
    'assets/img/map/**/*',
    'assets/img/screenshots/**/*',
    'assets/img/impressions/**/*',
    'assets/img/sponsors/**/*',

    // Obsolete fonts
    'assets/3rd-party/font-awesome/**/*.svg',

    // Duplications due to i18n
    'en/assets/js/**/*',
    'en/assets/css/**/*',
  ],
  swSrc: 'sw.js',
  swDest: '_site/sw.js',
};
