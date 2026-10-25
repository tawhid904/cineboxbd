"use client";

import { useEffect } from "react";

export default function TrailerModal({ videoKey, title, onClose }) {
	useEffect(() => {
		const onKeyDown = (event) => {
			if (event.key === "Escape") onClose();
		};
		const { overflow } = document.body.style;
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", onKeyDown);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = overflow;
		};
	}, [onClose]);

	return (
		<div
			className="fixed inset-0 z-70 flex animate-fade-in items-center justify-center bg-black/85 p-4 backdrop-blur-sm cursor-crosshair"
			onClick={onClose}
			role="dialog"
			aria-modal="true"
			aria-label={title || "Trailer"}
		>
			<div
				className="w-full max-w-4xl cursor-default"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="mb-3 flex items-center justify-between gap-4">
					<p className="truncate text-sm font-semibold text-ink">{title}</p>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close trailer"
						className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-muted transition hover:border-accent hover:text-ink"
					>
						<svg
							viewBox="0 0 20 20"
							className="h-4 w-4"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.8"
							strokeLinecap="round"
							aria-hidden="true"
						>
							<path d="M5 5l10 10" />
							<path d="M15 5L5 15" />
						</svg>
					</button>
				</div>
				<div className="relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-black">
					<iframe
						src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0`}
						title={title || "Trailer"}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
						className="absolute inset-0 h-full w-full"
					/>
				</div>
			</div>
		</div>
	);
}
