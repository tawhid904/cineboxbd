import ScrollShell from "@/components/media/ScrollShell";
import { tmdbImage, SIZES } from "@/lib/images";

export default function CastRow({ cast }) {
	if (!cast?.length) return null;

	return (
		<ScrollShell title="Top cast">
			{cast.map((person) => {
				const src = tmdbImage(person.profilePath, SIZES.profileMd);
				return (
					<article
						key={`${person.id}-${person.character ?? person.name}`}
						className="w-[130px] shrink-0 snap-start sm:w-[150px]"
					>
						<div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-surface ring-1 ring-white/5">
							{src ? (
								<img
									src={src}
									alt={person.name}
									loading="lazy"
									className="absolute inset-0 h-full w-full object-cover grayscale transition duration-500 hover:grayscale-0"
								/>
							) : null}
						</div>
						<p className="mt-2.5 truncate text-sm font-semibold text-ink">
							{person.name}
						</p>
						{person.character ? (
							<p className="truncate text-xs text-faint">{person.character}</p>
						) : null}
					</article>
				);
			})}
		</ScrollShell>
	);
}
