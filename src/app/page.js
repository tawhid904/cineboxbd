import ApiKeyNotice from "@/components/ui/ApiKeyNotice";
import NowWatchingHero from "@/components/home/NowWatchingHero";
import ContinueWatchingRow from "@/components/home/ContinueWatchingRow";
import GenreCollageSection from "@/components/home/GenreCollageSection";
import CtaBanner from "@/components/home/CtaBanner";
import Carousel from "@/components/media/Carousel";
import { cacheLife, cacheTag } from "next/cache";
import { hasTmdbCredentials, tmdbFetch } from "@/lib/tmdb/client";
import {
	discoverMovies,
	getGenreCollage,
	getGenreMap,
	getPopularMovies,
	getPopularTv,
	getTrending,
	getNowPlayingMovies,
	getUpcomingMovies,
} from "@/lib/tmdb/endpoints";
import { normalizeCard } from "@/lib/tmdb/normalize";
import { determineMediaVariant } from "@/lib/badges";
import { collageGenres, homeGenreRows, homeTvRow } from "@/config/site";

export const metadata = {
	title: 'CineboxBD | Watch Movies & Series Online Bangladesh',
	description: 'Discover trending movies and top-rated TV series on CineboxBD. Browse by genre, rating, and release date. Your ultimate movie discovery site in Bangladesh.',
	keywords: ['watch movies online Bangladesh', 'movies online BD', 'trending movies', 'best series to watch'],
	alternates: { canonical: 'https://www.cineboxbd.bond' },
	openGraph: {
		title: 'CineboxBD | Watch Movies & Series Online Bangladesh',
		description: 'Discover trending movies and top-rated TV series on CineboxBD.',
		url: 'https://www.cineboxbd.bond',
		images: [{ url: '/preview.png', width: 1200, height: 630 }],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'CineboxBD | Watch Movies & Series Online Bangladesh',
		description: 'Discover trending movies and top-rated TV series on CineboxBD.',
		images: ['/preview.png'],
	},
};

/**
 * Cached helper to fetch candidate upcoming movies strictly releasing in the future.
 * Cached for hours and revalidates automatically as dates progress.
 */
async function getFutureUpcomingMovies() {
	"use cache";
	cacheLife("hours");
	cacheTag("movies:upcoming:future");

	const today = new Date().toISOString().split("T")[0];

	const [upcomingRaw, discoverUpcoming] = await Promise.all([
		getUpcomingMovies(),
		tmdbFetch("/discover/movie", {
			params: {
				sort_by: "popularity.desc",
				"primary_release_date.gte": today,
				include_adult: false,
			},
			life: "hours",
			tag: `discover:upcoming:${today}`,
		}),
	]);

	const seen = new Set();
	const futureMovies = [];
	for (const item of [
		...(discoverUpcoming?.results || []),
		...(upcomingRaw?.results || []),
	]) {
		if (!item || !item.id || seen.has(item.id)) continue;
		seen.add(item.id);
		const releaseDate = item.release_date || item.first_air_date;
		if (!releaseDate || releaseDate <= today) continue;
		futureMovies.push(item);
	}

	return futureMovies;
}

