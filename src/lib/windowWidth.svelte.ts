class WindowWidthManager {
	element = window;

	width = $state(typeof this.element !== 'undefined' ? this.element.innerWidth : 1024);

	columnWidth = 300;

	// leftMenuWidht = $derived((this.width >= 1024) ? this.columnWidth : 0)

	// Calculate number of columns based on responsive breakpoints
	columns: number = $derived(Math.max(2, Math.min(5, Math.round(this.width / this.columnWidth))));

	constructor() {
		if (typeof this.element !== 'undefined') {
			this.setupResizeListener();
		}
	}

	private setupResizeListener() {
		const handleResize = () => {
			this.width = this.element.innerWidth;
		};
		this.element.addEventListener('resize', handleResize);
	}
}

export const windowWidthManager = new WindowWidthManager();
