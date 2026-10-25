"use client";

import Skeleton from "react-loading-skeleton";

export default function MovieCardSkeleton({ count = 1, variant = "poster" }) {
	return Array.from({ length: count }).map((_, i) => {
		if (variant === "card" || variant === "backdrop") {
			return (
				<article
					key={i}
					className="w-64.5 shrink-0 snap-start sm:w-75 lg:w-83.5 flex flex-col"
				>
					<div className="relative aspect-video w-full overflow-hidden rounded-xl bg-surface ring-1 ring-white/5">
						<Skeleton
							height="100%"
							width="100%"
							borderRadius="0.75rem"
							containerClassName="w-full h-full block"
						/>
					</div>
					<div className="mt-3 flex items-start justify-between gap-3">
						<Skeleton height={16} width="70%" borderRadius="0.25rem" />
						<Skeleton width={45} height={14} borderRadius="0.25rem" />
					</div>
					<div className="mt-1">
						<Skeleton height={12} width="42%" borderRadius="0.25rem" />
					</div>
				</article>
			);
		}

		// Default: "poster" for grid pages (/movies, /tv, /trending)
		return (
			<article key={i} className="w-full flex flex-col">
				<div className="relative aspect-2/3 w-full overflow-hidden rounded-lg bg-surface ring-1 ring-white/5">
					<Skeleton
						height="100%"
						width="100%"
						borderRadius="0.5rem"
						containerClassName="w-full h-full block"
					/>
				</div>
				<div className="mt-2.5 space-y-1.5">
					<Skeleton height={15} width="82%" borderRadius="0.25rem" />
					<Skeleton height={11} width="48%" borderRadius="0.25rem" />
				</div>
			</article>
		);
	});
}
