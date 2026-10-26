import BrowseCollection from "@/components/browse/BrowseCollection";
import ApiKeyNotice from "@/components/ui/ApiKeyNotice";
import { BrowseSkeleton } from "@/components/ui/Skeleton";
import { hasTmdbCredentials } from "@/lib/tmdb/client";
import { Suspense } from "react";

export const metadata = {
	title: 'TV Shows',
	description: 'Explore and stream top-rated TV series online. Filter by genre, rating, air date and popularity. Find the best series to binge-watch on CineboxBD.',
	keywords: ['watch TV series online Bangladesh', 'best series to binge watch', 'top rated TV shows', 'trending series online'],
	alternates: { canonical: 'https://www.cineboxbd.bond/tv' },
	openGraph: {
		title: 'Browse TV Shows | CineboxBD',
		description: 'Find the best TV series to watch. Filter by genre, rating and air date.',
		url: 'https://www.cineboxbd.bond/tv',
		images: [{ url: '/preview.png', width: 1200, height: 630 }],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Browse TV Shows | CineboxBD',
		description: 'Find the best TV series to watch. Filter by genre, rating and air date.',
		images: ['/preview.png'],
	},
};

export default function TvPage({ searchParams }) {
	if (!hasTmdbCredentials()) return <ApiKeyNotice />;

	return (
		<Suspense fallback={<BrowseSkeleton />}>
			<BrowseCollection mediaType="tv" searchParams={searchParams} />
		</Suspense>
	);
}
