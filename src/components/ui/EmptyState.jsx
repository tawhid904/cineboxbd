export default function EmptyState({ title, body, action }) {
	return (
		<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-surface/40 px-6 py-16 text-center">
			<p className="font-display text-lg text-ink">{title}</p>
			{body ? <p className="mt-2 max-w-md text-sm text-muted">{body}</p> : null}
			{action}
		</div>
	);
}
