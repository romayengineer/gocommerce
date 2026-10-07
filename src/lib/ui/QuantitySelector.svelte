<script lang="ts">
	import { Minus, Plus } from 'lucide-svelte';

	interface Props {
		id?: string;
		quantity: number;
		onchange?: (quantity: number) => void;
	}

	const { id, quantity, onchange }: Props = $props();

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		onchange?.(parseInt(target.value) || 1);
	}

	function decrement() {
		if (quantity > 1) {
			onchange?.(quantity - 1);
		}
	}

	function increment() {
		onchange?.(quantity + 1);
	}
</script>

<div class="flex items-center">
	<button
		type="button"
		onclick={decrement}
		disabled={quantity <= 1}
		aria-label="Decrease quantity"
		class="flex h-8 w-8 items-center justify-center border border-gray-300 bg-white transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
	>
		<Minus size={16} />
	</button>
	<input
		{id}
		type="number"
		value={quantity}
		onchange={handleChange}
		min="1"
		aria-label="Quantity"
		class="h-8 w-10 border border-gray-300 text-center outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
	/>
	<button
		type="button"
		onclick={increment}
		aria-label="Increase quantity"
		class="flex h-8 w-8 items-center justify-center border border-gray-300 bg-white transition hover:bg-gray-100"
	>
		<Plus size={16} />
	</button>
</div>
