<script lang="ts">
	import Button from './Button.svelte';
	import Price from './Price.svelte';
	import { addToCart } from './cart';
	import { ShoppingCart } from 'lucide-svelte';

	interface Props {
		productId: string;
		itemId: string;
		price: number;
	}

	const { productId, itemId, price }: Props = $props();

	function handleAddToCart(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		addToCart(productId, itemId, 1);
	}
</script>


<Button
	onclick={handleAddToCart}
	class="w-full md:w-auto flex items-center justify-center gap-2 whitespace-nowrap bg-gradient-to-r from-blue-400 to-transparent"
>
	<ShoppingCart size={25} class="flex-shrink-0" />
	<Price amount={price} size="md" />
</Button>
