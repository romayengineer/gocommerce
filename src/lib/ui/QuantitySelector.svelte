<script lang="ts">
	import { Minus, Plus } from 'lucide-svelte';
	import { iconButtonClasses, quantityInputClasses } from '$lib/ui/variants';

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
		class={iconButtonClasses('rounded-r-none border-r-0')}
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
		class={quantityInputClasses()}
	/>
	<button
		type="button"
		onclick={increment}
		aria-label="Increase quantity"
		class={iconButtonClasses('rounded-l-none border-l-0')}
	>
		<Plus size={16} />
	</button>
</div>
