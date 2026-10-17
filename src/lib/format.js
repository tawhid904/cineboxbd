export function formatRuntime(minutes) {
	if (!minutes || !Number.isFinite(minutes)) return null;
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	if (hours && mins) return `${hours}h ${mins}m`;
	if (hours) return `${hours}h`;
	return `${mins}m`;
}

export function formatYear(date) {
	if (!date) return null;
	return date.slice(0, 4);
}

export function formatVote(vote) {
	if (typeof vote !== "number" || !Number.isFinite(vote) || vote <= 0) return null;
	return vote.toFixed(1);
}

export function formatDate(date) {
	if (!date) return null;
	try {
		return new Intl.DateTimeFormat("en-GB", {
			day: "numeric",
			month: "short",
			year: "numeric",
		}).format(new Date(date));
	} catch {
		return date;
	}
}

export function formatLanguage(code) {
	if (!code) return null;
	try {
		return new Intl.DisplayNames(["en"], { type: "language" }).of(code);
	} catch {
		return code.toUpperCase();
	}
}

export function metaLine(parts) {
	return parts.filter(Boolean).join("  •  ");
}
