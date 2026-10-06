<script lang="ts">
	import ProductCard from './ProductCard.svelte';
	import type { DisplayProduct } from '$core/domain/product';
	import { computeGridLayout, pageFromScrollHeight, DEFAULT_GRID_CONFIG } from '$core/domain/grid';
	import { updatePageInUrl } from '$core/domain/url';
	import { viewport, route, router, logger, viewportTracker } from './view';

	interface Props {
		products: DisplayProduct[];
		emptyMessage?: string;
		onProductImageFailed?: (productId: string) => void;
	}

	const { products, emptyMessage = 'No products found', onProductImageFailed }: Props = $props();

	let gridContainer = $state<HTMLDivElement>();

	$effect(() => {
		if (gridContainer) {
			viewportTracker.setElement(gridContainer);
		}
	});

	let scrollHeight = $state(
		typeof window !== 'undefined'
			? sessionStorage.getItem('productGridScroll')
				? parseFloat(sessionStorage.getItem('productGridScroll')!)
				: window.scrollY
			: 0
	);

	let currentPage = $state(1);

	const gap = DEFAULT_GRID_CONFIG.gap;

	let gridState = $derived.by(() => {
		const { width, columns } = $viewport;
		return computeGridLayout(products, width, columns, currentPage, DEFAULT_GRID_CONFIG);
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

	$effect(() => {
		const _ = scrollHeight;
		const timer = setTimeout(() => {
			currentPage = pageFromScrollHeight(scrollHeight, gridState.cardHeight, gap);
		}, 100);
		return () => clearTimeout(timer);
	});

	function changePage() {
		const newUrl = updatePageInUrl($route.href, currentPage);
		router.navigate(newUrl, { noScroll: true });
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