<script lang="ts">
	import { t } from 'svelte-i18n';

	interface Props {
		itemId: string;
		productName: string;
		brand: string;
	}

	const { itemId, productName, brand }: Props = $props();
</script>

<div class="bg-gray-50 p-4 rounded-lg">
	<h3 class="font-semibold mb-2">{$t('productDetail.productDetails')}</h3>
	<ul class="space-y-2 text-sm text-gray-700">
		<li><strong>{$t('productDetail.sku')}</strong> {itemId}</li>
		<li><strong>Product:</strong> {productName}</li>
		<li><strong>Brand:</strong> {brand}</li>
	</ul>
</div>
