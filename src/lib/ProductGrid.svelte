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
	const minCardHeight = 600;
	const maxCardHight = minCardHeight * 1.2;
	const fixRatio = 2;
	const gap = 8; // gap-2 = 0.5rem = 8 px
	const rowsPerPage: number = 1;
	const pageBuffer = 4;

	let scrollHeight = $state(typeof window !== 'undefined' ? sessionStorage.getItem('productGridScroll') ? parseFloat(sessionStorage.getItem('productGridScroll')!) : window.scrollY : 0);

	let currentPage = $state(1);

	function sliceProducts(currentPage: number, itemsPerPage: number): DisplayProduct[] {
		const startIndex = Math.max(0, (currentPage - 1 - pageBuffer) * itemsPerPage);
		const endIndex = Math.min(products.length, (currentPage + 2 + pageBuffer) * itemsPerPage);
		return products.slice(startIndex, endIndex);
	}

	interface GridState {
		height: number;
		topPadding: number;
		cardHeight: number;
		columns: number;
		products: DisplayProduct[],
	}

	function clamp(value: number, min: number, max: number): number {
		return Math.min(Math.max(value, min), max);
	}

	let gridState = $derived.by<GridState>(() => {
		const itemsPerPage = windowWidthManager.columns * rowsPerPage;
		const maxPage = Math.ceil(products.length / itemsPerPage);
		const columns = windowWidthManager.columns;
		// height of ProductCard in px units
		const productCardHeight = clamp(fixRatio * (windowWidthManager.width / columns), minCardHeight, maxCardHight)
		const pageHeight = (productCardHeight + gap) * rowsPerPage;
		const maxHeight = maxPage * pageHeight;
		const topPadding = Math.min(maxHeight, Math.max(0, currentPage - 1 - pageBuffer) * pageHeight);
		const visibleProducts = sliceProducts(currentPage, itemsPerPage);
		const state = {
			height: Math.round(maxHeight),
			topPadding: Math.round(topPadding),
			cardHeight: Math.round(productCardHeight),
			columns: columns,
			products: visibleProducts,
		} as GridState
		const stateStr = JSON.stringify({...state, products: []});
		console.log(`state ${stateStr}`);
		return state;
	});


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
		return Math.max(1, Math.floor(scrollHeight / (gridState.cardHeight + gap)));
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
</script>

<div bind:this={gridContainer}>
	{#if gridState.products.length === 0}
		<p class="text-gray-600 text-center py-12">{emptyMessage}</p>
	{:else}
		<div style="height: {gridState.height}px">
			<div style="padding-top: {gridState.topPadding}px; display: grid; grid-template-columns: repeat({gridState.columns}, minmax(0, 1fr)); gap: {gap}px;">
				{#each gridState.products as product (product.productId)}
					<ProductCard {product} height={gridState.cardHeight} onImageLoaded={(loaded) => handleProductImageLoaded(product.productId, loaded)} />
				{/each}
			</div>
		</div>
	{/if}
</div>
