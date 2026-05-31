<script lang="ts">
	import { t } from 'svelte-i18n';
	import Button from './Button.svelte';
	import Link from './Link.svelte';
	import Price from './Price.svelte';
	import ProductImage from './ProductImage.svelte';
	import type { DisplayProduct } from './products';
	import { addToCart } from './cart';

	interface Props {
		product: DisplayProduct;
	}

	const { product }: Props = $props();

	function handleAddToCart(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		addToCart(product, 1);
	}
</script>

<Link href="#/products/{product.itemId}" class="group no-underline">
	<div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
		<div class="group-hover:opacity-80 transition-opacity">
			<ProductImage images={product.images} alt={product.nameComplete} showNavigation={false} />
		</div>

		<div class="p-4 flex flex-col flex-1">
			<h3 class="font-semibold text-lg mb-1 group-hover:text-blue-600 transition-colors">{product.productName}</h3>
			<p class="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>

			<p class="text-gray-700 text-sm mb-4 flex-1 font-medium">{product.brand}</p>

			<div class="flex items-center justify-between">
				<Price amount={product.price} size="lg" />
				<Button onclick={handleAddToCart}>{$t('products.add')}</Button>
			</div>
		</div>
	</div>
</Link>
