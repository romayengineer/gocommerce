<script lang="ts">
	import { page } from '$app/state';
	import ProductView from '@gocommerce/ui-catalog/ProductView.svelte';

	let productId: string = page.params.id!;
</script>

<ProductView {productId} />
