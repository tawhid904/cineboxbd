"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "movieboxbd:history:v1";
const MAX_ENTRIES = 12;
const EMPTY = [];

const subscribers = new Set();

function notify() {
	for (const callback of subscribers) callback();
}

function subscribe(callback) {
	subscribers.add(callback);
	window.addEventListener("storage", callback);
	return () => {
		subscribers.delete(callback);
		window.removeEventListener("storage", callback);
	};
}

function parseSafe(raw) {
	if (!raw) return EMPTY;
	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : EMPTY;
	} catch {
		return EMPTY;
	}
}

export function readHistory() {
	if (typeof window === "undefined") return EMPTY;
	try {
		return parseSafe(window.localStorage.getItem(STORAGE_KEY));
	} catch {
		return EMPTY;
	}
}

// Cached snapshot — useSyncExternalStore needs a stable reference
// between renders while the stored value is unchanged.
let lastRaw = null;
let lastSnapshot = EMPTY;

function getSnapshot() {
	let raw = null;
	try {
		raw = window.localStorage.getItem(STORAGE_KEY);
	} catch {
		raw = null;
	}
	if (raw === lastRaw) return lastSnapshot;
	lastRaw = raw;
	lastSnapshot = parseSafe(raw);
	return lastSnapshot;
}

function getServerSnapshot() {
	return EMPTY;
}

/** Real viewing history (Continue Watching) — reactive across tabs & navigation. */
export function useHistory() {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function recordVisit(entry) {
	if (typeof window === "undefined") return;
	try {
		const current = readHistory().filter(
			(item) => !(item.id === entry.id && item.mediaType === entry.mediaType),
		);
		current.unshift({ ...entry, viewedAt: Date.now() });
		window.localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify(current.slice(0, MAX_ENTRIES)),
		);
		lastRaw = null;
		notify();
	} catch {
		// storage unavailable (private mode) — silently skip
	}
}

export function relativeTime(timestamp) {
	if (!timestamp) return null;
	const diffMinutes = Math.round((Date.now() - timestamp) / 60000);
	if (diffMinutes < 1) return "just now";
	if (diffMinutes < 60) return `${diffMinutes}m ago`;
	const hours = Math.round(diffMinutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.round(hours / 24);
	return days === 1 ? "yesterday" : `${days}d ago`;
}
