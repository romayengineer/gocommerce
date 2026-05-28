<script lang="ts">
	const { name, category } = $props<{
		name: string;
		category: string;
	}>();
</script>

<div>
	<h1 class="text-4xl font-bold mb-4">{name}</h1>
	<p class="text-gray-600 mb-6">{category}</p>
</div>
