// https://developer.chrome.com/docs/workbox/modules/workbox-build#method-injectManifest
module.exports = {
	globDirectory: '_site/',
	globPatterns: [
		'**/*.{html,json,css,png,jpg,webp,jpeg,svg,js,mjs,ico,woff,woff2}'
	],
	globIgnores: [
		'workbox-config.js',
		'assets/screenshots/**/*',
		'assets/img/impressions/**/*',
		'assets/img/sponsors/**/*'
	],
	swSrc: 'sw.js',
	swDest: '_site/sw.js'
};