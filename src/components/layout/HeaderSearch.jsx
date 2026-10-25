"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function HeaderSearch() {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const inputRef = useRef(null);
	const router = useRouter();

	useEffect(() => {
		if (!open) return undefined;
		inputRef.current?.focus();

		// Prevent background scroll while overlay is open
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		document.body.classList.add("overflow-hidden");

		const onKeyDown = (event) => {
			if (event.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKeyDown);

		return () => {
			window.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = previousOverflow;
			document.body.classList.remove("overflow-hidden");
		};
	}, [open]);

	const close = () => {
		setOpen(false);
		setQuery("");
	};

	const submit = (event) => {
		event.preventDefault();
		const q = query.trim();
		if (!q) return;
		close();
		router.push(`/trending?q=${encodeURIComponent(q)}`);
	};

	return (
		<>
			{/* Search trigger button */}
			<button
				type="button"
				onClick={() => setOpen(true)}
				aria-label="Search movies and TV shows"
				className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-line bg-surface/70 text-muted transition hover:border-accent hover:text-ink"
			>
				<svg
					viewBox="0 0 20 20"
					className="h-4 w-4"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.8"
					aria-hidden="true"
				>
					<circle cx="9" cy="9" r="5.5" />
					<path d="M13.5 13.5L17 17" strokeLinecap="round" />
				</svg>
			</button>

			{/* Full-screen overlay — fixed, covers entire viewport */}
			{open ? (
				<div
					className="fixed inset-0 z-9999 w-screen h-dvh animate-fade-in bg-black/80 backdrop-blur-sm"
					style={{ position: "fixed", inset: 0, width: "100vw", height: "100dvh", zIndex: 9999 }}
				>
					{/* Backdrop click area — closes modal, crosshair cursor */}
					<div
						className="absolute inset-0 cursor-crosshair"
						onClick={close}
						aria-hidden="true"
					/>

					{/* Close button — top-right corner, always visible */}
					<button
						type="button"
						onClick={close}
						aria-label="Close search"
						className="absolute right-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-line bg-surface/80 text-muted backdrop-blur-sm transition hover:border-accent hover:text-ink"
					>
						<svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
							<path d="M4.5 4.5l11 11M15.5 4.5l-11 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
						</svg>
					</button>

					{/* Centered search form */}
					<div className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none">
						<form
							role="search"
							onSubmit={submit}
							onClick={(event) => event.stopPropagation()}
							className="relative z-10 w-full max-w-xl rounded-2xl border border-line bg-elevated p-3 shadow-2xl pointer-events-auto"
						>
							<div className="flex items-center gap-2 rounded-xl bg-surface px-3 ring-1 ring-line focus-within:ring-accent">
								<svg
									viewBox="0 0 20 20"
									className="h-4 w-4 shrink-0 text-faint"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.8"
									aria-hidden="true"
								>
									<circle cx="9" cy="9" r="5.5" />
									<path d="M13.5 13.5L17 17" strokeLinecap="round" />
								</svg>
								<input
									ref={inputRef}
									type="search"
									value={query}
									onChange={(event) => setQuery(event.target.value)}
									placeholder="Search films, series, people…"
									aria-label="Search"
									className="h-12 min-w-0 flex-1 cursor-pointer bg-transparent text-sm text-ink outline-none placeholder:text-faint"
								/>
								<kbd className="hidden shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-faint sm:block">
									Enter
								</kbd>
							</div>
							<p className="px-1 pt-2.5 text-[11px] text-faint">
								Enter to search · Esc or click outside to close.
							</p>
						</form>
					</div>
				</div>
			) : null}
		</>
	);
}
