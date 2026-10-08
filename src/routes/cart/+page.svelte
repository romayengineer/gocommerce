<script lang="ts">
	import { t } from 'svelte-i18n';
	import { ShoppingCart } from 'lucide-svelte';
	import Button from '$lib/ui/Button.svelte';
	import CartItem from '$lib/cart/CartItem.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import OrderSummaryLine from '$lib/cart/OrderSummaryLine.svelte';
	import Card from '$lib/ui/Card.svelte';
	import PageContainer from '$lib/ui/PageContainer.svelte';
	import PageTitle from '$lib/ui/PageTitle.svelte';
	import { cartProducts, cartTotal, removeFromCart, updateQuantity } from '@gocommerce/composition/view/cart';
	import { router } from '@gocommerce/composition/view/router';

	let total = $derived($cartTotal);
</script>

<PageContainer>
	<PageTitle title={$t('cart.title')}>
		<ShoppingCart size={30} />
	</PageTitle>

	{#if $cartProducts.length === 0}
		<EmptyState message={$t('cart.empty')} actionHref="#/products" actionLabel={$t('cart.continueShopping')} />
	{:else}
		<div class="grid grid-cols-1 gap-2 lg:grid-cols-3">
			<div class="grid gap-2 lg:col-span-2">
				{#each $cartProducts as item (item.product.itemId)}
					<CartItem
						{item}
						onQuantityChange={(qty) => updateQuantity(item.product.productId, item.product.itemId, qty)}
						onRemove={() => removeFromCart(item.product.productId, item.product.itemId)}
					/>
				{/each}
			</div>

			<div class="lg:col-span-1">
				<Card sticky={true}>
					<div class="mb-6">
						<OrderSummaryLine label={$t('cart.total') + ':'} amount={total} isBold={true} />
					</div>

					<Button class="mb-3 w-full whitespace-nowrap py-3" onclick={() => router.navigate('#/checkout')}>
						{$t('cart.checkout')}
					</Button>

					<Button class="w-full whitespace-nowrap py-3" variant="secondary" onclick={() => router.navigate('#/products')}>
						{$t('cart.keepBuying')}
					</Button>
				</Card>
			</div>
		</div>
	{/if}
</PageContainer>
