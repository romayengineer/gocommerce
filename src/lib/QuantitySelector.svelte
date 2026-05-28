<script lang="ts">
	import { t } from 'svelte-i18n';

	const { quantity, onchange } = $props<{
		quantity: number;
		onchange?: (quantity: number) => void;
	}>();

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		onchange?.(parseInt(target.value) || 1);
	}
</script>

<div class="flex items-center gap-4">
	<label for="qty" class="font-semibold">{$t('productDetail.quantity')}</label>
	<input
		id="qty"
		type="number"
		value={quantity}
		onchange={handleChange}
		min="1"
		class="w-20 p-2 border rounded"
	/>
</div>
