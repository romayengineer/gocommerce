<script lang="ts">
	import Button from './Button.svelte';
	import Link from './Link.svelte';
	import Price from './Price.svelte';
	import Rating from './Rating.svelte';
	import type { Product } from './products';
	import { addToCart } from './cart';

	const { product } = $props<{ product: Product }>();

	function handleAddToCart(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		addToCart(product, 1);
	}
</script>

<Link href="#/products/{product.id}" class="group no-underline">
	<div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
		<div class="bg-gray-100 aspect-square flex items-center justify-center group-hover:bg-gray-200 transition-colors">
			<div class="text-6xl">{product.emoji}</div>
		</div>

		<div class="p-4 flex flex-col flex-1">
			<h3 class="font-semibold text-lg mb-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
			<p class="text-gray-600 text-sm mb-2">{product.category}</p>

			<div class="flex items-center gap-2 mb-3">
				<Rating rating={product.rating} />
			</div>

			<p class="text-gray-700 text-sm mb-4 flex-1">{product.description.substring(0, 60)}...</p>

			<div class="flex items-center justify-between">
				<Price amount={product.price} size="lg" />
				<Button onclick={handleAddToCart}>Add</Button>
			</div>
		</div>
	</div>
</Link>
