import Image from "next/image";
import Link from "next/link";
import { tmdbImage, SIZES } from "@/lib/images";
import { formatVote, formatYear } from "@/lib/format";

export default function PosterCard({ item }) {
	if (!item) return null;
	const href = `/${item.mediaType}/${item.id}`;
	const poster = tmdbImage(item.posterPath, SIZES.poster);
	const vote = formatVote(item.voteAverage);
	const year = formatYear(item.year) || item.year;

	return (
		<article className="group">
			<Link href={href} className="block focus-visible:outline-offset-4">
				<div className="relative aspect-2/3 overflow-hidden rounded-lg bg-surface ring-1 ring-white/5">
					{poster ? (
						<Image
							src={poster}
							alt={item.title}
							fill
							sizes="(min-width: 1280px) 15vw, (min-width: 768px) 22vw, (min-width: 480px) 31vw, 45vw"
							className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
						/>
					) : null}
					<div className="absolute inset-0 flex items-end justify-center bg-black/65 p-3 opacity-0 transition group-hover:opacity-100">
						<span className="rounded-full border border-white/25 px-4 py-1.5 text-xs font-semibold text-white">
							View details
						</span>
					</div>
					{vote ? (
						<span className="absolute left-2 top-2 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[10px] text-star backdrop-blur-sm">
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
