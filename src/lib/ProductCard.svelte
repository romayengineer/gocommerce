<script lang="ts">
	import Button from './Button.svelte';
	import Link from './Link.svelte';
	import Price from './Price.svelte';
	import ProductImage from './ProductImage.svelte';
	import type { DisplayProduct } from './products';
	import { addToCart } from './cart';
	import { ShoppingCart } from 'lucide-svelte';

	interface Props {
		product: DisplayProduct;
		onImageLoaded?: (loaded: boolean) => void;
		height?: number;
	}

	const { product, onImageLoaded, height = 40 }: Props = $props();

	function handleAddToCart(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		addToCart(product.itemId, 1);
	}

	function handleImageLoaded(loaded: boolean) {
		onImageLoaded?.(loaded);
	}
</script>

<Link href="#/products/{product.itemId}" class="group no-underline">
	<div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col" style="height: {height}rem">
		<div class="group-hover:opacity-80 transition-opacity">
			<ProductImage
				images={product.images}
				alt={product.nameComplete}
				showNavigation={false}
				onImageLoaded={handleImageLoaded}
			/>
		</div>

		<div class="p-4 flex flex-col flex-1 justify-between">
			<div>
				<h3 class="font-semibold x-text-lg mb-1 group-hover:text-blue-600 transition-colors">{product.nameComplete}</h3>
				<div class="max-h-0 md:max-h-full text-gray-600 text-sm mb-2 line-clamp-2 prose prose-sm max-w-none overflow-hidden">
					{product.description}
				</div>
				<p class="text-gray-700 text-sm mb-4 font-medium">{product.brand}</p>
			</div>
			<Button onclick={handleAddToCart} class="w-full md:w-auto flex items-center justify-center gap-2 whitespace-nowrap">
				<ShoppingCart size={25} class='flex-shrink-0'/>
				<Price amount={product.price} size="md" />
			</Button>
		</div>
	</div>
</Link>
