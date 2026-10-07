<script lang="ts">
	interface Props {
		title?: string;
		sticky?: boolean;
		padded?: boolean;
		class?: string;
		children?: import('svelte').Snippet;
	}

	const { title, sticky = false, padded = true, class: className, children }: Props = $props();
</script>

<div class={sticky ? 'h-fit' : ''}>
	<div class={`card ${sticky ? 'sticky top-4' : ''} ${padded ? 'p-6' : ''} ${className || ''}`}>
		{#if title}
			<h2 class="mb-4 text-2xl font-bold">{title}</h2>
		{/if}
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
