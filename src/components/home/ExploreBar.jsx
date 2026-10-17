"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function GridIcon() {
	return (
		<svg
			viewBox="0 0 20 20"
			className="h-4 w-4"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
			aria-hidden="true"
		>
			<rect x="3" y="3" width="6" height="6" rx="1" />
			<rect x="11" y="3" width="6" height="6" rx="1" />
			<rect x="3" y="11" width="6" height="6" rx="1" />
			<rect x="11" y="11" width="6" height="6" rx="1" />
		</svg>
	);
}

function ListIcon() {
	return (
		<svg
			viewBox="0 0 20 20"
			className="h-4 w-4"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
			strokeLinecap="round"
			aria-hidden="true"
		>
			<path d="M4 5h12" />
			<path d="M4 10h12" />
			<path d="M4 15h12" />
		</svg>
	);
}

/**
 * "Explore curated for you" heading + search / genre / view toolbar.
 * All interactions navigate to real server-rendered routes.
 */
export default function ExploreBar({ genres }) {
	const router = useRouter();
	const [query, setQuery] = useState("");

	const submit = (event) => {
		event.preventDefault();
		const q = query.trim();
		router.push(q ? `/trending?q=${encodeURIComponent(q)}` : "/trending");
	};

	return (
		<section className="page-shell">
			<div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
				<div className="max-w-xl">
					<p className="mb-2 font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
						Explore
					</p>
					<h2 className="font-display text-[clamp(1.35rem,2.6vw,2rem)] leading-tight text-ink">
						Films curated for you
					</h2>
					<p className="mt-2 text-sm leading-relaxed text-muted">
						Pick by genre, search by name, or scroll until something grabs you.
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-2.5">
					<form
						onSubmit={submit}
						role="search"
						className="flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-3.5 transition focus-within:border-accent"
					>
						<svg
							viewBox="0 0 20 20"
							className="h-3.5 w-3.5 shrink-0 text-faint"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.8"
							aria-hidden="true"
						>
							<circle cx="9" cy="9" r="5.5" />
							<path d="M13.5 13.5L17 17" strokeLinecap="round" />
						</svg>
						<input
							type="search"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Search films"
							aria-label="Search films"
							className="w-28 bg-transparent text-sm text-ink outline-none placeholder:text-faint sm:w-36"
						/>
					</form>

					<label className="relative flex h-10 items-center">
						<span className="sr-only">Filter by genre</span>
						<select
							defaultValue=""
							onChange={(event) => {
								const value = event.target.value;
								router.push(
									value
										? `/movies?genre=${encodeURIComponent(value)}`
										: "/movies",
								);
							}}
							className="h-10 cursor-pointer appearance-none rounded-full border border-line bg-surface pl-4 pr-9 text-sm text-ink outline-none transition hover:border-accent"
						>
							<option value="">Genres</option>
							{genres.map((genre) => (
								<option key={genre.id} value={genre.id}>
									{genre.name}
								</option>
							))}
						</select>
						<svg
							viewBox="0 0 20 20"
							className="pointer-events-none absolute right-3.5 h-3.5 w-3.5 text-faint"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.8"
							aria-hidden="true"
						>
							<path d="M6 8l4 4 4-4" strokeLinecap="round" />
						</svg>
					</label>

					<div
						className="flex h-10 items-center gap-1 rounded-full border border-line bg-surface p-1"
						role="group"
						aria-label="View layout"
					>
						<a
							href="/movies?view=grid"
							aria-label="Grid view"
							className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-surface-hover hover:text-ink"
						>
							<GridIcon />
						</a>
						<a
							href="/movies?view=list"
							aria-label="List view"
							className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-surface-hover hover:text-ink"
						>
							<ListIcon />
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
