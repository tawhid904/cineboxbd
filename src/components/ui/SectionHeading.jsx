import { cn } from "@/lib/cn";

export default function SectionHeading({
	title,
	sub,
	eyebrow,
	action,
	className,
}) {
	return (
		<div className={cn("flex flex-wrap items-end justify-between gap-x-6 gap-y-3", className)}>
			<div className="min-w-0">
				{eyebrow ? (
					<p className="mb-2 font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
						{eyebrow}
					</p>
				) : null}
				<h2 className="font-display text-[clamp(1.3rem,2.4vw,1.9rem)] leading-tight text-ink">
					{title}
				</h2>
				{sub ? (
					<p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{sub}</p>
				) : null}
			</div>
			{action}
		</div>
	);
}
