<script lang="ts">
	import { page } from '$app/stores';
	import { displayProductsList } from '$lib/products';
	import { addToCart } from '$lib/cart';
	import ProductImage from '$lib/ProductImage.svelte';
	import ProductHeader from '$lib/ProductHeader.svelte';
	import QuantitySelector from '$lib/QuantitySelector.svelte';
	import AddToCartAction from '$lib/AddToCartAction.svelte';
	import ProductDetailsBox from '$lib/ProductDetailsBox.svelte';
	import ProductNotFound from '$lib/ProductNotFound.svelte';

	let quantity = $state(1);

	let product = $derived(displayProductsList.find(p => p.productId === $page.params.id));

	let itemSelected = $state(0)

	let itemId = $derived(product?.items[itemSelected].itemId)

	function selectSize(e: Event, index: number) {
		e.preventDefault();
		itemSelected = index;
	}

	function handleAddToCart() {
		if (product) {
			addToCart(product.productId, itemId!, quantity);
		}
	}
</script>

{#if product}
	<div class="max-w-8xl mx-auto px-2 md:px-4 md:pt-5">
		<div class="md:float-left md:w-1/2 md:mr-4 mb-2 md:mb-0">
			<ProductImage images={product.images} alt={product.nameComplete} />
		</div>

		<ProductHeader {product} {itemSelected} {selectSize}/>

		<div class="mb-8 flex flex-wrap justify-between">
			<QuantitySelector {quantity} onchange={(q) => (quantity = q)} />
			<AddToCartAction onclick={handleAddToCart} />
		</div>

		<div class="mb-8">
			<h4 class="font-semibold mb-2">Description:</h4>
			<p class="text-gray-700 whitespace-pre-wrap">{product.description}</p>
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

		<ProductDetailsBox productId={product.productId} productName={product.nameComplete} brand={product.brand} />
	</div>
{:else}
	<ProductNotFound />
{/if}
