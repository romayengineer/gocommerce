<script lang="ts">
	const { emoji, emojis = [emoji], alt = 'Product' } = $props<{
		emoji: string;
		emojis?: string[];
		alt?: string;
	}>();

	let currentIndex = $state(0);
	let imageList = $derived(emojis && emojis.length > 0 ? emojis : [emoji]);

	function goToPrevious() {
		currentIndex = (currentIndex - 1 + imageList.length) % imageList.length;
	}

	function goToNext() {
		currentIndex = (currentIndex + 1) % imageList.length;
	}
</script>

<div class="relative">
	<div class="bg-gray-200 rounded-lg aspect-square flex items-center justify-center relative">
		<div class="text-6xl" title={alt}>{imageList[currentIndex]}</div>

		{#if imageList.length > 1}
			<button
				onclick={goToPrevious}
				class="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors"
				title="Previous image"
			>
				❮
			</button>

			<button
				onclick={goToNext}
				class="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors"
				title="Next image"
			>
				❯
			</button>

			<div class="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-60 text-white text-xs px-3 py-1 rounded-full">
				{currentIndex + 1} / {imageList.length}
			</div>
		{/if}
	</div>
</div>
