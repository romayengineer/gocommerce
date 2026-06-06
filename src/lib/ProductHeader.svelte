<script lang="ts">
	interface Props {
		name: string;
		brand: string;
	}

	const { name, brand }: Props = $props();
</script>

<div>
	<h1 class="text-2xl md:text-4xl font-bold mb-4">{name}</h1>
	<p class="text-gray-600 mb-6">{brand}</p>
</div>
