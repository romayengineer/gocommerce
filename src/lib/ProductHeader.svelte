<script lang="ts">
	import Price from '$lib/Price.svelte';
	import type { DisplayProduct } from './products';
	import SizeSelector from './SizeSelector.svelte';

	interface Props {
		product: DisplayProduct
	}

	const { product }: Props = $props();

	let itemSelected = $state(0)

	function selectSize(e: Event, index: number) {
		e.preventDefault();
		itemSelected = index;
	}
</script>

<div>
	<h1 class="x-text-2xl font-bold mb-4">{product.nameComplete}</h1>
	<div class="mb-4">
		<SizeSelector items={product.items} selected={itemSelected} onSelect={selectSize} />
	</div>
	
	<div class="grid grid-cols-2 gap-10">
		<p class="text-xl text-gray-600 mb-6 whitespace-nowrap">{product.brand}</p>

		<div class="mb-6">
			<Price amount={product.items[itemSelected].price} size="lg" />
		</div>
	</div>
</div>
