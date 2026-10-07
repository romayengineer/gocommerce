<script lang="ts">
	interface Props {
		messages?: string[];
	}

	let { messages }: Props = $props();
</script>

{#if messages && messages.length > 0}
	<div class="mt-1.5 space-y-1" role="alert" aria-live="polite">
		{#each messages as message}
			<span class="block text-sm font-medium text-red-600">{message}</span>
		{/each}
	</div>
{/if}
