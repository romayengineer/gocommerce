<script lang="ts">
	interface Props {
		id: string;
		label: string;
		placeholder?: string;
		options: { value: string; label: string }[];
		value?: string;
		required?: boolean;
		error?: boolean;
	}

	let { id, label, placeholder = 'Search...', options, value = $bindable(), required = false, error = false } = $props<Props>();

	let isOpen = $state(false);
	let searchQuery = $state('');
	let filteredOptions = $derived(
		options.filter((opt) => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	function selectOption(selectedValue: string) {
		value = selectedValue;
		searchQuery = '';
		isOpen = false;
	}

	function toggleDropdown() {
		isOpen = !isOpen;
		if (isOpen) {
			searchQuery = '';
		}
	}

	function handleBlur() {
		isOpen = false;
	}

	const selectedLabel = $derived(options.find((opt) => opt.value === value)?.label || '');
</script>

<div class="relative">
	<label for={id} class="block text-sm font-medium text-gray-700 mb-2">
		{label}
		{#if required}
			<span class="text-red-500">*</span>
		{/if}
	</label>

	<button
		type="button"
		id={id}
		on:click={toggleDropdown}
		class="w-full px-4 py-2 border {error ? 'border-red-500' : 'border-gray-300'} rounded-lg text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
	>
		<span class={selectedLabel ? 'text-gray-900' : 'text-gray-500'}>
			{selectedLabel || placeholder}
		</span>
		<span class="float-right text-gray-400">▼</span>
	</button>

	{#if isOpen}
		<div
			class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
			on:focusout={handleBlur}
			role="listbox"
		>
			<div class="p-2">
				<input
					type="text"
					placeholder={placeholder}
					bind:value={searchQuery}
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					aria-label="Search options"
				/>
			</div>

			<ul class="max-h-64 overflow-y-auto">
				{#each filteredOptions as option (option.value)}
					<li>
						<button
							type="button"
							on:click={() => selectOption(option.value)}
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
