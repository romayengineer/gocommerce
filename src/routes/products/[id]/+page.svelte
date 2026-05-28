<script>
	import { page } from '$app/stores';
	import { products } from '../../../lib/products';
	import { cart, addToCart } from '../../../lib/cart';

	$: product = products.find(p => p.id === $page.params.id);
	$: quantity = 1;

	function handleAddToCart() {
		addToCart(product, quantity);
		alert(`${product.name} added to cart!`);
	}
</script>

{#if product}
	<div class="max-w-6xl mx-auto px-4 py-12">
		<a href="/products" class="text-blue-600 hover:underline mb-6 inline-block">← Back to Products</a>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<div class="bg-gray-200 rounded-lg aspect-square flex items-center justify-center">
				<div class="text-6xl">{product.emoji}</div>
			</div>

			<div>
				<h1 class="text-4xl font-bold mb-4">{product.name}</h1>
				<p class="text-gray-600 mb-6">{product.category}</p>

				<div class="mb-6">
					<p class="text-3xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
					<p class="text-sm text-gray-500 mt-1">In Stock</p>
				</div>

				<p class="text-gray-700 mb-8 leading-relaxed">{product.description}</p>

				<div class="flex items-center gap-4 mb-8">
					<label for="qty" class="font-semibold">Quantity:</label>
					<input
						id="qty"
						type="number"
						bind:value={quantity}
						min="1"
						class="w-20 p-2 border rounded"
					/>
				</div>

				<button
					on:click={handleAddToCart}
					class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mb-4"
				>
					Add to Cart
				</button>

				<div class="bg-gray-50 p-4 rounded-lg">
					<h3 class="font-semibold mb-2">Product Details</h3>
					<ul class="space-y-2 text-sm text-gray-700">
						<li><strong>SKU:</strong> {product.id}</li>
						<li><strong>Category:</strong> {product.category}</li>
						<li><strong>Rating:</strong> ⭐ {product.rating}/5</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="max-w-6xl mx-auto px-4 py-12">
		<p class="text-xl text-gray-600">Product not found</p>
		<a href="/products" class="text-blue-600 hover:underline mt-4 inline-block">Back to Products</a>
	</div>
{/if}
