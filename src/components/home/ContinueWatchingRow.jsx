"use client";

import Carousel from "@/components/media/Carousel";
import { useHistory } from "@/lib/watchlist";

export default function ContinueWatchingRow() {
	const items = useHistory();

	if (!items.length) return null;

	return (
		<Carousel
			title="Continue Watching"
			sub="Your last views, saved on this device."
			items={items}
			variant="continue"
			viewAllHref="/trending"
			viewAllLabel="Trending now"
		/>
	);
}
