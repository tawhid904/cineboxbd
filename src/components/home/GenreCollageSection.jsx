import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { tmdbImage, SIZES } from "@/lib/images";

/**
 * "Genres without boundaries" - collage cards built from real posters
 * of each genre (fetched server-side via TMDB Discover).
 */
export default function GenreCollageSection({ collages }) {
	if (!collages?.length) return null;

	return (
		<section className="page-shell">
			<SectionHeading
				title="Genres without boundaries"
				sub="Four starting points. Tap in and wander."
			/>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{collages.map(({ genre, items }) => (
					<Link
						key={genre.id}
						href={genre.href}
						className="group overflow-hidden rounded-xl border border-line bg-surface transition hover:border-accent/60"
					>
						<div className="grid aspect-[16/11] grid-cols-2 grid-rows-2 gap-[3px] p-[3px]">
							{items.map((item) => {
								const src = tmdbImage(item.poster_path, SIZES.poster);
								return src ? (
									<div
										key={item.id}
										className="relative overflow-hidden rounded-[4px]"
									>
										<Image
											src={src}
											alt=""
											fill
											sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw"
											className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
										/>
									</div>
								) : null;
							})}
						</div>
						<div className="flex items-center justify-between border-t border-line px-3.5 py-3">
							<span className="text-sm font-semibold text-ink transition group-hover:text-accent">
								{genre.label}
							</span>
							<span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-elevated text-muted transition group:border-accent group:text-accent">
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
