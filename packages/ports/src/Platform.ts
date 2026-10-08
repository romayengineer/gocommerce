import type { ReadableStore } from './Store';

export interface Viewport {
	width: number;
	columns: number;
}

export interface ViewportTracker {
	readonly viewport: ReadableStore<Viewport>;
	setElement(element: unknown): void;
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
