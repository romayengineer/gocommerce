<script lang="ts">
	export let id: string;
	export let label: string;
	export let type: string = 'text';
	export let placeholder: string = '';
	export let value: string = '';
	export let required: boolean = false;
	export let error: boolean = false;
	export let errorMessage: string = 'This field is required';
</script>

<div>
	<label for={id} class="block text-sm font-medium text-gray-700 mb-2">
		{label}
		{#if required}<span class="text-red-500">*</span>{/if}
	</label>
	<input
		{id}
		{type}
		bind:value
		{required}
		{placeholder}
		class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
	/>
	{#if error}
		<span class="text-red-500 text-sm mt-1">{errorMessage}</span>
	{/if}
</div>
