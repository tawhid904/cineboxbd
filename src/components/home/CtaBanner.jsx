import Link from "next/link";

const features = [
	{
		title: "Curated Collections",
		description:
			"Authentic genre rows, real community ratings, and expertly handpicked films. Discover something genuine in a minute, not an hour.",
		icon: (
			<svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
				<rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
				<line x1="7" y1="2" x2="7" y2="22" />
				<line x1="17" y1="2" x2="17" y2="22" />
				<line x1="2" y1="12" x2="22" y2="12" />
				<line x1="2" y1="7" x2="7" y2="7" />
				<line x1="2" y1="17" x2="7" y2="17" />
				<line x1="17" y1="17" x2="22" y2="17" />
				<line x1="17" y1="7" x2="22" y2="7" />
			</svg>
		),
	},
	{
		title: "Instant Trailers & Cast",
		description:
			"One click to watch official HD trailers, view complete cast & crew filmographies, and check authentic certifications and runtimes.",
		icon: (
			<svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
				<polygon points="5 3 19 12 5 21 5 3" />
			</svg>
		),
	},
	{
		title: "Streaming in Bangladesh",
		description:
			"Track real-time streaming availability in Bangladesh and worldwide across Netflix, Prime Video, Apple TV+, and regional platforms.",
		icon: (
			<svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
				<circle cx="12" cy="12" r="10" />
				<line x1="2" y1="12" x2="22" y2="12" />
				<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
			</svg>
		),
	},
];

/**
 * "Why CINEBOXBD" — Asymmetric cinematic layout with feature list and CTA bar.
 */
export default function CtaBanner() {
	return (
		<section className="page-shell py-12 md:py-16">
			{/* Asymmetric 2-column layout */}
			<div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
				{/* Left column: Confident statement */}
				<div className="md:col-span-5 space-y-4">
					<h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
						Why CINEBOXBD
					</h2>
					<p className="text-xl md:text-2xl font-medium text-white/90 leading-snug">
						Built for cinema lovers.
					</p>
					<p className="text-sm leading-relaxed text-white/60 max-w-md pt-1">
						A movie discovery experience built for film lovers in Bangladesh. Real ratings, meaningful genres, and instant answers.
					</p>
				</div>

				{/* Right column: Feature rows with thin vertical accent line */}
				<div className="md:col-span-7 border-l-2 border-white/10 pl-6 sm:pl-8 space-y-8 md:space-y-10">
					{features.map((feature) => (
						<div key={feature.title} className="flex items-start gap-4 sm:gap-5">
							<div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-surface text-accent">
								{feature.icon}
							</div>
							<div className="min-w-0 flex-1">
								<h3 className="text-lg font-semibold text-white">
									{feature.title}
								</h3>
								<p className="mt-1 text-sm text-white/60 leading-relaxed">
									{feature.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Call to action footer box */}
			<div className="mt-12 sm:mt-16 overflow-hidden rounded-2xl border border-line bg-elevated p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
				<div>
					<h3 className="text-xl font-bold text-ink">
						Stories worth the late night.
					</h3>
					<p className="mt-1 text-sm text-muted">
						Find your next favourite film or series in seconds.
					</p>
				</div>
				<Link
					href="/movies"
					className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover whitespace-nowrap truncate min-w-0 max-w-full"
				>
					<span className="whitespace-nowrap truncate">Browse the catalogue</span>
					<svg viewBox="0 0 20 20" className="h-4 w-4 fill-current shrink-0" aria-hidden="true">
						<path d="M7.5 4.5L13 10l-5.5 5.5.9.9 6.4-6.4-6.4-6.4z" />
					</svg>
				</Link>
			</div>
		</section>
	);
}
