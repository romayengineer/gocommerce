<script lang="ts">
	type Variant = 'primary' | 'secondary' | 'muted';

	interface Props {
		href: string;
		variant?: Variant;
		class?: string;
		children?: import('svelte').Snippet;
	}

	const { href, variant = 'primary', class: className, children }: Props = $props();

	const variantClasses = {
		primary: 'text-blue-600 hover:text-blue-700',
		secondary: 'text-gray-700 hover:text-blue-600',
		muted: 'text-gray-600 hover:text-gray-700'
	};
</script>

<a {href} class="transition-colors {variantClasses[variant as Variant]} {className || ''}">
	{#if children}
		{@render children()}
	{/if}
</a>
