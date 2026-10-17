import Image from "next/image";
import Link from "next/link";
import { tmdbImage, SIZES } from "@/lib/images";

function Phone({ src, className }) {
	return (
		<div
			className={`absolute w-[42%] max-w-[190px] overflow-hidden rounded-[26px] border border-line bg-black shadow-2xl ${className}`}
		>
			<div className="relative aspect-[9/19]">
				{src ? (
					<Image src={src} alt="" fill sizes="190px" className="object-cover" />
				) : (
					<div className="h-full w-full bg-surface" />
				)}
				<div className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-black/70" />
			</div>
		</div>
	);
}

/** Closing CTA banner - real posters inside CSS phone mockups. */
export default function CtaBanner({ posters }) {
	const first = tmdbImage(posters?.[0], SIZES.poster);
	const second = tmdbImage(posters?.[1], SIZES.posterLg);
	const third = tmdbImage(posters?.[2], SIZES.poster);

	return (
		<section className="page-shell">
			<div className="overflow-hidden rounded-2xl border border-line bg-elevated">
				<div className="grid gap-6 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-10 md:p-12">
					<div className="relative h-[300px] overflow-hidden md:h-[380px] md:overflow-visible">
						<Phone src={first} className="left-[12%] top-8 rotate-[-8deg]" />
						<Phone src={second} className="left-[42%] top-2 z-10 rotate-[3deg]" />
						<Phone src={third} className="left-[72%] top-12 rotate-[10deg]" />
					</div>

					<div className="px-6 pb-10 md:px-0 md:pb-0">
						<p className="mb-3 font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
							Why CINEBOXBD
						</p>
						<h2 className="font-display text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.05] text-ink">
							Stories worth the late night.
						</h2>
						<p className="mt-4 max-w-md text-sm leading-relaxed text-muted md:text-[15px]">
							Real genre rows, real ratings, and one click from the trailer, cast and runtime. Find a film in a minute, not an hour.
						</p>
						<Link
							href="/movies"
							className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-accent-hover"
						>
							Browse the catalogue
							<svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
								<path d="M7.5 4.5L13 10l-5.5 5.5.9.9 6.4-6.4-6.4-6.4z" />
							</svg>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
