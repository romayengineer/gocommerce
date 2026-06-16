<script lang="ts">
	import ProductCard from './ProductCard.svelte';
	import type { DisplayProduct } from './products';
	import { logger } from './logger.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { updatePageInUrl } from './urlUtils';
	import { windowWidthManager } from './windowWidth.svelte';

	interface Props {
		products: DisplayProduct[];
		emptyMessage?: string;
		onProductImageFailed?: (productId: string) => void;
	}

	const { products, emptyMessage = 'No products found', onProductImageFailed }: Props = $props();

	let scrollHeight = $state(typeof window !== 'undefined' ? sessionStorage.getItem('productGridScroll') ? parseFloat(sessionStorage.getItem('productGridScroll')!) : window.scrollY : 0);

	// Calculate number of columns based on responsive breakpoints
	let columns: number = $derived(
		(windowWidthManager.width >= 1024) ? 4 :
		(windowWidthManager.width >= 768) ? 3 : 2
	);

	const minHeight = 30
	const maxHHight = 40
	const fixRatio = 9.5

	// height of ProductCard in rem units
	let productCardHeight = $derived(Math.min(maxHHight, Math.max(minHeight, windowWidthManager.width / columns / fixRatio))); 
	const gap = 0.5; // gap-2 = 0.5rem

	const rowsPerPage: number = 1;

	const pageBuffer = 4;

	let itemsPerPage = $derived(columns * rowsPerPage);

	let pageHeight = $derived((productCardHeight + gap) * rowsPerPage);

	let maxPage = $derived(Math.ceil(products.length / itemsPerPage));

	let currentPage = $state(pageFromScrollHeight());

	let maxHeight = $derived(maxPage * pageHeight);


	$effect(() => {
		const handleScroll = () => {
			scrollHeight = window.scrollY;
			sessionStorage.setItem('productGridScroll', String(window.scrollY));
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	$effect(() => {
		const savedScroll = sessionStorage.getItem('productGridScroll');
		if (savedScroll) {
			window.scrollTo(0, parseFloat(savedScroll));
		}
	});

	function pageFromScrollHeight(): number {
		return Math.min(maxPage, 1 + Math.max(0, Math.floor((scrollHeight / 16) / (productCardHeight + gap))));
	}

	$effect(() => {
		const _ = scrollHeight;
		const timer = setTimeout(() => {
			currentPage = pageFromScrollHeight();
		}, 100);
		return () => clearTimeout(timer);
	});

	function changePage() {
		const newUrl = updatePageInUrl($page.url.toString(), currentPage);
		goto(newUrl, { noScroll: true });
		logger.log(`Page changed to ${currentPage}`);
	}

	$effect(() => {
		const _ = currentPage;
		const timer = setTimeout(changePage, 100);
		return () => clearTimeout(timer);
	});

	function handleProductImageLoaded(productId: string, loaded: boolean) {
		if (!loaded) {
			onProductImageFailed?.(productId);
		}
	}

	function sliceProducts(currentPage: number): DisplayProduct[] {
		const startIndex = Math.max(0, (currentPage - 1 - pageBuffer) * itemsPerPage);
		const endIndex = Math.min(products.length, (currentPage + 2 + pageBuffer) * itemsPerPage);
		return products.slice(startIndex, endIndex);
	}

	let visibleProducts = $derived(sliceProducts(currentPage));
</script>

{#if products.length === 0}
	<p class="text-gray-600 text-center py-12">{emptyMessage}</p>
{:else}
	<div style="height: {maxHeight}rem">
		<div style="padding-top: {Math.min(maxHeight, Math.max(0, currentPage - 1 - pageBuffer) * pageHeight)}rem"
				class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
			{#each visibleProducts as product (product.itemId)}
				<ProductCard {product} height={productCardHeight} onImageLoaded={(loaded) => handleProductImageLoaded(product.itemId, loaded)} />
			{/each}
		</div>
	</div>
{/if}
