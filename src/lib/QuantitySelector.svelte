<script lang="ts">
	interface Props {
		quantity: number;
		onchange?: (quantity: number) => void;
	}

	const { quantity, onchange }: Props = $props();

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
		onclick={decrement}
		class="w-8 h-8 text-xl border border-gray-300 bg-white hover:bg-gray-100 transition"
	>
		−
	</button>
	<input
		id="qty"
		type="number"
		value={quantity}
		onchange={handleChange}
		min="1"
		class="w-8 h-8 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-center appearance-none"
	/>
	<button
		onclick={increment}
		class="w-8 h-8 text-xl border border-gray-300 bg-white hover:bg-gray-100 transition"
	>
		+
	</button>
</div>


<style>
	button {
		border: 1px solid #d1d5db;
	}

	input[type="number"] {
		text-align: center !important;
		padding: 0 !important;
	}

	input[type="number"]::-webkit-outer-spin-button,
	input[type="number"]::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type="number"] {
		-moz-appearance: textfield;
		appearance: textfield;
	}
</style>