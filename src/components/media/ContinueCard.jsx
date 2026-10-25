import Image from "next/image";
import Link from "next/link";
import { tmdbImage, SIZES } from "@/lib/images";
import { relativeTime } from "@/lib/watchlist";

export default function ContinueCard({ item }) {
	if (!item) return null;
	const href = `/${item.mediaType === "movie" ? "movies" : item.mediaType}/${item.id}`;
	const backdrop = tmdbImage(item.backdropPath || item.posterPath, SIZES.backdrop);
	const when = relativeTime(item.viewedAt);

	return (
		<article className="group w-64.5 shrink-0 snap-start sm:w-75 lg:w-83.5">
			<Link href={href} className="block cursor-pointer focus-visible:outline-offset-4">
				<div className="relative aspect-video overflow-hidden rounded-xl bg-surface ring-1 ring-white/5">
					{backdrop ? (
						<Image
							src={backdrop}
							alt=""
							fill
							sizes="(min-width: 1024px) 83.5vw, (min-width: 640px) 75vw, 64.5vw"
							className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
						/>
					) : null}
					<div className="scrim-b pointer-events-none absolute inset-0 opacity-75" />
					<div className="absolute inset-x-3 bottom-3">
						<div className="h-0.75 w-full rounded-full bg-white/20">
							<div className="h-full w-0 rounded-full bg-accent transition-all duration-500 group-hover:w-full" />
						</div>
					</div>
					<span className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
						<svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
							<path d="M6 4.5l10 5.5-10 5.5z" />
						</svg>
					</span>
				</div>
				<div className="mt-3 flex items-baseline justify-between gap-3">
					<h3 className="min-w-0 flex-1 truncate text-[15px] font-semibold text-ink transition group-hover:text-accent">
						{item.title}
					</h3>
					{when ? (
						<span className="shrink-0 font-mono text-[11px] text-faint">{when}</span>
					) : null}
				</div>
			</Link>
		</article>
	);
}
