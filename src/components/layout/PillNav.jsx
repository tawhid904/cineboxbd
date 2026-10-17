"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";

function FilmIcon({ className }) {
	return (
		<svg
			viewBox="0 0 24 24"
			className={className}
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
		</svg>
	);
}

function TvIcon({ className }) {
	return (
		<svg
			viewBox="0 0 24 24"
			className={className}
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M21 6h-7.58l3.29-3.29L16 2l-4 4h-.03L8 2 7.29 2.71 10.59 6H3c-1.1 0-2 .89-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.11-.9-2-2-2zm0 14H3V8h18v12z" />
		</svg>
	);
}

function TrendingIcon({ className }) {
	return (
		<svg
			viewBox="0 0 24 24"
			className={className}
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M17.55 11.2c-.23-.3-.5-.58-.78-.85C15.42 9.04 14.5 7.42 14.5 5c0-.85.17-1.66.47-2.4-.95.3-1.8.84-2.5 1.56-1.57 1.62-2.3 3.96-1.74 6.22.06.24.13.48.21.72-1.3-.34-2.37-1.25-2.88-2.48-.48 1.07-.63 2.27-.41 3.47.45 2.49 2.28 4.54 4.73 5.21 3.51.97 7.02-.91 8.24-4.22.42-1.14.47-2.32.22-3.48-.38-.97-.93-1.76-1.63-2.38-.4.76-.94 1.4-1.56 1.9zm-3.05 7.3c-2.43 0-4.4-1.97-4.4-4.4 0-1.26.53-2.4 1.38-3.21.17 1.25.75 2.36 1.62 3.16.89.82 2.05 1.28 3.25 1.28.39 0 .77-.05 1.14-.14-.54 1.93-2.32 3.31-4.39 3.31z" />
		</svg>
	);
}

function getNavIcon(href) {
	if (href.startsWith("/movies")) return FilmIcon;
	if (href.startsWith("/tv")) return TvIcon;
	if (href.startsWith("/trending")) return TrendingIcon;
	return null;
}

export default function PillNav() {
	const pathname = usePathname();

	return (
		<nav
			aria-label="Primary"
			className="hidden h-9 items-center rounded-full border border-white/5 bg-white/10 backdrop-blur-md md:inline-flex"
		>
			{site.nav.map((link, index) => {
				const active =
					pathname === link.href ||
					(link.href !== "/" && pathname.startsWith(link.href));
				const Icon = getNavIcon(link.href);
				const label = link.href.startsWith("/tv") ? "TV Series" : link.label;
				const isFirst = index === 0;
				const isLast = index === site.nav.length - 1;

				return (
					<div key={link.href} className="flex h-full items-center">
						{index > 0 && (
							<span
								className="h-4 w-[1px] bg-white/20 shrink-0"
								aria-hidden="true"
							/>
						)}
						<Link
							href={link.href}
							aria-current={active ? "page" : undefined}
							className={cn(
								"flex h-full items-center gap-2 px-3.5 text-sm font-medium transition-colors duration-150",
								isFirst && "rounded-l-full",
								isLast && "rounded-r-full",
								active
									? "bg-white/20 text-white font-semibold"
									: "text-white/85 hover:bg-white/10 hover:text-white",
							)}
						>
							{Icon ? <Icon className="h-4 w-4 shrink-0 fill-current" /> : null}
							<span>{label}</span>
						</Link>
					</div>
				);
			})}
		</nav>
	);
}
