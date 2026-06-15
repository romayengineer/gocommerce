<script lang="ts">
	import { categorizeItems, type ProductFiltersProps } from './productFilters';
	import CollapsibleSectionButton from './CollapsibleSectionButton.svelte';
	import { Settings2 } from 'lucide-svelte'
	import { windowWidthManager } from './windowWidth.svelte';

	type Props = ProductFiltersProps;

	const { sortBy, filterCategory, searchQuery, categories, onSortChange, onCategoryChange, onSearchChange }: Props = $props();

	const { sizes, others } = $derived(categorizeItems(categories));

	let isDesktop = $derived(windowWidthManager.width >= 1024);
	let isMobileFiltersOpen = $state(false);

	let isExpanded = $derived(isDesktop || isMobileFiltersOpen);

	$effect(() => {
		if (isDesktop) {
			isMobileFiltersOpen = false;
		}
	});
</script>

<div class="bg-white rounded-lg shadow sticky top-16 max-h-screen overflow-y-auto z-10">
	<h3 class="font-bold text-lg p-4 hidden lg:inline">Filters</h3>

	<!-- Search Section -->
	<div class="px-3 py-3 border-b flex items-center gap-2">
		<input
			type="text"
			placeholder="Search..."
			value={searchQuery}
			oninput={(e) => onSearchChange(e.currentTarget.value)}
			class="flex-1 px-2 py-1.5 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
		<button
			onclick={() => { isMobileFiltersOpen = !isMobileFiltersOpen }}
			class="text-gray-600 hover:text-gray-900 lg:hidden"
		>
			<Settings2 size={20}/>
		</button>
	</div>

	{#if isExpanded}
		<!-- Category Section -->
		<div class="border-b">
			<CollapsibleSectionButton label="Category" isExpanded={isDesktop}>
				<div class="px-3 py-3 space-y-2">
					{#if sizes.length > 0}
						<div class="ml-1 border-l-2 border-gray-300 pl-2">
							<p class="text-xs md:text-base font-semibold text-gray-600 mb-1">Sizes</p>
							<div class="space-y-1">
								{#each sizes as size}
									<label class="flex items-center cursor-pointer text-xs md:text-base">
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
								<label class="flex items-center cursor-pointer text-xs md:text-base">
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
			</CollapsibleSectionButton>
		</div>

		<!-- Sort Section -->
		<div>
			<CollapsibleSectionButton label="Sort" isExpanded={isDesktop}>
				<div class="px-3 py-3">
					<select
						value={sortBy}
						onchange={(e) => onSortChange(e.currentTarget.value)}
						class="w-full p-1.5 text-xs md:text-base border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="random">Random</option>
						<option value="name">Name (A-Z)</option>
						<option value="price-low">Price (Low to High)</option>
						<option value="price-high">Price (High to Low)</option>
					</select>
				</div>
			</CollapsibleSectionButton>
		</div>
	{/if}
</div>
