"use client";

import Skeleton from "react-loading-skeleton";

export default function MovieDetailSkeleton() {
	return (
		<div aria-busy="true" aria-label="Loading details" className="cursor-loading">
			{/* Detail Hero Section */}
			<section className="relative">
				<div
					className="absolute inset-x-0 top-0 h-[clamp(340px,52vh,540px)] bg-surface/50"
					aria-hidden="true"
				>
					<div className="scrim-hero absolute inset-0" />
				</div>

				<div className="page-shell relative pb-12 pt-10 md:pt-16">
					<div className="flex flex-col gap-7 md:flex-row md:items-end md:gap-9">
						{/* Poster */}
						<div className="w-36 md:w-52 aspect-2/3 shrink-0 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-surface">
							<Skeleton
								height="100%"
								width="100%"
								borderRadius="0.75rem"
								containerClassName="w-full h-full block"
							/>
						</div>

						{/* Info Column */}
						<div className="min-w-0 max-w-2xl flex-1">
							{/* Meta pills / cert badge row */}
							<div className="mb-3 flex flex-wrap items-center gap-3">
								<Skeleton width={38} height={22} borderRadius="0.25rem" />
								<Skeleton width={180} height={16} borderRadius="0.25rem" />
								<Skeleton width={80} height={16} borderRadius="0.25rem" />
							</div>

							{/* Title */}
							<div className="max-w-lg space-y-2">
								<Skeleton height={42} width="88%" borderRadius="0.5rem" />
								<Skeleton height={16} width="45%" borderRadius="0.25rem" />
							</div>

							{/* Genre pills */}
							<div className="mt-4 flex flex-wrap gap-2">
								<Skeleton width={70} height={28} borderRadius="9999px" />
								<Skeleton width={85} height={28} borderRadius="9999px" />
								<Skeleton width={65} height={28} borderRadius="9999px" />
							</div>

							{/* Overview */}
							<div className="mt-4 max-w-xl space-y-2">
								<Skeleton height={14} width="100%" borderRadius="0.25rem" />
								<Skeleton height={14} width="96%" borderRadius="0.25rem" />
								<Skeleton height={14} width="72%" borderRadius="0.25rem" />
							</div>

							{/* Action buttons (Watch + Watch Trailer) */}
							<div className="mt-6 flex flex-wrap items-center gap-3">
								<Skeleton width={118} height={46} borderRadius="9999px" />
								<Skeleton width={148} height={46} borderRadius="9999px" />
								<Skeleton
									width={140}
									height={16}
									borderRadius="0.25rem"
									className="hidden sm:inline-block ml-2"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Lower Sections */}
			<div className="page-shell space-y-14 pb-24 pt-10 md:pt-14">
				{/* Details Facts Section */}
				<section>
					<h2 className="mb-6 font-display text-[clamp(1.3rem,2.4vw,1.9rem)] text-ink">
						Details
					</h2>
					<div className="grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className="border-b border-line pb-3 space-y-1.5">
								<Skeleton width={80} height={11} borderRadius="0.25rem" />
								<Skeleton width={130} height={16} borderRadius="0.25rem" />
							</div>
						))}
					</div>
				</section>

				{/* Top Cast Section */}
				<section>
					<h2 className="mb-6 font-display text-[clamp(1.3rem,2.4vw,1.9rem)] text-ink">
						Top cast
					</h2>
					<div className="no-scrollbar flex gap-4 overflow-hidden">
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className="w-[130px] shrink-0 sm:w-[150px] space-y-2">
								<div className="aspect-2/3 w-full rounded-lg overflow-hidden bg-surface ring-1 ring-white/5">
									<Skeleton
										height="100%"
										width="100%"
										borderRadius="0.5rem"
										containerClassName="w-full h-full block"
									/>
								</div>
								<Skeleton width={105} height={14} borderRadius="0.25rem" />
								<Skeleton width={75} height={12} borderRadius="0.25rem" />
							</div>
						))}
					</div>
				</section>

				{/* More Like This (Recommendations) Section */}
				<section>
					<div className="mb-4">
						<h2 className="text-2xl font-bold leading-tight text-ink">
							More like this
						</h2>
						<p className="mt-1.5 text-sm text-muted">Similar titles you might enjoy.</p>
					</div>
					<div className="no-scrollbar flex gap-4 overflow-hidden">
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className="w-64.5 shrink-0 sm:w-75 lg:w-83.5 space-y-3">
								<div className="aspect-video w-full rounded-xl overflow-hidden bg-surface ring-1 ring-white/5">
									<Skeleton
										height="100%"
										width="100%"
										borderRadius="0.75rem"
										containerClassName="w-full h-full block"
									/>
								</div>
								<div className="flex justify-between items-center">
									<Skeleton width="65%" height={16} borderRadius="0.25rem" />
									<Skeleton width={45} height={14} borderRadius="0.25rem" />
								</div>
								<Skeleton width="40%" height={12} borderRadius="0.25rem" />
							</div>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}
