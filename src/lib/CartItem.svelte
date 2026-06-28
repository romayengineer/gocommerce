<script lang="ts">
	import { Trash2 } from 'lucide-svelte';
	import Button from './Button.svelte';
	import Price from './Price.svelte';
	import QuantitySelector from './QuantitySelector.svelte';
	import type { CartItemFull } from './cart';

	interface Props {
		item: CartItemFull;
		onQuantityChange: (quantity: number) => void;
		onRemove: () => void;
	}

	const { item, onQuantityChange, onRemove }: Props = $props();
</script>

<div class="border-b border-1 border-grey-100 bg-white lg:shadow">
	<div class="grid grid-cols-[auto_1fr] py-4 px-2">
		{#if item.product.images.length > 0}
			<div class="w-24 h-24">
				<img src={item.product.images[0]} alt={item.product.productName} class="w-full h-full object-contain rounded" />
			</div>
		{/if}
		<div class="flex flex-col pl-4">

			<div class="flex items-start">
				<h3 class="capitalize font-semibold text-lg pb-2 flex-1">
					{item.product.brand} {item.product.productName} <span class="whitespace-nowrap">{item.product.size} ML</span>
				</h3>
				<Button class="px-2 py-1 bg-white hover:bg-white" onclick={onRemove}>
					<Trash2 size={20} class="bg-white text-gray-500"/>
				</Button>
			</div>

			<div class="flex items-center gap-4">
				<QuantitySelector quantity={item.quantity} onchange={onQuantityChange} />
				<Price amount={item.product.price * item.quantity} size="md" />
			</div>
		</div>
	</div>
</div>
