import { HeroSkeleton, RowSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
	return (
		<div aria-busy="true" aria-label="Loading">
			<HeroSkeleton />
			<div className="page-shell space-y-14 py-16">
				<div className="space-y-4">
					<RowSkeleton />
				</div>
				<div className="space-y-4">
					<RowSkeleton />
				</div>
				<div className="space-y-4">
					<RowSkeleton />
				</div>
			</div>
		</div>
	);
}
