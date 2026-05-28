<script lang="ts">
	const { rating, class: className } = $props<{
		rating: number;
		class?: string;
	}>();
</script>

<span class="text-yellow-400 {className || ''}">
	⭐ {rating}
</span>
