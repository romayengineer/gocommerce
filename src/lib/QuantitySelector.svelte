<script lang="ts">
	import { t } from 'svelte-i18n';

	interface Props {
		quantity: number;
		onchange?: (quantity: number) => void;
	}

	const { quantity, onchange }: Props = $props();

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
		class="w-14 p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
	/>
</div>
