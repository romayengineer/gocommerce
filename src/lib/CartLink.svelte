<script lang="ts">
	import Link from './Link.svelte';
	import { ShoppingCart } from 'lucide-svelte';
	import { cart } from './cart';

	let cartCount = $derived($cart.reduce((sum, item) => sum + item.quantity, 0));
</script>

<Link href="#/cart" class="relative flex-shrink-0">
	<span class="text-gray-700 hover:text-blue-600 text-2xl"><ShoppingCart size={30}/></span>
	{#if cartCount > 0}
		<span class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
			{cartCount}
		</span>
	{/if}
</Link>
