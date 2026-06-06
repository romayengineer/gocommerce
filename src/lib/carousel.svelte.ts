// Minimum pixels to drag before triggering image change (lower = more sensitive)
export const DRAG_THRESHOLD = 50;

// Duration of smooth slide animation when navigating (in milliseconds)
export const ANIMATION_DURATION = 300;

export class Carousel {
	currentIndex = $state(0);
	dragStartX = $state(0);
	dragOffset = $state(0);
	isDragging = $state(false);
	isAnimating = $state(false);
	justDragged = $state(false);

	private imageCount: number;
	private onNavigate?: () => void;

	constructor(imageCount: number, onNavigate?: () => void) {
		this.imageCount = imageCount;
		this.onNavigate = onNavigate;
	}

	private startAnimation() {
		this.isAnimating = true;
		setTimeout(() => {
			this.isAnimating = false;
		}, ANIMATION_DURATION);
	}

	navigateWithAnimation(direction: 'next' | 'prev') {
		const newIndex = direction === 'next'
			? (this.currentIndex + 1) % this.imageCount
			: (this.currentIndex - 1 + this.imageCount) % this.imageCount;

		this.currentIndex = newIndex;
		this.startAnimation();
		this.onNavigate?.();
	}

	handleDragStart = (e: MouseEvent | TouchEvent) => {
		const x = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;
		this.isDragging = true;
		this.dragStartX = x;
		this.dragOffset = 0;
		e instanceof MouseEvent && e.preventDefault();
	};

	handleDragMove = (e: MouseEvent | TouchEvent) => {
		if (!this.isDragging) return;

		const currentX = e instanceof TouchEvent ? e.touches[0].clientX : (e as MouseEvent).clientX;
		this.dragOffset = currentX - this.dragStartX;
	};

	handleDragEnd = () => {
		if (!this.isDragging) return;

		this.isDragging = false;

		if (Math.abs(this.dragOffset) > DRAG_THRESHOLD) {
			this.navigateWithAnimation(this.dragOffset > 0 ? 'prev' : 'next');
		}

		// Only mark as dragged if there was actual movement
		if (Math.abs(this.dragOffset) > 0) {
			this.justDragged = true;
		}
		this.dragOffset = 0;
	};

	handleImageClick = (e: MouseEvent) => {
		if (this.isDragging || this.justDragged) {
			this.justDragged = false;
			return;
		}

		const container = e.currentTarget as HTMLElement;
		const rect = container.getBoundingClientRect();
		const clickX = e.clientX - rect.left;
		const midpoint = rect.width / 2;

		this.navigateWithAnimation(clickX < midpoint ? 'prev' : 'next');
	};

	handleKeyDown = (e: KeyboardEvent) => {
		const directions: Record<string, 'next' | 'prev'> = {
			ArrowLeft: 'prev',
			ArrowRight: 'next'
		};

		if (directions[e.key]) {
			e.preventDefault();
			this.navigateWithAnimation(directions[e.key]);
		}
	};

	getTranslate() {
		return this.isDragging ? this.dragOffset : 0;
	}
}
