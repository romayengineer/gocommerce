<script lang="ts">
	import Link from './Link.svelte';
	import Card from './Card.svelte';

	interface Props {
		message: string;
		actionHref?: string;
		actionLabel?: string;
		class?: string;
	}

	const { message, actionHref, actionLabel, class: className }: Props = $props();
</script>

<Card padding="lg" class="text-center {className || ''}">
	<p class="mb-6 text-lg text-ink-muted">{message}</p>
	{#if actionHref && actionLabel}
		<Link href={actionHref} variant="button" size="md">{actionLabel}</Link>
	{/if}
</Card>
