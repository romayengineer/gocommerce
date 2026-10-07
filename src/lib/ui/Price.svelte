<script lang="ts">
	import { locale } from 'svelte-i18n';
	import { formatPrice } from '$core/domain/money';
	import { config } from '$lib/view';

	type Size = 'sm' | 'md' | 'lg';

	interface Props {
		amount: number;
		size?: Size;
		class?: string;
		currency?: string;
	}

	const { amount, size = 'md', class: className, currency = config.currency }: Props = $props();

	const sizeClasses = {
		sm: 'text-sm',
		md: 'text-lg',
		lg: 'text-2xl font-bold text-primary-600'
	};

	let formattedPrice = $derived(formatPrice(amount, $locale, currency));
</script>

<span class="font-bold pl-2 {sizeClasses[size as Size]} {className || ''}">
	{formattedPrice}
</span>
