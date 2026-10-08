<script lang="ts">
	import { page } from '$app/state';
	import ProductView from '$lib/catalog/ProductView.svelte';
	import { catalog, productFullUrl } from '@gocommerce/composition/view/catalog';
	import { router } from '@gocommerce/composition/view/router';

	let productId: string = page.params.id!;

	let fullUrl = $derived(productFullUrl(catalog.findByProductId(productId)));

	$effect(() => {
		if (fullUrl == '') return;
		router.navigate(fullUrl, {
			replaceState: true
		});
	});
</script>

<ProductView {productId} />
