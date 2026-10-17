"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

export default function MobileNav() {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();
	const buttonRef = useRef(null);
	const firstLinkRef = useRef(null);

	useEffect(() => {
		if (!open) return undefined;
		// Capture the trigger node up front so the cleanup never reads a
		// stale ref (keeps react-hooks/exhaustive-deps happy).
		const trigger = buttonRef.current;
		firstLinkRef.current?.focus();
		const onKeyDown = (event) => {
			if (event.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKeyDown);
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = previousOverflow;
			trigger?.focus();
		};
	}, [open]);

	return (
		<div className="md:hidden">
			{/* Hamburger -> X morph */}
			<button
				ref={buttonRef}
				type="button"
				onClick={() => setOpen((value) => !value)}
				aria-expanded={open}
				aria-controls="mobile-drawer"
				aria-label={open ? "Close menu" : "Open menu"}
				className={cn(
					"flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300",
					open
						? "border-accent text-ink"
						: "border-line bg-surface/70 text-muted hover:border-accent hover:text-ink",
				)}
			>
				<span className="relative flex h-4 w-4 flex-col justify-between">
					<span
						aria-hidden="true"
						className={cn(
							"h-0.5 w-full rounded-full bg-current transition-transform duration-300",
							EASE,
							open && "translate-y-[7px] rotate-45",
						)}
					/>
					<span
						aria-hidden="true"
						className={cn(
							"h-0.5 w-full rounded-full bg-current transition-all duration-200 ease-out",
							open && "scale-x-0 opacity-0",
						)}
					/>
					<span
						aria-hidden="true"
						className={cn(
							"h-0.5 w-full rounded-full bg-current transition-transform duration-300",
							EASE,
							open && "-translate-y-[7px] -rotate-45",
						)}
					/>
				</span>
			</button>

			{/* Backdrop scrim - anchored to the sticky header, viewport height */}
			<div
				aria-hidden="true"
				onClick={() => setOpen(false)}
				className={cn(
					"absolute left-0 top-0 z-10 h-dvh w-full bg-black/70 transition-opacity duration-300",
					open ? "opacity-100" : "pointer-events-none opacity-0",
				)}
			/>

			{/* Left slide-in drawer */}
			<div
				id="mobile-drawer"
				role="dialog"
				aria-modal="true"
				aria-label="Site menu"
				inert={!open}
				className={cn(
					"absolute left-0 top-0 z-20 flex h-dvh w-[82%] max-w-[320px] flex-col border-r border-line bg-elevated shadow-[10px_0_50px_rgba(0,0,0,0.55)] transition-transform duration-300",
					EASE,
					open ? "translate-x-0" : "pointer-events-none -translate-x-full",
				)}
			>
				<div className="flex items-center justify-between border-b border-line px-6 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))]">
					<span className="font-display text-base tracking-tight text-ink">
						CINEBOXBD
					</span>
					<span className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
						Menu
					</span>
				</div>

				<nav aria-label="Mobile" className="flex-1 overflow-y-auto px-6 py-4">
					<ul>
						{site.nav.map((link, index) => {
								const active =
										pathname === link.href ||
										(link.href !== "/" && pathname.startsWith(link.href));
								return (
									<li
										key={link.href}
										className={open ? "drawer-item" : undefined}
										style={{ animationDelay: `${0.05 + index * 0.07}s` }}
									>
										<Link
											ref={index === 0 ? firstLinkRef : undefined}
											href={link.href}
											onClick={() => setOpen(false)}
											aria-current={active ? "page" : undefined}
											className={cn(
																"flex items-center justify-between border-b border-line py-4 font-display text-xl tracking-tight transition-colors duration-200",
																active ? "text-accent" : "text-ink hover:text-accent",
											)}
										>
											{link.label}
											<svg
																viewBox="0 0 20 20"
																aria-hidden="true"
																className={cn(
																	"h-4 w-4 fill-current transition-all duration-300",
																	active
																		? "translate-x-0 opacity-100"
																		: "-translate-x-1 opacity-40",
																)}
											>
																<path d="M7.5 4.5L13 10l-5.5 5.5.9.9 6.4-6.4-6.4-6.4z" />
											</svg>
										</Link>
									</li>
								);
						})}
					</ul>
				</nav>

				<div
					className={cn(
						"border-t border-line px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4",
						open && "drawer-item",
					)}
					style={{ animationDelay: "0.26s" }}
				>
					<p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
						Watch something good tonight.
					</p>
				</div>
			</div>
		</div>
	);
}
