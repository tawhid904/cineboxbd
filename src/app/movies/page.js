import { Suspense } from "react";
import ApiKeyNotice from "@/components/ui/ApiKeyNotice";
import BrowseCollection from "@/components/browse/BrowseCollection";
import { BrowseSkeleton } from "@/components/ui/Skeleton";
import { hasTmdbCredentials } from "@/lib/tmdb/client";

export const metadata = {
	title: "Browse movies",
	description:
		"Browse movies by genre, rating, release date or popularity — the full film catalogue, curated for MOVIEBOXBD.",
};

export default function MoviesPage({ searchParams }) {
	if (!hasTmdbCredentials()) return <ApiKeyNotice />;

	return (
		<Suspense fallback={<BrowseSkeleton />}>
			<BrowseCollection mediaType="movie" searchParams={searchParams} />
		</Suspense>
	);
}
