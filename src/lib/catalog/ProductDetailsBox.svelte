<script lang="ts">
	import { t } from 'svelte-i18n';

	interface Props {
		productId: string;
		productName: string;
		brand: string;
	}

	const { productId, productName, brand }: Props = $props();
</script>

<div class="rounded-lg bg-gray-50 p-4">
	<h3 class="mb-2 font-semibold">{$t('productDetail.productDetails')}</h3>
	<ul class="space-y-2 text-sm text-gray-700">
		<li><strong>{$t('productDetail.sku')}</strong> {productId}</li>
		<li><strong>{$t('productDetail.product')}</strong> {productName}</li>
		<li><strong>{$t('productDetail.brand')}</strong> {brand}</li>
	</ul>
</div>
