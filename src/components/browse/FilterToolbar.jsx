"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SORT_OPTIONS } from "@/config/site";

export default function FilterToolbar({ mediaType, genres, values }) {
	const router = useRouter();
	const base = mediaType === "movie" ? "/movies" : "/tv";
	const [query, setQuery] = useState(values.q ?? "");

	const go = (patch) => {
		const next = { ...values, ...patch };
		delete next.page;
		if (!next.q) delete next.q;
		if (!next.genre) delete next.genre;
		const params = new URLSearchParams(
			Object.entries(next).filter(([, value]) => value !== "" && value != null),
		);
		const qs = params.toString();
		router.push(qs ? `${base}?${qs}` : base);
	};

	const submit = (event) => {
		event.preventDefault();
		go({ q: query.trim() });
	};

	const hasFilters = Boolean(values.q || values.genre || values.view === "list");

	return (
		<div className="flex flex-wrap items-center gap-2.5">
			<form
				onSubmit={submit}
				role="search"
				className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-surface px-3.5 transition focus-within:border-accent sm:max-w-xs"
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
					placeholder={`Search ${mediaType === "movie" ? "films" : "series"}…`}
					aria-label="Search"
					className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-faint"
				/>
			</form>

			<label className="relative flex h-10 items-center">
				<span className="sr-only">Filter by genre</span>
				<select
					value={values.genre ?? ""}
					onChange={(event) => go({ genre: event.target.value })}
					className="h-10 cursor-pointer appearance-none rounded-full border border-line bg-surface pl-4 pr-9 text-sm text-ink outline-none transition hover:border-accent"
				>
					<option value="">All genres</option>
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

			<label className="relative flex h-10 items-center">
				<span className="sr-only">Sort by</span>
				<select
					value={values.sort ?? "popularity"}
					onChange={(event) => go({ sort: event.target.value })}
					className="h-10 cursor-pointer appearance-none rounded-full border border-line bg-surface pl-4 pr-9 text-sm text-ink outline-none transition hover:border-accent"
				>
					{SORT_OPTIONS.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
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
				<button
					type="button"
					onClick={() => go({ view: "grid" })}
					aria-label="Grid view"
					aria-pressed={values.view !== "list"}
					className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition ${
						values.view !== "list"
							? "bg-ink text-bg"
							: "text-muted hover:text-ink"
					}`}
				>
					<svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
						<rect x="3" y="3" width="6" height="6" rx="1" />
						<rect x="11" y="3" width="6" height="6" rx="1" />
						<rect x="3" y="11" width="6" height="6" rx="1" />
						<rect x="11" y="11" width="6" height="6" rx="1" />
					</svg>
				</button>
				<button
					type="button"
					onClick={() => go({ view: "list" })}
					aria-label="List view"
					aria-pressed={values.view === "list"}
					className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition ${
						values.view === "list"
							? "bg-ink text-bg"
							: "text-muted hover:text-ink"
					}`}
				>
					<svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
						<path d="M4 5h12" />
						<path d="M4 10h12" />
						<path d="M4 15h12" />
					</svg>
				</button>
			</div>

			{hasFilters ? (
				<button
					type="button"
					onClick={() => {
						setQuery("");
						router.push(base);
					}}
					className="h-10 cursor-pointer rounded-full px-3 text-xs text-faint underline decoration-line underline-offset-4 transition hover:text-accent hover:decoration-accent"
				>
					Clear filters
				</button>
			) : null}
		</div>
	);
}
