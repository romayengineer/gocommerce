<script lang="ts">
	interface Props {
		name: string;
		category: string;
	}

	const { name, category } = $props<Props>();
</script>

<div>
	<h1 class="text-4xl font-bold mb-4">{name}</h1>
	<p class="text-gray-600 mb-6">{category}</p>
</div>
