import { formatDate, formatLanguage } from "@/lib/format";

export default function FactsGrid({ facts }) {
	const rows = facts.filter((fact) => fact.value);

	if (!rows.length) return null;

	return (
		<dl className="grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
			{rows.map((fact) => (
				<div key={fact.label} className="border-b border-line pb-3">
					<dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
						{fact.label}
					</dt>
					<dd className="mt-1.5 text-sm text-ink">{fact.value}</dd>
				</div>
			))}
		</dl>
	);
}

export function buildFacts(item, extras = {}) {
	return [
		{ label: "Status", value: item.status },
		{
			label: item.mediaType === "movie" ? "Released" : "First aired",
			value: formatDate(item.releaseDate),
		},
		item.mediaType === "tv" && item.lastAirDate
			? { label: "Last aired", value: formatDate(item.lastAirDate) }
			: { label: "Original language", value: formatLanguage(item.language) },
		{ label: "Director", value: extras.director },
		{ label: "Written by", value: extras.writer },
		{ label: "Certification", value: item.cert },
	];
}
