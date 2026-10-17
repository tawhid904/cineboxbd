import Image from "next/image";
import CertBadge from "@/components/media/CertBadge";
import RatingStars from "@/components/media/RatingStars";
import TrailerButton from "./TrailerButton";
import { tmdbImage, SIZES } from "@/lib/images";
import { formatDate, formatRuntime, metaLine } from "@/lib/format";

function ProviderChip({ provider }) {
	const logo = tmdbImage(provider.logo_path, SIZES.logo);
	return (
		<span className="flex items-center gap-2 rounded-lg border border-line bg-surface px-2.5 py-1.5">
			{logo ? (
				<Image src={logo} alt="" width={16} height={16} className="rounded-sm" />
			) : null}
			<span className="text-xs text-muted">{provider.provider_name}</span>
		</span>
	);
}

export default function DetailHero({ item, director, providers }) {
	if (!item) return null;

	const poster = tmdbImage(item.posterPath, SIZES.posterLg);
	const backdrop = tmdbImage(item.backdropPath, SIZES.backdropLg);
	const runtimeLabel =
		item.mediaType === "tv"
			? metaLine([
					item.seasons ? `${item.seasons} season${item.seasons > 1 ? "s" : ""}` : null,
					item.episodes ? `${item.episodes} episodes` : null,
					item.episodeRuntime ? `${item.episodeRuntime}m / ep` : null,
				])
			: formatRuntime(item.runtime);
	const meta = metaLine([item.year, runtimeLabel, item.status].filter(Boolean));

	return (
		<section className="relative">
			<div
				className="absolute inset-x-0 top-0 h-[clamp(340px,52vh,540px)]"
				aria-hidden="true"
			>
				{backdrop ? (
					<Image
						src={backdrop}
						alt=""
						fill
						priority
						sizes="100vw"
						className="object-cover"
					/>
				) : null}
				<div className="scrim-hero absolute inset-0" />
			</div>

			<div className="page-shell relative pb-12 pt-10 md:pt-16">
				<div className="flex flex-col gap-7 md:flex-row md:items-end md:gap-9">
					{poster ? (
						<Image
							src={poster}
							alt={`${item.title} poster`}
							width={200}
							height={300}
							priority
							className="w-36 shrink-0 rounded-xl ring-1 ring-white/10 shadow-2xl md:w-52"
						/>
					) : null}

					<div className="min-w-0 max-w-2xl">
						<div className="mb-3 flex flex-wrap items-center gap-3">
							<CertBadge cert={item.cert} />
							{meta ? (
								<span className="font-mono text-xs text-muted">{meta}</span>
							) : null}
							<RatingStars value={item.voteAverage} />
							{item.voteCount ? (
								<span className="font-mono text-[11px] text-faint">
									({item.voteCount.toLocaleString()} votes)
								</span>
							) : null}
						</div>

						<h1 className="font-display text-[clamp(1.9rem,4.6vw,3.4rem)] leading-[1.02] tracking-tight text-ink">
							{item.title}
						</h1>

						{item.tagline ? (
							<p className="mt-2 text-sm italic text-faint">&ldquo;{item.tagline}&rdquo;</p>
						) : null}

						{item.genres?.length ? (
							<div className="mt-4 flex flex-wrap gap-2">
								{item.genres.map((genre) => (
									<span
										key={genre}
										className="rounded-full border border-line bg-surface/70 px-3 py-1 text-xs text-muted backdrop-blur-sm"
									>
										{genre}
									</span>
								))}
							</div>
						) : null}

						<p className="mt-4 max-w-xl text-sm leading-relaxed text-muted md:text-[15px]">
							{item.overview || "No synopsis available."}
						</p>

						<div className="mt-6 flex flex-wrap items-center gap-3">
							<TrailerButton videoKey={item.trailerKey} title={item.title} />
							{director ? (
								<span className="font-mono text-xs text-faint">
									Directed by{" "}
									<span className="text-muted">{director}</span>
								</span>
							) : null}
						</div>

						{providers?.flatrate?.length ? (
							<div className="mt-7">
								<p className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-faint">
									Streaming in Bangladesh
								</p>
								<div className="flex flex-wrap gap-2">
									{providers.flatrate.slice(0, 6).map((provider) => (
										<ProviderChip key={provider.provider_id} provider={provider} />
									))}
								</div>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</section>
	);
}
