export default function MovieJsonLd({ movie }) {
	if (!movie) return null;

	const schema = {
		"@context": "https://schema.org",
		"@type": "Movie",
		name: movie.title,
		description: movie.overview,
		image: movie.poster_path
			? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
			: undefined,
		datePublished: movie.release_date,
		aggregateRating:
			movie.vote_average > 0
				? {
						"@type": "AggregateRating",
						ratingValue: Number(movie.vote_average).toFixed(1),
						ratingCount: movie.vote_count || 1,
						bestRating: "10",
						worstRating: "1",
				  }
				: undefined,
		genre: movie.genres?.map((g) => (typeof g === "string" ? g : g.name)),
		duration: movie.runtime ? `PT${movie.runtime}M` : undefined,
		url: movie.id ? `https://www.cineboxbd.bond/movies/${movie.id}` : undefined,
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	);
}
