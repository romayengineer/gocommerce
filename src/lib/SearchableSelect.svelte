<script lang="ts">
	import FormField from './FormField.svelte';
	import { filterOptions, matchesOption } from '$core/domain/search';

	interface Ioption { value: string; label: string }

	interface Props {
		id: string;
		label: string;
		options: Ioption[];
		value?: string;
		required?: boolean;
		error?: boolean;
		onchange?: (value: string) => void;
	}

	let { id, label, options, value = $bindable(''), required = false, error = false, onchange }: Props = $props();

	let isOpen = $state(false);
	let filteredOptions = $derived(filterOptions(options, value));

	function optionMatches(): boolean {
		return matchesOption(options, value);
	}

	function setValue(newValue: string) {
		value = newValue;
	}

	function setToOpen() {
		if (!optionMatches()) {
			isOpen = true;
		}
	}

	function selectOption(selectedValue: string) {
		isOpen = false;
		if (value != selectedValue) {
			setValue(selectedValue);
		}
		onchange?.(selectedValue);
	}

	function handleInputChange() {
		setToOpen();
	}

	function handleFocusOut() {
		isOpen = false;
		if (value && filteredOptions.length == 1) {
			setValue(filteredOptions[0].label);
		}
	}

	function handleFocusIn() {
		setToOpen();
	}

	$effect(() => {
		if (value) {
			setToOpen();
		}
	});
</script>

<div class="relative" >
	<FormField
		{id}
		{label}
		type="text"
		{required}
		error={error}
		bind:value={value}
		onchange={handleInputChange}
		onfocusin={handleFocusIn}
		onfocusout={handleFocusOut}
	/>

	{#if isOpen}
		<div
			class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
			role="listbox"
			tabindex="-1"
			onmousedown={(e) => e.preventDefault()}
		>
			<ul class="max-h-64 overflow-y-auto">
				{#each filteredOptions as option (option.value)}
					<li>
						<button
							type="button"
							onclick={() => selectOption(option.label)}
							class="w-full text-left px-4 py-2 hover:bg-blue-100 focus:bg-blue-100 focus:outline-none {value === option.value ? 'bg-blue-50 font-semibold' : ''}"
						>
							{option.label}
						</button>
					</li>
				{:else}
					<li class="px-4 py-2 text-gray-500 text-sm">No options found</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>