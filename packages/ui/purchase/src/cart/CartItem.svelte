<script lang="ts">
	import { t } from 'svelte-i18n';
	import { Trash2 } from '@lucide/svelte';
	import Price from '@gocommerce/ui-primitives/Price.svelte';
	import QuantitySelector from '@gocommerce/ui-primitives/QuantitySelector.svelte';
	import type { CartItemFull } from '@gocommerce/domain/cart';

	interface Props {
		item: CartItemFull;
		onQuantityChange: (quantity: number) => void;
		onRemove: () => void;
	}

	const { item, onQuantityChange, onRemove }: Props = $props();
</script>

<div class="border-b border-gray-100 bg-white lg:shadow">
	<div class="grid grid-cols-[auto_1fr] px-2 py-4">
		{#if item.product.images.length > 0}
			<div class="h-24 w-24">
				<img src={item.product.images[0]} alt={item.product.productName} class="h-full w-full rounded object-contain" />
			</div>
		{/if}
		<div class="flex flex-col pl-4">

			<div class="flex items-start">
				<h3 class="flex-1 pb-2 text-lg font-semibold">
					{item.product.brand} {item.product.productName} <span class="whitespace-nowrap">{item.product.size} ML</span>
				</h3>
				<button
					type="button"
					onclick={onRemove}
					aria-label={$t('cart.remove')}
					class="rounded p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-600"
				>
					<Trash2 size={20} />
				</button>
			</div>

			<div class="flex items-center gap-4">
				<QuantitySelector id={`qty-${item.product.itemId}`} quantity={item.quantity} onchange={onQuantityChange} />
				<Price amount={item.product.price * item.quantity} size="md" />
			</div>
		</div>
	</div>
</div>
