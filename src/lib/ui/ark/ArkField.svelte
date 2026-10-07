<script lang="ts">
	import { Field } from '@ark-ui/svelte/field';
	import ErrorMessage from '$lib/ui/ErrorMessage.svelte';
	import { inputClasses } from '$lib/ui/variants';

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
	}

	let {
		id,
		label,
		type = 'text',
		value = $bindable(''),
		required = false,
		error = false,
		errorMessages,
		editable = true,
		autocomplete,
		onchange
	}: Props = $props();
</script>

<Field.Root {id} {required} invalid={error} disabled={!editable}>
	<Field.Label class="mb-2 block text-sm font-medium text-gray-700">
		{label}
		{#if required}<span class="text-red-500">*</span>{/if}
	</Field.Label>
	<Field.Input
		{id}
		{type}
		{required}
		{autocomplete}
		bind:value
		spellcheck="false"
		aria-invalid={error}
		onchange={onchange}
		class={inputClasses(error ? 'error' : !editable ? 'disabled' : 'default')}
	/>
	{#if error}
		<ErrorMessage messages={errorMessages} />
	{/if}
</Field.Root>
