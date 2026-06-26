<script lang="ts">
	import { t } from 'svelte-i18n';
	import { ShoppingCart } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import Button from '$lib/Button.svelte';
	import CartItem from '$lib/CartItem.svelte';
	import EmptyState from '$lib/EmptyState.svelte';
	import OrderSummaryLine from '$lib/OrderSummaryLine.svelte';
	import SidePanel from '$lib/SidePanel.svelte';
	import { cartProducts, removeFromCart, updateQuantity } from '$lib/cart';

	let total = $derived($cartProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
</script>

<div class="mx-auto max-w-6xl px-2 py-6 md:py-12">
	<div class="flex items-center gap-2 mb-2 md:mb-6">
		<ShoppingCart size={30} />
		<h1 class="capitalize x-text-xl">{$t('cart.title')}</h1>
	</div>

	{#if $cartProducts.length === 0}
		<EmptyState message={$t('cart.empty')} actionHref="#/products" actionLabel={$t('cart.continueShopping')} />
	{:else}
		<div class="grid grid-cols-1 lg:grid-cols-3 lg:gap-2">
			<div class="grid lg:col-span-2 lg:gap-2">
				{#each $cartProducts as item (item.product.itemId)}
					<CartItem
						{item}
						onQuantityChange={(qty) => updateQuantity(item.product.productId, item.product.itemId, qty)}
						onRemove={() => removeFromCart(item.product.productId, item.product.itemId)}
					/>
				{/each}
			</div>

			<div class="lg:col-span-1">
				<SidePanel sticky={true}>
					<div class="mb-6">
						<OrderSummaryLine label={$t('cart.total') + ':'} amount={total} isBold={true} />
					</div>

					<Button class="w-full py-3 mb-3 whitespace-nowrap" onclick={() => goto('#/checkout')}>
						{$t('cart.checkout')}
					</Button>

					<Button class="w-full py-3 whitespace-nowrap" variant="secondary" onclick={() => goto('#/products')}>
						{$t('cart.keepBuying')}
					</Button>
				</SidePanel>
			</div>
		</div>
	{/if}
</div>
