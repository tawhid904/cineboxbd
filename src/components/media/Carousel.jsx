"use client";

import { useRef } from "react";
import Link from "next/link";
import MediaCard from "./MediaCard";
import ContinueCard from "./ContinueCard";
import MovieCardSkeleton from "@/components/ui/skeletons/MovieCardSkeleton";
import { cn } from "@/lib/cn";

function ControlButton({ dir, label, onClick }) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-muted transition hover:border-accent hover:text-ink"
		>
			<svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
				{dir === "prev" ? (
					<path d="M12.5 4.5L7 10l5.5 5.5-.9.9L5.2 10l6.4-6.4z" />
				) : (
					<path d="M7.5 4.5L13 10l-5.5 5.5.9.9 6.4-6.4-6.4-6.4z" />
				)}
			</svg>
		</button>
	);
}

/**
 * Horizontally scrolling media row with prev/next controls.
 * `items` must be plain serializable card view models.
 */
export default function Carousel({
	title,
	sub,
	items,
	variant = "card",
	viewAllHref,
	viewAllLabel = "See all",
	ariaLabel,
	className,
	id,
	isLoading = false,
}) {
	const scrollerRef = useRef(null);
	if (isLoading) {
		return (
			<section className={cn("page-shell cursor-loading", className)} id={id}>
				<div className="mb-4 flex items-end justify-between gap-4">
					<div className="min-w-0">
						<h2 className="text-2xl font-bold leading-tight text-ink">
							{title}
						</h2>
						{sub ? (
							<p className="mt-1.5 max-w-xl text-sm text-muted">{sub}</p>
						) : null}
					</div>
				</div>
				<div className="no-scrollbar flex gap-4 overflow-x-auto pb-1">
					<MovieCardSkeleton count={5} variant="card" />
				</div>
			</section>
		);
	}
	if (!items?.length) return null;

	const scrollByDir = (dir) => {
		const el = scrollerRef.current;
		if (!el) return;
		el.scrollBy({
			left: dir * Math.round(el.clientWidth * 0.85),
			behavior: "smooth",
		});
	};

	return (
		<section className={cn("page-shell", className)} id={id}>
			<div className="mb-4 flex items-end justify-between gap-4">
				<div className="min-w-0">
					<h2 className="text-2xl font-bold leading-tight text-ink">
						{title}
					</h2>
					{sub ? (
						<p className="mt-1.5 max-w-xl text-sm text-muted">{sub}</p>
					) : null}
				</div>
				<div className="flex shrink-0 items-center gap-3">
					{viewAllHref ? (
						<Link
							href={viewAllHref}
							className="inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-accent transition hover:text-accent-hover"
						>
							<span>{viewAllLabel}</span>
							<svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
								<path d="M7.5 4.5L13 10l-5.5 5.5.9.9 6.4-6.4-6.4-6.4z" />
							</svg>
						</Link>
					) : null}
					<div className="hidden gap-2 md:flex">
						<ControlButton
							dir="prev"
							label={`Scroll ${title} backwards`}
							onClick={() => scrollByDir(-1)}
						/>
						<ControlButton
							dir="next"
							label={`Scroll ${title} forwards`}
							onClick={() => scrollByDir(1)}
						/>
					</div>
				</div>
			</div>
			<div
				ref={scrollerRef}
				role="group"
				aria-label={ariaLabel || title}
				className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 pb-1"
			>
				{items.map((item) => (
					<div key={`${item.mediaType ?? variant}-${item.id}`} className="contents">
						{variant === "continue" ? (
							<ContinueCard item={item} />
						) : (
							<MediaCard item={item} badge={item.badge} variant={item.variant} />
						)}
					</div>
				))}
			</div>
		</section>
	);
}
