<script lang="ts">
	import { t } from 'svelte-i18n';
	import Button from '$lib/Button.svelte';
	import CartItem from '$lib/CartItem.svelte';
	import EmptyState from '$lib/EmptyState.svelte';
	import OrderSummaryLine from '$lib/OrderSummaryLine.svelte';
	import SidePanel from '$lib/SidePanel.svelte';
	import { cart, removeFromCart, updateQuantity, clearCart } from '$lib/cart';

	let total = $derived($cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
	let itemCount = $derived($cart.reduce((sum, item) => sum + item.quantity, 0));
</script>

<div class="max-w-4xl mx-auto px-4 py-12">
	<h1 class="text-4xl font-bold mb-8">{$t('cart.title')}</h1>

	{#if $cart.length === 0}
		<EmptyState message={$t('cart.empty')} actionHref="#/products" actionLabel={$t('cart.continueShopping')} />
	{:else}
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<div class="lg:col-span-2">
				<div class="bg-white rounded-lg shadow">
					{#each $cart as item (item.product.id)}
						<CartItem
							{item}
							onQuantityChange={(qty) => updateQuantity(item.product.id, qty)}
							onRemove={() => removeFromCart(item.product.id)}
						/>
					{/each}
				</div>
			</div>

			<div class="h-fit">
				<SidePanel title={$t('cart.title')} sticky={true}>

					<div class="space-y-3 mb-6 pb-6 border-b">
						<OrderSummaryLine label={$t('cart.subtotal') + ':'} amount={total} />
						<OrderSummaryLine label={$t('cart.shipping') + ':'} amount={total > 100 ? 0 : 10} />
						<OrderSummaryLine label={$t('cart.tax') + ':'} amount={total * 0.1} />
					</div>

					<div class="mb-6">
						<OrderSummaryLine label={$t('cart.total') + ':'} amount={total + (total > 100 ? 0 : 10) + total * 0.1} isBold={true} />
					</div>

					<Button class="w-full py-3 mb-3">
						{$t('cart.checkout')}
					</Button>

					<Button variant="secondary" class="w-full py-3" onclick={() => clearCart()}>
						{$t('cart.title')}
					</Button>

					{#if total > 100}
						<div class="mt-4 bg-green-50 border border-green-200 rounded p-3 text-sm text-green-700">
							🎉 Free shipping on orders over $100!
						</div>
					{/if}
				</SidePanel>
			</div>
		</div>
	{/if}
</div>
