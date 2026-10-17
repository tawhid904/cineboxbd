import Image from "next/image";
import Link from "next/link";
import RatingStars from "./RatingStars";
import CertBadge from "./CertBadge";
import { tmdbImage, SIZES } from "@/lib/images";
import { formatRuntime, metaLine } from "@/lib/format";

export default function MediaCard({ item }) {
	if (!item) return null;
	const href = `/${item.mediaType}/${item.id}`;
	const meta = metaLine([
		item.year,
		item.genres?.length ? item.genres.slice(0, 2).join("/") : null,
		item.runtime ? formatRuntime(item.runtime) : null,
	]);
	const backdrop = tmdbImage(item.backdropPath, SIZES.backdrop);

	return (
		<article className="group w-[258px] shrink-0 snap-start sm:w-[300px] lg:w-[334px]">
			<Link href={href} className="block focus-visible:outline-offset-4">
				<div className="relative aspect-video overflow-hidden rounded-xl bg-surface ring-1 ring-white/5">
					{backdrop ? (
						<Image
							src={backdrop}
							alt=""
							fill
							sizes="(min-width: 1024px) 334px, (min-width: 640px) 300px, 258px"
							className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
						/>
					) : null}
					<div className="scrim-b pointer-events-none absolute inset-0 opacity-60" />
					<div className="absolute left-2.5 top-2.5">
						<CertBadge cert={item.cert} />
					</div>
					{item.trailerKey ? (
						<span className="absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
							<svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
								<path d="M6 4.5l10 5.5-10 5.5z" />
							</svg>
						</span>
					) : null}
				</div>
				<div className="mt-3 flex items-start justify-between gap-3">
					<h3 className="min-w-0 flex-1 truncate text-[15px] font-semibold text-ink transition group-hover:text-accent">
						{item.title}
					</h3>
					<RatingStars value={item.voteAverage} className="shrink-0 pt-0.5" />
				</div>
				{meta ? <p className="mt-1 truncate text-xs text-faint">{meta}</p> : null}
			</Link>
		</article>
	);
}
