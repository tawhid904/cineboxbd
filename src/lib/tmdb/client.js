import { cacheLife, cacheTag } from "next/cache";

const TMDB_BASE = "https://api.themoviedb.org/3";

export class TmdbError extends Error {
	constructor(message, status) {
		super(message);
		this.name = "TmdbError";
		this.status = status;
	}
}

export function hasTmdbCredentials() {
	return Boolean(process.env.TMDB_READ_ACCESS_TOKEN || process.env.TMDB_API_KEY);
}

function buildUrl(path, params) {
	const url = new URL(`${TMDB_BASE}${path}`);
	url.searchParams.set("language", "en-US");
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null || value === "") continue;
		url.searchParams.set(key, String(value));
	}
	// v3 auth via query param when no v4 bearer token is configured
	if (!process.env.TMDB_READ_ACCESS_TOKEN && process.env.TMDB_API_KEY) {
		url.searchParams.set("api_key", process.env.TMDB_API_KEY);
	}
	return url;
}

/**
 * Cached catalogue fetcher (Next 16 Cache Functions).
 * - `life` is a cacheLife profile: "minutes" | "hours" | "days" | ...
 * - `tag` registers a cacheTag for debugging/revalidation.
 */
export async function tmdbFetch(path, { params = {}, life = "hours", tag } = {}) {
	"use cache";
	cacheLife(life);
	if (tag) cacheTag(tag);

	if (!hasTmdbCredentials()) {
		throw new TmdbError(
			"Catalogue API credentials missing. See .env.example for setup.",
			503,
		);
	}

	const url = buildUrl(path, params);
	const headers = { accept: "application/json" };
	if (process.env.TMDB_READ_ACCESS_TOKEN) {
		headers.Authorization = `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`;
	}

	const res = await fetch(url, { headers, cache: "force-cache" });
	if (!res.ok) {
		throw new TmdbError(`Catalogue API responded ${res.status} for ${path}`, res.status);
	}
	return res.json();
}
