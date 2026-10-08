import type { WritableStore } from '@gocommerce/ports/Store';
import type { StoreFactory } from '@gocommerce/ports/StoreFactory';
import type {
	ColumnsForWidthFn,
	Viewport,
	ViewportTracker
} from '@gocommerce/ports/Platform';

export interface ViewportTrackerInit {
	columnWidth: number;
	min: number;
	max: number;
	columnsForWidth: ColumnsForWidthFn;
}

function currentWindowWidth(fallback: number): number {
	return typeof window !== 'undefined' ? window.innerWidth : fallback;
}

/**
 * Tracks the viewport width and derives the responsive column count.
 * Mounting is owned by the UI shell via `setElement`; the store factory is
 * injected (composition supplies `memoryStoreFactory`) so this adapter
 * constructs no stores of its own. Column math is likewise injected —
 * composition wires `columnsForWidth` + constants from
 * `@gocommerce/ui-core/viewport`.
 */
export class ViewportWidthTracker implements ViewportTracker {
	readonly viewport: WritableStore<Viewport>;
	private element: Element | Window | null = null;
	private resizeListener: (() => void) | null = null;
	private resizeObserver: ResizeObserver | null = null;

	constructor(
		private init: ViewportTrackerInit,
		stores: StoreFactory
	) {
		const width = currentWindowWidth(init.columnWidth * 2);
		this.viewport = stores.create({
			width,
			columns: init.columnsForWidth(width, init.columnWidth, init.min, init.max)
		});
	}

	setElement(element: Element | Window | null): void {
		this.removeResizeListener();
		this.element = element;

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

	/** Release resize listeners/observers (HMR, tests, unmount). */
	dispose(): void {
		this.removeResizeListener();
		this.element = null;
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
