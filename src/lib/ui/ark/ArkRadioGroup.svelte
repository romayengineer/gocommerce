<script lang="ts">
	import { RadioGroup } from '@ark-ui/svelte/radio-group';
	import type { SearchOption } from '$core/domain/search';

	interface Props {
		options: SearchOption[];
		value?: string;
		name?: string;
		label?: string;
		hideLabel?: boolean;
		orientation?: 'horizontal' | 'vertical';
		disabled?: boolean;
		class?: string;
		onchange?: (value: string) => void;
	}

	let {
		options,
		value = $bindable(''),
		name,
		label,
		hideLabel = false,
		orientation = 'vertical',
		disabled = false,
		class: className = '',
		onchange
	}: Props = $props();

	function handleValueChange(details: { value: string | null }) {
		const next = details.value ?? '';
		if (next !== value) {
			value = next;
			onchange?.(next);
		}
	}
</script>

<RadioGroup.Root
	value={value}
	onValueChange={handleValueChange}
	{name}
	{orientation}
	{disabled}
	class={orientation === 'vertical' ? `space-y-1 ${className}` : `flex flex-wrap gap-2 ${className}`}
>
	{#if label}
		<RadioGroup.Label class={hideLabel ? 'sr-only' : 'mb-1 block text-sm font-medium text-gray-700'}>
			{label}
		</RadioGroup.Label>
	{/if}
	{#each options as option (option.value)}
		<RadioGroup.Item
			value={option.value}
			class="ark-radio-item group flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 md:text-base"
		>
			<RadioGroup.ItemControl class="ark-radio-control">
				<RadioGroup.Indicator class="ark-radio-dot" />
			</RadioGroup.ItemControl>
			<RadioGroup.ItemText class="capitalize">{option.label}</RadioGroup.ItemText>
			<RadioGroup.ItemHiddenInput />
		</RadioGroup.Item>
	{/each}
</RadioGroup.Root>
