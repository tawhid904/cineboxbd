import { Suspense } from "react";
import { notFound } from "next/navigation";
import ApiKeyNotice from "@/components/ui/ApiKeyNotice";
import MovieDetailSkeleton from "@/components/ui/skeletons/MovieDetailSkeleton";
import DetailHero from "@/components/detail/DetailHero";
import FactsGrid, { buildFacts } from "@/components/detail/FactsGrid";
import CastRow from "@/components/detail/CastRow";
import HistoryTracker from "@/components/detail/HistoryTracker";
import Carousel from "@/components/media/Carousel";
import { hasTmdbCredentials, TmdbError } from "@/lib/tmdb/client";
import {
	getGenreMap,
	getMovieDetails,
	getWatchProviders,
} from "@/lib/tmdb/endpoints";
import {
	extractProviders,
	normalizeCast,
	normalizeCrew,
	normalizeDetails,
	normalizeCard,
} from "@/lib/tmdb/normalize";

async function loadMovie(id) {
	try {
		const [details, providersPayload, genreMap] = await Promise.all([
			getMovieDetails(id),
			getWatchProviders("movie", id),
			getGenreMap(),
		]);
		return {
			details,
			providers: extractProviders(providersPayload),
			genreMap,
		};
	} catch (error) {
		if (error instanceof TmdbError && error.status === 404) notFound();
		throw error;
	}
}

export async function generateMetadata({ params }) {
	const { id } = await params;
	const numericId = Number(id);
	if (!hasTmdbCredentials() || !Number.isInteger(numericId)) {
		return { title: 'Movie' };
	}
	try {
		const details = await getMovieDetails(numericId);
		const overview = details.overview?.slice(0, 160) || 'Movie details on CineboxBD.';
		const backdropUrl = details.backdrop_path
			? `https://image.tmdb.org/t/p/w1280${details.backdrop_path}`
			: '/preview.png';
		return {
			title: details.title,
			description: overview,
			keywords: [
				`watch ${details.title} online`,
				`${details.title} full movie`,
				`${details.title} Bangladesh`,
				'movies online BD',
			],
			alternates: { canonical: `/movies/${numericId}` },
			openGraph: {
				title: `${details.title} | CineboxBD`,
				description: overview,
				url: `https://www.cineboxbd.bond/movies/${numericId}`,
				images: [{ url: backdropUrl, width: 1280, height: 720, alt: details.title }],
				type: 'video.movie',
			},
			twitter: {
				card: 'summary_large_image',
				title: `${details.title} | CineboxBD`,
				description: overview,
				images: [backdropUrl],
			},
		};
	} catch {
		return { title: 'Movie', description: 'Movie details on CineboxBD.' };
	}
}

export default function MovieDetailPage({ params }) {
	if (!hasTmdbCredentials()) return <ApiKeyNotice />;

	// `params` is URL data - keep the read inside Suspense so navigation can
	// paint the shared shell + skeleton instantly (instant-shell rule).
	return (
		<Suspense fallback={<MovieDetailSkeleton />}>
			<MovieDetailContent params={params} />
		</Suspense>
	);
}

async function MovieDetailContent({ params }) {
	const { id } = await params;
	const numericId = Number(id);
	if (!Number.isInteger(numericId) || numericId <= 0) notFound();

	const { details, providers, genreMap } = await loadMovie(numericId);
	const item = normalizeDetails(details, "movie", genreMap);
	const crew = normalizeCrew(details.credits);
	const cast = normalizeCast(details.credits);

	const recommendations = (details.recommendations?.results ?? [])
		.map((result) => normalizeCard(result, "movie", genreMap))
		.filter(Boolean)
		.slice(0, 12);

	const facts = buildFacts(item, crew);

	const movieSchema = {
		'@context': 'https://schema.org',
		'@type': 'Movie',
		name: details.title,
		description: details.overview,
		image: details.poster_path
			? `https://image.tmdb.org/t/p/w500${details.poster_path}`
			: undefined,
		datePublished: details.release_date,
		genre: details.genres?.map((g) => g.name),
		aggregateRating: details.vote_count > 0
			? {
					'@type': 'AggregateRating',
					ratingValue: details.vote_average.toFixed(1),
					bestRating: '10',
					worstRating: '0',
					ratingCount: details.vote_count,
			  }
			: undefined,
		url: `https://www.cineboxbd.bond/movies/${details.id}`,
	};

	const breadcrumbSchema = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.cineboxbd.bond' },
			{ '@type': 'ListItem', position: 2, name: 'Movies', item: 'https://www.cineboxbd.bond/movies' },
			{ '@type': 'ListItem', position: 3, name: details.title, item: `https://www.cineboxbd.bond/movies/${details.id}` },
		],
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(movieSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
			/>
			<DetailHero item={item} director={crew.director} providers={providers} />

			<div className="page-shell space-y-14 pb-24 pt-10 md:pt-14">
				<section aria-labelledby="movie-details-heading">
					<h2
						id="movie-details-heading"
						className="mb-6 font-display text-[clamp(1.3rem,2.4vw,1.9rem)] text-ink"
					>
						Details
					</h2>
					<FactsGrid facts={facts} />
				</section>

				<CastRow cast={cast} />

				{recommendations.length ? (
					<Carousel
						title="More like this"
						sub={`If you liked ${item.title}, start here.`}
						items={recommendations}
						viewAllHref={
							item.genreIds.length
								? `/movies?genre=${item.genreIds[0]}`
								: "/movies"
						}
						viewAllLabel="See all"
					/>
				) : null}
			</div>

			<HistoryTracker
				id={item.id}
				mediaType="movie"
				title={item.title}
				posterPath={item.posterPath}
				backdropPath={item.backdropPath}
				year={item.year}
			/>
		</>
	);
}
