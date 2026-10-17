"use client";

import { useRef } from "react";
import Link from "next/link";
import MediaCard from "./MediaCard";
import ContinueCard from "./ContinueCard";
import { cn } from "@/lib/cn";

function ControlButton({ dir, label, onClick }) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-muted transition hover:border-accent hover:text-ink"
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
	viewAllLabel = "View all",
	ariaLabel,
	className,
	id,
}) {
	const scrollerRef = useRef(null);
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
			<div className="mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
				<div className="min-w-0">
					<h2 className="font-display text-[clamp(1.3rem,2.4vw,1.9rem)] leading-tight text-ink">
						{title}
					</h2>
					{sub ? (
						<p className="mt-1.5 max-w-xl text-sm text-muted">{sub}</p>
					) : null}
				</div>
				<div className="flex items-center gap-2">
					{viewAllHref ? (
						<Link
							href={viewAllHref}
							className="mr-1 hidden text-sm text-muted underline decoration-line underline-offset-4 transition hover:text-ink hover:decoration-accent sm:inline"
						>
							{viewAllLabel}
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
							<MediaCard item={item} />
						)}
					</div>
				))}
			</div>
		</section>
	);
}
