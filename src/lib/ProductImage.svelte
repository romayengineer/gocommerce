<script lang="ts">
	const { emoji, alt = 'Product' } = $props<{
		emoji: string;
		alt?: string;
	}>();
</script>

<div class="bg-gray-200 rounded-lg aspect-square flex items-center justify-center">
	<div class="text-6xl" title={alt}>{emoji}</div>
</div>
