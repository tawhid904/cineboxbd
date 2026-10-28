import Link from "next/link";
import { tmdbImage, SIZES } from "@/lib/images";

/**
 * "Genres without boundaries" - collage cards built from real posters
 * of each genre (fetched server-side via TMDB Discover).
 */
export default function GenreCollageSection({ collages }) {
	if (!collages?.length) return null;

	return (
		<section className="page-shell">
			<div className="mb-6 flex items-end justify-between gap-4">
				<div className="min-w-0">
					<h2 className="text-2xl font-bold leading-tight text-ink">
						Genres without boundaries
					</h2>
					<p className="mt-1.5 max-w-xl text-sm text-muted">
						Four starting points. Tap in and wander.
					</p>
				</div>
				<Link
					href="/movies"
					className="inline-flex shrink-0 cursor-pointer items-center gap-1 text-sm font-semibold text-accent transition hover:text-accent-hover"
				>
					<span>See all</span>
					<svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
						<path d="M7.5 4.5L13 10l-5.5 5.5.9.9 6.4-6.4-6.4-6.4z" />
					</svg>
				</Link>
			</div>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{collages.map(({ genre, items }) => (
					<Link
						key={genre.id}
						href={genre.href}
						className="group cursor-pointer overflow-hidden rounded-xl border border-line bg-surface transition hover:border-accent/60"
					>
						<div className="grid aspect-[16/11] grid-cols-2 grid-rows-2 gap-[3px] p-[3px]">
							{items.map((item) => {
								const src = tmdbImage(item.poster_path, SIZES.poster);
								return src ? (
									<div
										key={item.id}
										className="relative overflow-hidden rounded-[4px]"
									>
										<img
											src={src}
											alt=""
											loading="lazy"
											className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
										/>
									</div>
								) : null;
							})}
						</div>
						<div className="flex items-center justify-between border-t border-line px-3.5 py-3">
							<span className="text-sm font-semibold text-ink transition group-hover:text-accent">
								{genre.label}
							</span>
							<span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-elevated text-muted transition group-hover:border-accent group-hover:text-accent">
								<svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
									<path d="M7.5 4.5L13 10l-5.5 5.5.9.9 6.4-6.4-6.4-6.4z" />
								</svg>
							</span>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}
