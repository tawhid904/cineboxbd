"use client";

import BaseSkeleton from "react-loading-skeleton";
import MovieCardSkeleton from "@/components/ui/skeletons/MovieCardSkeleton";
import HeroCarouselSkeleton from "@/components/ui/skeletons/HeroCarouselSkeleton";
import MovieDetailSkeleton from "@/components/ui/skeletons/MovieDetailSkeleton";

export { default as MovieCardSkeleton } from "@/components/ui/skeletons/MovieCardSkeleton";
export { default as HeroCarouselSkeleton } from "@/components/ui/skeletons/HeroCarouselSkeleton";
export { default as MovieDetailSkeleton } from "@/components/ui/skeletons/MovieDetailSkeleton";

export function Skeleton(props) {
	return <BaseSkeleton {...props} />;
}

export function CardSkeleton({ count = 1, variant = "poster" }) {
	return <MovieCardSkeleton count={count} variant={variant} />;
}

export function RowSkeleton() {
	return (
		<div className="no-scrollbar flex gap-4 overflow-hidden cursor-loading pb-1">
			<MovieCardSkeleton count={5} variant="card" />
		</div>
	);
}

export function BrowseSkeleton() {
	return (
		<div className="page-shell cursor-loading py-10 md:py-14">
			<header className="mb-8 max-w-2xl">
				<div className="mb-2">
					<BaseSkeleton width={70} height={13} borderRadius="0.25rem" />
				</div>
				<BaseSkeleton height={42} width={260} borderRadius="0.5rem" />
				<div className="mt-2">
					<BaseSkeleton
						height={16}
						width={380}
						borderRadius="0.25rem"
						className="max-w-full"
					/>
				</div>
			</header>

			{/* Filter toolbar skeleton */}
			<div className="mb-8 flex flex-wrap items-center justify-between gap-4">
				<div className="flex flex-wrap items-center gap-2.5">
					<BaseSkeleton width={200} height={40} borderRadius="9999px" />
					<BaseSkeleton width={110} height={40} borderRadius="9999px" />
					<BaseSkeleton width={130} height={40} borderRadius="9999px" />
					<BaseSkeleton width={80} height={40} borderRadius="9999px" />
				</div>
				<BaseSkeleton width={70} height={16} borderRadius="0.25rem" />
			</div>

			{/* Poster Grid */}
			<div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-5">
				<MovieCardSkeleton count={10} variant="poster" />
			</div>
		</div>
	);
}

export function HeroSkeleton() {
	return <HeroCarouselSkeleton />;
}

export function DetailSkeleton() {
	return <MovieDetailSkeleton />;
}
