<script lang="ts">
	import Link from './Link.svelte';
	import { cart } from './cart';

	let cartCount = $derived($cart.reduce((sum, item) => sum + item.quantity, 0));
</script>

<nav class="bg-white shadow-md sticky top-0 z-50">
	<div class="max-w-7xl mx-auto px-4">
		<div class="flex items-center justify-between h-16">
			<Link href="#/" class="text-2xl font-bold text-blue-600 hover:text-blue-700">ShopHub</Link>

			<div class="flex items-center gap-8">
				<Link href="#/" variant="secondary">Home</Link>
				<Link href="#/products" variant="secondary">Products</Link>

				<Link href="#/cart" class="relative">
					<span class="text-gray-700 hover:text-blue-600 text-2xl">🛒</span>
					{#if cartCount > 0}
						<span class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
							{cartCount}
						</span>
					{/if}
				</Link>
			</div>
		</div>
	</div>
</nav>
