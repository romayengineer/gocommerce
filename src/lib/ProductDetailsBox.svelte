<script lang="ts">
	interface Props {
		id: string;
		category: string;
		rating: number;
	}

	const { id, category, rating } = $props<Props>();
</script>

<div class="bg-gray-50 p-4 rounded-lg">
	<h3 class="font-semibold mb-2">Product Details</h3>
	<ul class="space-y-2 text-sm text-gray-700">
		<li><strong>SKU:</strong> {id}</li>
		<li><strong>Category:</strong> {category}</li>
		<li><strong>Rating:</strong> ⭐ {rating}/5</li>
	</ul>
</div>
