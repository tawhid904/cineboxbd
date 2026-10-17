"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export default function Logo({
	priority = false,
	className = "",
	isDrawerOpen,
	...props
}) {
	const [isTouchActive, setIsTouchActive] = useState(false);
	const [prevDrawerOpen, setPrevDrawerOpen] = useState(isDrawerOpen);
	const containerRef = useRef(null);

	// Adjust state during render when isDrawerOpen changes to false (React 19 pattern)
	if (prevDrawerOpen !== isDrawerOpen) {
		setPrevDrawerOpen(isDrawerOpen);
		if (isDrawerOpen === false && isTouchActive) {
			setIsTouchActive(false);
		}
	}

	// On touch devices, keep full color until tapped elsewhere on the page
	useEffect(() => {
		if (!isTouchActive) return;

		const handlePointerDown = (event) => {
			if (containerRef.current && !containerRef.current.contains(event.target)) {
				setIsTouchActive(false);
			}
		};

		window.addEventListener("pointerdown", handlePointerDown);
		return () => {
			window.removeEventListener("pointerdown", handlePointerDown);
		};
	}, [isTouchActive]);

	const handlePointerUp = (event) => {
		if (event.pointerType === "touch" || event.pointerType === "pen") {
			setIsTouchActive(true);
		}
	};

	const handleTouchEnd = () => {
		setIsTouchActive(true);
	};

	const isColorVisible = isTouchActive && isDrawerOpen !== false;

	return (
		<span
			ref={containerRef}
			onPointerUp={handlePointerUp}
			onTouchEnd={handleTouchEnd}
			className={cn("relative inline-block select-none", className)}
			{...props}
		>
			{/* Base layer: Grayscale version */}
			<Image
				src="/text-logo.png"
				alt="CINEBOXBD"
				width={819}
				height={106}
				priority={priority}
				draggable={false}
				className="block h-full w-full object-contain grayscale"
			/>

			{/* Top layer: Full-colour overlay (fades in on hover, focus, or tap) */}
			<Image
				src="/text-logo.png"
				alt=""
				aria-hidden="true"
				width={819}
				height={106}
				priority={priority}
				draggable={false}
				className={cn(
					"pointer-events-none absolute inset-0 block h-full w-full object-contain transition-opacity duration-300 ease-out motion-reduce:transition-none",
					isColorVisible ? "opacity-100" : "opacity-0",
					"group-hover:opacity-100 hover:opacity-100",
					"group-focus-visible:opacity-100 focus-visible:opacity-100",
				)}
			/>
		</span>
	);
}
