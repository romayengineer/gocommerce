<script lang="ts">
	import ProductCard from './ProductCard.svelte';
	import type { DisplayProduct } from './products';
	import { logger } from './logger.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { updatePageInUrl } from './urlUtils';
	import { WindowWidthManager } from './windowWidth.svelte';

	interface Props {
		products: DisplayProduct[];
		emptyMessage?: string;
		onProductImageFailed?: (productId: string) => void;
	}

	const { products, emptyMessage = 'No products found', onProductImageFailed }: Props = $props();

	let gridContainer = $state<HTMLDivElement>();
	let windowWidthManager = $state(new WindowWidthManager());

	$effect(() => {
		if (gridContainer) {
			windowWidthManager.setElement(gridContainer);
		}
	});

	let scrollHeight = $state(typeof window !== 'undefined' ? sessionStorage.getItem('productGridScroll') ? parseFloat(sessionStorage.getItem('productGridScroll')!) : window.scrollY : 0);

	const minHeight = 30
	const maxHHight = 40
	const fixRatio = 7.5
	const gap = 0.5; // gap-2 = 0.5rem

	// height of ProductCard in rem units
	let productCardHeight = $derived(Math.min(maxHHight, Math.max(minHeight, windowWidthManager.width / windowWidthManager.columns / fixRatio))); 

	const rowsPerPage: number = 1;

	const pageBuffer = 4;

	let itemsPerPage = $derived(windowWidthManager.columns * rowsPerPage);

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
		const newUrl = updatePageInUrl(page.url.toString(), currentPage);
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

<div bind:this={gridContainer}>
	{#if products.length === 0}
		<p class="text-gray-600 text-center py-12">{emptyMessage}</p>
	{:else}
		<div style="height: {maxHeight}rem">
			<div style="padding-top: {Math.min(maxHeight, Math.max(0, currentPage - 1 - pageBuffer) * pageHeight)}rem; display: grid; grid-template-columns: repeat({windowWidthManager.columns}, minmax(0, 1fr)); gap: 0.5rem;">
				{#each visibleProducts as product (product.productId)}
					<ProductCard {product} height={productCardHeight} onImageLoaded={(loaded) => handleProductImageLoaded(product.productId, loaded)} />
				{/each}
			</div>
		</div>
	{/if}
</div>
