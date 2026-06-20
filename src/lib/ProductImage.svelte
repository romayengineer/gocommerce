<script lang="ts">
	import { logger } from './logger.svelte';
	import { SplideCarousel } from './splideCarousel.svelte';
	import type { Options } from '@splidejs/splide';
	import '@splidejs/splide/dist/css/splide.min.css';

	interface Props {
		images: string[];
		alt?: string;
		showNavigation?: boolean;
		onImageLoaded?: (loaded: boolean) => void;
	}

	const { images = [], alt = 'Product', showNavigation = true, onImageLoaded }: Props = $props();

	// for speed up if showNavigation is false only load first image
	const imageList = $derived(images && images.length > 0 ? (showNavigation ? images : [images[0]]) : []);

	let splideElement: HTMLDivElement | undefined = $state();

	// keep this line do not make the splide component reactive
	// svelte-ignore state_referenced_locally
	const carouselOptions: Options = {
		type: 'loop',
		rewind: true,
		perPage: 1,
		speed: 300,
		arrows: false,
		pagination: false,
		// do not drag when showNavigation is false
		drag: showNavigation,
		keyboard: true,
		touchAngle: 30,
	};

	const carousel = new SplideCarousel(carouselOptions, (index: number) => {
		if (index === 0) {
			onImageLoaded?.(true);
		}
	});

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

	$effect(() => {
		if (splideElement && imageList.length > 0) {
			carousel.init(splideElement);
			return () => {
				carousel.destroy();
			};
		}
	});
</script>

<div class="relative">
	<div bind:this={splideElement} class="splide overflow-hidden aspect-square">
		<div class="splide__track">
			<ul class="splide__list">
				{#each imageList as image, i}
					<li class="splide__slide w-full h-full">
						<img
							src={image}
							alt="{alt} {i + 1}"
							loading="lazy"
							draggable="false"
							class="w-full h-full object-cover select-none pointer-events-none"
							onload={handleImageLoad}
							onerror={handleImageError}
						/>
					</li>
				{/each}
			</ul>
		</div>

		{#if imageList.length > 1 && showNavigation}
			<button
				onclick={() => carousel.prevSlide()}
				class="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors z-10"
				title="Previous image"
			>
				❮
			</button>

			<button
				onclick={() => carousel.nextSlide()}
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
	<div class="h-0 md:h-2"></div>
</div>

<style>
	:global(.splide__slide) {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
