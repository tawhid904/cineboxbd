import BrowseCollection from "@/components/browse/BrowseCollection";
import ApiKeyNotice from "@/components/ui/ApiKeyNotice";
import { BrowseSkeleton } from "@/components/ui/Skeleton";
import { hasTmdbCredentials } from "@/lib/tmdb/client";
import { Suspense } from "react";

export const metadata = {
	title: "TV Shows",
	description:
		"Every series on the catalogue, filterable by genre, rating, air date and popularity.",
};

export default function TvPage({ searchParams }) {
	if (!hasTmdbCredentials()) return <ApiKeyNotice />;

	return (
		<Suspense fallback={<BrowseSkeleton />}>
			<BrowseCollection mediaType="tv" searchParams={searchParams} />
		</Suspense>
	);
}
