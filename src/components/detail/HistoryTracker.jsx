"use client";

import { useEffect } from "react";

/**
 * Records the current title in localStorage so the home page's
 * "Continue Watching" row shows genuinely visited titles.
 */
export default function HistoryTracker({
	id,
	mediaType,
	title,
	posterPath,
	backdropPath,
	year,
}) {
	useEffect(() => {
		if (!id) return;
		// dynamic import keeps this out of the server bundle
		import("@/lib/watchlist").then(({ recordVisit }) =>
			recordVisit({ id, mediaType, title, posterPath, backdropPath, year }),
		);
	}, [id, mediaType, title, posterPath, backdropPath, year]);

	return null;
}
