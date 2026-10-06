<script lang="ts">
	import ProductGrid from '$lib/ProductGrid.svelte';
	import ProductFiltersMobile from '$lib/ProductFiltersMobile.svelte';
	import { productPage, sortedProducts } from '$lib/view';
</script>

<div class="max-w-8xl mx-auto py-1">

	<div class="flex flex-col lg:flex-row gap-2">
		<ProductFiltersMobile store={productPage} />

		<div class="flex-1">
			<ProductGrid products={$sortedProducts} onProductImageFailed={(id) => productPage.handleProductImageFailed(id)} />
		</div>
	</div>
</div>