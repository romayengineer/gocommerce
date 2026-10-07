<script lang="ts">
	interface Props {
		class?: string;
		children?: import('svelte').Snippet;
	}

	const { class: className, children }: Props = $props();
</script>

<div class="page-container {className || ''}">
	{#if children}
		{@render children()}
	{/if}
</div>
