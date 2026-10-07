<script lang="ts">
	import Link from '$lib/ui/Link.svelte';

	interface Props {
		message: string;
		actionHref?: string;
		actionLabel?: string;
	}

	const { message, actionHref, actionLabel }: Props = $props();
</script>

<div class="card p-12 text-center">
	<p class="mb-6 text-xl text-gray-600">{message}</p>
	{#if actionHref && actionLabel}
		<Link href={actionHref} variant="button">{actionLabel}</Link>
	{/if}
</div>
