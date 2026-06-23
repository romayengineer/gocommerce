<script lang="ts">
	import { page } from '$app/stores';
	import ProductView from '$lib/ProductView.svelte';

	let productId: string = $page.params.id!;
</script>

<ProductView {productId} />
