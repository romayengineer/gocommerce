<script lang="ts">
	import { t } from 'svelte-i18n';
	import ArkCollapsible from '$lib/ui/ark/ArkCollapsible.svelte';
	import ArkRadioGroup from '$lib/ui/ark/ArkRadioGroup.svelte';
	import ArkSelect from '$lib/ui/ark/ArkSelect.svelte';
	import { Settings2 } from 'lucide-svelte';
	import {
		viewport,
		productPage,
		filterCategories,
		filterSizes,
		filterBrands,
		sortBy,
		filterCategory,
		filterSize,
		filterBrand,
		searchQuery
	} from '$lib/view';

	let isDesktop = $derived($viewport.width >= 1024);
	let isMobileFiltersOpen = $state(false);

	let isExpanded = $derived(isDesktop || isMobileFiltersOpen);

	function scrollTop() {
		window.scrollTo(0, 0);
	}

	const sortOptions = $derived([
		{ value: 'random', label: $t('filters.random') },
		{ value: 'name-asc', label: $t('filters.nameAsc') },
		{ value: 'name-desc', label: $t('filters.nameDesc') },
		{ value: 'price-asc', label: $t('filters.priceAsc') },
		{ value: 'price-desc', label: $t('filters.priceDesc') }
	]);

	const categoryOptions = $derived($filterCategories.map((cat) => ({ value: cat, label: cat })));
	const brandOptions = $derived($filterBrands.map((brand) => ({ value: brand, label: brand })));
	const sizeOptions = $derived($filterSizes.map((size) => ({ value: size, label: `${size} ML` })));

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
			oninput={(e) => {
				scrollTop();
				productPage.searchQuery.set(e.currentTarget.value);
			}}
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
			<ArkCollapsible label={$t('filters.sort')} isExpanded={isDesktop}>
				<div class="px-3 py-3">
					<ArkSelect
						options={sortOptions}
						value={$sortBy}
						ariaLabel={$t('filters.sort')}
						onchange={(v) => {
							scrollTop();
							productPage.sortBy.set(v);
						}}
					/>
				</div>
			</ArkCollapsible>
		</div>

		<!-- Category Section -->
		<div class="border-b">
			<ArkCollapsible label={$t('filters.category')} isExpanded={isDesktop}>
				<div class="px-3 py-3">
					{#if $filterCategories.length > 0}
						<ArkRadioGroup
							name="category"
							label={$t('filters.category')}
							hideLabel
							options={categoryOptions}
							value={$filterCategory}
							onchange={(v) => {
								scrollTop();
								productPage.filterCategory.set(v);
							}}
						/>
					{/if}
				</div>
			</ArkCollapsible>
		</div>

		<div class="border-b">
			<ArkCollapsible label={$t('filters.brands')} isExpanded={isDesktop}>
				<div class="px-3 py-3">
					{#if $filterBrands.length > 0}
						<ArkRadioGroup
							name="brand"
							label={$t('filters.brands')}
							hideLabel
							options={brandOptions}
							value={$filterBrand}
							onchange={(v) => {
								scrollTop();
								productPage.filterBrand.set(v);
							}}
						/>
					{/if}
				</div>
			</ArkCollapsible>
		</div>

		<div class="border-b">
			<ArkCollapsible label={$t('filters.sizes')} isExpanded={isDesktop}>
				<div class="px-3 py-3">
					{#if $filterSizes.length > 0}
						<ArkRadioGroup
							name="size"
							label={$t('filters.sizes')}
							hideLabel
							options={sizeOptions}
							value={$filterSize}
							onchange={(v) => {
								scrollTop();
								productPage.filterSize.set(v);
							}}
						/>
					{/if}
				</div>
			</ArkCollapsible>
		</div>
	{/if}
</div>
