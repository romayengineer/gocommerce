<script lang="ts">
	interface Props {
		items: Array<{ size: string }>;
		selected?: number;
		onSelect?: (e: Event, index: number) => void;
	}

	const { items, selected = 0, onSelect }: Props = $props();

	function handleSelectSize(e: Event, index: number) {
		e.preventDefault();
		onSelect?.(e, index);
	}
</script>

<div class="flex flex-wrap gap-2">
	{#each items as item, index}
		<button
			type="button"
			onclick={(e) => handleSelectSize(e, index)}
			class="rounded-lg px-3 py-1 text-sm font-medium transition-colors {selected === index
				? 'bg-primary-600 text-white'
				: 'bg-gray-200 text-gray-800 hover:bg-gray-300'}"
		>
			{item.size} ML
		</button>
	{/each}
</div>
