<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import ProductGrid from '$lib/ProductGrid.svelte';
	import ProductFilters from '$lib/ProductFilters.svelte';
	import ProductFiltersMobile from '$lib/ProductFiltersMobile.svelte';
	import { displayProductsList, deleteProduct } from '$lib/products';

	let isMobile = $state(false);

	let sortBy = $state('name');
	let filterCategory = $state('all');
	let searchQuery = $state('');

	onMount(() => {
		const checkMobile = () => {
			isMobile = window.innerWidth < 768;
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	});

	let displayProducts = $state(displayProductsList)

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
				if (searchQuery.trim() !== '') {
					const query = searchQuery.toLowerCase();
					return p.nameComplete.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query);
				}
				return true;
			})
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

<div class="max-w-7xl mx-auto px-4 py-4">
	<h1 class="x-text-xl font-bold mb-8">{$t('products.title')}</h1>

	<div class="flex flex-col md:flex-row gap-8">
		<aside class="md:w-48">
			{#if isMobile}
				<ProductFiltersMobile
					{sortBy}
					{filterCategory}
					{searchQuery}
					{categories}
					onSortChange={(value) => (sortBy = value)}
					onCategoryChange={(value) => (filterCategory = value)}
					onSearchChange={(value) => (searchQuery = value)}
				/>
			{:else}
				<ProductFilters
					{sortBy}
					{filterCategory}
					{searchQuery}
					{categories}
					onSortChange={(value) => (sortBy = value)}
					onCategoryChange={(value) => (filterCategory = value)}
					onSearchChange={(value) => (searchQuery = value)}
				/>
			{/if}
		</aside>

		<div class="flex-1">
			<p class="text-gray-600 mb-6">{$t('products.add')} {sorted.length} {sorted.length !== 1 ? 's' : ''}</p>
			<ProductGrid products={sorted} onProductImageFailed={handleProductImageFailed} />
		</div>
	</div>
</div>
