<script lang="ts">
	import { SplideCarousel } from '$lib/catalog/carousel';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import ProductImage from '$lib/catalog/ProductImage.svelte';
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

	const currentIndex = carousel.currentIndex;

	$effect(() => {
		if (splideElement && imageList.length > 0) {
			carousel.init(splideElement);
			return () => {
				carousel.destroy();
			};
		}
	});
</script>

<div class="relative bg-white">
	<div bind:this={splideElement} class="splide aspect-square overflow-hidden">
		<div class="splide__track h-full w-full">
			<ul class="splide__list">
				{#each imageList as image, i}
					<li class="splide__slide">
						<ProductImage
							src={image}
							{alt}
							{onImageLoaded}
							imageIndex={i}
						/>
					</li>
				{/each}
			</ul>
		</div>

		{#if imageList.length > 1 && showNavigation}
			<button
				type="button"
				onclick={() => carousel.prevSlide()}
				class="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-black bg-opacity-50 p-2 text-white transition-colors hover:bg-opacity-70"
				aria-label="Previous image"
			>
				<ChevronLeft size={20} />
			</button>

			<button
				type="button"
				onclick={() => carousel.nextSlide()}
				class="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-black bg-opacity-50 p-2 text-white transition-colors hover:bg-opacity-70"
				aria-label="Next image"
			>
				<ChevronRight size={20} />
			</button>

			<div class="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black bg-opacity-60 px-3 py-1 text-xs text-white">
				{$currentIndex + 1} / {imageList.length}
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
