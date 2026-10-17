/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		agentFeedback: true,
	},
	cacheComponents: true,
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

