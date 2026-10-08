import type { ReadableStore } from './Store';

export interface Viewport {
	width: number;
	columns: number;
}

export interface ViewportTracker {
	readonly viewport: ReadableStore<Viewport>;
	setElement(element: unknown): void;
}

export interface Platform {
	readonly isBrowser: boolean;
}
