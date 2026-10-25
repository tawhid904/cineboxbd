'use client';

const VARIANTS = {
	trending:   { label: 'Trending',    className: 'bg-[#FF4500] text-white shadow-[0_0_8px_rgba(255,69,0,0.5)]' },
	new:        { label: 'New',         className: 'bg-[#00C2FF] text-white shadow-[0_0_8px_rgba(0,194,255,0.4)]' },
	upcoming:   { label: 'Upcoming',    className: 'bg-[#A855F7] text-white shadow-[0_0_8px_rgba(168,85,247,0.4)]' },
	topRated:   { label: 'Top Rated',   className: 'bg-[#F59E0B] text-black shadow-[0_0_8px_rgba(245,158,11,0.4)]' },
	nowPlaying: { label: 'Now Playing', className: 'bg-[#10B981] text-white shadow-[0_0_8px_rgba(16,185,129,0.4)]' },
};

function normalizeVariant(variant) {
	if (!variant) return null;
	if (VARIANTS[variant]) return variant;
	const lower = String(variant).toLowerCase().replace(/[\s_-]+/g, '');
	if (lower === 'trending' || lower === 'toptrending') return 'trending';
	if (lower === 'new' || lower === 'newmovies') return 'new';
	if (lower === 'upcoming') return 'upcoming';
	if (lower === 'toprated') return 'topRated';
	if (lower === 'nowplaying') return 'nowPlaying';
	return null;
}

export default function MediaBadge({ variant, className: extraClasses = '' }) {
	const normalizedKey = normalizeVariant(variant);
	if (!normalizedKey || !VARIANTS[normalizedKey]) return null;
	const { label, className } = VARIANTS[normalizedKey];
	return (
		<span
			className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${className} ${extraClasses}`}
		>
			{label}
		</span>
	);
}
