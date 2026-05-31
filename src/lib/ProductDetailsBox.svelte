<script lang="ts">
	import { t } from 'svelte-i18n';

	const { itemId, ean, variations } = $props<{
		itemId: string;
		ean: string;
		variations: string[];
	}>();
</script>

<div class="bg-gray-50 p-4 rounded-lg">
	<h3 class="font-semibold mb-2">{$t('productDetail.productDetails')}</h3>
	<ul class="space-y-2 text-sm text-gray-700">
		<li><strong>{$t('productDetail.sku')}</strong> {itemId}</li>
		<li><strong>EAN:</strong> {ean}</li>
		<li><strong>Variations:</strong> {variations.join(', ')}</li>
	</ul>
</div>
