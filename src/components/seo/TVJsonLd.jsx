export default function TVJsonLd({ show }) {
	if (!show) return null;

	const schema = {
		"@context": "https://schema.org",
		"@type": "TVSeries",
		name: show.name,
		description: show.overview,
		image: show.poster_path
			? `https://image.tmdb.org/t/p/w500${show.poster_path}`
			: undefined,
		datePublished: show.first_air_date,
		aggregateRating:
			show.vote_average > 0
				? {
						"@type": "AggregateRating",
						ratingValue: Number(show.vote_average).toFixed(1),
						ratingCount: show.vote_count || 1,
						bestRating: "10",
						worstRating: "1",
				  }
				: undefined,
		genre: show.genres?.map((g) => (typeof g === "string" ? g : g.name)),
		numberOfSeasons: show.number_of_seasons,
		numberOfEpisodes: show.number_of_episodes,
		url: show.id ? `https://www.cineboxbd.bond/tv/${show.id}` : undefined,
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	);
}
