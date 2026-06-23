<script lang="ts">
	import ProductGrid from '$lib/ProductGrid.svelte';
	import ProductFiltersMobile from '$lib/ProductFiltersMobile.svelte';
	import { productPageStore } from '$lib/productPageStore.svelte';

	$effect(() => {
		productPageStore.sorted;
		window.scrollTo(0, 0);
	});
</script>

<div class="max-w-8xl mx-auto py-1">

	<div class="flex flex-col lg:flex-row gap-2">
		<ProductFiltersMobile store={productPageStore} />

		<div class="flex-1">
			<ProductGrid products={productPageStore.sorted} onProductImageFailed={(id) => productPageStore.handleProductImageFailed(id)} />
		</div>
	</div>
</div>
