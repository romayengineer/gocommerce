<script lang="ts">
	import { categorizeItems, type ProductFiltersProps } from './productFilters';
	import CollapsibleSectionButton from './CollapsibleSectionButton.svelte';

	type Props = ProductFiltersProps;

	const { sortBy, filterCategory, searchQuery, categories, onSortChange, onCategoryChange, onSearchChange }: Props = $props();

	const { sizes, others } = $derived(categorizeItems(categories));

	let expandedSections = $state({
		search: true,
		category: false,
		sort: false
	});

	function toggleSection(section: keyof typeof expandedSections) {
		expandedSections[section] = !expandedSections[section];
	}
</script>

<div class="bg-white rounded-lg shadow space-y-2">
	<!-- Search Section -->
	<div class="border-b">
		<CollapsibleSectionButton
			label="Search"
			isExpanded={expandedSections.search}
			onToggle={() => toggleSection('search')}
		/>
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
		<CollapsibleSectionButton
			label="Category"
			isExpanded={expandedSections.category}
			onToggle={() => toggleSection('category')}
		/>
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
		<CollapsibleSectionButton
			label="Sort"
			isExpanded={expandedSections.sort}
			onToggle={() => toggleSection('sort')}
		/>
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
