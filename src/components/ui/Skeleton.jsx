import { cn } from "@/lib/cn";

export function Skeleton({ className }) {
	return (
		<div
			className={cn("animate-pulse rounded-lg bg-surface", className)}
			aria-hidden="true"
		/>
	);
}

export function CardSkeleton({ variant = "card" }) {
	if (variant === "poster") {
		return (
			<div className="space-y-2">
				<Skeleton className="aspect-[2/3] w-full rounded-lg" />
				<Skeleton className="h-4 w-3/4" />
				<Skeleton className="h-3 w-1/2" />
			</div>
		);
	}
	return (
		<div className="w-[260px] shrink-0 space-y-2 sm:w-[300px] lg:w-[336px]">
			<Skeleton className="aspect-video w-full rounded-xl" />
			<Skeleton className="h-4 w-2/3" />
			<Skeleton className="h-3 w-1/2" />
		</div>
	);
}

export function RowSkeleton() {
	return (
		<div className="no-scrollbar flex gap-4 overflow-hidden">
			{Array.from({ length: 5 }, (_, i) => (
				<CardSkeleton key={i} />
			))}
		</div>
	);
}

export function BrowseSkeleton() {
	return (
		<div className="page-shell py-14">
			<div className="mb-8 space-y-3">
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-9 w-72" />
				<Skeleton className="h-4 w-96 max-w-full" />
			</div>
			<div className="mb-8 flex gap-3">
				<Skeleton className="h-10 w-56 rounded-full" />
				<Skeleton className="h-10 w-36 rounded-full" />
				<Skeleton className="h-10 w-36 rounded-full" />
			</div>
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				{Array.from({ length: 10 }, (_, i) => (
					<CardSkeleton key={i} variant="poster" />
				))}
			</div>
		</div>
	);
}

export function HeroSkeleton() {
	return (
		<div className="relative h-[clamp(480px,80vh,760px)] w-full bg-surface">
			<div className="absolute inset-0 scrim-hero" />
			<div className="page-shell relative flex h-full flex-col justify-end pb-16">
				<div className="max-w-2xl space-y-4">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-14 w-3/4" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-5/6" />
					<div className="flex gap-3 pt-2">
						<Skeleton className="h-11 w-40 rounded-full" />
						<Skeleton className="h-11 w-32 rounded-full" />
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Detail-page placeholder shown instantly while `params`-driven content
 * streams in behind a Suspense boundary (instant-shell requirement).
 * Mirrors the real layout so the swap doesn't shift the page.
 */
export function DetailSkeleton() {
	return (
		<div aria-busy="true" aria-label="Loading details">
			<section className="relative">
				<div
					className="absolute inset-x-0 top-0 h-[clamp(340px,52vh,540px)] bg-surface"
					aria-hidden="true"
				>
					<div className="scrim-hero absolute inset-0" />
				</div>
				<div className="page-shell relative pb-12 pt-10 md:pt-16">
					<div className="flex flex-col gap-7 md:flex-row md:items-end md:gap-9">
						<Skeleton className="aspect-[2/3] w-36 shrink-0 rounded-xl md:w-52" />
						<div className="w-full max-w-2xl space-y-4">
							<div className="flex gap-3">
								<Skeleton className="h-4 w-10" />
								<Skeleton className="h-4 w-36" />
								<Skeleton className="h-4 w-20" />
							</div>
							<Skeleton className="h-10 w-3/4 md:h-12" />
							<Skeleton className="h-4 w-1/2" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-5/6" />
							<div className="flex gap-3 pt-2">
								<Skeleton className="h-11 w-40 rounded-full" />
								<Skeleton className="h-11 w-32 rounded-full" />
							</div>
						</div>
					</div>
				</div>
			</section>

			<div className="page-shell space-y-14 pb-24 pt-10 md:pt-14">
				<div className="space-y-4">
					<Skeleton className="h-7 w-28" />
					<div className="grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: 6 }, (_, i) => (
							<div key={i} className="space-y-2 border-b border-line pb-3">
								<Skeleton className="h-3 w-24" />
								<Skeleton className="h-4 w-36" />
							</div>
						))}
					</div>
				</div>
				<div className="space-y-4">
					<Skeleton className="h-7 w-24" />
					<RowSkeleton />
				</div>
			</div>
		</div>
	);
}
