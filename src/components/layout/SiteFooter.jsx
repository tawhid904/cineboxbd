import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import { collageGenres } from "@/config/site";

const columns = [
	{
		title: "Explore",
		links: [
			{ label: "Home", href: "/" },
			{ label: "Movies", href: "/movies" },
			{ label: "TV Shows", href: "/tv" },
			{ label: "Trending", href: "/trending" },
		],
	},
	{
		title: "Genres",
		links: collageGenres.map((genre) => ({
			label: genre.label,
			href: genre.href,
		})),
	},
];

export default function SiteFooter() {
	return (
		<footer className="border-t border-line bg-bg">
			<div className="page-shell grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr] md:gap-8">
				<div>
					<h3 className="font-display text-lg text-ink">
						Join the list.
					</h3>
					<p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
						New releases, festival picks, hidden gems. Saved on this device for now.
					</p>
					<NewsletterForm />
				</div>

				{columns.map((column) => (
					<nav key={column.title} aria-label={column.title}>
						<h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">
							{column.title}
						</h4>
						<ul className="mt-4 space-y-2.5">
							{column.links.map((link) => (
								<li key={`${column.title}-${link.label}`}>
									<Link
										href={link.href}
										{...(link.external
											? { target: "_blank", rel: "noreferrer" }
											: {})}
										className="text-sm text-muted transition hover:text-ink"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				))}
			</div>

			<div className="page-shell border-t border-line py-5">
				<p className="max-w-3xl text-xs leading-relaxed text-faint">
					Titles, artwork and metadata belong to their respective owners.
				</p>
			</div>

			<div className="overflow-hidden px-2 pb-4" aria-hidden="true">
				<p className="select-none whitespace-nowrap text-center font-display leading-[0.78] tracking-[-0.03em] text-ink/95" style={{ fontSize: "clamp(2.75rem, 14vw, 15rem)" }}>
					CINEBOXBD
				</p>
			</div>
		</footer>
	);
}
