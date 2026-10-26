import { Suspense } from "react";
import ApiKeyNotice from "@/components/ui/ApiKeyNotice";
import BrowseCollection from "@/components/browse/BrowseCollection";
import { BrowseSkeleton } from "@/components/ui/Skeleton";
import { hasTmdbCredentials } from "@/lib/tmdb/client";

export const metadata = {
	title: 'Movies',
	description: 'Browse and discover the latest movies online. Filter by genre, rating, release year, and popularity. Find your next favourite film on CineboxBD Bangladesh.',
	keywords: ['latest movies online BD', 'browse movies by genre', 'top rated movies', 'new movie releases Bangladesh'],
	alternates: { canonical: 'https://www.cineboxbd.bond/movies' },
	openGraph: {
		title: 'Browse Movies | CineboxBD',
		description: 'Browse and filter movies by genre, rating and release date.',
		url: 'https://www.cineboxbd.bond/movies',
		images: [{ url: '/preview.png', width: 1200, height: 630 }],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Browse Movies | CineboxBD',
		description: 'Browse and filter movies by genre, rating and release date.',
		images: ['/preview.png'],
	},
};

export default function MoviesPage({ searchParams }) {
	if (!hasTmdbCredentials()) return <ApiKeyNotice />;

	return (
		<Suspense fallback={<BrowseSkeleton />}>
			<BrowseCollection mediaType="movie" searchParams={searchParams} />
		</Suspense>
	);
}
