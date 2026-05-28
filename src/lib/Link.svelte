<script lang="ts">
	type Variant = 'primary' | 'secondary' | 'muted';

	interface Props {
		href: string;
		variant?: Variant;
		class?: string;
	}

	const { href, variant = 'primary', class: className } = $props<Props>();

	const variantClasses = {
		primary: 'text-blue-600 hover:text-blue-700',
		secondary: 'text-gray-700 hover:text-blue-600',
		muted: 'text-gray-600 hover:text-gray-700'
	};
</script>

<a {href} class="transition-colors {variantClasses[variant]} {className || ''}">
	<slot />
</a>
