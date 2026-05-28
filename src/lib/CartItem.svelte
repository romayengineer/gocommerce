<script lang="ts">
	import Button from './Button.svelte';
	import Price from './Price.svelte';
	import QuantitySelector from './QuantitySelector.svelte';
	import type { CartItem as CartItemType } from './cart';

	interface Props {
		item: CartItemType;
		onQuantityChange: (quantity: number) => void;
		onRemove: () => void;
	}

	const { item, onQuantityChange, onRemove } = $props<Props>();
</script>

<div class="flex items-center gap-4 p-6 border-b">
	<div class="text-4xl">{item.product.emoji}</div>

	<div class="flex-1">
		<h3 class="font-semibold text-lg">{item.product.name}</h3>
		<Price amount={item.product.price} size="sm" class="text-gray-600" />
	</div>

	<div class="flex items-center">
		<QuantitySelector quantity={item.quantity} onchange={onQuantityChange} />
	</div>

	<div class="w-24 text-right">
		<Price amount={item.product.price * item.quantity} size="md" />
	</div>

	<Button variant="danger" class="px-3 py-1 text-sm" onclick={onRemove}>
		Remove
	</Button>
</div>
