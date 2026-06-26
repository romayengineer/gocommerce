<script lang="ts">
	type Variant = 'primary' | 'secondary' | 'danger';

	interface Props {
		variant?: Variant;
		class?: string;
		onclick?: (e: MouseEvent) => void;
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		children?: import('svelte').Snippet;
	}

	const { variant = 'primary', class: className, onclick, disabled = false, type = 'button', children }: Props = $props();

	const variantClasses = {
		primary: 'bg-blue-600 text-white hover:bg-blue-700',
		secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
		danger: 'bg-red-600 text-white hover:bg-red-700'
	};
</script>

<button
	{type}
	{onclick}
	{disabled}
	class="capitalize px-4 py-2 rounded font-semibold transition-colors {variantClasses[variant as Variant]} {disabled ? 'opacity-50 cursor-not-allowed' : ''} {className || ''}"
>
	{#if children}
		{@render children()}
	{/if}
</button>
