<script lang="ts">
	import Price from './Price.svelte';

	interface Props {
		label: string;
		amount: number;
		size?: string;
		quantity?: number;
		isBold?: boolean;
	}

	const { label, amount, size, quantity, isBold = false }: Props = $props();
</script>

<div class={`flex justify-between capitalize py-4 border-b ${isBold ? 'text-2xl font-bold' : ''}`}>
	<p>
		{#if quantity}
			<span>{label}</span> <span class="whitespace-nowrap">{size} ML</span> <span>x{quantity}</span>
		{:else}
			<span>{label}</span>
		{/if}
	</p>
	<Price {amount} size={isBold ? 'lg' : 'sm'} />
</div>
