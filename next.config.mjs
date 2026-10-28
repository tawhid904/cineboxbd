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
		// TMDB images are already CDN-optimized at fixed sizes (w300/w500/w780/w1280).
		// Setting unoptimized:true bypasses Vercel's Image Optimization pipeline entirely,
		// preventing 402 quota errors on the free tier. Local/static assets are unaffected
		// because next/image is only used for /text-logo.png elsewhere in this codebase.
		unoptimized: true,
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

