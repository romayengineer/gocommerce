<script lang="ts">
	import ErrorMessage from './ErrorMessage.svelte';

	interface Props {
		id: string;
		label: string;
		type?: string;
		value?: string;
		required?: boolean;
		error?: boolean;
		errorMessages?: string[];
		editable?: boolean;
		onchange?: (event: Event) => void;
		onfocusin?: (event: FocusEvent) => void;
		onfocusout?: (event: FocusEvent) => void;
	}

	let { id, label, type = 'text', value = $bindable(''), required = false, error = false, errorMessages = ['This field is required'], editable = true, onchange, onfocusin, onfocusout }: Props = $props();
</script>


<div>
	<label for={id} class="capitalize block text-sm font-medium text-gray-700 mb-2">
		{label}
		{#if required}<span class="text-red-500">*</span>{/if}
	</label>
	<input
		{id}
		{type}
		{value}
		{required}
		disabled={!editable}
		spellcheck="false"
		onchange={onchange}
		onfocusin={onfocusin}
		onfocusout={onfocusout}
		oninput={(e) => { if (e.target instanceof HTMLInputElement) value = e.target.value; }}
		class="capitalize w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent {!editable ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : ''}"
	/>
	{#if error}
		{#each errorMessages as message}
			<ErrorMessage messages={errorMessages}/>
		{/each}
	{/if}
</div>
