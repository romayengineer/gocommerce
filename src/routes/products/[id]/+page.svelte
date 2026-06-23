<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import ProductView from '$lib/ProductView.svelte';
	import { displayProductsList } from '$lib/products';
	import type { DisplayProduct } from '$lib/products';

	let productId: string = $page.params.id!;

	let product = $derived(displayProductsList.find(p => p.productId === productId));
	let fullUrl = $derived(productFullUrl(product))

	function productFullUrl(product?: DisplayProduct): string {
		if (!product) return '';
		let productNameFull = `${product.brand} ${product.nameComplete}`.toLowerCase().replace(/ /g, "-");
		return `/#/products/${productId}/${productNameFull}`;
	}

	$effect(() => {
		if (fullUrl == '') return;
		goto(fullUrl, {
			replaceState: true
		})
	});

</script>

<ProductView {productId} />
