import { Suspense } from "react";
import Link from "next/link";
import PillNav from "./PillNav";
import HeaderSearch from "./HeaderSearch";
import MobileNav from "./MobileNav";

function NavFallback() {
	return (
		<div
			className="h-9 w-52 rounded-full border border-line bg-surface/70"
			aria-hidden="true"
		/>
	);
}

function MobileNavFallback() {
	return (
		<div
			className="h-10 w-10 rounded-full border border-line bg-surface/70 md:hidden"
			aria-hidden="true"
		/>
	);
}

export default function SiteHeader() {
	return (
		<header className="sticky top-0 z-50 border-b border-line/60 bg-bg/75 backdrop-blur-md">
			<div className="page-shell flex h-16 items-center justify-between gap-4">
				<Link
					href="/"
					aria-label="MOVIEBOXBD home"
					className="shrink-0 font-display text-lg tracking-tight text-ink transition hover:text-accent md:text-xl"
				>
					MOVIEBOXBD
				</Link>
				<Suspense fallback={<NavFallback />}>
					<PillNav />
				</Suspense>
				<div className="z-30 flex shrink-0 items-center gap-1.5">
					<HeaderSearch />
					<Suspense fallback={<MobileNavFallback />}>
						<MobileNav />
					</Suspense>
				</div>
			</div>
		</header>
	);
}
