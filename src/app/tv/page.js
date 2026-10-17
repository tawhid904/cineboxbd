import { Suspense } from "react";
import ApiKeyNotice from "@/components/ui/ApiKeyNotice";
import BrowseCollection from "@/components/browse/BrowseCollection";
import { BrowseSkeleton } from "@/components/ui/Skeleton";
import { hasTmdbCredentials } from "@/lib/tmdb/client";

export const metadata = {
	title: "Browse TV shows",
	description:
		"Browse series by genre, rating, air date or popularity — the full series catalogue, curated for MOVIEBOXBD.",
};

export default function TvPage({ searchParams }) {
	if (!hasTmdbCredentials()) return <ApiKeyNotice />;

	return (
		<Suspense fallback={<BrowseSkeleton />}>
			<BrowseCollection mediaType="tv" searchParams={searchParams} />
		</Suspense>
	);
}
