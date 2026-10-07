<script lang="ts">
	import ErrorMessage from '$lib/ui/ErrorMessage.svelte';

	interface Props {
		id: string;
		label: string;
		type?: string;
		value?: string;
		required?: boolean;
		error?: boolean;
		errorMessages?: string[];
		editable?: boolean;
		autocomplete?: import('svelte/elements').FullAutoFill;
		onchange?: (event: Event) => void;
		onfocusin?: (event: FocusEvent) => void;
		onfocusout?: (event: FocusEvent) => void;
	}

	let { id, label, type = 'text', value = $bindable(''), required = false, error = false, errorMessages = ['This field is required'], editable = true, autocomplete, onchange, onfocusin, onfocusout }: Props = $props();
</script>


<div>
	<label for={id} class="mb-2 block text-sm font-medium text-gray-700">
		{label}
		{#if required}<span class="text-red-500">*</span>{/if}
	</label>
	<input
		{id}
		{type}
		{value}
		{required}
		{autocomplete}
		disabled={!editable}
		spellcheck="false"
		aria-invalid={error}
		onchange={onchange}
		onfocusin={onfocusin}
		onfocusout={onfocusout}
		oninput={(e) => { if (e.target instanceof HTMLInputElement) value = e.target.value; }}
		class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary-500 {!editable ? 'cursor-not-allowed bg-gray-100 text-gray-600' : ''}"
	/>
	{#if error}
		<ErrorMessage messages={errorMessages}/>
	{/if}
</div>
