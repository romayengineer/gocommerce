<script lang="ts">
	interface Props {
		title?: string;
		sticky?: boolean;
		children?: import('svelte').Snippet;
	}

	const { title, sticky = false, children }: Props = $props();
</script>

<div class={sticky ? 'h-fit' : ''}>
	<div class={`bg-white rounded-lg shadow p-6 ${sticky ? 'sticky top-4' : ''}`}>
		{#if title}
		    <h2 class="text-2xl font-bold mb-4">{title}</h2>
		{/if}
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
