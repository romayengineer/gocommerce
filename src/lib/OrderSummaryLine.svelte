<script lang="ts">
	import Price from './Price.svelte';

	interface Props {
		label: string;
		amount: number;
		isBold?: boolean;
	}

	const { label, amount, isBold = false } = $props<Props>();
</script>

<div class={`flex justify-between ${isBold ? 'text-2xl font-bold' : ''}`}>
	<span>{label}</span>
	<Price {amount} size={isBold ? 'lg' : 'sm'} />
</div>
