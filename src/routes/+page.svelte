<script lang="ts">
	import { t } from 'svelte-i18n';
	import ProductGrid from '$lib/catalog/ProductGrid.svelte';
	import PageContainer from '$lib/ui/PageContainer.svelte';
	import Link from '$lib/ui/Link.svelte';
	import { productPage, sortedProducts, viewport } from '$lib/view';

	// number of rows for 10 products minimum
	const MIN_FEATURED_PRODUCTS = 10;
	let gridRows = $derived(Math.ceil(MIN_FEATURED_PRODUCTS / $viewport.columns));

	const featured = $derived($sortedProducts.slice(0, $viewport.columns * gridRows));
</script>

<PageContainer>
	<section class="mb-16">
		<div class="mb-8 rounded-lg bg-gradient-to-r from-primary-600 to-primary-800 p-12 text-white">
			<h1 class="mb-4 text-5xl font-bold">{$t('header.title')}</h1>
			<p class="mb-6 text-xl">{$t('home.browse')}</p>
			<Link href="#/products" variant="contrast">
				{$t('products.add')}
			</Link>
		</div>
	</section>

	<section>
		<ProductGrid products={featured} onProductImageFailed={(id) => productPage.handleProductImageFailed(id)}/>
	</section>
</PageContainer>
