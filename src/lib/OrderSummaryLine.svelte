<script lang="ts">
	import Price from './Price.svelte';

	const { label, amount, isBold = false } = $props<{
		label: string;
		amount: number;
		isBold?: boolean;
	}>();
</script>

<div class={`flex justify-between ${isBold ? 'text-2xl font-bold' : ''}`}>
	<span>{label}</span>
	<Price {amount} size={isBold ? 'lg' : 'sm'} />
</div>
