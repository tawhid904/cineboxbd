import Link from "next/link";

export default function NotFound() {
	return (
		<div className="page-shell flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
			<p className="font-display text-[clamp(4rem,12vw,9rem)] leading-none text-accent">
				404
			</p>
			<h1 className="mt-4 font-display text-[clamp(1.5rem,3vw,2.25rem)] text-ink">
				Page not found.
			</h1>
			<p className="mt-3 max-w-md text-sm text-muted">
				That page doesn&apos;t exist. The films do.
			</p>
			<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
				<Link
					href="/"
					className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
				>
					Back home
				</Link>
				<Link
					href="/trending"
					className="rounded-full border border-line bg-surface px-6 py-3 text-sm font-semibold text-ink transition hover:border-accent"
				>
					Browse trending
				</Link>
			</div>
		</div>
	);
}
