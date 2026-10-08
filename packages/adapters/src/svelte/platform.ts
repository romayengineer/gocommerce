import type { WritableStore } from '@gocommerce/ports/Store';
import { createStore } from '@gocommerce/adapters-memory/store';
import type { Platform, Viewport, ViewportTracker } from '@gocommerce/ports/Platform';

export type ColumnsForWidthFn = (
	width: number,
	columnWidth: number,
	min: number,
	max: number
) => number;

export interface ViewportTrackerInit {
	columnWidth: number;
	min: number;
	max: number;
	columnsForWidth: ColumnsForWidthFn;
}

function currentWindowWidth(fallback: number): number {
	return typeof window !== 'undefined' ? window.innerWidth : fallback;
}

export class BrowserPlatform implements Platform {
	readonly isBrowser = typeof window !== 'undefined';
}

/**
 * Tracks the viewport width and derives the responsive column count.
 * Tracks the whole window unless `setElement` is called with a container.
 * Column math is injected (owns no ui-core import) — composition wires
 * `columnsForWidth` + constants from `@gocommerce/ui-core/viewport`.
 */
export class ViewportWidthTracker implements ViewportTracker {
	readonly viewport: WritableStore<Viewport>;
	private element: Element | Window | null = null;
	private resizeListener: (() => void) | null = null;
	private resizeObserver: ResizeObserver | null = null;

	constructor(private init: ViewportTrackerInit) {
		const width = currentWindowWidth(init.columnWidth * 2);
		this.viewport = createStore({
			width,
			columns: init.columnsForWidth(width, init.columnWidth, init.min, init.max)
		});
	}

	setElement(element: unknown): void {
		this.removeResizeListener();
		this.element = element as Element | Window | null;

		if (typeof Window !== 'undefined' && this.element instanceof Window) {
			this.updateWidth(this.element.innerWidth);
			this.resizeListener = () => this.updateWidth(window.innerWidth);
			window.addEventListener('resize', this.resizeListener);
		} else if (typeof Element !== 'undefined' && this.element instanceof Element) {
			const container = this.element;
			this.updateWidth(container.clientWidth);
			this.resizeObserver = new ResizeObserver(() => {
				this.updateWidth(container.clientWidth);
			});
			this.resizeObserver.observe(container);
		}
	}

	private updateWidth(width: number): void {
		this.viewport.set({
			width,
			columns: this.init.columnsForWidth(width, this.init.columnWidth, this.init.min, this.init.max)
		});
	}

	private removeResizeListener(): void {
		if (this.resizeListener) {
			window.removeEventListener('resize', this.resizeListener);
			this.resizeListener = null;
		}
		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
			this.resizeObserver = null;
		}
	}
}
