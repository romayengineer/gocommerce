<script lang="ts">
	type Size = 'sm' | 'md' | 'lg';

	const { amount, size = 'md', class: className } = $props<{
		amount: number;
		size?: Size;
		class?: string;
	}>();

	const sizeClasses = {
		sm: 'text-sm',
		md: 'text-lg',
		lg: 'text-2xl font-bold text-blue-600'
	};
</script>

<span class="{sizeClasses[size as Size]} {className || ''}">
	${amount.toFixed(2)}
</span>
