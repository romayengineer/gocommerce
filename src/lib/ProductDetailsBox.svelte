<script lang="ts">
	import { t } from 'svelte-i18n';

	interface Props {
		productId: string;
		productName: string;
		brand: string;
	}

	const { productId, productName, brand }: Props = $props();
</script>

<div class="bg-gray-50 rounded-lg">
	<h3 class="capitalize font-semibold mb-2">{$t('productDetail.productDetails')}</h3>
	<ul class="capitalize space-y-2 text-sm text-gray-700">
		<li><strong>{$t('productDetail.sku')}</strong> {productId}</li>
		<li><strong>Product:</strong> {productName}</li>
		<li><strong>Brand:</strong> {brand}</li>
	</ul>
</div>
