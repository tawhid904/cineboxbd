/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		agentFeedback: true,
	},
	cacheComponents: true,
	async redirects() {
		return [
			{
				source: "/search",
				destination: "/trending",
				permanent: true,
			},
		];
	},
	partialPrefetching: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "image.tmdb.org",
				pathname: "/t/p/**",
			},
		],
	},
	turbopack: {
		rules: {
			"*.css": {
				loaders: ["@tailwindcss/turbopack"],
				as: "*.css",
			},
		},
	},
};

export default nextConfig;

