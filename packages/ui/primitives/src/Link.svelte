<script lang="ts">
	import { buttonClasses, linkClasses, type ButtonSize } from './variants';
	import { route } from '@gocommerce/composition/view/router';
	import { withSeedFromCurrent } from '@gocommerce/ui-core/url';

	type Variant = 'primary' | 'secondary' | 'muted' | 'button' | 'contrast';

	interface Props {
		href: string;
		variant?: Variant;
		size?: ButtonSize;
		class?: string;
		children?: import('svelte').Snippet;
	}

	const { href, variant = 'primary', size = 'lg', class: className, children }: Props = $props();

	// Hash navigations replace the whole `#/...?...` string, so a static
	// `href="#/products"` would drop `?seed=` (and reshuffle the catalog).
	// Re-resolve against the live route so every link keeps the same seed.
	const resolvedHref = $derived(withSeedFromCurrent(href, $route.href));

	function linkClass(v: Variant, extra: string): string {
		if (v === 'button') return buttonClasses('primary', size, extra);
		if (v === 'contrast') return buttonClasses('contrast', size, extra);
		return linkClasses(v, extra);
	}
</script>

<a href={resolvedHref} class={linkClass(variant, className || '')}>
	{#if children}
		{@render children()}
	{/if}
</a>
