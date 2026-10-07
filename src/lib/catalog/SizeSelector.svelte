<script lang="ts">
	import { RadioGroup } from '@ark-ui/svelte/radio-group';
	import { chipClasses } from '$lib/ui/variants';

	interface Props {
		items: Array<{ size: string }>;
		selected?: number;
		onSelect?: (index: number) => void;
	}

	const { items, selected = 0, onSelect }: Props = $props();

	let options = $derived(items.map((item, index) => ({ value: String(index), label: `${item.size} ML` })));

	function handleValueChange(details: { value: string | null }) {
		const index = Number(details.value ?? '0');
		if (!Number.isNaN(index) && index !== selected) {
			onSelect?.(index);
		}
	}
</script>

<RadioGroup.Root
	value={String(selected)}
	onValueChange={handleValueChange}
	orientation="horizontal"
	class="flex flex-wrap gap-2"
>
	<RadioGroup.Label class="sr-only">Size</RadioGroup.Label>
	{#each options as option (option.value)}
		<RadioGroup.Item value={option.value} class={chipClasses(false, 'ark-size-item cursor-pointer')}>
			<RadioGroup.ItemText>{option.label}</RadioGroup.ItemText>
			<RadioGroup.ItemHiddenInput />
		</RadioGroup.Item>
	{/each}
</RadioGroup.Root>
