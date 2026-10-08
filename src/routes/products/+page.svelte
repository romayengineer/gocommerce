<script lang="ts">
	import ProductGrid from '@gocommerce/ui-catalog/ProductGrid.svelte';
	import ProductFiltersMobile from '@gocommerce/ui-catalog/ProductFiltersMobile.svelte';
	import PageContainer from '@gocommerce/ui-primitives/PageContainer.svelte';
	import { productPage, sortedProducts } from '@gocommerce/composition/view/products';
</script>

<PageContainer class="py-1">

	<div class="flex flex-col gap-2 lg:flex-row">
		<ProductFiltersMobile />

		<div class="flex-1">
			<ProductGrid products={$sortedProducts} onProductImageFailed={(id) => productPage.handleProductImageFailed(id)} />
		</div>
	</div>
</PageContainer>
