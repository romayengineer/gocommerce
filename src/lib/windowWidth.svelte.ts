export class WindowWidthManager {
	element: Window | HTMLElement = window;
	columnWidth: number = 300;
	private handleResize: (() => void) | null = null;
	private resizeObserver: ResizeObserver | null = null;

	width: number = $state(typeof window !== 'undefined' ? window.innerWidth : (this.columnWidth * 2));
	columns: number = $derived(Math.max(2, Math.min(5, Math.round(this.width / this.columnWidth))));

	setElement(element?: Window | HTMLElement | null): WindowWidthManager {
		this.removeResizeListener();
		this.element = element || window;
		this.width = this.element instanceof Window ? this.element.innerWidth : this.element.clientWidth;

		if (typeof this.element !== 'undefined') {
			this.setupResizeListener();
		}

		return this;
	}

	private setupResizeListener() {
		if (this.element instanceof Window) {
			this.handleResize = () => {
				this.width = window.innerWidth;
			};
			window.addEventListener('resize', this.handleResize);
		} else {
			this.resizeObserver = new ResizeObserver(() => {
				this.width = (this.element as HTMLElement).clientWidth;
			});
			this.resizeObserver.observe(this.element as HTMLElement);
		}
	}

	private removeResizeListener() {
		if (this.handleResize) {
			window.removeEventListener('resize', this.handleResize);
			this.handleResize = null;
		}
		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
			this.resizeObserver = null;
		}
	}
}

export const windowWidthManager = (new WindowWidthManager()).setElement(window);
