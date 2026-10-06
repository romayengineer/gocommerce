import type { ReadableStore } from './Store';

export interface Viewport {
	width: number;
	columns: number;
}

export interface ViewportTracker {
	readonly viewport: ReadableStore<Viewport>;
	setElement(element: Element | Window | null): void;
}

export interface Platform {
	readonly isBrowser: boolean;
}
