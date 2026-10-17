export const site = {
	name: "MOVIEBOXBD",
	tagline: "Films & series, hand-picked.",
	description:
		"MOVIEBOXBD is a carefully kept guide to what to watch next — real ratings, honest picks, nothing buried in noise.",
	nav: [
		{ label: "Movies", href: "/movies" },
		{ label: "TV Shows", href: "/tv" },
		{ label: "Trending", href: "/search" },
	],
};

// Genre rows on the home page. IDs are real TMDB genre IDs.
// `genres` joined with "|" = OR in TMDB Discover.
export const homeGenreRows = [
	{
		title: "Horror Mystery",
		sub: "Things that linger after the credits.",
		mediaType: "movie",
		genres: [27, 9648],
		href: "/movies?genre=27%7C9648",
	},
	{
		title: "Action & Adventure",
		sub: "Big stakes, bigger screens.",
		mediaType: "movie",
		genres: [28, 12],
		href: "/movies?genre=28%7C12",
	},
];

export const homeTvRow = {
	title: "Binge-worthy TV",
	sub: "Series people finish in a weekend.",
	mediaType: "tv",
};

// Genre collage cards ("Genres without boundaries")
export const collageGenres = [
	{ id: 53, label: "Thriller", href: "/movies?genre=53" },
	{ id: 10749, label: "Romance", href: "/movies?genre=10749" },
	{ id: 99, label: "Documentary", href: "/movies?genre=99" },
	{ id: 28, label: "Action", href: "/movies?genre=28" },
];

// User-facing sort keys, mapped to real TMDB `sort_by` values per media type.
export const SORTS = {
	movie: {
		popularity: "popularity.desc",
		rating: "vote_average.desc",
		newest: "primary_release_date.desc",
		az: "title.asc",
	},
	tv: {
		popularity: "popularity.desc",
		rating: "vote_average.desc",
		newest: "first_air_date.desc",
		az: "name.asc",
	},
};

export const SORT_OPTIONS = [
	{ value: "popularity", label: "Most popular" },
	{ value: "rating", label: "Top rated" },
	{ value: "newest", label: "Newest" },
	{ value: "az", label: "A–Z" },
];
