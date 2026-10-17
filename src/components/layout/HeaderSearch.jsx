"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function HeaderSearch() {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const inputRef = useRef(null);
	const router = useRouter();

	useEffect(() => {
		if (!open) return;
		inputRef.current?.focus();
		const onKeyDown = (event) => {
			if (event.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [open]);

	const submit = (event) => {
		event.preventDefault();
		const q = query.trim();
		if (!q) return;
		setOpen(false);
		router.push(`/search?q=${encodeURIComponent(q)}`);
	};

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				aria-label="Search movies and TV shows"
				className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface/70 text-muted transition hover:border-accent hover:text-ink"
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

			{open ? (
				<div
					className="absolute inset-x-0 top-0 z-40 flex h-dvh animate-fade-in items-start justify-center bg-black/70 px-4 pt-[14vh] backdrop-blur-sm"
					onClick={() => setOpen(false)}
				>
						<form
							role="search"
							onSubmit={submit}
							onClick={(event) => event.stopPropagation()}
							className="w-full max-w-xl rounded-2xl border border-line bg-elevated p-3 shadow-2xl"
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
										className="h-12 min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-faint"
									/>
									<kbd className="hidden shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-faint sm:block">
										Enter
									</kbd>
								</div>
								<p className="px-1 pt-2.5 text-[11px] text-faint">
									Search films, series and people — press Esc to close.
								</p>
						</form>
				</div>
			) : null}
		</>
	);
}
