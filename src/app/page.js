import ApiKeyNotice from "@/components/ui/ApiKeyNotice";
import NowWatchingHero from "@/components/home/NowWatchingHero";
import ContinueWatchingRow from "@/components/home/ContinueWatchingRow";
import GenreCollageSection from "@/components/home/GenreCollageSection";
import CtaBanner from "@/components/home/CtaBanner";
import Carousel from "@/components/media/Carousel";
import { hasTmdbCredentials } from "@/lib/tmdb/client";
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
	alternates: { canonical: '/' },
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

export default async function HomePage() {
	if (!hasTmdbCredentials()) return <ApiKeyNotice />;

	const [
		trendingRaw,
		nowPlayingRaw,
		upcomingRaw,
		popularMovies,
		popularTv,
		genreMap,
		genreRows,
		collages,
	] = await Promise.all([
		getTrending("movie", "week"),
		getNowPlayingMovies(),
		getUpcomingMovies(),
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

	// Build 3 hero groups of 6 items with genres and variant badges
	const mapHeroMovies = (items, variant) =>
		(items || []).slice(0, 6).map((item) => ({
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
			movies: mapHeroMovies(upcomingRaw.results, "upcoming"),
		},
	].filter((g) => g.movies.length > 0);

	const movieCards = (list, defaultVariant) =>
		(list.results || [])
			.map((item) => {
				const card = normalizeCard(item, "movie", genreMap);
				if (!card) return null;
				const variant = defaultVariant
					? determineMediaVariant({ releaseDate: card.releaseDate, defaultVariant })
					: undefined;
				return { ...card, variant };
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
					items={movieCards(upcomingRaw, "upcoming")}
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
