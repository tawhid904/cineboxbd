import Link from "next/link";
import { cn } from "@/lib/cn";

const MAX_PAGES = 500; // TMDB caps pagination

export default function Pagination({ page, totalPages, makeHref }) {
	const max = Math.min(totalPages || 1, MAX_PAGES);
	if (max <= 1) return null;

	const edge = "pointer-events-none opacity-35";
	const baseCls =
		"inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-5 text-sm transition hover:border-accent hover:text-ink";

	return (
		<nav
			aria-label="Pagination"
			className="flex flex-wrap items-center justify-center gap-4 pt-12"
		>
			{page > 1 ? (
				<Link href={makeHref(page - 1)} rel="prev" className={baseCls}>
					<svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
						<path d="M12.5 4.5L7 10l5.5 5.5-.9.9L5.2 10l6.4-6.4z" />
					</svg>
					Previous
				</Link>
			) : (
				<span className={cn(baseCls, edge)} aria-disabled="true">
					Previous
				</span>
			)}

			<span className="font-mono text-xs tracking-wider text-muted">
				Page {page} / {max}
			</span>

			{page < max ? (
				<Link href={makeHref(page + 1)} rel="next" className={baseCls}>
					Next
					<svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
						<path d="M7.5 4.5L13 10l-5.5 5.5.9.9 6.4-6.4-6.4-6.4z" />
					</svg>
				</Link>
			) : (
				<span className={cn(baseCls, edge)} aria-disabled="true">
					Next
				</span>
			)}
		</nav>
	);
}
