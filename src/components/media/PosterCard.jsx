import Link from "next/link";
import MediaBadge from "@/components/ui/MediaBadge";
import { tmdbImage, SIZES } from "@/lib/images";
import { formatVote, formatYear } from "@/lib/format";

export default function PosterCard({ item, badge, variant }) {
	if (!item) return null;
	const href = `/${item.mediaType === "movie" ? "movies" : item.mediaType}/${item.id}`;
	const poster = tmdbImage(item.posterPath, SIZES.poster);
	const vote = formatVote(item.voteAverage);
	const year = formatYear(item.year) || item.year;
	const resolvedVariant = variant || item.variant || badge || item.badge || null;

	return (
		<article className="group">
			<Link href={href} className="block cursor-pointer focus-visible:outline-offset-4">
				<div className="relative aspect-2/3 overflow-hidden rounded-lg bg-surface ring-1 ring-white/5">
					{poster ? (
						<img
							src={poster}
							alt={item.title}
							loading="lazy"
							className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
						/>
					) : null}
					<div className="absolute inset-0 flex items-end justify-center bg-black/65 p-3 opacity-0 transition group-hover:opacity-100">
						<span className="rounded-full border border-white/25 px-4 py-1.5 text-xs font-semibold text-white">
							View details
						</span>
					</div>
					{/* MediaBadge chip — top-left */}
					{resolvedVariant && (
						<div className="absolute top-2 left-2 z-10">
							<MediaBadge variant={resolvedVariant} />
						</div>
					)}
					{vote ? (
						<span className={`absolute ${resolvedVariant ? "right-2" : "left-2"} top-2 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[10px] text-star backdrop-blur-sm z-10`}>
							★ {vote}
						</span>
					) : null}
				</div>
				<h3 className="mt-2.5 truncate text-sm font-medium text-ink transition group-hover:text-accent">
					{item.title}
				</h3>
				<p className="mt-0.5 font-mono text-[11px] text-faint">
					{[year, item.genres?.[0]].filter(Boolean).join(" • ")}
				</p>
			</Link>
		</article>
	);
}
