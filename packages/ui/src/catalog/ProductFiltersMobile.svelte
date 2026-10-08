<script lang="ts">
	import { t } from 'svelte-i18n';
	import CollapsibleSectionButton from '$lib/catalog/CollapsibleSectionButton.svelte';
	import { Settings2 } from 'lucide-svelte';
	import {
		productPage,
		filterCategories,
		filterSizes,
		filterBrands,
		sortBy,
		filterCategory,
		filterSize,
		filterBrand,
		searchQuery
	} from '@gocommerce/composition/view/products';
	import { viewport } from '@gocommerce/composition/view/viewport';
	import type { SortOption } from '@gocommerce/composition/view/products';

	const SORT_OPTIONS: SortOption[] = ['random', 'name-asc', 'name-desc', 'price-asc', 'price-desc'];

	function setSortBy(value: string): void {
		if ((SORT_OPTIONS as string[]).includes(value)) {
			productPage.sortBy.set(value as SortOption);
		}
	}

	let isDesktop = $derived($viewport.width >= 1024);
	let isMobileFiltersOpen = $state(false);

	let isExpanded = $derived(isDesktop || isMobileFiltersOpen);

	function onChange(mutate: (e: any) => void): (e: any) => void {
		return (e) => {
			window.scrollTo(0, 0);
			return mutate(e);
		};
	}

	$effect(() => {
		if (isDesktop) {
			isMobileFiltersOpen = false;
		}
	});
</script>

<div class="card z-10 max-h-screen sticky top-16 overflow-y-auto">
	<div class="hidden lg:inline">
		<div class="h-3"></div>
		<h3 class="pl-3 text-lg font-bold">{$t('filters.title')}</h3>
	</div>

	<!-- Search Section -->
	<div class="flex items-center gap-2 border-b px-3 py-3">
		<input
			type="text"
			placeholder={$t('filters.search')}
			value={$searchQuery}
			oninput={onChange((e) => (productPage.searchQuery.set(e.currentTarget.value)))}
			spellcheck="false"
			aria-label={$t('filters.search')}
			class="flex-1 rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 md:text-base"
		/>
		<button
			type="button"
			onclick={() => { isMobileFiltersOpen = !isMobileFiltersOpen }}
			aria-label={$t('filters.title')}
			class="text-gray-600 hover:text-gray-900 lg:hidden"
		>
			<Settings2 size={20}/>
		</button>
	</div>

	{#if isExpanded}
		<!-- Sort Section -->
		<div>
			<CollapsibleSectionButton label={$t('filters.sort')} isExpanded={isDesktop}>
				<div class="px-3 py-3">
					<select
						value={$sortBy}
						onchange={onChange((e) => setSortBy(e.currentTarget.value))}
						aria-label={$t('filters.sort')}
						class="w-full rounded border p-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 md:text-base"
					>
						<option value="random">{$t('filters.random')}</option>
						<option value="name-asc">{$t('filters.nameAsc')}</option>
						<option value="name-desc">{$t('filters.nameDesc')}</option>
						<option value="price-asc">{$t('filters.priceAsc')}</option>
						<option value="price-desc">{$t('filters.priceDesc')}</option>
					</select>
				</div>
			</CollapsibleSectionButton>
		</div>

		<!-- Category Section -->
		<div class="border-b">
			<CollapsibleSectionButton label={$t('filters.category')} isExpanded={isDesktop}>
				<div class="space-y-2 px-3 py-3">
					{#if $filterCategories.length > 0}
						<div class="space-y-1">
							{#each $filterCategories as cat}
								<label class="flex cursor-pointer items-center text-xs md:text-base">
									<input
										type="radio"
										name="category"
										checked={$filterCategory.endsWith(cat) || $filterCategory === cat}
										onchange={onChange(() => (productPage.filterCategory.set(cat)))}
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
			<CollapsibleSectionButton label={$t('filters.brands')} isExpanded={isDesktop}>
				<div class="space-y-2 px-3 py-3">
					{#if $filterBrands.length > 0}
						<div class="space-y-1">
							{#each $filterBrands as brand}
								<label class="flex cursor-pointer items-center text-xs md:text-base">
									<input
										type="radio"
										name="brand"
										checked={$filterBrand === brand}
										onchange={onChange(() => (productPage.filterBrand.set(brand)))}
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
			<CollapsibleSectionButton label={$t('filters.sizes')} isExpanded={isDesktop}>
				<div class="space-y-2 px-3 py-3">
					{#if $filterSizes.length > 0}
						<div class="space-y-1">
							{#each $filterSizes as size}
								<label class="flex cursor-pointer items-center text-xs md:text-base">
									<input
										type="radio"
										name="size"
										checked={$filterSize === size}
										onchange={onChange(() => (productPage.filterSize.set(size)))}
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
