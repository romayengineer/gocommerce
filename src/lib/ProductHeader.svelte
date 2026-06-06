<script lang="ts">
	import { t } from 'svelte-i18n';
	import Price from '$lib/Price.svelte';
	import type { DisplayProduct } from './products';

	interface Props {
		product: DisplayProduct
	}

	const { product }: Props = $props();
</script>

<div>
	<h1 class="text-2xl md:text-4xl font-bold mb-4">{product.nameComplete}</h1>
	
	<div class="grid grid-cols-2">
		<p class="text-xl text-gray-600 mb-6 whitespace-nowrap">{product.brand}</p>

		<div class="mb-6">
			<Price amount={product.price} size="lg" />
		</div>
	</div>
</div>