export default async function HomePage() {
	if (!hasTmdbCredentials()) return <ApiKeyNotice />;

	const [
		trendingRaw,
		nowPlayingRaw,
		upcomingCandidates,
		popularMovies,
		popularTv,
		genreMap,
		genreRows,
		collages,
	] = await Promise.all([
		getTrending("movie", "week"),
		getNowPlayingMovies(),
		getFutureUpcomingMovies(),
		getPopularMovies(),
		getPopularTv(),
		getGenreMap(),
		Promise.all(
			homeGenreRows.map(async (row) => ({
				row,
				data: await discoverMovies({ genres: row.genres }),
			})),
		),
		Promise.all(
			collageGenres.map(async (genre) => ({
				genre,
				items: await getGenreCollage(genre.id),
			})),
		),
	]);

	// Filter upcoming movies: upcoming cannot be in trending or new movies
	const trendingIds = new Set((trendingRaw?.results || []).map((m) => m.id));
	const nowPlayingIds = new Set((nowPlayingRaw?.results || []).map((m) => m.id));

	const cleanUpcomingMovies = upcomingCandidates.filter(
		(item) => !trendingIds.has(item.id) && !nowPlayingIds.has(item.id),
	);

	const cleanUpcomingRaw = {
		results: cleanUpcomingMovies,
	};

	// Build 3 hero groups of 6 items with genres and variant badges
	const mapHeroMovies = (items, variant) =>
		(items || [])
			.filter((item) => Boolean(item?.backdrop_path))
			.slice(0, 6)
			.map((item) => ({
				id: item.id,
				title: item.title || item.name,
				backdrop_path: item.backdrop_path,
				poster_path: item.poster_path,
				release_date: item.release_date || item.first_air_date,
				genres: (item.genre_ids || [])
					.map((gid) => genreMap.movie?.[gid] || genreMap.tv?.[gid])
					.filter(Boolean)
					.slice(0, 3),
				media_type: item.media_type || "movie",
				variant,
				vote_average: item.vote_average ? Number(item.vote_average.toFixed(1)) : null,
			}));

	const heroGroups = [
		{
			label: "Top Trending",
			variant: "trending",
			movies: mapHeroMovies(trendingRaw.results, "trending"),
		},
		{
			label: "New Movies",
			variant: "new",
			movies: mapHeroMovies(nowPlayingRaw.results, "new"),
		},
		{
			label: "Upcoming",
			variant: "upcoming",
			movies: mapHeroMovies(cleanUpcomingMovies, "upcoming"),
		},
	].filter((g) => g.movies.length > 0);

	const movieCards = (list, defaultVariant) =>
		(list?.results || [])
			.map((item) => {
				const card = normalizeCard(item, "movie", genreMap);
				if (!card) return null;
				return { ...card, variant: defaultVariant };
			})
			.filter(Boolean);

	const tvCards = (list) =>
		(list.results || [])
			.map((item) => normalizeCard(item, "tv", genreMap))
			.filter(Boolean);

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'WebSite',
						name: 'CineboxBD',
						url: 'https://www.cineboxbd.bond',
						description: 'Discover trending movies and top-rated TV series in Bangladesh.',
						potentialAction: {
							'@type': 'SearchAction',
							target: {
								'@type': 'EntryPoint',
								urlTemplate: 'https://www.cineboxbd.bond/trending?q={search_term_string}',
							},
							'query-input': 'required name=search_term_string',
						},
					}),
				}}
			/>
			<NowWatchingHero groups={heroGroups} />

			<div className="space-y-10 py-10 md:space-y-16 md:py-16 pb-24">
				<ContinueWatchingRow />

				<Carousel
					title="Recommendations for you"
					sub="What everyone is watching right now."
					items={movieCards(popularMovies, "trending")}
					viewAllHref="/movies"
					viewAllLabel="See all"
				/>

				<Carousel
					title="Now Playing in Theatres"
					sub="Fresh theatrical and streaming releases."
					items={movieCards(nowPlayingRaw, "nowPlaying")}
					viewAllHref="/movies"
					viewAllLabel="See all"
				/>

				<Carousel
					title="Upcoming Releases"
					sub="Anticipated films arriving soon."
					items={movieCards(cleanUpcomingRaw, "upcoming")}
					viewAllHref="/movies"
					viewAllLabel="See all"
				/>

				{genreRows.map(({ row, data }) => (
					<Carousel
						key={row.title}
						title={row.title}
						sub={row.sub}
						items={movieCards(data)}
						viewAllHref={row.href}
						viewAllLabel="See all"
					/>
				))}

				<Carousel
					title={homeTvRow.title}
					sub={homeTvRow.sub}
					items={tvCards(popularTv)}
					viewAllHref="/tv"
					viewAllLabel="See all"
				/>

				<GenreCollageSection collages={collages} />

				<CtaBanner />
			</div>
		</>
	);
}
