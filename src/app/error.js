"use client";

import Link from "next/link";

export default function Error({ error, reset }) {
	return (
		<div className="page-shell flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
			<p className="mb-3 font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
				Something went wrong
			</p>
			<h1 className="font-display text-[clamp(1.6rem,3.5vw,2.5rem)] leading-tight text-ink">
				We couldn&apos;t load this page.
			</h1>
			{error?.message ? (
				<p className="mt-3 max-w-md font-mono text-xs text-faint">{error.message}</p>
			) : (
				<p className="mt-3 max-w-md text-sm text-muted">
					The catalogue didn&apos;t respond. Try again.
				</p>
			)}
			<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
				<button
					type="button"
					onClick={reset}
					className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
				>
					Try again
				</button>
				<Link
					href="/"
					className="rounded-full border border-line bg-surface px-6 py-3 text-sm font-semibold text-ink transition hover:border-accent"
				>
					Back home
				</Link>
			</div>
		</div>
	);
}
