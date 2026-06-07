<script lang="ts">
	import { t } from 'svelte-i18n';
	import { ShoppingCart } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import Button from '$lib/Button.svelte';
	import CartItem from '$lib/CartItem.svelte';
	import EmptyState from '$lib/EmptyState.svelte';
	import OrderSummaryLine from '$lib/OrderSummaryLine.svelte';
	import SidePanel from '$lib/SidePanel.svelte';
	import { cart, removeFromCart, updateQuantity } from '$lib/cart';

	let total = $derived($cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
</script>

<div class="max-w-5xl mx-auto px-2 py-6 md:py-12">
	<div class="flex items-center gap-2 mb-2 md:mb-6">
		<ShoppingCart size={30} />
		<h1 class="x-font-title">{$t('cart.title')}</h1>
	</div>

	{#if $cart.length === 0}
		<EmptyState message={$t('cart.empty')} actionHref="#/products" actionLabel={$t('cart.continueShopping')} />
	{:else}
		<div class="grid grid-cols-1 lg:grid-cols-3 md:gap-8">
			<div class="lg:col-span-2">
				<div class="bg-white py-2">
					{#each $cart as item (item.product.itemId)}
						<CartItem
							{item}
							onQuantityChange={(qty) => updateQuantity(item.product.itemId, qty)}
							onRemove={() => removeFromCart(item.product.itemId)}
						/>
					{/each}
				</div>
			</div>

			<div class="h-fit">
				<SidePanel sticky={true}>

					<div class="mb-6">
						<OrderSummaryLine label={$t('cart.total') + ':'} amount={total + (total > 100 ? 0 : 10) + total * 0.1} isBold={true} />
					</div>

					<Button class="w-full py-3 mb-3" onclick={() => goto('#/checkout')}>
						{$t('cart.checkout')}
					</Button>

					<Button variant="secondary" class="w-full py-3" onclick={() => goto('#/products')}>
						{$t('cart.keepBuying')}
					</Button>
				</SidePanel>
			</div>
		</div>
	{/if}
</div>
