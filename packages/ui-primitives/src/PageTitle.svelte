<script lang="ts">
	interface Props {
		title: string;
		class?: string;
		children?: import('svelte').Snippet;
	}

	const { title, class: className, children }: Props = $props();
</script>

<div class="mb-4 flex items-center gap-2 md:mb-6 {className || ''}">
	{#if children}
		{@render children()}
	{/if}
	<h1 class="x-text-xl font-semibold">{title}</h1>
</div>
