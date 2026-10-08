import type { WritableStore } from '@gocommerce/ports/Store';
import { createStore } from '@gocommerce/adapters-memory/store';
import type { Platform, Viewport, ViewportTracker } from '@gocommerce/ports/Platform';
import {
	columnsForWidth,
	DEFAULT_COLUMN_WIDTH,
	MAX_COLUMNS,
	MIN_COLUMNS
} from '@gocommerce/ui-core/viewport';

function currentWindowWidth(): number {
	return typeof window !== 'undefined' ? window.innerWidth : DEFAULT_COLUMN_WIDTH * 2;
}

export class BrowserPlatform implements Platform {
	readonly isBrowser = typeof window !== 'undefined';
}

/**
 * Tracks the viewport width and derives the responsive column count.
 * Tracks the whole window unless `setElement` is called with a container.
 */
export class ViewportWidthTracker implements ViewportTracker {
	readonly viewport: WritableStore<Viewport>;
	private element: Element | Window | null = null;
	private resizeListener: (() => void) | null = null;
	private resizeObserver: ResizeObserver | null = null;

	constructor(
		private columnWidth: number = DEFAULT_COLUMN_WIDTH,
		private min: number = MIN_COLUMNS,
		private max: number = MAX_COLUMNS
	) {
		this.viewport = createStore({
			width: currentWindowWidth(),
			columns: columnsForWidth(currentWindowWidth(), columnWidth, min, max)
		});
	}

	setElement(element: Element | Window | null): void {
		this.removeResizeListener();
		this.element = element;

		if (this.element instanceof Window) {
			this.updateWidth(this.element.innerWidth);
			this.resizeListener = () => this.updateWidth(window.innerWidth);
			window.addEventListener('resize', this.resizeListener);
		} else if (this.element instanceof Element) {
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
			columns: columnsForWidth(width, this.columnWidth, this.min, this.max)
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