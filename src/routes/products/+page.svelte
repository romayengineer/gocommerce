<script lang="ts">
	import ProductGrid from '$lib/catalog/ProductGrid.svelte';
	import ProductFiltersMobile from '$lib/catalog/ProductFiltersMobile.svelte';
	import PageContainer from '$lib/ui/PageContainer.svelte';
	import { productPage, sortedProducts } from '$lib/view';
</script>

<PageContainer class="py-1">

	<div class="flex flex-col gap-2 lg:flex-row">
		<ProductFiltersMobile />

		<div class="flex-1">
			<ProductGrid products={$sortedProducts} onProductImageFailed={(id) => productPage.handleProductImageFailed(id)} />
		</div>
	</div>
</PageContainer>
