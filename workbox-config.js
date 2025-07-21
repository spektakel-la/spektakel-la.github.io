// https://developer.chrome.com/docs/workbox/modules/workbox-build#method-injectManifest
module.exports = {
	globDirectory: '_site/',
	globPatterns: [
		'**/*.{html,json,css,png,jpg,jpeg,webp,svg,js,mjs,ico,woff,woff2}'
	],
	globIgnores: [
		'workbox-config.js',

		// Javascript
		'assets/3rd-party/workbox-v7.3.0/*.dev.*',

		// Images will now be handled lazy (see sw.js)
		'assets/img/**/*',

		// Obsolete fonts
		'assets/3rd-party/font-awesome/**/*.svg',

		// Duplications due to i18n
		'en/assets/js/**/*',
		'en/assets/css/**/*',
	],
	swSrc: 'sw.js',
	swDest: '_site/sw.js'
};