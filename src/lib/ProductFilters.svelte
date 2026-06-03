<script lang="ts">
	interface Props {
		sortBy: string;
		filterCategory: string;
		searchQuery: string;
		categories: string[];
		onSortChange: (value: string) => void;
		onCategoryChange: (value: string) => void;
		onSearchChange: (value: string) => void;
	}

	const { sortBy, filterCategory, searchQuery, categories, onSortChange, onCategoryChange, onSearchChange }: Props = $props();

	interface CategorizedItems {
		sizes: string[];
		others: string[];
	}

	function categorizeItems(items: string[]): CategorizedItems {
		const sizes: string[] = [];
		const others: string[] = [];

		for (const item of items) {
			const parts = item.trim().split(/\s+/);
			const isSize = parts.length === 2 && !isNaN(Number(parts[0])) && parts[1].toUpperCase() === 'ML';

			if (isSize) {
				sizes.push(item);
			} else {
				// split item with / and get last value that is different from ''
				const pathParts = item.split('/').filter((part) => part !== '');
				const categoryName = pathParts.length > 0 ? pathParts[pathParts.length - 1] : item;
				others.push(categoryName);
			}
		}

		sizes.sort((a, b) => {
			const aNum = Number(a.split(/\s+/)[0]);
			const bNum = Number(b.split(/\s+/)[0]);
			return aNum - bNum;
		});

		return { sizes, others };
	}

	const { sizes, others } = $derived(categorizeItems(categories));
</script>

<div class="bg-white p-6 rounded-lg shadow">
	<h3 class="font-bold text-lg mb-4">Filters</h3>

	<div class="mb-6">
		<h4 class="font-semibold mb-3">Search</h4>
		<input
			type="text"
			placeholder="Search by name or description..."
			value={searchQuery}
			oninput={(e) => onSearchChange(e.currentTarget.value)}
			class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
	</div>

	<div class="mb-6">
		<h4 class="font-semibold mb-3">Category</h4>
		<div class="space-y-2">

			{#if sizes.length > 0}
				<div class="ml-2 border-l-2 border-gray-300 pl-3">
					<p class="text-sm font-semibold text-gray-600 mb-2">Sizes</p>
					<div class="space-y-2">
						{#each sizes as size}
							<label class="flex items-center cursor-pointer">
								<input
									type="radio"
									checked={filterCategory === size}
									onchange={() => onCategoryChange(size)}
									class="mr-2"
								/>
								<span>{size}</span>
							</label>
						{/each}
					</div>
				</div>
			{/if}

			{#if others.length > 0}
				<div class="space-y-2">
					{#each others as cat}
						<label class="flex items-center cursor-pointer">
							<input
								type="radio"
								checked={filterCategory.endsWith(cat) || filterCategory === cat}
								onchange={() => onCategoryChange(cat)}
								class="mr-2"
							/>
							<span class="capitalize">{cat}</span>
						</label>
					{/each}
				</div>
			{/if}
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
