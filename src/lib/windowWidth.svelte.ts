class WindowWidthManager {
	width = $state(typeof window !== 'undefined' ? window.innerWidth : 1024);

	constructor() {
		if (typeof window !== 'undefined') {
			this.setupResizeListener();
		}
	}

	private setupResizeListener() {
		const handleResize = () => {
			this.width = window.innerWidth;
		};
		window.addEventListener('resize', handleResize);
	}
}

export const windowWidthManager = new WindowWidthManager();
