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

	let topSentinel = $state<HTMLDivElement | undefined>();
	let bottomSentinel = $state<HTMLDivElement | undefined>();
	let topSentinelVisible = $state(false);
	let bottomSentinelVisible = $state(false);
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
		// Observer for tracking sentinel visibility
		const observerBottom = new IntersectionObserver((entries) => {
			bottomSentinelVisible = entries[0].isIntersecting;
		});

		const observerTop = new IntersectionObserver((entries) => {
			topSentinelVisible = entries[0].isIntersecting;
		});

		if (bottomSentinel) {
			observerBottom.observe(bottomSentinel);
		}
		if (topSentinel) {
			observerTop.observe(topSentinel);
		}

		return () => {
			observerBottom.disconnect();
			observerTop.disconnect();
		};
	});

	// Handle continuous page increment while bottom sentinel is visible
	$effect(() => {
		if (bottomSentinelVisible && currentPage * itemsPerPage < products.length) {
			const timer = setTimeout(() => {
				const nextPage = currentPage + 1;
				const newUrl = updatePageInUrl($page.url.toString(), nextPage);
				goto(newUrl, { noScroll: true });
				logger.log(`Page incremented to ${nextPage}`);
			}, 100);
			return () => clearTimeout(timer);
		}
	});

	// Handle continuous page decrement while top sentinel is visible
	$effect(() => {
		if (topSentinelVisible && currentPage > 1) {
			const timer = setTimeout(() => {
				const prevPage = currentPage - 1;
				const newUrl = updatePageInUrl($page.url.toString(), prevPage);
				goto(newUrl, { noScroll: true });
				logger.log(`Page decremented to ${prevPage}`);
			}, 100);
			return () => clearTimeout(timer);
		}
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
	<div>
		<div bind:this={topSentinel} style="height: {Math.max(0, currentPage - (1 + pageBuffer)) * pageHeight}rem"></div>
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
			{#each visibleProducts as product (product.itemId)}
				<ProductCard {product} height={productCardHeight} onImageLoaded={(loaded) => handleProductImageLoaded(product.itemId, loaded)} />
			{/each}
		</div>
		<div bind:this={bottomSentinel} class="h-1"></div>
	</div>
{/if}
