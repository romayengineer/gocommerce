<script lang="ts">
	import Button from './Button.svelte';

	const { onclick } = $props<{
		onclick: () => void;
	}>();
</script>

<Button
	variant="primary"
	class="w-full py-3"
	{onclick}
>
	Add to Cart
</Button>
