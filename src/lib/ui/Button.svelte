<script lang="ts">
	import { buttonClasses, type ButtonSize, type ButtonVariant } from '$lib/ui/variants';

	interface Props {
		variant?: ButtonVariant;
		size?: ButtonSize;
		class?: string;
		onclick?: (e: MouseEvent) => void;
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		children?: import('svelte').Snippet;
	}

	const {
		variant = 'primary',
		size = 'md',
		class: className,
		onclick,
		disabled = false,
		type = 'button',
		children
	}: Props = $props();
</script>

<button
	{type}
	{onclick}
	{disabled}
	class={buttonClasses(variant, size, className || '')}
>
	{#if children}
		{@render children()}
	{/if}
</button>
