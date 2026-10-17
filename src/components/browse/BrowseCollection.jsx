import { hasTmdbCredentials } from "@/lib/tmdb/client";
import {
	discoverMovies,
	discoverTv,
	getGenreList,
	searchByType,
} from "@/lib/tmdb/endpoints";
import { normalizeCard } from "@/lib/tmdb/normalize";
import { SORTS } from "@/config/site";
import FilterToolbar from "./FilterToolbar";
import Pagination from "./Pagination";
import PosterCard from "@/components/media/PosterCard";
import ListCard from "@/components/media/ListCard";
import EmptyState from "@/components/ui/EmptyState";

const VALID_SORTS = Object.keys(SORTS.movie);

function parseValues(sp, mediaType) {
	const q = typeof sp.q === "string" ? sp.q.trim() : "";
	const genre = typeof sp.genre === "string" ? sp.genre : "";
	const sortKey = typeof sp.sort === "string" ? sp.sort : "popularity";
	const sort = VALID_SORTS.includes(sortKey) ? sortKey : "popularity";
	const view = sp.view === "list" ? "list" : "grid";
	const page = Math.min(500, Math.max(1, Number.parseInt(sp.page, 10) || 1));
	return { q, genre, sort, view, page, mediaType };
}

/**
 * Shared server-rendered collection view for /movies and /tv.
 * Reads searchParams inside the page's Suspense boundary (cacheComponents rule).
 */
export default async function BrowseCollection({ mediaType, searchParams }) {
	const sp = await searchParams;
	const values = parseValues(sp ?? {}, mediaType);
	const isMovie = mediaType === "movie";
	const sortMap = SORTS[mediaType];
	const base = isMovie ? "/movies" : "/tv";

	const genres = await getGenreList(mediaType);
	const genreNameMap = Object.fromEntries(
		genres.genres.map((genre) => [genre.id, genre.name]),
	);

	const data = values.q
		? await searchByType(mediaType, values.q, values.page)
		: await (isMovie ? discoverMovies : discoverTv)({
				genres: values.genre || undefined,
				sort: sortMap[values.sort],
				page: values.page,
			});

	const cards = data.results
		.map((result) => normalizeCard(result, mediaType, { [mediaType]: genreNameMap }))
		.filter(Boolean);

	const makeHref = (page) => {
		const params = new URLSearchParams();
		if (values.q) params.set("q", values.q);
		if (values.genre) params.set("genre", values.genre);
		if (values.sort !== "popularity") params.set("sort", values.sort);
		if (values.view !== "grid") params.set("view", values.view);
		params.set("page", String(page));
		return `${base}?${params.toString()}`;
	};

	return (
		<div className="page-shell py-10 md:py-14">
			<header className="mb-8 max-w-2xl">
				<p className="mb-2 font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
					{isMovie ? "Movies" : "TV Shows"}
				</p>
				<h1 className="font-display text-[clamp(1.9rem,4vw,3rem)] leading-tight text-ink">
					{values.q
						? `Results for “${values.q}”`
						: isMovie
								? "Browse movies"
								: "Browse series"}
				</h1>
				<p className="mt-2 text-sm leading-relaxed text-muted">
					{values.q
						? `Matched in ${isMovie ? "movies" : "TV shows"}.`
						: "Filter by genre, sort by what matters, and open any title for the full breakdown."}
				</p>
			</header>

			<div className="mb-8 flex flex-wrap items-center justify-between gap-4">
				<FilterToolbar
					mediaType={mediaType}
					genres={genres.genres}
					values={values}
				/>
				<p className="font-mono text-xs text-faint">
					{data.total_results?.toLocaleString?.() ?? cards.length} titles
				</p>
			</div>

			{cards.length === 0 ? (
				<EmptyState
					title="Nothing matched"
					body="Try a different search term, or clear the filters to start over."
				/>
			) : values.view === "list" ? (
				<div className="space-y-4">
					{cards.map((card) => (
						<ListCard key={card.id} item={card} />
					))}
				</div>
			) : (
				<div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-5">
					{cards.map((card) => (
						<PosterCard key={card.id} item={card} />
					))}
				</div>
			)}

			<Pagination
				page={values.page}
				totalPages={data.total_pages}
				makeHref={makeHref}
			/>
		</div>
	);
}
