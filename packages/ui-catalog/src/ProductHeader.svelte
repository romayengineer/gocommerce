<script lang="ts">
	import Price from '@gocommerce/ui-primitives/Price.svelte';
	import type { DisplayProduct } from '@gocommerce/domain/product';
	import SizeSelector from './SizeSelector.svelte';

	interface Props {
		product: DisplayProduct
		itemSelected: number,
		selectSize: (e: Event, index: number) => void
	}

	const { product, itemSelected, selectSize }: Props = $props();

	let selectedItem = $derived(product.items[itemSelected]);
</script>

<div>
	<h1 class="x-text-2xl mb-4 font-bold">{product.brand} {product.productName}</h1>
	<div class="mb-4 flex flex-wrap justify-between gap-4">
		<SizeSelector items={product.items} selected={itemSelected} onSelect={selectSize} />
		{#if selectedItem}
			<Price amount={selectedItem.price} size="lg" />
		{/if}
	</div>
</div>
