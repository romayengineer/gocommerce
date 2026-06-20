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
	<h1 class="capitalize x-text-2xl font-bold mb-4">{product.nameComplete}</h1>
	<div class="mb-4">
		<SizeSelector items={product.items} selected={itemSelected} onSelect={selectSize} />
	</div>
	<div class="mb-6 flex flex-wrap items-center gap-4">
		<span class="capitalize text-xl text-gray-600">{product.brand}</span>
		<Price amount={product.items[itemSelected].price} size="lg" />
	</div>
</div>
