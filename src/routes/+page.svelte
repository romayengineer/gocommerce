<script lang="ts">
	import { t } from 'svelte-i18n';
	import ProductGrid from '$lib/ProductGrid.svelte';
	import { getDisplayProducts } from '$lib/products';

	const featured = getDisplayProducts().slice(0, 6);
</script>

<div class="max-w-7xl mx-auto px-4 py-12">
	<section class="mb-16">
		<div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-12 mb-8">
			<h1 class="text-5xl font-bold mb-4">{$t('header.title')}</h1>
			<p class="text-xl mb-6">{$t('home.browse')}</p>
			<a href="#/products" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block">
				{$t('products.add')}
			</a>
		</div>
	</section>

	<section>
		<h2 class="text-3xl font-bold mb-8">{$t('home.featured')}</h2>
		<ProductGrid products={featured} />
	</section>
</div>
