import { cn } from "@/lib/cn";
import { formatVote } from "@/lib/format";

const STAR_PATH =
	"M10 1.6l2.55 5.17 5.7.83-4.13 4.02.98 5.68L10 14.6l-5.1 2.7.98-5.68L1.75 7.6l5.7-.83L10 1.6z";

export default function RatingStars({ value, className }) {
	const vote = formatVote(value);
	if (!vote) return null;
	const filled = Math.round(value / 2);
	return (
		<div
			className={cn("flex items-center gap-1", className)}
			role="img"
			aria-label={`Rated ${vote} out of 10`}
		>
			<div className="flex gap-[2px]">
				{[1, 2, 3, 4, 5].map((star) => (
					<svg
						key={star}
						viewBox="0 0 20 20"
						aria-hidden="true"
						className={cn(
							"h-3 w-3",
							star <= filled ? "fill-star" : "fill-line",
						)}
					>
						<path d={STAR_PATH} />
					</svg>
				))}
			</div>
			<span className="font-mono text-[11px] text-faint">{vote}</span>
		</div>
	);
}
