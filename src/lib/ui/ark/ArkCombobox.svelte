<script lang="ts">
	import { Combobox, createListCollection } from '@ark-ui/svelte/combobox';
	import { Portal } from '@ark-ui/svelte/portal';
	import { ChevronDown } from 'lucide-svelte';
	import { t } from 'svelte-i18n';
	import { filterOptions, type SearchOption } from '$core/domain/search';
	import { dropdownContentClasses, dropdownItemClasses } from '$lib/ui/ark/arkClasses';
	import { inputClasses } from '$lib/ui/variants';

	interface Props {
		id: string;
		label: string;
		options: SearchOption[];
		value?: string;
		required?: boolean;
		error?: boolean;
		onchange?: (value: string) => void;
	}

	let {
		id,
		label,
		options,
		value = $bindable(''),
		required = false,
		error = false,
		onchange
	}: Props = $props();

	// Same contract as the legacy SearchableSelect: `value` holds the option
	// *label* (free text allowed). Filtering reuses the pure core helper; Ark
	// owns focus, keyboard nav, open state and ARIA wiring.
	let filteredOptions = $derived(value ? filterOptions(options, value) : options);
	let collection = $derived(createListCollection({ items: filteredOptions }));
	let selectedValues = $derived.by(() => {
		const match = options.find((option) => option.label === value);
		return match ? [match.value] : [];
	});

	function handleValueChange(details: { value: string[] }) {
		const next = details.value[0] ?? '';
		const selected = options.find((option) => option.value === next);
		const label = selected ? selected.label : next;
		if (label !== value) {
			value = label;
			onchange?.(label);
		}
	}
</script>

<div class="relative">
	<Combobox.Root
		{collection}
		value={selectedValues}
		onValueChange={handleValueChange}
		bind:inputValue={value}
		{required}
		invalid={error}
		allowCustomValue
		openOnClick
	>
		<Combobox.Label class="mb-2 block text-sm font-medium text-gray-700">
			{label}
			{#if required}<span class="text-red-500">*</span>{/if}
		</Combobox.Label>
		<Combobox.Control class="relative">
			<Combobox.Input
				{id}
				class={inputClasses(error ? 'error' : 'default', 'pr-10')}
				aria-invalid={error}
			/>
			<Combobox.Trigger
				aria-label={label}
				class="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-gray-500 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
			>
				<ChevronDown size={18} class="ark-chevron" />
			</Combobox.Trigger>
		</Combobox.Control>
		<Portal>
			<Combobox.Positioner>
				<Combobox.Content class={dropdownContentClasses}>
					<Combobox.Empty class="px-4 py-2 text-sm text-gray-500">
						{$t('common.noOptions')}
					</Combobox.Empty>
					{#each collection.items as option (option.value)}
						<Combobox.Item item={option} class={dropdownItemClasses}>
							<Combobox.ItemText>{option.label}</Combobox.ItemText>
							<Combobox.ItemIndicator class="font-bold">✓</Combobox.ItemIndicator>
						</Combobox.Item>
					{/each}
				</Combobox.Content>
			</Combobox.Positioner>
		</Portal>
	</Combobox.Root>
</div>
