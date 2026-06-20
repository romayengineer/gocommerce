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

<div class="flex gap-2 flex-wrap">
	{#each items as item, index}
		<button
			onclick={(e) => handleSelectSize(e, index)}
			class="px-3 py-1 rounded-lg font-medium text-sm transition-colors {selected === index
				? 'bg-blue-600 text-white'
				: 'bg-gray-200 text-gray-800 hover:bg-gray-300'}"
		>
			{item.size}
		</button>
	{/each}
</div>
