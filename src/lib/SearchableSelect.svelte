<script lang="ts">
	import FormField from './FormField.svelte';

	interface Ioption { value: string; label: string }

	let { id, label, options, value = $bindable(''), required = false, error = false, onchange } = $props<{
		id: string;
		label: string;
		options: Ioption[];
		value?: string;
		required?: boolean;
		error?: boolean;
		onchange?: (value: string) => void;
	}>();

	let isOpen = $state(false);
	let filteredOptions: Ioption[] = $derived(
		options.filter((opt: Ioption) => opt.label.toLowerCase().includes(value.toLowerCase()))
	);

	function selectOption(selectedValue: string) {
		value = selectedValue;
		onchange?.(selectedValue);
		isOpen = false;
	}

	function handleInputChange(e: Event) {
		isOpen = true;
	}

	function handleFocusOut() {
		if (value && filteredOptions.length == 1) {
			value = filteredOptions[0].label
		}
		isOpen = false;
	}
</script>

<div class="relative" onfocusout={handleFocusOut}>
	<FormField
		{id}
		{label}
		type="text"
		{required}
		error={error}
		bind:value={value}
		onchange={handleInputChange}
		onfocus={() => (isOpen = true)}
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
