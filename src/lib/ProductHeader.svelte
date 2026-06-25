<script lang="ts">
	import Price from '$lib/Price.svelte';
	import type { DisplayProduct } from './products';
	import SizeSelector from './SizeSelector.svelte';

	interface Props {
		product: DisplayProduct
		itemSelected: number,
		selectSize: (e: Event, index: number) => void
	}

	const { product, itemSelected, selectSize }: Props = $props();
</script>

<div>
	<h1 class="capitalize x-text-2xl font-bold mb-4">{product.brand} {product.productName}</h1>
	<div class="mb-4 flex flex-wrap justify-between gap-4">
		<SizeSelector items={product.items} selected={itemSelected} onSelect={selectSize} />
		<Price amount={product.items[itemSelected].price} size="lg" />
	</div>
</div>
