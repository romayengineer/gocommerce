<script lang="ts">
	import { page } from '$app/state';
	import ProductView from '$lib/catalog/ProductView.svelte';

	let productId: string = page.params.id!;
</script>

<ProductView {productId} />
