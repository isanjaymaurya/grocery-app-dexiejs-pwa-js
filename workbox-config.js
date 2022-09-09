module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{css,js,html,json}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};