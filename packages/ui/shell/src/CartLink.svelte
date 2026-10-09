<script lang="ts">
	import Link from '@gocommerce/ui-primitives/Link.svelte';
	import { ShoppingCart } from '@lucide/svelte';
	import { cartCount } from '@gocommerce/composition/view/cart';

	let cartCountValue = $derived($cartCount);
	let isShaking = $state(false);

	$effect(() => {
		if (cartCountValue > 0) {
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

<Link href="#/cart" class="relative flex-shrink-0" variant="muted">
	<span class="text-ink-secondary hover:text-primary-600"><ShoppingCart size={30}/></span>
	{#if cartCountValue > 0}
		<span class="absolute -top-1 -right-1 bg-danger-500 text-oncolor text-base font-bold rounded-full w-5 h-5 p-3 flex items-center justify-center {isShaking ? 'shake' : ''}">
			{cartCountValue}
		</span>
	{/if}
</Link>
