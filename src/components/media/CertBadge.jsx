export default function CertBadge({ cert, className = "" }) {
	if (!cert) return null;
	return (
		<span
			className={`rounded border border-white/20 bg-black/70 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-white backdrop-blur-sm ${className}`}
		>
			{cert}
		</span>
	);
}
