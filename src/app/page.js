import ApiKeyNotice from "@/components/ui/ApiKeyNotice";
import NowWatchingHero from "@/components/home/NowWatchingHero";
import ContinueWatchingRow from "@/components/home/ContinueWatchingRow";
import ExploreBar from "@/components/home/ExploreBar";
import GenreCollageSection from "@/components/home/GenreCollageSection";
import CtaBanner from "@/components/home/CtaBanner";
import Carousel from "@/components/media/Carousel";
import { hasTmdbCredentials } from "@/lib/tmdb/client";
import {
	discoverMovies,
	getGenreCollage,
	getGenreMap,
	getHeroItems,
	getPopularMovies,
	getPopularTv,
} from "@/lib/tmdb/endpoints";
import { normalizeCard, normalizeHero } from "@/lib/tmdb/normalize";
import { collageGenres, homeGenreRows, homeTvRow } from "@/config/site";

export const metadata = {
	description:
		"What to watch tonight — trending films and series, curated genre rows and honest ratings. Welcome to MOVIEBOXBD.",
};

export default async function HomePage() {
	if (!hasTmdbCredentials()) return <ApiKeyNotice />;

	const [heroPairs, popularMovies, popularTv, genreMap, genreRows, collages, ctaList] =
		await Promise.all([
			getHeroItems(5),
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
			getPopularMovies(2),
		]);

	const slides = heroPairs
		.map(({ item, details }) => normalizeHero(item, details, genreMap))
		.filter(Boolean);

	const movieCards = (list) =>
		list.results.map((item) => normalizeCard(item, "movie", genreMap)).filter(Boolean);
	const tvCards = (list) =>
		list.results.map((item) => normalizeCard(item, "tv", genreMap)).filter(Boolean);

	const genreOptions = Object.entries(genreMap.movie)
		.map(([id, name]) => ({ id: Number(id), name }))
		.sort((a, b) => a.name.localeCompare(b.name));

	const ctaPosters = ctaList.results
		.filter((item) => item.poster_path)
		.slice(0, 3)
		.map((item) => item.poster_path);

	return (
		<>
			<NowWatchingHero slides={slides} />

			<div className="space-y-16 pb-24 pt-14 md:space-y-24 md:pt-20">
				<ContinueWatchingRow />

				<ExploreBar genres={genreOptions} />

				<Carousel
					title="Recommendations for you"
					sub="What everyone is watching right now."
					items={movieCards(popularMovies)}
					viewAllHref="/movies"
				/>

				{genreRows.map(({ row, data }) => (
					<Carousel
						key={row.title}
						title={row.title}
						sub={row.sub}
						items={movieCards(data)}
						viewAllHref={row.href}
					/>
				))}

				<Carousel
					title={homeTvRow.title}
					sub={homeTvRow.sub}
					items={tvCards(popularTv)}
					viewAllHref="/tv"
				/>

				<GenreCollageSection collages={collages} />

				<CtaBanner posters={ctaPosters} />
			</div>
		</>
	);
}

