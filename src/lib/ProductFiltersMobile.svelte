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

	let expandedSections = $state({
		search: true,
		category: false,
		sort: false
	});

	function categorizeItems(items: string[]): CategorizedItems {
		const sizes: string[] = [];
		const others: string[] = [];

		for (const item of items) {
			const parts = item.trim().split(/\s+/);
			const isSize = parts.length === 2 && !isNaN(Number(parts[0])) && parts[1].toUpperCase() === 'ML';

			if (isSize) {
				sizes.push(item);
			} else {
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

	function toggleSection(section: keyof typeof expandedSections) {
		expandedSections[section] = !expandedSections[section];
	}
</script>

<div class="bg-white rounded-lg shadow space-y-2">
	<!-- Search Section -->
	<div class="border-b">
		<button
			onclick={() => toggleSection('search')}
			class="w-full flex items-center justify-between p-3 text-sm font-semibold hover:bg-gray-50"
		>
			<span>Search</span>
			<span class={`text-gray-500 transition-transform ${expandedSections.search ? 'rotate-180' : ''}`}>▼</span>
		</button>
		{#if expandedSections.search}
			<div class="px-3 pb-3">
				<input
					type="text"
					placeholder="Search..."
					value={searchQuery}
					oninput={(e) => onSearchChange(e.currentTarget.value)}
					class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>
		{/if}
	</div>

	<!-- Category Section -->
	<div class="border-b">
		<button
			onclick={() => toggleSection('category')}
			class="w-full flex items-center justify-between p-3 text-sm font-semibold hover:bg-gray-50"
		>
			<span>Category</span>
			<span class={`text-gray-500 transition-transform ${expandedSections.category ? 'rotate-180' : ''}`}>▼</span>
		</button>
		{#if expandedSections.category}
			<div class="px-3 pb-3 space-y-2">
				{#if sizes.length > 0}
					<div class="ml-1 border-l-2 border-gray-300 pl-2">
						<p class="text-xs font-semibold text-gray-600 mb-1">Sizes</p>
						<div class="space-y-1">
							{#each sizes as size}
								<label class="flex items-center cursor-pointer text-xs">
									<input
										type="radio"
										checked={filterCategory === size}
										onchange={() => onCategoryChange(size)}
										class="mr-1.5"
									/>
									<span>{size}</span>
								</label>
							{/each}
						</div>
					</div>
				{/if}

				{#if others.length > 0}
					<div class="space-y-1">
						{#each others as cat}
							<label class="flex items-center cursor-pointer text-xs">
								<input
									type="radio"
									checked={filterCategory.endsWith(cat) || filterCategory === cat}
									onchange={() => onCategoryChange(cat)}
									class="mr-1.5"
								/>
								<span class="capitalize">{cat}</span>
							</label>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Sort Section -->
	<div>
		<button
			onclick={() => toggleSection('sort')}
			class="w-full flex items-center justify-between p-3 text-sm font-semibold hover:bg-gray-50"
		>
			<span>Sort</span>
			<span class={`text-gray-500 transition-transform ${expandedSections.sort ? 'rotate-180' : ''}`}>▼</span>
		</button>
		{#if expandedSections.sort}
			<div class="px-3 pb-3">
				<select
					value={sortBy}
					onchange={(e) => onSortChange(e.currentTarget.value)}
					class="w-full p-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="name">Name (A-Z)</option>
					<option value="price-low">Price (Low to High)</option>
					<option value="price-high">Price (High to Low)</option>
				</select>
			</div>
		{/if}
	</div>
</div>
