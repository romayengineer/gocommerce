<script lang="ts">
	import Link from './Link.svelte';
	import ProductImage from './ProductImage.svelte';
	import AddToCartButton from './AddToCartButton.svelte';
	import SizeSelector from './SizeSelector.svelte';
	import type { DisplayProduct } from './products';

	interface Props {
		product: DisplayProduct;
		onImageLoaded?: (loaded: boolean) => void;
		height?: number;
	}

	const { product, onImageLoaded, height = 40 }: Props = $props();

	let itemSelected = $state(0)

	function selectSize(e: Event, index: number) {
		e.preventDefault();
		itemSelected = index;
	}

	function handleImageLoaded(loaded: boolean) {
		onImageLoaded?.(loaded);
	}
</script>

<Link href="#/products/{product.productId}" class="group no-underline">
	<div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col" style="height: {height}rem">
		<div class="group-hover:opacity-80 transition-opacity">
			<ProductImage
				images={product.images}
				alt={product.nameComplete}
				showNavigation={false}
				onImageLoaded={handleImageLoaded}
			/>
		</div>

		<div class="p-4 flex flex-col flex-1 justify-between">
			<div>
				<h3 class="capitalize font-semibold x-text-lg mb-1 group-hover:text-blue-600 transition-colors">{product.nameComplete}</h3>
				<div class="max-h-0 md:max-h-full text-gray-600 text-sm mb-2 line-clamp-2 prose prose-sm max-w-none overflow-hidden">
					{product.description}
				</div>
				<p class="capitalize text-gray-700 text-sm mb-4 font-medium">{product.brand}</p>
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
