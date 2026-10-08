<script lang="ts">
	import { locale } from 'svelte-i18n';
	import { formatPrice } from '@gocommerce/ui-core/format';
	import { config } from '@gocommerce/composition/view';

	type Size = 'sm' | 'md' | 'lg';

	interface Props {
		amount: number;
		size?: Size;
		class?: string;
		currency?: string;
	}

	const { amount, size = 'md', class: className, currency = config.currency }: Props = $props();

	const sizeClasses = {
		sm: 'text-sm font-semibold',
		md: 'text-lg font-bold',
		lg: 'text-2xl font-bold text-primary-600'
	};

	let formattedPrice = $derived(formatPrice(amount, $locale, currency));
</script>

<span class="font-bold tabular-nums {sizeClasses[size as Size]} {className || ''}">
	{formattedPrice}
</span>
