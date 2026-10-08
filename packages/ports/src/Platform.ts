import type { ReadableStore } from './Store';

export interface Viewport {
	width: number;
	columns: number;
}

export interface ViewportTracker {
	readonly viewport: ReadableStore<Viewport>;
	/** Mount tracking onto a container (or the window). Owned by the UI shell. */
	setElement(element: Element | Window | null): void;
	/** Release resize listeners/observers (HMR, tests, unmount). */
	dispose(): void;
}

/**
 * Column-count math for a viewport width. Owned by the port so adapters and
 * composition agree on the signature; the implementation lives in
 * `@gocommerce/ui-core/viewport` (dependency-free, structural match — ui-core
 * imports no workspace types by rule 4c).
 */
export type ColumnsForWidthFn = (
	width: number,
	columnWidth: number,
	min: number,
	max: number
) => number;

export interface Platform {
	readonly isBrowser: boolean;
}
