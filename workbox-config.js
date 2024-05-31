module.exports = {
	globDirectory: '_site/',
	globPatterns: [
		'**/*.{html,json,css,png,jpg,webp,jpeg,svg,js,ico,woff,woff2}'
	],
	globIgnores: [
		'workbox-config.js',
		'assets/screenshots',
		'assets/img/impressions/**/*'
	],
	swSrc: 'sw.js',
	swDest: '_site/sw.js'
};