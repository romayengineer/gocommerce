<script lang="ts">
	interface Props {
		emoji: string;
		alt?: string;
	}

	const { emoji, alt = 'Product' } = $props<Props>();
</script>

<div class="bg-gray-200 rounded-lg aspect-square flex items-center justify-center">
	<div class="text-6xl" title={alt}>{emoji}</div>
</div>
