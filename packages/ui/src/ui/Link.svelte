<script lang="ts">
	import { buttonClasses, linkClasses, type ButtonSize } from '$lib/ui/variants';

	type Variant = 'primary' | 'secondary' | 'muted' | 'button' | 'contrast';

	interface Props {
		href: string;
		variant?: Variant;
		size?: ButtonSize;
		class?: string;
		children?: import('svelte').Snippet;
	}

	const { href, variant = 'primary', size = 'lg', class: className, children }: Props = $props();

	function linkClass(v: Variant, extra: string): string {
		if (v === 'button') return buttonClasses('primary', size, extra);
		if (v === 'contrast') return buttonClasses('contrast', size, extra);
		return linkClasses(v, extra);
	}
</script>

<a {href} class={linkClass(variant, className || '')}>
	{#if children}
		{@render children()}
	{/if}
</a>
