import { Suspense } from "react";
import Link from "next/link";
import Logo from "./Logo";
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
			<div className="page-shell relative flex h-16 items-center justify-between gap-4">
				<Link
					href="/"
					aria-label="CINEBOXBD home"
					className="group relative z-30 inline-flex cursor-pointer shrink-0 items-center"
				>
					<Logo priority className="aspect-[819/106] h-6 w-auto md:h-7" />
				</Link>

				<div className="pointer-events-none absolute inset-x-0 hidden justify-center md:flex">
					<div className="pointer-events-auto">
						<Suspense fallback={<NavFallback />}>
							<PillNav />
						</Suspense>
					</div>
				</div>

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
