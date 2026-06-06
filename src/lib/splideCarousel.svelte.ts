import Splide from '@splidejs/splide';
import type { Options } from '@splidejs/splide';

export class SplideCarousel {
	private splide: Splide | null = null;
	private element: HTMLElement | null = null;
	currentIndex = $state(0);

	constructor(
		private options: Options,
		private onMove?: (index: number) => void
	) {}

	init(element: HTMLElement): void {
		if (!element) return;

		this.element = element;
		this.splide = new Splide(element, this.options);

		this.splide.on('move', (newIndex: number) => {
			this.currentIndex = newIndex;
			this.onMove?.(newIndex);
		});

		this.splide.mount();
	}

	destroy(): void {
		if (this.splide) {
			this.splide.destroy();
			this.splide = null;
		}
	}

	goToSlide(index: number): void {
		this.splide?.go(index);
	}

	nextSlide(): void {
		this.splide?.go('>');
	}

	prevSlide(): void {
		this.splide?.go('<');
	}

	getSplide(): Splide | null {
		return this.splide;
	}
}
