<script lang="ts">
	import ProductCard from '../lib/ProductCard.svelte';
	import { products, type Product } from '../lib/products';

	const featured: Product[] = products.slice(0, 6);
</script>

<div class="max-w-7xl mx-auto px-4 py-12">
	<section class="mb-16">
		<div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-12 mb-8">
			<h1 class="text-5xl font-bold mb-4">Welcome to ShopHub</h1>
			<p class="text-xl mb-6">Discover amazing products at unbeatable prices</p>
			<a href="/products" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block">
				Shop Now
			</a>
		</div>
	</section>

	<section>
		<h2 class="text-3xl font-bold mb-8">Featured Products</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each featured as product (product.id)}
				<ProductCard {product} />
			{/each}
		</div>
	</section>
</div>
