"use client";

import { useRef } from "react";
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
 * Generic horizontal scroller with heading + controls.
 * Children are arbitrary server-rendered cards (cast, posters, etc.).
 */
export default function ScrollShell({ title, children, className, ariaLabel }) {
	const scrollerRef = useRef(null);

	const scrollByDir = (dir) => {
		const el = scrollerRef.current;
		if (!el) return;
		el.scrollBy({
			left: dir * Math.round(el.clientWidth * 0.85),
			behavior: "smooth",
		});
	};

	return (
		<section className={cn("page-shell", className)}>
			<div className="mb-4 flex items-end justify-between gap-4">
				<h2 className="font-display text-[clamp(1.3rem,2.4vw,1.9rem)] leading-tight text-ink">
					{title}
				</h2>
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
			<div
				ref={scrollerRef}
				role="group"
				aria-label={ariaLabel || title}
				className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 pb-1"
			>
				{children}
			</div>
		</section>
	);
}
