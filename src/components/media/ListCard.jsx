import Image from "next/image";
import Link from "next/link";
import RatingStars from "./RatingStars";
import CertBadge from "./CertBadge";
import { tmdbImage, SIZES } from "@/lib/images";
import { formatRuntime, metaLine } from "@/lib/format";

/** Wide list-row card used by the list view on browse pages. */
export default function ListCard({ item }) {
	if (!item) return null;
	const href = `/${item.mediaType}/${item.id}`;
	const src =
		tmdbImage(item.backdropPath, SIZES.backdrop) ||
		tmdbImage(item.posterPath, SIZES.poster);
	const meta = metaLine([
		item.cert,
		item.year,
		item.genres?.length ? item.genres.slice(0, 2).join("/") : null,
		item.runtime ? formatRuntime(item.runtime) : null,
	]);

	return (
		<article className="group">
			<Link
				href={href}
				className="flex flex-col gap-4 rounded-xl border border-line bg-surface/40 p-3 transition hover:border-accent/60 hover:bg-surface sm:flex-row sm:gap-5"
			>
				<div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-surface sm:w-56 lg:w-72">
					{src ? (
						<Image
							src={src}
							alt=""
							fill
							sizes="(min-width: 640px) 288px, (min-width: 1024px) 90vw, 100vw"
							className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
						/>
					) : null}
					<div className="absolute left-2 top-2">
						<CertBadge cert={item.cert} />
					</div>
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex items-start justify-between gap-3">
						<h3 className="truncate text-base font-semibold text-ink transition group-hover:text-accent">
							{item.title}
						</h3>
						<RatingStars value={item.voteAverage} className="shrink-0 pt-1" />
					</div>
					{meta ? <p className="mt-1 font-mono text-[11px] text-faint">{meta}</p> : null}
					<p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted">
						{item.overview || "No synopsis available."}
					</p>
				</div>
			</Link>
		</article>
	);
}
