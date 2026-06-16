<script lang="ts">
	import Link from './Link.svelte';
	import { ShoppingCart } from 'lucide-svelte';
	import { cart } from './cart';

	let cartCount = $derived($cart.reduce((sum, item) => sum + item.quantity, 0));
	let isShaking = $state(false);

	$effect(() => {
		if (cartCount > 0) {
			isShaking = true;
			const timer = setTimeout(() => {
				isShaking = false;
			}, 500);
			return () => clearTimeout(timer);
		}
	});
</script>

<style>
	@keyframes shake {
		0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
		10% { transform: translate(-2px, -2px) rotate(-5deg) scale(1.6); }
		20% { transform: translate(2px, 2px) rotate(5deg) scale(1.6); }
		30% { transform: translate(-2px, 2px) rotate(-5deg) scale(1.5); }
		40% { transform: translate(2px, -2px) rotate(5deg) scale(1.5); }
		50% { transform: translate(-1px, -1px) rotate(-3deg) scale(1.3); }
		60% { transform: translate(1px, 1px) rotate(3deg) scale(1.2); }
		70% { transform: translate(-1px, 1px) rotate(-3deg) scale(1.15); }
		80% { transform: translate(1px, -1px) rotate(3deg) scale(1.05); }
		90% { transform: translate(0, 0) rotate(0deg) scale(1); }
	}

	.shake {
		animation: shake 0.5s ease-in-out;
	}
</style>

<Link href="#/cart" class="relative flex-shrink-0">
	<span class="text-gray-700 hover:text-blue-600 text-2xl"><ShoppingCart size={30}/></span>
	{#if cartCount > 0}
		<span class="absolute top-0 right-0 bg-red-500 text-white text-base font-bold rounded-full w-5 h-5 flex items-center justify-center {isShaking ? 'shake' : ''}">
			{cartCount}
		</span>
	{/if}
</Link>
