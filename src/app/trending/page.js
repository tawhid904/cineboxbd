import { Suspense } from "react";
import ApiKeyNotice from "@/components/ui/ApiKeyNotice";
import { BrowseSkeleton } from "@/components/ui/Skeleton";
import PosterCard from "@/components/media/PosterCard";
import Pagination from "@/components/browse/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import { hasTmdbCredentials } from "@/lib/tmdb/client";
import { getGenreMap, getTrending, searchMulti } from "@/lib/tmdb/endpoints";
import { normalizeCard } from "@/lib/tmdb/normalize";

export const metadata = {
	title: 'Trending',
	description: "See what movies and TV shows are trending right now in Bangladesh. Search CineboxBD's full catalogue of films and series.",
	keywords: ['trending movies Bangladesh', 'most popular movies right now', 'trending series this week', 'movie search online'],
	alternates: { canonical: '/trending' },
	openGraph: {
		title: 'Trending Now | CineboxBD',
		description: "See what's trending in movies and TV today. Search the full catalogue.",
		url: 'https://www.cineboxbd.bond/trending',
		images: [{ url: '/preview.png', width: 1200, height: 630 }],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Trending Now | CineboxBD',
		description: "See what's trending in movies and TV today.",
		images: ['/preview.png'],
	},
};

function SearchContent({ searchParams }) {
	return <SearchResults searchParams={searchParams} />;
}

async function SearchResults({ searchParams }) {
	const sp = await searchParams;
	const q = typeof sp?.q === "string" ? sp.q.trim() : "";
	const page = Math.min(500, Math.max(1, Number.parseInt(sp?.page, 10) || 1));

	const [genreMap, data] = await Promise.all([
		getGenreMap(),
		q
			? searchMulti(q, page)
			: getTrending("all", "day", page),
	]);

	const cards = data.results
		.filter((result) => result.media_type !== "person")
		.map((result) => normalizeCard(result, result.media_type, genreMap))
		.filter(Boolean);

	const makeHref = (targetPage) => {
		const params = new URLSearchParams();
		if (q) params.set("q", q);
		params.set("page", String(targetPage));
		return `/trending?${params.toString()}`;
	};

	return (
		<div className="page-shell py-10 md:py-14">
			<header className="mb-8 max-w-2xl">
				<p className="mb-2 font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
					{q ? "Search" : "Right now"}
				</p>
				<h1 className="font-display text-[clamp(1.9rem,4vw,3rem)] leading-tight text-ink">
					{q ? `“${q}”` : "Trending today"}
				</h1>
				<p className="mt-2 text-sm leading-relaxed text-muted">
					{q
						? `${data.total_results?.toLocaleString?.() ?? cards.length} matches across films and series.`
						: "What people are actually watching right now."}
				</p>
			</header>

			{cards.length === 0 ? (
				<EmptyState
					title="No results"
					body="Try another spelling, or search for an actor, director or keyword."
				/>
			) : (
				<div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-5">
					{cards.map((card) => (
						<PosterCard key={`${card.mediaType}-${card.id}`} item={card} variant={q ? undefined : "trending"} />
					))}
				</div>
			)}

			<Pagination page={page} totalPages={data.total_pages} makeHref={makeHref} />
		</div>
	);
}

export default function SearchPage({ searchParams }) {
	if (!hasTmdbCredentials()) return <ApiKeyNotice />;

	return (
		<Suspense fallback={<BrowseSkeleton />}>
			<SearchContent searchParams={searchParams} />
		</Suspense>
	);
}
