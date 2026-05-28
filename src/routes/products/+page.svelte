<script lang="ts">
	import ProductGrid from '../../lib/ProductGrid.svelte';
	import ProductFilters from '../../lib/ProductFilters.svelte';
	import { products, type Product } from '../../lib/products';

	let sortBy = $state('name');
	let filterCategory = $state('all');

	const categories: string[] = ['all', ...new Set(products.map(p => p.category))];

	let filtered = $derived(
		filterCategory === 'all'
			? products
			: products.filter(p => p.category === filterCategory)
	);

	let sorted = $derived(
		[...filtered].sort((a, b) => {
			if (sortBy === 'name') return a.name.localeCompare(b.name);
			if (sortBy === 'price-low') return a.price - b.price;
			if (sortBy === 'price-high') return b.price - a.price;
			return 0;
		})
	);
</script>

<div class="max-w-7xl mx-auto px-4 py-12">
	<h1 class="text-4xl font-bold mb-8">All Products</h1>

	<div class="flex flex-col md:flex-row gap-8">
		<aside class="md:w-48">
			<ProductFilters
				{sortBy}
				{filterCategory}
				{categories}
				onSortChange={(value) => (sortBy = value)}
				onCategoryChange={(value) => (filterCategory = value)}
			/>
		</aside>

		<div class="flex-1">
			<p class="text-gray-600 mb-6">Showing {sorted.length} product{sorted.length !== 1 ? 's' : ''}</p>
			<ProductGrid products={sorted} />
		</div>
	</div>
</div>
