<script lang="ts">
	import ProductCard from './ProductCard.svelte';
	import type { DisplayProduct } from './products';
	import { logger } from './logger.svelte';

	interface Props {
		products: DisplayProduct[];
		emptyMessage?: string;
		onProductImageFailed?: (productId: string) => void;
	}

	const { products, emptyMessage = 'No products found', onProductImageFailed }: Props = $props();

	let displayedCount = $state(20);
	let sentinel = $state<HTMLDivElement | undefined>();

	$effect(() => {
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && displayedCount < products.length) {
				displayedCount += 20;
				logger.log(`displayedCount ${displayedCount}`)
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

	let visibleProducts = $derived(products.slice(0, displayedCount));
</script>

{#if products.length === 0}
	<p class="text-gray-600 text-center py-12">{emptyMessage}</p>
{:else}
	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
		{#each visibleProducts as product (product.itemId)}
			<ProductCard {product} onImageLoaded={(loaded) => handleProductImageLoaded(product.itemId, loaded)} />
		{/each}
	</div>
	<div bind:this={sentinel} class="h-96"></div>
{/if}
