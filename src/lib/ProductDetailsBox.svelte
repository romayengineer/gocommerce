<script lang="ts">
	import { t } from 'svelte-i18n';

	const { id, category, rating } = $props<{
		id: string;
		category: string;
		rating: number;
	}>();
</script>

<div class="bg-gray-50 p-4 rounded-lg">
	<h3 class="font-semibold mb-2">{$t('productDetail.productDetails')}</h3>
	<ul class="space-y-2 text-sm text-gray-700">
		<li><strong>{$t('productDetail.sku')}</strong> {id}</li>
		<li><strong>{$t('productDetail.category')}</strong> {category}</li>
		<li><strong>{$t('productDetail.rating')}</strong> ⭐ {rating}/5</li>
	</ul>
</div>
