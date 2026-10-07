<script lang="ts">
	interface Props {
		messages?: string[];
	}

	let { messages }: Props = $props();
</script>

{#if messages && messages.length > 0}
	<div class="mt-1 space-y-1" role="alert">
		{#each messages as message}
			<span class="block text-sm text-red-500">{message}</span>
		{/each}
	</div>
{/if}
