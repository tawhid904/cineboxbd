"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";

export default function PillNav() {
	const pathname = usePathname();

	return (
		<nav
			aria-label="Primary"
			className="hidden items-center gap-1 rounded-full border border-line bg-surface/70 p-1 md:flex"
		>
			{site.nav.map((link) => {
				const active =
					pathname === link.href ||
					(link.href !== "/" && pathname.startsWith(link.href));
				return (
					<Link
						key={link.href}
						href={link.href}
						aria-current={active ? "page" : undefined}
						className={cn(
							"cursor-pointer rounded-full px-4 py-1.5 text-sm transition",
							active
								? "bg-ink font-semibold text-bg"
								: "text-muted hover:text-ink",
						)}
					>
						{link.label}
					</Link>
				);
			})}
		</nav>
	);
}
