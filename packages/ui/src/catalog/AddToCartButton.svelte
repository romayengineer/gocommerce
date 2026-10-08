<script lang="ts">
	import Button from '$lib/ui/Button.svelte';
	import Price from '$lib/ui/Price.svelte';
	import { ShoppingCart } from 'lucide-svelte';
	import { addToCart } from '@gocommerce/composition/view';

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
	class="w-full gap-2 whitespace-nowrap"
>
	<ShoppingCart size={25} class="flex-shrink-0" />
	<Price amount={price} size="md" />
</Button>
