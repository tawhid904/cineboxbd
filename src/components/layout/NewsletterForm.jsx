"use client";

import { useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "cineboxbd:newsletter";

function getSnapshot() {
	try {
		return window.localStorage.getItem(STORAGE_KEY);
	} catch {
		return null;
	}
}

function getServerSnapshot() {
	return null;
}

export default function NewsletterForm() {
	const [email, setEmail] = useState("");
	const [localStatus, setLocalStatus] = useState("idle");
	const storedEmail = useSyncExternalStore(
		(callback) => {
			window.addEventListener("storage", callback);
			return () => window.removeEventListener("storage", callback);
		},
		getSnapshot,
		getServerSnapshot,
	);
	const status = storedEmail ? "saved" : localStatus;

	const submit = (event) => {
		event.preventDefault();
		const value = email.trim();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
			setLocalStatus("invalid");
			return;
		}
		try {
			window.localStorage.setItem(STORAGE_KEY, value);
		} catch {
			// ignore storage errors
		}
		setLocalStatus("saved");
	};

	if (status === "saved") {
		return (
			<p className="mt-4 rounded-lg border border-line bg-surface px-4 py-3 text-sm text-muted">
				<span className="font-semibold text-ink">You&apos;re on the list.</span>{" "}
				Saved on this device.
			</p>
		);
	}

	return (
		<form onSubmit={submit} className="mt-4 max-w-sm" noValidate>
			<div className="flex overflow-hidden rounded-full border border-line bg-surface focus-within:border-accent">
				<input
					type="email"
					value={email}
					onChange={(event) => {
						setEmail(event.target.value);
						if (status === "invalid") setLocalStatus("idle");
					}}
					placeholder="johndoe@gmail.com"
					aria-label="Email address"
					className="h-11 min-w-0 flex-1 bg-transparent px-4 text-sm text-ink outline-none placeholder:text-faint"
				/>
				<button
					type="submit"
					className="h-11 shrink-0 cursor-pointer bg-accent px-5 text-sm font-semibold text-white transition hover:bg-accent-hover"
				>
					Subscribe
				</button>
			</div>
			{status === "invalid" ? (
				<p className="mt-2 text-xs text-accent" role="alert">
					Please enter a valid email address.
				</p>
			) : (
				<p className="mt-2 text-[11px] text-faint">
					Nothing leaves this device.
				</p>
			)}
		</form>
	);
}
