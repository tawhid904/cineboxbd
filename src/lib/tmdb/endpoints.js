import { tmdbFetch } from "./client";

/* ---------------------------------- lists --------------------------------- */

export function getTrending(mediaType = "all", window = "day", page = 1) {
	return tmdbFetch(`/trending/${mediaType}/${window}`, {
		params: { page },
		life: "hours",
		tag: `trending:${mediaType}:${window}:${page}`,
	});
}

export function getPopularMovies(page = 1) {
	return tmdbFetch("/movie/popular", {
		params: { page },
		life: "hours",
		tag: `movie:popular:${page}`,
	});
}

export function getNowPlayingMovies(page = 1) {
	return tmdbFetch("/movie/now_playing", {
		params: { page },
		life: "hours",
		tag: `movie:now_playing:${page}`,
	});
}

export function getTopRatedMovies(page = 1) {
	return tmdbFetch("/movie/top_rated", {
		params: { page },
		life: "hours",
		tag: `movie:top_rated:${page}`,
	});
}

export function getUpcomingMovies(page = 1) {
	return tmdbFetch("/movie/upcoming", {
		params: { page },
		life: "hours",
		tag: `movie:upcoming:${page}`,
	});
}

export function getPopularTv(page = 1) {
	return tmdbFetch("/tv/popular", {
		params: { page },
		life: "hours",
		tag: `tv:popular:${page}`,
	});
}

export function getOnTheAirTv(page = 1) {
	return tmdbFetch("/tv/on_the_air", {
		params: { page },
		life: "hours",
		tag: `tv:on_the_air:${page}`,
	});
}

/* -------------------------------- discover -------------------------------- */

export function discoverMovies({ genres, sort = "popularity.desc", page = 1 } = {}) {
	return tmdbFetch("/discover/movie", {
		params: {
			with_genres: Array.isArray(genres) ? genres.join("|") : genres,
			sort_by: sort,
			page,
			include_adult: false,
			"vote_count.gte": 100,
		},
		life: "hours",
		tag: `discover:movie:${genres ?? ""}:${sort}:${page}`,
	});
}

export function discoverTv({ genres, sort = "popularity.desc", page = 1 } = {}) {
	return tmdbFetch("/discover/tv", {
		params: {
			with_genres: Array.isArray(genres) ? genres.join("|") : genres,
			sort_by: sort,
			page,
			"vote_count.gte": 100,
		},
		life: "hours",
		tag: `discover:tv:${genres ?? ""}:${sort}:${page}`,
	});
}

/* --------------------------------- details -------------------------------- */

function detailParams(mediaType) {
	return {
		append_to_response:
			mediaType === "movie"
				? "videos,credits,release_dates,recommendations"
				: "videos,credits,content_ratings,recommendations",
	};
}

export function getMovieDetails(id) {
	return tmdbFetch(`/movie/${id}`, {
		params: detailParams("movie"),
		life: "hours",
		tag: `movie:details:${id}`,
	});
}

export function getTvDetails(id) {
	return tmdbFetch(`/tv/${id}`, {
		params: detailParams("tv"),
		life: "hours",
		tag: `tv:details:${id}`,
	});
}

export function getWatchProviders(mediaType, id) {
	return tmdbFetch(`/${mediaType}/${id}/watch/providers`, {
		life: "days",
		tag: `providers:${mediaType}:${id}`,
	});
}

/** Lightweight details for hero slides (trailer key + certification). */
export function getHeroDetail(mediaType, id) {
	return tmdbFetch(`/${mediaType}/${id}`, {
		params: {
			append_to_response:
				mediaType === "movie" ? "videos,release_dates" : "videos,content_ratings",
		},
		life: "hours",
		tag: `hero:${mediaType}:${id}`,
	});
}

/* --------------------------------- search --------------------------------- */

export function searchByType(mediaType, query, page = 1) {
	return tmdbFetch(`/search/${mediaType}`, {
		params: { query, page, include_adult: false },
		life: "minutes",
		tag: `search:${mediaType}:${query}:${page}`,
	});
}

export function searchMulti(query, page = 1) {
	return tmdbFetch("/search/multi", {
		params: { query, page, include_adult: false },
		life: "minutes",
		tag: `search:multi:${query}:${page}`,
	});
}

/* --------------------------------- genres --------------------------------- */

export function getGenreList(mediaType) {
	return tmdbFetch(`/genre/${mediaType}/list`, {
		life: "days",
		tag: `genres:${mediaType}`,
	});
}

export async function getGenreMap() {
	const [movie, tv] = await Promise.all([getGenreList("movie"), getGenreList("tv")]);
	const toMap = (genres = []) =>
		Object.fromEntries(genres.map((g) => [g.id, g.name]));
	return { movie: toMap(movie.genres), tv: toMap(tv.genres) };
}

/* ------------------------------ home specials ----------------------------- */

/**
 * Top trending titles with real trailer keys for the hero rotation.
 */
export async function getHeroItems(limit = 5) {
	const trending = await getTrending("all", "day");
	const picked = trending.results
		.filter(
			(item) =>
				(item.media_type === "movie" || item.media_type === "tv") && item.backdrop_path,
		)
		.slice(0, limit);

	const items = await Promise.all(
		picked.map(async (item) => {
			const details = await getHeroDetail(item.media_type, item.id);
			return { item, details };
		}),
	);
	return items;
}

/** First 4 poster paths for a genre - used by the genre collage cards. */
export async function getGenreCollage(genreId) {
	const data = await discoverMovies({ genres: genreId, page: 1 });
	return data.results.filter((r) => r.poster_path).slice(0, 4);
}
