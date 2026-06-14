<script lang="ts">
	import ProductGrid from '$lib/ProductGrid.svelte';
	import ProductFilters from '$lib/ProductFilters.svelte';
	import ProductFiltersMobile from '$lib/ProductFiltersMobile.svelte';
	import { displayProductsList, deleteProduct } from '$lib/products';

	let sortBy = $state('random');
	let filterCategory = $state('all');
	let searchQuery = $state('');
	let debouncedSearchQuery = $state('');

	let displayProducts = $state(displayProductsList)

	$effect(() => {
		// IMPORTANT (_) ensure the effect properly tracks the dependency on searchQuery
		let _ = searchQuery;
		const timer = setTimeout(() => {
			debouncedSearchQuery = searchQuery;
		}, 1000);
		return () => clearTimeout(timer);
	})

	export function handleProductImageFailed(productId: string) {
		// delete from real list this way next time the component is mounted the list is already filtered
		deleteProduct(displayProductsList, productId)
		// delete from state which triggers the update
		deleteProduct(displayProducts, productId)
	}

	const categories: string[] = ['all', ...new Set(displayProducts.flatMap(p => p.categories))];

	let filtered = $derived(
		displayProducts
			.filter((p) => {
				if (filterCategory !== 'all' && !p.categories.some(cat => cat.endsWith(`${filterCategory}/`))) {
					return false;
				}
				if (debouncedSearchQuery.trim() !== '') {
					const query = debouncedSearchQuery.toLowerCase();
					return p.nameComplete.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
				}
				return true;
			})
	);

	let sorted = $derived(
		(sortBy === 'random') ?
			filtered
		: [...filtered].sort((a, b) => {
				if (sortBy === 'name') return a.productName.localeCompare(b.productName);
				if (sortBy === 'price-low') return a.price - b.price;
				if (sortBy === 'price-high') return b.price - a.price;
				return 0;
			})
	);
</script>

<div class="max-w-7xl mx-auto py-1">

	<div class="flex flex-col lg:flex-row gap-2">
		<div class="block lg:hidden">
			<ProductFiltersMobile
				{sortBy}
				{filterCategory}
				{searchQuery}
				{categories}
				onSortChange={(value) => (sortBy = value)}
				onCategoryChange={(value) => (filterCategory = value)}
				onSearchChange={(value) => (searchQuery = value)}
			/>
		</div>
		<div class="hidden lg:flex">
			<ProductFilters
				{sortBy}
				{filterCategory}
				{searchQuery}
				{categories}
				onSortChange={(value) => (sortBy = value)}
				onCategoryChange={(value) => (filterCategory = value)}
				onSearchChange={(value) => (searchQuery = value)}
			/>
		</div>

		<div class="flex-1">
			<ProductGrid products={sorted} onProductImageFailed={handleProductImageFailed} />
		</div>
	</div>
</div>
