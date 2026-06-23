<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import ProductView from '$lib/ProductView.svelte';
	import { displayProductsList, productFullUrl } from '$lib/products';

	let productId: string = $page.params.id!;

	let product = $derived(displayProductsList.find(p => p.productId === productId));
	let fullUrl = $derived(productFullUrl(product))

	$effect(() => {
		if (fullUrl == '') return;
		goto(fullUrl, {
			replaceState: true
		})
	});

</script>

<ProductView {productId} />
