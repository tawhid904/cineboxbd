"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CertBadge from "@/components/media/CertBadge";
import RatingStars from "@/components/media/RatingStars";
import TrailerModal from "@/components/detail/TrailerModal";
import { tmdbImage, SIZES } from "@/lib/images";
import { formatRuntime, metaLine } from "@/lib/format";

const SLIDE_MS = 9000;

export default function NowWatchingHero({ slides }) {
	const [index, setIndex] = useState(0);
	const [trailerKey, setTrailerKey] = useState(null);

	useEffect(() => {
		if (slides.length < 2) return undefined;
		const timer = setTimeout(
			() => setIndex((current) => (current + 1) % slides.length),
			SLIDE_MS,
		);
		return () => clearTimeout(timer);
	}, [index, slides.length]);

	if (!slides?.length) return null;
	const active = slides[index];
	if (!active) return null;

	const meta = metaLine([
		active.year,
		active.mediaType === "tv" && active.seasons
			? `${active.seasons} season${active.seasons > 1 ? "s" : ""}`
			: null,
		active.runtime ? formatRuntime(active.runtime) : null,
	]);
	const hasTrailer = Boolean(active.trailerKey);

	return (
		<section
			aria-label="Now watching"
			className="relative -mt-16 h-[clamp(560px,90vh,860px)] w-full overflow-hidden"
		>
			{/* Backdrop rotation — images are mounted only for the active slide
			    and its immediate neighbours (circular distance). Keeps crossfades
			    smooth, avoids downloading every w1280 backdrop up front, and
			    prevents dev-only "100vw" size warnings from full-width images that
			    get unmounted mid-load during client-side navigation. */}
			<div className="absolute inset-0" aria-hidden="true">
				{slides.map((slide, slideIndex) => {
					const src = tmdbImage(slide.backdropPath, SIZES.backdropLg);
					if (!src) return null;
					const offset = Math.abs(slideIndex - index);
					const distance = Math.min(offset, slides.length - offset);
					return (
						<div
							key={`${slide.mediaType}-${slide.id}`}
							className={`absolute inset-0 transition-opacity duration-700 ${
								slideIndex === index ? "opacity-100" : "opacity-0"
							}`}
						>
							{distance <= 1 ? (
								<Image
									src={src}
									alt=""
									fill
									priority={slideIndex === index}
									sizes="100vw"
									className="object-cover"
								/>
							) : null}
						</div>
					);
				})}
				<div className="scrim-hero absolute inset-0" />
			</div>

			{/* Content */}
			<div className="page-shell relative flex h-full flex-col justify-end pb-7 pt-24">
				<div key={active.id} className="max-w-2xl animate-fade-up">
					<p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
						Now watching
					</p>
					<div className="mb-3 flex flex-wrap items-center gap-3">
						<CertBadge cert={active.cert} />
						{meta ? (
							<span className="font-mono text-xs text-muted">{meta}</span>
						) : null}
						<RatingStars value={active.voteAverage} />
					</div>
					<h1 className="font-display text-[clamp(2.1rem,5.5vw,4.25rem)] leading-[0.95] tracking-tight text-ink">
						{active.title}
					</h1>
					<p className="mt-4 line-clamp-3 max-w-xl text-sm leading-relaxed text-muted md:text-[15px]">
						{active.overview || "No synopsis available."}
					</p>
					<div className="mt-6 flex flex-wrap items-center gap-3">
						{hasTrailer ? (
							<button
								type="button"
								onClick={() => setTrailerKey(active.trailerKey)}
								className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
							>
								<svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
									<path d="M6 4.5l10 5.5-10 5.5z" />
								</svg>
								Watch trailer
							</button>
						) : null}
						<Link
							href={`/${active.mediaType}/${active.id}`}
							className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-6 py-3 text-sm font-semibold text-ink backdrop-blur-sm transition hover:border-accent"
						>
							More info
						</Link>
					</div>
				</div>

				{/* Player-style control bar */}
				<div className="mt-8 flex items-center gap-4">
					<button
						type="button"
						onClick={() => active.trailerKey && setTrailerKey(active.trailerKey)}
						aria-label={hasTrailer ? "Play trailer" : "Trailer unavailable"}
						disabled={!hasTrailer}
						className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white backdrop-blur-sm transition enabled:hover:border-accent enabled:hover:text-accent disabled:opacity-40"
					>
						<svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
							<path d="M6.5 4.5l9 5.5-9 5.5z" />
						</svg>
					</button>
					<div className="flex min-w-0 flex-1 gap-1.5" aria-hidden="true">
						{slides.map((slide, slideIndex) => (
							<div
								key={`segment-${slide.mediaType}-${slide.id}`}
								className="h-[3px] min-w-0 flex-1 overflow-hidden rounded-full bg-white/20"
							>
								<div
									className={`h-full origin-left rounded-full bg-accent ${
										slideIndex < index ? "w-full" : "w-0"
									}`}
									style={
										slideIndex === index
											? {
													animation: `hero-progress ${SLIDE_MS}ms linear forwards`,
												}
											: undefined
									}
								/>
							</div>
						))}
					</div>
					<span className="shrink-0 font-mono text-[11px] tracking-wider text-muted">
						{String(index + 1).padStart(2, "0")} /{" "}
						{String(slides.length).padStart(2, "0")}
					</span>
				</div>
			</div>

			{trailerKey ? (
				<TrailerModal
					videoKey={trailerKey}
					title={`Trailer · ${active.title}`}
					onClose={() => setTrailerKey(null)}
				/>
			) : null}
		</section>
	);
}
