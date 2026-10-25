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
	getTvDetails,
	getWatchProviders,
} from "@/lib/tmdb/endpoints";
import {
	extractProviders,
	normalizeCast,
	normalizeCrew,
	normalizeDetails,
	normalizeCard,
} from "@/lib/tmdb/normalize";

async function loadShow(id) {
	try {
		const [details, providersPayload, genreMap] = await Promise.all([
			getTvDetails(id),
			getWatchProviders("tv", id),
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
		return { title: 'TV Show' };
	}
	try {
		const details = await getTvDetails(numericId);
		const overview = details.overview?.slice(0, 160) || 'TV show details on CineboxBD.';
		const backdropUrl = details.backdrop_path
			? `https://image.tmdb.org/t/p/w1280${details.backdrop_path}`
			: '/preview.png';
		return {
			title: details.name,
			description: overview,
			keywords: [
				`watch ${details.name} online`,
				`${details.name} series`,
				`${details.name} Bangladesh`,
				'watch TV series online Bangladesh',
			],
			alternates: { canonical: `/tv/${numericId}` },
			openGraph: {
				title: `${details.name} | CineboxBD`,
				description: overview,
				url: `https://www.cineboxbd.bond/tv/${numericId}`,
				images: [{ url: backdropUrl, width: 1280, height: 720, alt: details.name }],
				type: 'video.tv_show',
			},
			twitter: {
				card: 'summary_large_image',
				title: `${details.name} | CineboxBD`,
				description: overview,
				images: [backdropUrl],
			},
		};
	} catch {
		return { title: 'TV Show', description: 'TV show details on CineboxBD.' };
	}
}

export default function TvDetailPage({ params }) {
	if (!hasTmdbCredentials()) return <ApiKeyNotice />;

	// `params` is URL data - keep the read inside Suspense so navigation can
	// paint the shared shell + skeleton instantly (instant-shell rule).
	return (
		<Suspense fallback={<MovieDetailSkeleton />}>
			<TvDetailContent params={params} />
		</Suspense>
	);
}

async function TvDetailContent({ params }) {
	const { id } = await params;
	const numericId = Number(id);
	if (!Number.isInteger(numericId) || numericId <= 0) notFound();

	const { details, providers, genreMap } = await loadShow(numericId);
	const item = normalizeDetails(details, "tv", genreMap);
	const crew = normalizeCrew(details.credits);
	const cast = normalizeCast(details.credits);

	const recommendations = (details.recommendations?.results ?? [])
		.map((result) => normalizeCard(result, "tv", genreMap))
		.filter(Boolean)
		.slice(0, 12);

	const facts = [
		...buildFacts(item, crew),
		{ label: "Seasons", value: item.seasons },
		{ label: "Episodes", value: item.episodes },
	];

	const tvSchema = {
		'@context': 'https://schema.org',
		'@type': 'TVSeries',
		name: details.name,
		description: details.overview,
		image: details.poster_path
			? `https://image.tmdb.org/t/p/w500${details.poster_path}`
			: undefined,
		datePublished: details.first_air_date,
		numberOfSeasons: details.number_of_seasons,
		numberOfEpisodes: details.number_of_episodes,
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
		url: `https://www.cineboxbd.bond/tv/${details.id}`,
	};

	const breadcrumbSchema = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.cineboxbd.bond' },
			{ '@type': 'ListItem', position: 2, name: 'TV Shows', item: 'https://www.cineboxbd.bond/tv' },
			{ '@type': 'ListItem', position: 3, name: details.name, item: `https://www.cineboxbd.bond/tv/${details.id}` },
		],
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(tvSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
			/>
			<DetailHero item={item} director={crew.director} providers={providers} />

			<div className="page-shell space-y-14 pb-24 pt-10 md:pt-14">
				<section aria-labelledby="tv-details-heading">
					<h2
						id="tv-details-heading"
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
								? `/tv?genre=${item.genreIds[0]}`
								: "/tv"
						}
					/>
				) : null}
			</div>

			<HistoryTracker
				id={item.id}
				mediaType="tv"
				title={item.title}
				posterPath={item.posterPath}
				backdropPath={item.backdropPath}
				year={item.year}
			/>
		</>
	);
}
