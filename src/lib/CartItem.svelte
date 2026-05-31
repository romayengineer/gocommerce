<script lang="ts">
	import { t } from 'svelte-i18n';
	import Button from './Button.svelte';
	import Price from './Price.svelte';
	import QuantitySelector from './QuantitySelector.svelte';
	import { clearCart, type CartItem } from './cart';
	import { isValidProduct } from './products';

	const { item, onQuantityChange, onRemove } = $props<{
		item: CartItem;
		onQuantityChange: (quantity: number) => void;
		onRemove: () => void;
	}>();

	if (!isValidProduct(item.product)) {
		clearCart();
	}
</script>

<div class="flex items-center gap-4 p-6 border-b">
	<div class="w-20 h-20">
		{#if item.product.images.length > 0}
			<img src={item.product.images[0]} alt={item.product.nameComplete} class="w-full h-full object-cover rounded" />
		{/if}
	</div>

	<div class="flex-1">
		<h3 class="font-semibold text-lg">{item.product.nameComplete}</h3>
		<Price amount={item.product.price} size="sm" class="text-gray-600" />
	</div>

	<div class="flex items-center">
		<QuantitySelector quantity={item.quantity} onchange={onQuantityChange} />
	</div>

	<div class="w-24 text-right">
		<Price amount={item.product.price * item.quantity} size="md" />
	</div>

	<Button variant="danger" class="px-3 py-1 text-sm" onclick={onRemove}>
		{$t('cart.remove')}
	</Button>
</div>
