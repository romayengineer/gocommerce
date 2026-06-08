<script lang="ts">
	interface Props {
		messages?: string[];
	}

	let { messages }: Props = $props();
</script>

{#if messages}
	{#each messages as message}
		<span class="text-red-500 text-sm mt-1">{message}</span>
	{/each}
{/if}
