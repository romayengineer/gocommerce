<script lang="ts">
	type Variant = 'primary' | 'secondary' | 'muted' | 'button' | 'contrast';

	interface Props {
		href: string;
		variant?: Variant;
		class?: string;
		children?: import('svelte').Snippet;
	}

	const { href, variant = 'primary', class: className, children }: Props = $props();

	const variantClasses = {
		primary: 'text-primary-600 hover:text-primary-700',
		secondary: 'text-gray-700 hover:text-primary-600',
		muted: 'text-gray-600 hover:text-gray-700',
		button: 'inline-block rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700',
		contrast: 'inline-block rounded-lg bg-white px-6 py-3 font-semibold text-primary-600 hover:bg-gray-100'
	};
</script>

<a {href} class="transition-colors {variantClasses[variant as Variant]} {className || ''}">
	{#if children}
		{@render children()}
	{/if}
</a>
