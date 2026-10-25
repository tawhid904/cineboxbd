/**
 * Determines the MediaBadge variant based on release date, sort, and context.
 */
export function determineMediaVariant({ releaseDate, sort, isSearch = false, defaultVariant } = {}) {
	if (isSearch) return undefined;
	if (releaseDate) {
		const releaseTime = new Date(releaseDate).getTime();
		const now = Date.now();
		const diffDays = (now - releaseTime) / (1000 * 60 * 60 * 24);
		if (diffDays < 0) return "upcoming";
		if (diffDays <= 30) return "new";
	}
	if (defaultVariant) return defaultVariant;
	if (sort === "rating") return "topRated";
	if (sort === "newest") return "new";
	if (sort === "popularity") return "trending";
	return undefined;
}
