import { getServerSideSitemap } from 'next-sitemap';
import { getPopularMovies, getPopularTv } from '@/lib/tmdb/endpoints';
import { hasTmdbCredentials } from '@/lib/tmdb/client';

function safeLastmod(dateStr) {
	if (!dateStr) return new Date().toISOString();
	const d = new Date(dateStr);
	return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

export async function GET() {
	if (!hasTmdbCredentials()) {
		return getServerSideSitemap([]);
	}

	try {
		const [moviesData, tvData] = await Promise.all([
			getPopularMovies(1),
			getPopularTv(1),
		]);

		const urls = [
			...(moviesData?.results || []).map((m) => ({
				loc: `https://www.cineboxbd.bond/movies/${m.id}`,
				lastmod: safeLastmod(m.release_date),
				changefreq: 'weekly',
				priority: 0.8,
			})),
			...(tvData?.results || []).map((s) => ({
				loc: `https://www.cineboxbd.bond/tv/${s.id}`,
				lastmod: safeLastmod(s.first_air_date),
				changefreq: 'weekly',
				priority: 0.8,
			})),
		];

		return getServerSideSitemap(urls);
	} catch {
		return getServerSideSitemap([]);
	}
}
