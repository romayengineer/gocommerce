<script lang="ts">
	const { amount, size = 'md', class: className } = $props<{
		amount: number;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}>();

	const sizeClasses = {
		sm: 'text-sm',
		md: 'text-lg',
		lg: 'text-2xl font-bold text-blue-600'
	};
</script>

<span class="{sizeClasses[size]} {className || ''}">
	${amount.toFixed(2)}
</span>
