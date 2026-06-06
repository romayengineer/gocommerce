<script lang="ts">
	import { logger } from './logger.svelte';
	import { Carousel, ANIMATION_DURATION } from './carousel.svelte';

	interface Props {
		images: string[];
		alt?: string;
		showNavigation?: boolean;
		onImageLoaded?: (loaded: boolean) => void;
	}

	const { images = [], alt = 'Product', showNavigation = true, onImageLoaded }: Props = $props();

	const imageList = $derived(images && images.length > 0 ? images : ['']);
	const carousel = new Carousel(imageList.length);

	function handleImageLoad() {
		if (carousel.currentIndex === 0) {
			onImageLoaded?.(true);
		}
	}

	function handleImageError() {
		logger.log(`Image error at index ${carousel.currentIndex}`);
		if (carousel.currentIndex === 0) {
			onImageLoaded?.(false);
		}
	}
</script>

<div class="relative">
	<div
		class="ounded-lg aspect-square flex items-center justify-center relative cursor-grab active:cursor-grabbing select-none touch-none overflow-hidden"
		role="button"
		tabindex="0"
		aria-label="Product image carousel. Click left/right, drag, or press arrow keys to navigate"
		onmousedown={carousel.handleDragStart}
		onmousemove={carousel.handleDragMove}
		onmouseup={carousel.handleDragEnd}
		onmouseleave={carousel.handleDragEnd}
		ontouchstart={carousel.handleDragStart}
		ontouchmove={carousel.handleDragMove}
		ontouchend={carousel.handleDragEnd}
		onkeydown={carousel.handleKeyDown}
		onclick={carousel.handleImageClick}
	>
		<div
			class="flex w-full h-full"
			style="transform: translateX(calc({carousel.getTranslate()}px - {carousel.currentIndex * 100}%)); transition: {carousel.isAnimating ? `transform ${ANIMATION_DURATION}ms ease-out` : 'none'};"
		>
			{#each imageList as image, i}
				<div class="w-full h-full flex-shrink-0">
					<img
						src={image}
						alt="{alt} {i + 1}"
						loading="lazy"
						draggable="false"
						class="w-full h-full object-cover rounded-lg select-none pointer-events-none"
						onload={i === carousel.currentIndex ? handleImageLoad : undefined}
						onerror={i === carousel.currentIndex ? handleImageError : undefined}
					/>
				</div>
			{/each}
		</div>

		{#if imageList.length > 1 && showNavigation}
			<button
				onclick={() => carousel.navigateWithAnimation('prev')}
				class="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors z-10"
				title="Previous image"
			>
				❮
			</button>

			<button
				onclick={() => carousel.navigateWithAnimation('next')}
				class="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors z-10"
				title="Next image"
			>
				❯
			</button>

			<div class="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-60 text-white text-xs px-3 py-1 rounded-full z-10">
				{carousel.currentIndex + 1} / {imageList.length}
			</div>
		{/if}
	</div>
</div>
