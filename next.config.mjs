/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '1337',
				pathname: '/**'
			},
			{
				protocol: 'http',
				hostname: '127.0.0.1',
				port: '1337',
				pathname: '/**'
			}
		],
		// Добавляем плейсхолдеры для изображений
		unoptimized: process.env.NODE_ENV !== 'production'
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack']
		})

		return config
	}
}

export default nextConfig
