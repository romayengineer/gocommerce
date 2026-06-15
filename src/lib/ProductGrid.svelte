<script lang="ts">
	import ProductCard from './ProductCard.svelte';
	import type { DisplayProduct } from './products';
	import { logger } from './logger.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { updatePageInUrl, getPageInUrl } from './urlUtils';

	interface Props {
		products: DisplayProduct[];
		emptyMessage?: string;
		onProductImageFailed?: (productId: string) => void;
	}

	const { products, emptyMessage = 'No products found', onProductImageFailed }: Props = $props();

	let sentinel = $state<HTMLDivElement | undefined>();
	let gridContainer = $state<HTMLDivElement | undefined>();
	let windowWidth = $state(typeof window !== 'undefined' ? window.innerWidth : 1024);

	// Get current page from URL, default to 1
	let currentPage = $derived(getPageInUrl($page.url.toString()));

	// Calculate number of columns based on responsive breakpoints
	let columns: number = $derived(
		(windowWidth >= 1024) ? 4 :
		(windowWidth >= 768) ? 3 : 2
	);

	let rowsPerPage: number = 1;

	const itemsPerPage = $derived(columns * rowsPerPage);

	const productCardHeight = 30; // height of ProductCard in rem units
	const gap = 0.5; // gap-2 = 0.5rem

	let pageHeight = $derived((productCardHeight + gap) * rowsPerPage);

	const pageBuffer = 1;

	$effect(() => {
		const handleResize = () => {
			windowWidth = window.innerWidth;
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});

	$effect(() => {
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && currentPage * itemsPerPage < products.length) {
				const nextPage = currentPage + 1;
				const newUrl = updatePageInUrl($page.url.toString(), nextPage);
				goto(newUrl, { noScroll: true })
				logger.log(`Page incremented to ${nextPage}`);
			}
		});

		if (sentinel) {
			observer.observe(sentinel);
		}

		return () => observer.disconnect();
	});

	function handleProductImageLoaded(productId: string, loaded: boolean) {
		if (!loaded) {
			onProductImageFailed?.(productId);
		}
	}

	function sliceProducts(currentPage: number): DisplayProduct[] {
		const startIndex = Math.max(0, (currentPage - (1 + pageBuffer)) * itemsPerPage);
		const endIndex = Math.min(products.length, (currentPage + pageBuffer) * itemsPerPage);
		return products.slice(startIndex, endIndex);
	}

	let visibleProducts = $derived(sliceProducts(currentPage));
</script>

{#if products.length === 0}
	<p class="text-gray-600 text-center py-12">{emptyMessage}</p>
{:else}
	<div bind:this={gridContainer} class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2" style="padding-top: {Math.max(0, currentPage - (1 + pageBuffer)) * pageHeight}rem">
		{#each visibleProducts as product (product.itemId)}
			<ProductCard {product} height={productCardHeight} onImageLoaded={(loaded) => handleProductImageLoaded(product.itemId, loaded)} />
		{/each}
	</div>
	<div bind:this={sentinel} class="h-96"></div>
{/if}
