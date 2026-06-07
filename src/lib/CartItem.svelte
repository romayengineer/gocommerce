<script lang="ts">
	import { t } from 'svelte-i18n';
	import { Trash2 } from 'lucide-svelte';
	import Button from './Button.svelte';
	import Price from './Price.svelte';
	import QuantitySelector from './QuantitySelector.svelte';
	import { type CartItem } from './cart';

	interface Props {
		item: CartItem;
		onQuantityChange: (quantity: number) => void;
		onRemove: () => void;
	}

	const { item, onQuantityChange, onRemove }: Props = $props();
</script>

<div class="shadow border border-1 border-grey-100">
	<Button class="bg-white text-red-600 px-2 py-1 float-right" onclick={onRemove}>
		<Trash2 size={20} />
	</Button>
	<div class="grid grid-cols-[auto_1fr] py-4 px-2">
		{#if item.product.images.length > 0}
			<div class="w-16 h-30">
				<img src={item.product.images[0]} alt={item.product.nameComplete} class="w-full h-full object-cover rounded" />
			</div>
		{/if}
		<div class="flex flex-col">
			<h3 class="font-semibold text-lg pb-2 flex-1">{item.product.nameComplete}</h3>

			<div class="flex items-center gap-4">
				<QuantitySelector quantity={item.quantity} onchange={onQuantityChange} />
				<Price amount={item.product.price * item.quantity} size="md" />
			</div>
		</div>
	</div>
</div>
