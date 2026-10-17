import { Suspense } from "react";
import { notFound } from "next/navigation";
import ApiKeyNotice from "@/components/ui/ApiKeyNotice";
import { DetailSkeleton } from "@/components/ui/Skeleton";
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
		return { title: "TV show" };
	}
	try {
		const details = await getTvDetails(numericId);
		return {
			title: details.name,
			description: details.overview?.slice(0, 180) || undefined,
			openGraph: {
				title: details.name,
				description: details.overview?.slice(0, 180) || undefined,
				images: details.backdrop_path
					? [`https://image.tmdb.org/t/p/w1280${details.backdrop_path}`]
					: undefined,
			},
		};
	} catch {
		return { title: "TV show" };
	}
}

export default function TvDetailPage({ params }) {
	if (!hasTmdbCredentials()) return <ApiKeyNotice />;

	// `params` is URL data — keep the read inside Suspense so navigation can
	// paint the shared shell + skeleton instantly (instant-shell rule).
	return (
		<Suspense fallback={<DetailSkeleton />}>
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

	return (
		<>
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
						sub={`If you liked ${item.title}, these share the vibe.`}
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
