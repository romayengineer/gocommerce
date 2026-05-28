<script lang="ts">
	import Button from './Button.svelte';

	interface Props {
		onclick: () => void;
	}

	const { onclick } = $props<Props>();
</script>

<Button
	variant="primary"
	class="w-full py-3"
	{onclick}
>
	Add to Cart
</Button>
