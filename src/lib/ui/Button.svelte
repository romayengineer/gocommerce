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
		primary: 'bg-primary-600 text-white hover:bg-primary-700',
		secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
		danger: 'bg-red-600 text-white hover:bg-red-700'
	};
</script>

<button
	{type}
	{onclick}
	{disabled}
	class="inline-flex items-center justify-center gap-2 rounded px-4 py-2 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/40 {variantClasses[variant as Variant]} {disabled ? 'opacity-50 cursor-not-allowed' : ''} {className || ''}"
>
	{#if children}
		{@render children()}
	{/if}
</button>
