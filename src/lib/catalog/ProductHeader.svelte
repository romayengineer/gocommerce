<script lang="ts">
	import Price from '$lib/ui/Price.svelte';
	import type { DisplayProduct } from '$core/domain/product';
	import SizeSelector from '$lib/catalog/SizeSelector.svelte';

	interface Props {
		product: DisplayProduct
		itemSelected: number,
		selectSize: (e: Event, index: number) => void
	}

	const { product, itemSelected, selectSize }: Props = $props();
</script>

<div>
	<h1 class="x-text-2xl mb-4 font-bold">{product.brand} {product.productName}</h1>
	<div class="mb-4 flex flex-wrap justify-between gap-4">
		<SizeSelector items={product.items} selected={itemSelected} onSelect={selectSize} />
		<Price amount={product.items[itemSelected].price} size="lg" />
	</div>
</div>
