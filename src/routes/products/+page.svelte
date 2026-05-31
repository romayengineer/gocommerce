<script lang="ts">
	import { t } from 'svelte-i18n';
	import ProductGrid from '$lib/ProductGrid.svelte';
	import ProductFilters from '$lib/ProductFilters.svelte';
	import { getDisplayProducts } from '$lib/products';

	let sortBy = $state('name');
	let filterCategory = $state('all');

	const displayProducts = getDisplayProducts();
	const categories: string[] = ['all', ...new Set(displayProducts.flatMap(p => p.categories))];

	// fix filtered p.categories that end in filterCategory + /
	let filtered = $derived(
		filterCategory === 'all'
			? displayProducts
			: displayProducts.filter(p => p.categories.some(cat => cat.endsWith(`${filterCategory}/`)))
	);

	let sorted = $derived(
		[...filtered].sort((a, b) => {
			if (sortBy === 'name') return a.productName.localeCompare(b.productName);
			if (sortBy === 'price-low') return a.price - b.price;
			if (sortBy === 'price-high') return b.price - a.price;
			return 0;
		})
	);
</script>

<div class="max-w-7xl mx-auto px-4 py-12">
	<h1 class="text-4xl font-bold mb-8">{$t('products.title')}</h1>

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
			<p class="text-gray-600 mb-6">{$t('products.add')} {sorted.length} {sorted.length !== 1 ? 's' : ''}</p>
			<ProductGrid products={sorted} />
		</div>
	</div>
</div>
