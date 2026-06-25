<script lang="ts">
	import CollapsibleSectionButton from './CollapsibleSectionButton.svelte';
	import { Settings2 } from 'lucide-svelte'
	import { windowWidthManager } from './windowWidth.svelte';
	import type { ProductPageStore } from './productPageStore.svelte';

	interface Props {
		store: ProductPageStore;
	}

	const { store }: Props = $props();

	let others = $derived(store.categories);

	let sizes =  $derived(store.sizes);

	let brands =  $derived(store.brands);

	let isDesktop = $derived(windowWidthManager.width >= 1024);
	let isMobileFiltersOpen = $state(false);

	let isExpanded = $derived(isDesktop || isMobileFiltersOpen);

	function onChange(func: (e: any) => void): ((e: any) => void) {
		return (e) => {
			window.scrollTo(0, 0);
			return func(e);
		}
	}

	$effect(() => {
		if (isDesktop) {
			isMobileFiltersOpen = false;
		}
	});
</script>

<div class="bg-white rounded-lg shadow sticky top-16 max-h-screen overflow-y-auto z-10">
	<div class="hidden lg:inline">
		<div class="h-3"></div>
		<h3 class="font-bold text-lg pl-3">Filters</h3>
	</div>

	<!-- Search Section -->
	<div class="px-3 py-3 border-b flex items-center gap-2">
		<input
			type="text"
			placeholder="Search..."
			value={store.searchQuery}
			oninput={onChange((e) => (store.searchQuery = e.currentTarget.value))}
			spellcheck="false"
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
		<!-- Sort Section -->
		<div>
			<CollapsibleSectionButton label="Sort" isExpanded={isDesktop}>
				<div class="px-3 py-3">
					<select
						value={store.sortBy}
						onchange={onChange((e) => (store.sortBy = e.currentTarget.value))}
						class="w-full p-1.5 text-xs md:text-base border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="random">Random</option>
						<option value="name-asc">Name (A-Z)</option>
						<option value="name-desc">Name (Z-A)</option>
						<option value="price-asc">Price (Low to High)</option>
						<option value="price-desc">Price (High to Low)</option>
					</select>
				</div>
			</CollapsibleSectionButton>
		</div>

		<!-- Category Section -->
		<div class="border-b">
			<CollapsibleSectionButton label="Category" isExpanded={isDesktop}>
				<div class="px-3 py-3 space-y-2">
					{#if others.length > 0}
						<div class="space-y-1">
							{#each others as cat}
								<label class="flex items-center cursor-pointer text-xs md:text-base">
									<input
										type="radio"
										checked={store.filterCategory.endsWith(cat) || store.filterCategory === cat}
										onchange={onChange(() => (store.filterCategory = cat))}
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

		
		<div class="border-b">
			<CollapsibleSectionButton label="Brands" isExpanded={isDesktop}>
				<div class="px-3 py-3 space-y-2">
					{#if brands.length > 0}
						<div class="space-y-1">
							{#each brands as brand}
								<label class="flex items-center cursor-pointer text-xs md:text-base">
									<input
										type="radio"
										checked={store.filterBrand === brand}
										onchange={onChange(() => (store.filterBrand = brand))}
										class="mr-1.5"
									/>
									<span class="capitalize">{brand}</span>
								</label>
							{/each}
						</div>
					{/if}
				</div>
			</CollapsibleSectionButton>
		</div>

		
		<div class="border-b">
			<CollapsibleSectionButton label="Sizes" isExpanded={isDesktop}>
				<div class="px-3 py-3 space-y-2">
					{#if sizes.length > 0}
						<div class="space-y-1">
							{#each sizes as size}
								<label class="flex items-center cursor-pointer text-xs md:text-base">
									<input
										type="radio"
										checked={store.filterSize === size}
										onchange={onChange(() => (store.filterSize = size))}
										class="mr-1.5"
									/>
									<span class="capitalize">{size} ML</span>
								</label>
							{/each}
						</div>
					{/if}
				</div>
			</CollapsibleSectionButton>
		</div>
	{/if}
</div>
