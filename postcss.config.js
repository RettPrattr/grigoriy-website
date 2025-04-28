export const plugins = {
	'@tailwindcss/postcss': {},
	autoprefixer: {},
	'postcss-flexbugs-fixes': {},
	cssnano: {},
	'postcss-preset-env': {
		stage: 2,
		features: {
			'nesting-rules': true,
			'gap-properties': true,
			'custom-properties': true,
			'custom-media-queries': true
		},
		browsers:
			'last 8 versions, > 0.1%, Safari 9, Chrome >= 49, Firefox >= 45, Edge >= 12, IE 11'
	}
}
