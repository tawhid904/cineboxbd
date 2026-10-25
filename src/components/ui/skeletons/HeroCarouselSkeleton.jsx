"use client";

import Skeleton from "react-loading-skeleton";

export default function HeroCarouselSkeleton() {
	return (
		<section
			aria-label="Loading featured showcase"
			className="relative w-full overflow-hidden flex flex-col justify-between py-2 md:py-6 md:h-[70vh] md:max-h-150 select-none bg-[#0a0a0b] cursor-loading"
		>
			{/* Mobile Skeleton (< md) */}
			<div className="block md:hidden w-full overflow-hidden px-[7.5vw] py-1">
				<div className="flex gap-4 items-center">
					{/* Center active card */}
					<div className="w-[85vw] h-[58vw] min-h-[260px] max-h-[360px] shrink-0 rounded-3xl overflow-hidden ring-1 ring-white/10 shadow-2xl bg-surface">
						<Skeleton
							height="100%"
							width="100%"
							borderRadius="1.5rem"
							containerClassName="w-full h-full block"
						/>
					</div>
					{/* Right peek placeholder */}
					<div className="w-[85vw] h-[58vw] min-h-[260px] max-h-[360px] shrink-0 rounded-3xl overflow-hidden opacity-30 scale-95 bg-surface">
						<Skeleton
							height="100%"
							width="100%"
							borderRadius="1.5rem"
							containerClassName="w-full h-full block"
						/>
					</div>
				</div>
			</div>

			{/* Desktop Skeleton (md:flex) */}
			<div className="hidden md:flex relative flex-1 items-center justify-center w-full px-4 overflow-hidden">
				<div className="relative flex items-center justify-center w-full max-w-[1920px] h-full py-2 gap-4">
					{/* Left partial card */}
					<div className="w-70 aspect-21/11 rounded-2xl overflow-hidden opacity-40 scale-95 ring-1 ring-white/10 bg-surface">
						<Skeleton
							height="100%"
							width="100%"
							borderRadius="1rem"
							containerClassName="w-full h-full block"
						/>
					</div>
					{/* Center main card */}
					<div className="w-full md:w-195 md:max-w-195 aspect-16/10 sm:aspect-video md:aspect-21/11 max-h-110 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/15 bg-surface">
						<Skeleton
							height="100%"
							width="100%"
							borderRadius="1rem"
							containerClassName="w-full h-full block"
						/>
					</div>
					{/* Right partial card */}
					<div className="w-70 aspect-21/11 rounded-2xl overflow-hidden opacity-40 scale-95 ring-1 ring-white/10 bg-surface">
						<Skeleton
							height="100%"
							width="100%"
							borderRadius="1rem"
							containerClassName="w-full h-full block"
						/>
					</div>
				</div>
			</div>

			{/* Indicator dots placeholder */}
			<div className="relative z-30 flex flex-col items-center justify-center mt-3 pb-2">
				<div className="flex items-center justify-center gap-1.5">
					<Skeleton width={24} height={6} borderRadius="9999px" />
					<Skeleton width={6} height={6} borderRadius="9999px" />
					<Skeleton width={6} height={6} borderRadius="9999px" />
				</div>
				<div className="mt-1.5">
					<Skeleton width={80} height={10} borderRadius="0.25rem" />
				</div>
			</div>
		</section>
	);
}
