"use client";

import Carousel from "@/components/media/Carousel";
import { useHistory } from "@/lib/watchlist";

export default function ContinueWatchingRow() {
	const items = useHistory();

	if (!items.length) return null;

	return (
		<Carousel
			title="Continue Watching"
			sub="Picks up where you left off — stored on this device."
			items={items}
			variant="continue"
			viewAllHref="/search"
			viewAllLabel="Recently viewed"
		/>
	);
}
