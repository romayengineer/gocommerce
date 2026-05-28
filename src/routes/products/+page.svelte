<script>
	import ProductCard from '../../lib/ProductCard.svelte';
	import { products } from '../../lib/products';

	let sortBy = 'name';
	let filterCategory = 'all';

	const categories = ['all', ...new Set(products.map(p => p.category))];

	$: filtered = filterCategory === 'all'
		? products
		: products.filter(p => p.category === filterCategory);

	$: sorted = [...filtered].sort((a, b) => {
		if (sortBy === 'name') return a.name.localeCompare(b.name);
		if (sortBy === 'price-low') return a.price - b.price;
		if (sortBy === 'price-high') return b.price - a.price;
		return 0;
	});
</script>

<div class="max-w-7xl mx-auto px-4 py-12">
	<h1 class="text-4xl font-bold mb-8">All Products</h1>

	<div class="flex flex-col md:flex-row gap-8">
		<aside class="md:w-48">
			<div class="bg-white p-6 rounded-lg shadow">
				<h3 class="font-bold text-lg mb-4">Filters</h3>

				<div class="mb-6">
					<h4 class="font-semibold mb-3">Category</h4>
					<div class="space-y-2">
						{#each categories as cat}
							<label class="flex items-center cursor-pointer">
								<input
									type="radio"
									bind:group={filterCategory}
									value={cat}
									class="mr-2"
								/>
								<span class="capitalize">{cat}</span>
							</label>
						{/each}
					</div>
				</div>

				<div>
					<h4 class="font-semibold mb-3">Sort By</h4>
					<select bind:value={sortBy} class="w-full p-2 border rounded">
						<option value="name">Name (A-Z)</option>
						<option value="price-low">Price (Low to High)</option>
						<option value="price-high">Price (High to Low)</option>
					</select>
				</div>
			</div>
		</aside>

		<div class="flex-1">
			<p class="text-gray-600 mb-6">Showing {sorted.length} product{sorted.length !== 1 ? 's' : ''}</p>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each sorted as product (product.id)}
					<ProductCard {product} />
				{/each}
			</div>
		</div>
	</div>
</div>
