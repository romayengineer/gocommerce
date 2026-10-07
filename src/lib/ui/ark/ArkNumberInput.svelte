<script lang="ts">
	import { NumberInput } from '@ark-ui/svelte/number-input';
	import { Minus, Plus } from 'lucide-svelte';
	import { iconButtonClasses, quantityInputClasses } from '$lib/ui/variants';

	interface Props {
		id?: string;
		quantity?: number;
		min?: number;
		max?: number;
		ariaLabel?: string;
		onchange?: (quantity: number) => void;
	}

	let {
		id,
		quantity = $bindable(1),
		min = 1,
		max,
		ariaLabel = 'Quantity',
		onchange
	}: Props = $props();

	function handleValueChange(details: { valueAsNumber: number }) {
		const next = Number.isNaN(details.valueAsNumber) ? min : Math.max(min, details.valueAsNumber);
		if (next !== quantity) {
			quantity = next;
			onchange?.(next);
		}
	}
</script>

<NumberInput.Root
	value={String(quantity)}
	onValueChange={handleValueChange}
	{min}
	{max}
	allowOverflow={false}
	clampValueOnBlur
	class="flex items-center"
>
	<NumberInput.DecrementTrigger aria-label="Decrease quantity" class={iconButtonClasses('rounded-r-none border-r-0')}>
		<Minus size={16} />
	</NumberInput.DecrementTrigger>
	<NumberInput.Input {id} aria-label={ariaLabel} class={quantityInputClasses()} />
	<NumberInput.IncrementTrigger aria-label="Increase quantity" class={iconButtonClasses('rounded-l-none border-l-0')}>
		<Plus size={16} />
	</NumberInput.IncrementTrigger>
</NumberInput.Root>
