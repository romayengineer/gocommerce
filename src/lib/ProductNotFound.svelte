<script lang="ts">
    import { goto } from '$app/navigation';
	import Link from './Link.svelte';

	setTimeout(() => {
		goto('/#/products', {
			replaceState: true,
		});
	}, 3000)
</script>

<div class="max-w-6xl mx-auto px-4 py-12">
	<p class="text-xl text-gray-600">Product not found</p>
	<Link href="#/products" class="mt-4 inline-block">Back to Products</Link>
</div>
