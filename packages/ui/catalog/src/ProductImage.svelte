
<script lang="ts">

	interface Props {
		src: string;
		alt?: string;
		onImageLoaded?: (loaded: boolean) => void;
		imageIndex?: number;
	}

	const { src, alt = 'Product', onImageLoaded, imageIndex = 0 }: Props = $props();

	function handleImageLoad() {
		if (imageIndex === 0) {
			onImageLoaded?.(true);
		}
	}

	function handleImageError() {
		if (imageIndex === 0) {
			onImageLoaded?.(false);
		}
	}

</script>

<img
	src={src}
	alt="{alt} {imageIndex + 1}"
	loading="lazy"
	draggable="false"
	class="w-full h-full object-contain select-none pointer-events-none"
	onload={handleImageLoad}
	onerror={handleImageError}
/>