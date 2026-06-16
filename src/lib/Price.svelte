<script lang="ts">
	import { locale } from 'svelte-i18n';

	type Size = 'sm' | 'md' | 'lg';

	interface Props {
		amount: number;
		size?: Size;
		class?: string;
	}

	const { amount, size = 'md', class: className }: Props = $props();

	const sizeClasses = {
		sm: 'text-sm',
		md: 'text-lg',
		lg: 'text-2xl font-bold text-blue-600'
	};

	function formatPrice(value: number, lang: string | null | undefined): string {
		// in argentna cents are not used much so remove them
		// dots are used for separating 3 digits
		if (lang === 'es') {
			const integer = value.toFixed(0);
			return integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
		} else {
			const fixed = value.toFixed(2);
			const [integer, decimal] = fixed.split('.');
			return integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + decimal;
		}
	}

	let formattedPrice = $derived(formatPrice(amount, $locale));
</script>

<span class="font-bold pl-2 {sizeClasses[size as Size]} {className || ''}">
	${formattedPrice}
</span>
