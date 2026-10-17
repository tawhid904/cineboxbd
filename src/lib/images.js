const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

// TMDB-provided file sizes (see https://developer.themoviedb.org/docs/image-basics)
export const SIZES = {
	posterSm: "w185",
	poster: "w342",
	posterLg: "w500",
	backdropSm: "w300",
	backdrop: "w780",
	backdropLg: "w1280",
	profile: "w185",
	profileMd: "w342",
	logo: "w92",
};

export function tmdbImage(filePath, size = SIZES.backdrop) {
	if (!filePath) return null;
	return `${TMDB_IMAGE_BASE}/${size}${filePath}`;
}
