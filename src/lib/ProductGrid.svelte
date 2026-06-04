<script lang="ts">
	import ProductCard from './ProductCard.svelte';
	import type { DisplayProduct } from './products';

	interface Props {
		products: DisplayProduct[];
		emptyMessage?: string;
	}

	const { products, emptyMessage = 'No products found' }: Props = $props();
</script>

{#if products.length === 0}
	<p class="text-gray-600 text-center py-12">{emptyMessage}</p>
{:else}
	<div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
		{#each products as product (product.itemId)}
			<ProductCard {product} />
		{/each}
	</div>
{/if}
