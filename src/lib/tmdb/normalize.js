/** US certification from appended release_dates (movie) / content_ratings (tv). */
export function extractCert(mediaType, payload) {
	if (mediaType === "movie") {
		const us = payload?.release_dates?.results?.find((r) => r.iso_3166_1 === "US");
		return (
			us?.release_dates?.find((r) => r.certification)?.certification || null
		);
	}
	const us = payload?.content_ratings?.results?.find((r) => r.iso_3166_1 === "US");
	return us?.rating || null;
}

/** Best YouTube trailer/teaser key from appended `videos`. */
export function extractTrailerKey(videos) {
	const results = videos?.results ?? [];
	const youtube = results.filter((v) => v.site === "YouTube");
	const preferred =
		youtube.find((v) => /trailer|teaser/i.test(v.type) && v.official !== false) ||
		youtube.find((v) => /trailer|teaser/i.test(v.type)) ||
		youtube.find((v) => v.official !== false) ||
		youtube[0];
	return preferred?.key || null;
}

/**
 * Map a raw TMDB movie/tv item to the view model used by cards & rows.
 * Returns null for unsupported media types (e.g. person).
 */
export function normalizeCard(item, fallbackType, genreMap = {}) {
	if (!item) return null;
	const mediaType =
		item.media_type && item.media_type !== "person"
			? item.media_type
			: fallbackType;
	if (!mediaType || (mediaType !== "movie" && mediaType !== "tv")) return null;

	const title = item.title || item.name || "Untitled";
	const date = item.release_date || item.first_air_date || "";
	const genres = (item.genre_ids || [])
		.map((id) => genreMap[mediaType]?.[id])
		.filter(Boolean);

	return {
		id: item.id,
		mediaType,
		title,
		year: date ? date.slice(0, 4) : null,
		overview: item.overview || "",
		posterPath: item.poster_path || null,
		backdropPath: item.backdrop_path || item.poster_path || null,
		voteAverage:
			typeof item.vote_average === "number" && item.vote_average > 0
				? item.vote_average
				: null,
		genres,
	};
}

/** Hero slides: card + certification + runtime/seasons + trailer key. */
export function normalizeHero(item, details, genreMap = {}) {
	const base = normalizeCard(item, item.media_type, genreMap);
	if (!base) return null;
	const mediaType = base.mediaType;
	return {
		...base,
		cert: extractCert(mediaType, details),
		runtime: mediaType === "movie" ? details.runtime || null : null,
		seasons: mediaType === "tv" ? details.number_of_seasons || null : null,
		trailerKey: extractTrailerKey(details.videos),
	};
}

/** Full detail view model for /movie/[id] and /tv/[id]. */
export function normalizeDetails(details, mediaType, genreMap = {}) {
	if (!details) return null;
	const isMovie = mediaType === "movie";
	return {
		id: details.id,
		mediaType,
		title: details.title || details.name || "Untitled",
		tagline: details.tagline || null,
		overview: details.overview || "",
		posterPath: details.poster_path || null,
		backdropPath: details.backdrop_path || details.poster_path || null,
		year: (isMovie ? details.release_date : details.first_air_date)
			? (isMovie ? details.release_date : details.first_air_date).slice(0, 4)
			: null,
		releaseDate: isMovie ? details.release_date || null : details.first_air_date || null,
		lastAirDate: !isMovie ? details.last_air_date || null : null,
		voteAverage:
			typeof details.vote_average === "number" && details.vote_average > 0
				? details.vote_average
				: null,
		voteCount: details.vote_count || 0,
		runtime: isMovie ? details.runtime || null : null,
		episodeRuntime: !isMovie
			? details.episode_run_time?.[0] || null
			: null,
		seasons: !isMovie ? details.number_of_seasons || null : null,
		episodes: !isMovie ? details.number_of_episodes || null : null,
		status: details.status || null,
		language: details.original_language || null,
		genres: (details.genres || []).map((g) => g.name),
		genreIds: (details.genres || []).map((g) => g.id),
		cert: extractCert(mediaType, details),
		trailerKey: extractTrailerKey(details.videos),
		homepage: details.homepage || null,
	};
}

export function normalizeCast(credits) {
	return (credits?.cast ?? [])
		.filter((person) => person.profile_path)
		.slice(0, 12)
		.map((person) => ({
			id: person.id,
			name: person.name,
			character: person.character || null,
			profilePath: person.profile_path,
		}));
}

export function normalizeCrew(credits) {
	const crew = credits?.crew ?? [];
	const pick = (job) => crew.find((p) => p.job === job)?.name || null;
	return { director: pick("Director"), writer: pick("Writer") };
}

export function normalizeVideos(videos) {
	return (videos?.results ?? [])
		.filter((v) => v.site === "YouTube")
		.slice(0, 6)
		.map((v) => ({ key: v.key, name: v.name, type: v.type }));
}

/** BD watch providers (flatrate/rent/buy) from appended/separate providers payload. */
export function extractProviders(providers) {
	const bd = providers?.results?.BD;
	if (!bd) return null;
	return {
		flatrate: bd.flatrate ?? [],
		rent: bd.rent ?? [],
		buy: bd.buy ?? [],
		link: bd.link ?? null,
	};
}
