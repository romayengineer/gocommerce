<script lang="ts">
	const { images = [], alt = 'Product', showNavigation = true } = $props<{
		images: string[];
		alt?: string;
		showNavigation?: boolean;
	}>();

	let currentIndex = $state(0);
	let imageList = $derived(images && images.length > 0 ? images : ['']);

	function goToPrevious(e: MouseEvent) {
		e.stopPropagation();
		currentIndex = (currentIndex - 1 + imageList.length) % imageList.length;
	}

	function goToNext(e: MouseEvent) {
		e.stopPropagation();
		currentIndex = (currentIndex + 1) % imageList.length;
	}
</script>

<div class="relative">
	<div class="bg-gray-200 rounded-lg aspect-square flex items-center justify-center relative">
		{#if imageList[currentIndex]}
			<img src={imageList[currentIndex]} alt={alt} loading="lazy" class="w-full h-full object-cover rounded-lg" />
		{/if}

		{#if imageList.length > 1 && showNavigation}
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
