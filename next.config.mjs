/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: false,
	images: {
		remotePatterns: [
			// {
			// 	protocol: 'http',
			// 	hostname: 'localhost',
			// 	port: '1337'
			// }
		]
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
