<script lang="ts">
	import { t } from 'svelte-i18n';
	import FormField from './FormField.svelte';
	import { filterOptions, matchesOption } from '@gocommerce/ui-core/search';

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
		const onlyOption = filteredOptions[0];
		if (value && filteredOptions.length == 1 && onlyOption) {
			setValue(onlyOption.label);
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
			class="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg border border-line bg-card shadow-lg"
			role="listbox"
			tabindex="-1"
			onmousedown={(e) => e.preventDefault()}
		>
			<ul class="max-h-64 overflow-y-auto">
				{#each filteredOptions as option (option.value)}
					<li>
						<button
							type="button"
							role="option"
							aria-selected={value === option.label}
							onclick={() => selectOption(option.label)}
							class="w-full px-4 py-2 text-left transition-colors hover:bg-primary-100 focus:bg-primary-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500/40 {value === option.label ? 'bg-primary-50 font-semibold' : ''}"
						>
							{option.label}
						</button>
					</li>
				{:else}
					<li class="px-4 py-2 text-sm text-ink-faint">{$t('common.noOptions')}</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
