<script lang="ts">
	import { page } from '$app/stores';
	import { products } from '$lib/products';
	import { addToCart } from '$lib/cart';
	import Link from '$lib/Link.svelte';
	import Price from '$lib/Price.svelte';
	import ProductImage from '$lib/ProductImage.svelte';
	import ProductHeader from '$lib/ProductHeader.svelte';
	import ProductDescription from '$lib/ProductDescription.svelte';
	import QuantitySelector from '$lib/QuantitySelector.svelte';
	import AddToCartAction from '$lib/AddToCartAction.svelte';
	import ProductDetailsBox from '$lib/ProductDetailsBox.svelte';
	import ProductNotFound from '$lib/ProductNotFound.svelte';

	let quantity = $state(1);

	let product = $derived(products.find(p => p.id === $page.params.id));

	function handleAddToCart() {
		if (product) {
			addToCart(product, quantity);
		}
	}
</script>

{#if product}
	<div class="max-w-6xl mx-auto px-4 py-12">
		<Link href="#/products" class="mb-6 inline-block">← Back to Products</Link>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<ProductImage emoji={product.emoji} alt={product.name} />

			<div>
				<ProductHeader name={product.name} category={product.category} />

				<div class="mb-6">
					<Price amount={product.price} size="lg" />
					<p class="text-sm text-gray-500 mt-1">In Stock</p>
				</div>

				<ProductDescription text={product.description} />

				<div class="mb-8">
					<QuantitySelector {quantity} onchange={(q) => (quantity = q)} />
				</div>

				<div class="mb-4">
					<AddToCartAction onclick={handleAddToCart} />
				</div>

				<ProductDetailsBox id={product.id} category={product.category} rating={product.rating} />
			</div>
		</div>
	</div>
{:else}
	<ProductNotFound />
{/if}
