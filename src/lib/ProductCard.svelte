<script lang="ts">
	import Link from './Link.svelte';
	import ProductImage from './ProductImage.svelte';
	import AddToCartButton from './AddToCartButton.svelte';
	import SizeSelector from './SizeSelector.svelte';
	import type { DisplayProduct } from './products';
	import { productFullUrl } from './products';

	interface Props {
		product: DisplayProduct;
		onImageLoaded?: (loaded: boolean) => void;
		height?: number;
	}

	const { product, onImageLoaded, height = 40 }: Props = $props();

	let fullUrl = $derived(productFullUrl(product))

	let itemSelected = $state(0)

	function selectSize(e: Event, index: number) {
		e.preventDefault();
		itemSelected = index;
	}

	function handleImageLoaded(loaded: boolean) {
		onImageLoaded?.(loaded);
	}
</script>

<Link href={fullUrl} class="group no-underline">
	<div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col" style="height: {height}rem">
		<div class="group-hover:opacity-80 transition-opacity">
			<ProductImage
				images={product.images}
				alt={product.productName}
				showNavigation={false}
				onImageLoaded={handleImageLoaded}
			/>
		</div>

		<div class="p-4 flex flex-col flex-1 justify-between">
			<div>
				<h3 class="capitalize font-semibold x-text-lg mb-1 group-hover:text-blue-600 transition-colors">{product.productName}</h3>
				<p class="capitalize text-gray-700 text-sm mb-4 font-medium">{product.brand}</p>
				<div class="max-h-full text-gray-600 text-sm mb-2 line-clamp-2 prose prose-sm max-w-none overflow-hidden">
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
