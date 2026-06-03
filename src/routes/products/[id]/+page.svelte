<script lang="ts">
	import { t } from 'svelte-i18n';
	import { page } from '$app/stores';
	import { getDisplayProducts } from '$lib/products';
	import { addToCart } from '$lib/cart';
	import Link from '$lib/Link.svelte';
	import Price from '$lib/Price.svelte';
	import ProductImage from '$lib/ProductImage.svelte';
	import ProductHeader from '$lib/ProductHeader.svelte';
	import QuantitySelector from '$lib/QuantitySelector.svelte';
	import AddToCartAction from '$lib/AddToCartAction.svelte';
	import ProductDetailsBox from '$lib/ProductDetailsBox.svelte';
	import ProductNotFound from '$lib/ProductNotFound.svelte';

	let quantity = $state(1);

	let product = $derived(getDisplayProducts().find(p => p.itemId === $page.params.id));

	function handleAddToCart() {
		if (product) {
			addToCart(product, quantity);
		}
	}
</script>

{#if product}
	<div class="max-w-6xl mx-auto px-4 py-12">
		<Link href="#/products" class="mb-6 inline-block">{$t('productDetail.backToProducts')}</Link>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<ProductImage images={product.images} alt={product.nameComplete} />

			<div>
				<ProductHeader name={product.nameComplete} category={product.brand} />

				<div class="mb-6">
					<Price amount={product.price} size="lg" />
					<p class="text-sm text-gray-500 mt-1">{$t('productDetail.inStock')}</p>
				</div>

				<div class="mb-8">
					<h4 class="font-semibold mb-2">Description:</h4>
					<p class="text-gray-700">{@html product.description}</p>
				</div>

				{#if product.properties.length > 0}
					<div class="mb-8">
						<h4 class="font-semibold mb-4">Properties:</h4>
						<div class="space-y-3">
							{#each product.properties as prop (prop.name)}
								<div>
									<p class="text-sm font-medium text-gray-700">{prop.name}:</p>
									<p class="text-sm text-gray-600">{prop.values.join(', ')}</p>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<div class="mb-8">
					<QuantitySelector {quantity} onchange={(q) => (quantity = q)} />
				</div>

				<div class="mb-4">
					<AddToCartAction onclick={handleAddToCart} />
				</div>

				<ProductDetailsBox itemId={product.itemId} productName={product.nameComplete} brand={product.brand} />
			</div>
		</div>
	</div>
{:else}
	<ProductNotFound />
{/if}
