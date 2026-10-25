"use client";

import { SkeletonTheme } from "react-loading-skeleton";

export default function AppSkeletonTheme({ children }) {
	return (
		<SkeletonTheme
			baseColor="#1a1a1a"
			highlightColor="#2e2e2e"
			borderRadius="0.5rem"
		>
			{children}
		</SkeletonTheme>
	);
}
