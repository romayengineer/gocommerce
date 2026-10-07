<script lang="ts">
	type Padding = 'none' | 'sm' | 'md' | 'lg';

	interface Props {
		title?: string;
		sticky?: boolean;
		padded?: boolean;
		padding?: Padding;
		class?: string;
		children?: import('svelte').Snippet;
	}

	const { title, sticky = false, padded = true, padding = 'md', class: className, children }: Props = $props();

	const paddingClasses: Record<Padding, string> = {
		none: '',
		sm: 'p-4',
		md: 'p-6',
		lg: 'p-8 md:p-12'
	};

	const resolvedPadding = $derived(padded ? paddingClasses[padding] : '');
</script>

<div class={sticky ? 'h-fit' : 'contents'}>
	<div class={`card ${sticky ? 'sticky top-4' : ''} ${resolvedPadding} ${className || ''}`}>
		{#if title}
			<h2 class="mb-4 text-xl font-semibold">{title}</h2>
		{/if}
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
