<script lang="ts">
	import { chipClasses } from '$lib/ui/variants';

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
			aria-pressed={selected === index}
			class={chipClasses(selected === index)}
		>
			{item.size} ML
		</button>
	{/each}
</div>
