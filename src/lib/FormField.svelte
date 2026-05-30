<script lang="ts">

	let { id, label, type = 'text', value = $bindable(''), required = false, error = false, errorMessage = 'This field is required', editable = true, onchange, onfocusin, onfocusout } = $props<{
		id: string;
		label: string;
		type?: string;
		value?: string;
		required?: boolean;
		error?: boolean;
		errorMessage?: string;
		editable?: boolean;
		onchange?: (event: Event) => void;
		onfocusin?: (event: FocusEvent) => void;
		onfocusout?: (event: FocusEvent) => void;
	}>();
</script>


<div>
	<label for={id} class="block text-sm font-medium text-gray-700 mb-2">
		{label}
		{#if required}<span class="text-red-500">*</span>{/if}
	</label>
	<input
		{id}
		{type}
		{value}
		{required}
		disabled={!editable}
		onchange={onchange}
		onfocusin={onfocusin}
		onfocusout={onfocusout}
		oninput={(e) => { if (e.target instanceof HTMLInputElement) value = e.target.value; }}
		class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent {!editable ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : ''}"
	/>
	{#if error}
		<span class="text-red-500 text-sm mt-1">{errorMessage}</span>
	{/if}
</div>
