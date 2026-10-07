<script lang="ts">
	import { Select, createListCollection } from '@ark-ui/svelte/select';
	import { Portal } from '@ark-ui/svelte/portal';
	import { Check, ChevronDown } from 'lucide-svelte';
	import type { SearchOption } from '$core/domain/search';
	import { dropdownContentClasses, dropdownItemClasses, selectTriggerClasses } from '$lib/ui/ark/arkClasses';

	interface Props {
		options: SearchOption[];
		value?: string;
		label?: string;
		ariaLabel?: string;
		placeholder?: string;
		disabled?: boolean;
		invalid?: boolean;
		class?: string;
		onchange?: (value: string) => void;
	}

	let {
		options,
		value = $bindable(''),
		label,
		ariaLabel,
		placeholder,
		disabled = false,
		invalid = false,
		class: className = '',
		onchange
	}: Props = $props();

	let collection = $derived(createListCollection({ items: options }));

	function handleValueChange(details: { value: string[] }) {
		const next = details.value[0] ?? '';
		if (next !== value) {
			value = next;
			onchange?.(next);
		}
	}
</script>

<Select.Root
	{collection}
	value={value ? [value] : []}
	onValueChange={handleValueChange}
	{disabled}
	{invalid}
>
	{#if label}
		<Select.Label class="mb-2 block text-sm font-medium text-gray-700">{label}</Select.Label>
	{/if}
	<Select.Control>
		<Select.Trigger aria-label={ariaLabel ?? label} class={selectTriggerClasses(invalid, className)}>
			<Select.ValueText {placeholder} />
			<Select.Indicator>
				<ChevronDown size={18} class="ark-chevron text-gray-500" />
			</Select.Indicator>
		</Select.Trigger>
	</Select.Control>
	<Portal>
		<Select.Positioner>
			<Select.Content class={dropdownContentClasses}>
				{#each collection.items as option (option.value)}
					<Select.Item item={option} class={dropdownItemClasses}>
						<Select.ItemText>{option.label}</Select.ItemText>
						<Select.ItemIndicator>
							<Check size={16} />
						</Select.ItemIndicator>
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Positioner>
	</Portal>
	<Select.HiddenSelect />
</Select.Root>
