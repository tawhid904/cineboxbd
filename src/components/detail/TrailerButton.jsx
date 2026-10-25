"use client";

import { useState } from "react";
import TrailerModal from "./TrailerModal";

export default function TrailerButton({ videoKey, title, label = "Watch trailer" }) {
	const [open, setOpen] = useState(false);

	if (!videoKey) return null;

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-accent px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
			>
				<svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
					<path d="M6 4.5l10 5.5-10 5.5z" />
				</svg>
				<span>{label}</span>
			</button>
			{open ? (
				<TrailerModal
					videoKey={videoKey}
					title={`Trailer · ${title}`}
					onClose={() => setOpen(false)}
				/>
			) : null}
		</>
	);
}
