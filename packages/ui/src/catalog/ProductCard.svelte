<script lang="ts">
	import Link from '$lib/ui/Link.svelte';
	import AddToCartButton from '$lib/catalog/AddToCartButton.svelte';
	import SizeSelector from '$lib/catalog/SizeSelector.svelte';
	import type { DisplayProduct } from '@gocommerce/domain/product';
	import { productFullUrl } from '@gocommerce/composition/view';
	import ProductImage from '$lib/catalog/ProductImage.svelte';

	interface Props {
		product: DisplayProduct;
		onImageLoaded?: (loaded: boolean) => void;
		height?: number;
	}

	const { product, onImageLoaded, height = 40 }: Props = $props();

	let fullUrl = $derived(productFullUrl(product));

	let itemSelected = $state(0);

	function selectSize(e: Event, index: number) {
		e.preventDefault();
		itemSelected = index;
	}

	function handleImageLoaded(loaded: boolean) {
		onImageLoaded?.(loaded);
	}
</script>

<Link href={fullUrl} class="group no-underline">
	<div class="card flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg" style="height: {height}px">
		<div class="flex-1 min-h-0 transition-opacity group-hover:opacity-80">
			<ProductImage
				src={product.images[0]}
				alt={product.productName}
				onImageLoaded={handleImageLoaded}
			/>
		</div>

		<div class="flex flex-1 flex-col justify-between p-4">
			<div>
				<h3 class="x-text-lg mb-1 font-semibold transition-colors group-hover:text-primary-600">{product.productName}</h3>
				<p class="mb-4 text-sm font-medium text-gray-700">{product.brand}</p>
				<div class="mb-2 line-clamp-2 max-h-full overflow-hidden text-sm text-gray-600">
					{product.description}
				</div>
			</div>
			<div>
				<div class="mb-2">
					<SizeSelector items={product.items} selected={itemSelected} onSelect={selectSize} />
				</div>
				<AddToCartButton productId={product.productId} itemId={product.items[itemSelected].itemId} price={product.items[itemSelected].price} />
			</div>
		</div>
	</div>
</Link>
