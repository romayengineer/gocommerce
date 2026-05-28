<script lang="ts">

	const { sortBy, filterCategory, categories, onSortChange, onCategoryChange } = $props<{
		sortBy: string;
		filterCategory: string;
		categories: string[];
		onSortChange: (value: string) => void;
		onCategoryChange: (value: string) => void;
	}>();
</script>

<div class="bg-white p-6 rounded-lg shadow">
	<h3 class="font-bold text-lg mb-4">Filters</h3>

	<div class="mb-6">
		<h4 class="font-semibold mb-3">Category</h4>
		<div class="space-y-2">
			{#each categories as cat}
				<label class="flex items-center cursor-pointer">
					<input
						type="radio"
						checked={filterCategory === cat}
						onchange={() => onCategoryChange(cat)}
						class="mr-2"
					/>
					<span class="capitalize">{cat}</span>
				</label>
			{/each}
		</div>
	</div>

	<div>
		<h4 class="font-semibold mb-3">Sort By</h4>
		<select value={sortBy} onchange={(e) => onSortChange(e.currentTarget.value)} class="w-full p-2 border rounded">
			<option value="name">Name (A-Z)</option>
			<option value="price-low">Price (Low to High)</option>
			<option value="price-high">Price (High to Low)</option>
		</select>
	</div>
</div>
