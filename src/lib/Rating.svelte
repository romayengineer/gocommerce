<script lang="ts">
	interface Props {
		rating: number;
		class?: string;
	}

	const { rating, class: className }: Props = $props();
</script>

<span class="text-yellow-400 {className || ''}">
	⭐ {rating}
</span>
