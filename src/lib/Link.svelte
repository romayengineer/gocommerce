<script lang="ts">
	type Variant = 'primary' | 'secondary' | 'muted';

	const { href, variant = 'primary', class: className, children } = $props<{
		href: string;
		variant?: Variant;
		class?: string;
		children?: import('svelte').Snippet;
	}>();

	const variantClasses = {
		primary: 'text-blue-600 hover:text-blue-700',
		secondary: 'text-gray-700 hover:text-blue-600',
		muted: 'text-gray-600 hover:text-gray-700'
	};
</script>

<a {href} class="transition-colors {variantClasses[variant]} {className || ''}">
	{#if children}
		{@render children()}
	{/if}
</a>
