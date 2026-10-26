import { getServerSideSitemap } from 'next-sitemap';
import { getPopularMovies, getPopularTv } from '@/lib/tmdb/endpoints';
import { hasTmdbCredentials } from '@/lib/tmdb/client';

export async function GET() {
	if (!hasTmdbCredentials()) {
		return getServerSideSitemap([]);
	}

	try {
		const [moviesData, tvData] = await Promise.all([
			getPopularMovies(1),
			getPopularTv(1),
		]);

		const now = new Date().toISOString();

		const urls = [
			...(moviesData?.results || []).map((m) => ({
				loc: `https://www.cineboxbd.bond/movies/${m.id}`,
				lastmod: m.release_date
					? new Date(m.release_date).toISOString()
					: now,
				changefreq: 'weekly',
				priority: 0.8,
			})),
			...(tvData?.results || []).map((s) => ({
				loc: `https://www.cineboxbd.bond/tv/${s.id}`,
				lastmod: s.first_air_date
					? new Date(s.first_air_date).toISOString()
					: now,
				changefreq: 'weekly',
				priority: 0.8,
			})),
		];

		return getServerSideSitemap(urls);
	} catch {
		return getServerSideSitemap([]);
	}
}
