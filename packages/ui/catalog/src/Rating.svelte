<script lang="ts">
	import { Star } from '@lucide/svelte';

	interface Props {
		rating: number;
		class?: string;
	}

	const { rating, class: className }: Props = $props();
</script>

<span class="inline-flex items-center gap-1 text-yellow-500 {className || ''}" aria-label={`${rating} out of 5`}>
	<Star size={16} fill="currentColor" />
	{rating}
</span>
