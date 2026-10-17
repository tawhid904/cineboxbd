import { Suspense } from "react";
import ApiKeyNotice from "@/components/ui/ApiKeyNotice";
import BrowseCollection from "@/components/browse/BrowseCollection";
import { BrowseSkeleton } from "@/components/ui/Skeleton";
import { hasTmdbCredentials } from "@/lib/tmdb/client";

export const metadata = {
	title: "Movies",
	description:
		"Every film on the catalogue, filterable by genre, rating, release date and popularity.",
};

export default function MoviesPage({ searchParams }) {
	if (!hasTmdbCredentials()) return <ApiKeyNotice />;

	return (
		<Suspense fallback={<BrowseSkeleton />}>
			<BrowseCollection mediaType="movie" searchParams={searchParams} />
		</Suspense>
	);
}
