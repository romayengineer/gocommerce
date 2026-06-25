<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import ProductView from '$lib/ProductView.svelte';
	import { products, productFullUrl } from '$lib/products';

	let productId: string = page.params.id!;

	let product = $derived(products.find(p => p.productId === productId));
	let fullUrl = $derived(productFullUrl(product))

	$effect(() => {
		if (fullUrl == '') return;
		goto(fullUrl, {
			replaceState: true
		})
	});

</script>

<ProductView {productId} />
