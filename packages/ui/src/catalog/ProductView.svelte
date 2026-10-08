<script lang="ts">
	import { t } from 'svelte-i18n';
	import { catalogProducts, addToCart } from '@gocommerce/composition/view';
	import ProductImageCarousel from '$lib/catalog/ProductImageCarousel.svelte';
	import ProductHeader from '$lib/catalog/ProductHeader.svelte';
	import QuantitySelector from '$lib/ui/QuantitySelector.svelte';
	import AddToCartAction from '$lib/catalog/AddToCartAction.svelte';
	import ProductDetailsBox from '$lib/catalog/ProductDetailsBox.svelte';
	import ProductNotFound from '$lib/catalog/ProductNotFound.svelte';
	import PageContainer from '$lib/ui/PageContainer.svelte';

	let { productId }: { productId: string } = $props();

	let quantity = $state(1);

	let product = $derived($catalogProducts.find((p) => p.productId === productId));

	let itemSelected = $state(0);

	let itemId = $derived(product?.items[itemSelected].itemId);

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
	<PageContainer class="py-6 md:py-5">
		<div class="mb-2 md:float-left md:mr-4 md:mb-0 md:w-1/2">
			<ProductImageCarousel images={product.images} alt={product.productName} />
		</div>

		<ProductHeader {product} {itemSelected} {selectSize}/>

		<div class="mb-8 flex flex-wrap justify-between">
			<QuantitySelector {quantity} onchange={(q) => (quantity = q)} />
			<AddToCartAction onclick={handleAddToCart} />
		</div>

		<div class="mb-8">
			<h4 class="mb-2 font-semibold">{$t('productDetail.description')}</h4>
			<p class="whitespace-pre-wrap text-gray-700">{product.description}</p>
		</div>

		{#if product.properties.length > 0}
			<div class="mb-8">
				<h4 class="mb-4 font-semibold">{$t('productDetail.properties')}</h4>
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

		<ProductDetailsBox productId={product.productId} productName={product.productName} brand={product.brand} />
	</PageContainer>
{:else}
	<ProductNotFound />
{/if}
