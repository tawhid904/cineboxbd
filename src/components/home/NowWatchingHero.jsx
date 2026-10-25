"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import MediaBadge from "@/components/ui/MediaBadge";
import HeroCarouselSkeleton from "@/components/ui/skeletons/HeroCarouselSkeleton";

const GROUP_MS = 3000;

export default function NowWatchingHero({ groups = [], isLoading = false }) {
	const router = useRouter();
	const [groupIndex, setGroupIndex] = useState(0);
	const [movieIndex, setMovieIndex] = useState(0);
	const [paused, setPaused] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const timerRef = useRef(null);
	const touchStartXRef = useRef(null);
	const touchStartYRef = useRef(null);

	const totalGroups = groups.length;
	const activeGroup = groups[groupIndex] || groups[0];
	const movies = activeGroup?.movies || [];
	const totalMovies = movies.length;

	const goNext = useCallback(() => {
		if (totalMovies === 0) return;
		setIsTransitioning(true);
		if (movieIndex < totalMovies - 1) {
			setMovieIndex((prev) => prev + 1);
		} else {
			// Advance to next group
			setGroupIndex((prev) => (prev + 1) % totalGroups);
			setMovieIndex(0);
		}
	}, [movieIndex, totalMovies, totalGroups]);

	const goPrev = useCallback(() => {
		if (totalMovies === 0) return;
		setIsTransitioning(true);
		if (movieIndex > 0) {
			setMovieIndex((prev) => prev - 1);
		} else {
			// Go to previous group, last movie
			const prevGroupIdx = (groupIndex - 1 + totalGroups) % totalGroups;
			const prevGroupMovies = groups[prevGroupIdx]?.movies || [];
			setGroupIndex(prevGroupIdx);
			setMovieIndex(prevGroupMovies.length > 0 ? prevGroupMovies.length - 1 : 0);
		}
	}, [movieIndex, totalMovies, groupIndex, totalGroups, groups]);

	// Auto-advance every GROUP_MS ms, pause on hover/touch
	useEffect(() => {
		if (totalGroups === 0 || totalMovies === 0 || paused) return undefined;
		timerRef.current = setTimeout(goNext, GROUP_MS);
		return () => clearTimeout(timerRef.current);
	}, [groupIndex, movieIndex, paused, goNext, totalGroups, totalMovies]);

	// Safety fallback for transition state (in case image is already cached or fails)
	useEffect(() => {
		if (isTransitioning) {
			const timeout = setTimeout(() => setIsTransitioning(false), 600);
			return () => clearTimeout(timeout);
		}
	}, [isTransitioning, movieIndex, groupIndex]);

	// Touch swipe handlers for mobile
	const handleTouchStart = (e) => {
		setPaused(true);
		if (e.touches && e.touches.length > 0) {
			touchStartXRef.current = e.touches[0].clientX;
			touchStartYRef.current = e.touches[0].clientY;
		}
	};

	const handleTouchEnd = (e) => {
		setPaused(false);
		if (touchStartXRef.current === null) return;
		if (e.changedTouches && e.changedTouches.length > 0) {
			const touchEndX = e.changedTouches[0].clientX;
			const touchEndY = e.changedTouches[0].clientY;
			const diffX = touchStartXRef.current - touchEndX;
			const diffY = (touchStartYRef.current ?? touchEndY) - touchEndY;
			// Only trigger if horizontal swipe is dominant and exceeds threshold
			if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
				if (diffX > 0) {
					goNext();
				} else {
					goPrev();
				}
			}
		}
		touchStartXRef.current = null;
		touchStartYRef.current = null;
	};

	if (isLoading || !totalGroups || totalMovies === 0) {
		return <HeroCarouselSkeleton />;
	}

	const centerMovie = movies[movieIndex] || movies[0];
	const leftMovie = movies[(movieIndex - 1 + totalMovies) % totalMovies];
	const rightMovie = movies[(movieIndex + 1) % totalMovies];

	const centerBackdrop = centerMovie?.backdrop_path
		? `https://image.tmdb.org/t/p/w1280${centerMovie.backdrop_path}`
		: null;
	const leftBackdrop = leftMovie?.backdrop_path
		? `https://image.tmdb.org/t/p/w780${leftMovie.backdrop_path}`
		: null;
	const rightBackdrop = rightMovie?.backdrop_path
		? `https://image.tmdb.org/t/p/w780${rightMovie.backdrop_path}`
		: null;

	const centerTitle = centerMovie?.title || centerMovie?.name || "Untitled";
	const centerYear = (centerMovie?.release_date || centerMovie?.first_air_date || "").slice(0, 4);
	const centerVariant = centerMovie?.variant || activeGroup?.variant || "trending";

	const leftTitle = leftMovie?.title || leftMovie?.name || "";
	const leftYear = (leftMovie?.release_date || leftMovie?.first_air_date || "").slice(0, 4);
	const leftVariant = leftMovie?.variant || activeGroup?.variant || "trending";

	const rightTitle = rightMovie?.title || rightMovie?.name || "";
	const rightYear = (rightMovie?.release_date || rightMovie?.first_air_date || "").slice(0, 4);
	const rightVariant = rightMovie?.variant || activeGroup?.variant || "trending";

	const handleMovieClick = (movie) => {
		if (movie?.id) {
			const mediaType = movie?.media_type === "tv" ? "tv" : "movies";
			router.push(`/${mediaType}/${movie.id}`);
		}
	};

	return (
		<section
			aria-label="Featured showcase carousel"
			className="relative w-full overflow-hidden flex flex-col justify-between py-2 md:py-6 md:h-[74vh] md:min-h-[590px] md:max-h-[680px] select-none bg-[#0a0a0b]"
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
		>
			{/* Ambient blurred backdrop behind cards */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
				{centerBackdrop && (
					<Image
						src={centerBackdrop}
						alt=""
						fill
						priority
						sizes="100vw"
						className="object-cover blur-3xl opacity-25 scale-110 transition-opacity duration-700 ease-in-out"
					/>
				)}
				{/* Ambient radial red cinema backlight behind center card on desktop */}
				<div className="hidden md:block absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_46%,rgba(229,39,47,0.15)_0%,transparent_70%)] pointer-events-none" />
				<div className="absolute inset-0 bg-linear-to-t from-[#0a0a0b] via-transparent to-[#0a0a0b]/80" />
			</div>

			{/* Mobile Sliding Carousel Track (< md) */}
			<div className="block md:hidden w-full overflow-hidden px-[8vw] pt-1 pb-2">
				<div
					className="flex gap-3.5 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
					style={{
						transform: `translateX(calc(-${movieIndex} * (84vw + 14px)))`,
					}}
				>
					{movies.map((movie, idx) => {
						const isActive = idx === movieIndex;
						const backdrop = movie.backdrop_path
							? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
							: null;
						const title = movie.title || movie.name || "Untitled";
						const year = (movie.release_date || movie.first_air_date || "").slice(0, 4);
						const variant = movie.variant || activeGroup?.variant || "trending";

						return (
							<div
								key={`${movie.id}-${idx}`}
								onClick={() => {
									if (isActive) {
										handleMovieClick(movie);
									} else {
										setMovieIndex(idx);
									}
								}}
								role="button"
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										if (isActive) handleMovieClick(movie);
										else {
											setMovieIndex(idx);
										}
									}
								}}
								aria-label={`View details for ${title}`}
								className={`group relative w-[84vw] h-[310px] sm:h-[340px] shrink-0 rounded-2xl overflow-hidden cursor-pointer select-none bg-surface/90 border border-white/10 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
									isActive
										? "opacity-100 scale-100 ring-1 ring-white/25 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.9),0_0_25px_rgba(255,255,255,0.06)] z-10"
										: "opacity-35 scale-[0.93] brightness-75 hover:opacity-60 z-0"
								}`}
							>
								{backdrop ? (
									<Image
										src={backdrop}
										alt={title}
										fill
										sizes="(max-width: 768px) 84vw, 400px"
										priority={isActive}
										className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
									/>
								) : null}

								{/* Top vignette gradient for badge contrast */}
								<div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/85 via-black/30 to-transparent z-10 pointer-events-none" />

								{/* Bottom dramatic cinema gradient for typography & buttons */}
								<div className="absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-black via-black/80 to-transparent z-10 pointer-events-none" />

								{/* Ultra-fine glass inner rim */}
								<div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/15 pointer-events-none z-15" />

								{/* MediaBadge chip: top-left */}
								<div className="absolute top-3.5 left-3.5 z-20">
									<MediaBadge variant={variant} />
								</div>

								{/* Top-right badges */}
								<div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5">
									{movie.vote_average ? (
										<div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 text-[10px] font-bold text-amber-400 shadow-md">
											<svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 shrink-0">
												<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
											</svg>
											<span>{movie.vote_average}</span>
										</div>
									) : null}
									<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-semibold text-white/90 shadow-md">
										<span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
										<span>HD</span>
									</div>
								</div>

								{/* Card content (bottom) */}
								<div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end pointer-events-none z-20">
									<h2 className="text-xl sm:text-2xl font-black text-white leading-tight line-clamp-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
										{title}
									</h2>

									<div className="mt-2.5 flex items-center justify-between gap-2">
										<div className="flex flex-wrap items-center gap-1.5 min-w-0">
											{year && (
												<span className="font-mono text-[11px] font-bold text-white/90 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
													{year}
												</span>
											)}
											{movie.genres?.slice(0, 2).map((genre) => (
												<span
													key={genre}
													className="text-[10px] font-medium bg-white/10 backdrop-blur-md text-white/80 px-2 py-0.5 rounded-full border border-white/10 whitespace-nowrap truncate max-w-24"
												>
													{genre}
												</span>
											))}
										</div>

										{/* Interactive 'Watch' CTA pill */}
										<div className="pointer-events-auto flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-transform active:scale-95 whitespace-nowrap truncate min-w-0">
											<svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
												<path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
											</svg>
											<span className="whitespace-nowrap truncate">Watch</span>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{/* Mobile Movie Progress Dots */}
				<div className="flex items-center justify-center gap-1.5 mt-3">
					{movies.map((_, i) => {
						const isCurrent = i === movieIndex;
						return (
							<button
								key={i}
								type="button"
								aria-label={`Go to slide ${i + 1}`}
								onClick={() => setMovieIndex(i)}
								className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
									isCurrent
										? "w-6 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
										: "w-2 bg-white/35 hover:bg-white/60"
								}`}
							/>
						);
					})}
				</div>

				{/* Mobile Group Pill Switcher */}
				<div className="flex items-center justify-center mt-2.5 px-3 max-w-full">
					<div className="inline-flex items-center gap-1 p-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-inner max-w-full overflow-hidden">
						{groups.map((group, idx) => {
							const isActive = idx === groupIndex;
							return (
								<button
									key={group.label}
									type="button"
									onClick={() => {
										clearTimeout(timerRef.current);
										setGroupIndex(idx);
										setMovieIndex(0);
									}}
									className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap truncate min-w-0 max-w-full ${
										isActive
											? "bg-white text-black shadow-md scale-102"
											: "text-white/50 hover:text-white/80"
									}`}
								>
									<span className="whitespace-nowrap truncate block">{group.label}</span>
								</button>
							);
						})}
					</div>
				</div>
			</div>

			{/* Subtle dark vignettes on left & right edges to fade side cards on desktop */}
			<div className="hidden md:block absolute left-0 top-0 bottom-0 w-36 bg-linear-to-r from-[#0a0a0b] via-[#0a0a0b]/80 to-transparent pointer-events-none z-25" />
			<div className="hidden md:block absolute right-0 top-0 bottom-0 w-36 bg-linear-to-l from-[#0a0a0b] via-[#0a0a0b]/80 to-transparent pointer-events-none z-25" />

			{/* Desktop 3-Card Stage (md:flex) */}
			<div className="hidden md:flex relative flex-1 items-center justify-center w-full px-6 lg:px-12 overflow-hidden">
				<div className="relative flex items-center justify-center w-full max-w-[1920px] h-full py-2">
					{/* Left card */}
					{leftMovie && (
						<div
							onClick={goPrev}
							aria-label={`Previous movie: ${leftTitle}`}
							className="absolute right-[calc(50%+min(35vw,420px)+16px)] top-1/2 -translate-y-1/2 z-10 w-64 lg:w-76 xl:w-84 aspect-21/11 rounded-2xl overflow-hidden opacity-45 scale-95 transition-all duration-500 ease-out cursor-pointer hover:opacity-85 hover:scale-100 ring-1 ring-white/10 hover:ring-white/30 shadow-2xl bg-surface group"
						>
							{leftBackdrop ? (
								<Image
									src={leftBackdrop}
									alt={leftTitle}
									fill
									sizes="340px"
									className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
								/>
							) : null}
							<div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/45 to-transparent" />
							<div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/15 pointer-events-none" />
							<div className="absolute top-3 left-3 z-10">
								<MediaBadge variant={leftVariant} />
							</div>
							<div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-semibold text-white/90">
								<span className="w-1.5 h-1.5 rounded-full bg-red-500" />
								<span>HD</span>
							</div>
							<div className="absolute bottom-3 left-3.5 right-3.5 z-10">
								<p className="text-xs lg:text-sm font-bold text-white leading-snug line-clamp-1 drop-shadow-md">
									{leftTitle}
								</p>
								{leftYear && (
									<p className="font-mono text-[10px] text-white/70 mt-0.5">
										{leftYear}
									</p>
								)}
							</div>
						</div>
					)}

					{/* Center card */}
					<div
						onClick={() => handleMovieClick(centerMovie)}
						role="button"
						tabIndex={0}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") handleMovieClick(centerMovie);
						}}
						aria-label={`View details for ${centerTitle}`}
						className="relative z-20 w-full md:w-[700px] lg:w-[820px] xl:w-[920px] aspect-[16/9] md:aspect-[2.1/1] max-h-[460px] rounded-3xl overflow-hidden shadow-[0_25px_60px_-12px_rgba(0,0,0,0.95),0_0_45px_rgba(229,39,47,0.18)] ring-1 ring-inset ring-white/20 border border-white/10 cursor-pointer scale-100 opacity-100 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group bg-surface"
					>
						{centerBackdrop ? (
							<Image
								src={centerBackdrop}
								alt={centerTitle}
								fill
								priority
								onLoad={() => setIsTransitioning(false)}
								sizes="(min-width: 1024px) 920px, 100vw"
								className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
							/>
						) : null}

						{/* Top vignette gradient for badge legibility */}
						<div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/90 via-black/35 to-transparent z-10 pointer-events-none" />

						{/* Deep cinema gradient from bottom for typography & CTA */}
						<div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-black via-black/85 to-transparent z-10 pointer-events-none" />

						{/* Ultra-fine glass inner rim */}
						<div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/15 pointer-events-none z-15" />

						{/* Top-left: MediaBadge chip */}
						<div className="absolute top-4 left-4 lg:top-5 lg:left-5 z-20">
							<MediaBadge variant={centerVariant} />
						</div>

						{/* Top-right: HD quality pill + optional rating badge */}
						<div className="absolute top-4 right-4 lg:top-5 lg:right-5 z-20 flex items-center gap-2">
							{centerMovie?.vote_average ? (
								<div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-400 font-bold text-xs shadow-md">
									<svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
									<span>{centerMovie.vote_average}</span>
								</div>
							) : null}

							<div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-bold text-white/90 shadow-md">
								<span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
								<span>HD · 4K</span>
							</div>
						</div>

						{/* Overlaid content at bottom — Typography, genres, interactive buttons */}
						<div className="absolute inset-x-0 bottom-0 p-5 md:p-7 lg:p-8 flex flex-col justify-end pointer-events-none z-20">
							<h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight line-clamp-1 drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
								{centerTitle}
							</h1>

							{/* Metadata row: Year + Genres */}
							<div className="mt-2.5 flex flex-wrap items-center gap-2">
								{centerYear && (
									<span className="font-mono text-xs font-bold text-white/95 bg-white/15 backdrop-blur-md px-2.5 py-1 rounded border border-white/20 shadow-sm">
										{centerYear}
									</span>
								)}
								{centerMovie?.genres?.slice(0, 3).map((genre) => (
									<span
										key={genre}
										className="text-xs font-medium bg-white/10 backdrop-blur-md text-white/90 px-3 py-1 rounded-full border border-white/15 shadow-sm"
									>
										{genre}
									</span>
								))}
							</div>

							{/* Interactive CTA buttons: Watch Now + Details */}
							<div className="pointer-events-auto flex items-center gap-3 mt-4">
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										handleMovieClick(centerMovie);
									}}
									className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm font-bold shadow-[0_0_25px_rgba(229,39,47,0.5)] hover:shadow-[0_0_35px_rgba(229,39,47,0.8)] transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap truncate min-w-0"
								>
									<svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
										<path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
									</svg>
									<span className="whitespace-nowrap truncate">Watch Now</span>
								</button>

								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										handleMovieClick(centerMovie);
									}}
									className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold backdrop-blur-md border border-white/20 hover:border-white/40 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap truncate min-w-0"
								>
									<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0">
										<circle cx="10" cy="10" r="8" />
										<line x1="10" y1="9" x2="10" y2="14" />
										<circle cx="10" cy="6" r="0.5" fill="currentColor" />
									</svg>
									<span className="whitespace-nowrap truncate">Details</span>
								</button>
							</div>
						</div>
					</div>

					{/* Right card */}
					{rightMovie && (
						<div
							onClick={goNext}
							aria-label={`Next movie: ${rightTitle}`}
							className="absolute left-[calc(50%+min(35vw,420px)+16px)] top-1/2 -translate-y-1/2 z-10 w-64 lg:w-76 xl:w-84 aspect-21/11 rounded-2xl overflow-hidden opacity-45 scale-95 transition-all duration-500 ease-out cursor-pointer hover:opacity-85 hover:scale-100 ring-1 ring-white/10 hover:ring-white/30 shadow-2xl bg-surface group"
						>
							{rightBackdrop ? (
								<Image
									src={rightBackdrop}
									alt={rightTitle}
									fill
									sizes="340px"
									className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
								/>
							) : null}
							<div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/45 to-transparent" />
							<div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/15 pointer-events-none" />
							<div className="absolute top-3 left-3 z-10">
								<MediaBadge variant={rightVariant} />
							</div>
							<div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-semibold text-white/90">
								<span className="w-1.5 h-1.5 rounded-full bg-red-500" />
								<span>HD</span>
							</div>
							<div className="absolute bottom-3 left-3.5 right-3.5 z-10">
								<p className="text-xs lg:text-sm font-bold text-white leading-snug line-clamp-1 drop-shadow-md">
									{rightTitle}
								</p>
								{rightYear && (
									<p className="font-mono text-[10px] text-white/70 mt-0.5">
										{rightYear}
									</p>
								)}
							</div>
						</div>
					)}
				</div>

				{/* Arrow buttons: hidden on mobile, visible on desktop (md:flex) */}
				<button
					type="button"
					onClick={goPrev}
					aria-label="Previous movie"
					className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/65 text-white backdrop-blur-xl transition-all duration-300 hover:bg-white hover:text-black hover:scale-110 active:scale-95 shadow-[0_8px_25px_rgba(0,0,0,0.7)] shrink-0"
				>
					<svg viewBox="0 0 20 20" className="h-5 w-5 fill-current shrink-0" aria-hidden="true">
						<path d="M12.5 4.5L7 10l5.5 5.5-.9.9L5.2 10l6.4-6.4z" />
					</svg>
				</button>
				<button
					type="button"
					onClick={goNext}
					aria-label="Next movie"
					className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/65 text-white backdrop-blur-xl transition-all duration-300 hover:bg-white hover:text-black hover:scale-110 active:scale-95 shadow-[0_8px_25px_rgba(0,0,0,0.7)] shrink-0"
				>
					<svg viewBox="0 0 20 20" className="h-5 w-5 fill-current shrink-0" aria-hidden="true">
						<path d="M7.5 4.5L13 10l-5.5 5.5.9.9 6.4-6.4-6.4-6.4z" />
					</svg>
				</button>
			</div>

			{/* Desktop bottom controls: Movie dots & Group Pill Switcher */}
			<div className="hidden md:flex relative z-30 flex-col items-center justify-center gap-3 mt-4 pb-2">
				{/* Movie slide indicators */}
				<div className="flex items-center justify-center gap-1.5" aria-label="Movie slide indicators">
					{movies.map((_, i) => {
						const isCurrent = i === movieIndex;
						return (
							<button
								key={i}
								type="button"
								aria-label={`Go to movie ${i + 1}`}
								onClick={() => setMovieIndex(i)}
								className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
									isCurrent
										? "w-8 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)]"
										: "w-2 hover:w-4 bg-white/30 hover:bg-white/60"
								}`}
							/>
						);
					})}
				</div>

				{/* Desktop Group Pill Switcher (elevated from mobile) */}
				<div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
					{groups.map((group, idx) => {
						const isActive = idx === groupIndex;
						return (
							<button
								key={group.label}
								type="button"
								role="tab"
								aria-selected={isActive}
								aria-label={`Switch to ${group.label}`}
								onClick={() => {
									clearTimeout(timerRef.current);
									setGroupIndex(idx);
									setMovieIndex(0);
								}}
								className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap truncate min-w-0 max-w-full ${
									isActive
										? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-102"
										: "text-white/60 hover:text-white hover:bg-white/5"
								}`}
							>
								<span className="whitespace-nowrap truncate block">{group.label}</span>
							</button>
						);
					})}
				</div>
			</div>
		</section>
	);
}
