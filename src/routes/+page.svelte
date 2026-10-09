<script lang="ts">
	import { t } from 'svelte-i18n';
	import ProductGrid from '@gocommerce/ui-catalog/ProductGrid.svelte';
	import PageContainer from '@gocommerce/ui-primitives/PageContainer.svelte';
	import Link from '@gocommerce/ui-primitives/Link.svelte';
	import { config } from '@gocommerce/composition/view/app';
	import { productPage, sortedProducts } from '@gocommerce/composition/view/products';
	import { viewport } from '@gocommerce/composition/view/viewport';

	let gridRows = $derived(Math.ceil(config.home.featuredCount / $viewport.columns));

	const featured = $derived($sortedProducts.slice(0, $viewport.columns * gridRows));

	// Gradient tokens resolve through theme CSS vars so configured shades
	// follow [data-theme] overrides; fallbacks match the default palette.
	const heroStyle = $derived(
		`background-image: linear-gradient(to right, rgb(var(--color-${config.hero.gradientFrom}, 37 99 235)), rgb(var(--color-${config.hero.gradientTo}, 30 64 175)))`
	);
</script>

<PageContainer>
	{#if config.hero.enabled}
		<section class="mb-2 md:mb-4">
			<div class="rounded-lg p-12 text-white" style={heroStyle}>
				<h1 class="mb-4 text-5xl font-bold">{config.shop.name}</h1>
				<p class="mb-6 text-xl">{$t('home.browse')}</p>
				<Link href={config.hero.ctaHref} variant="contrast">
					{$t('products.add')}
				</Link>
			</div>
		</section>
	{/if}

	<section>
		<ProductGrid products={featured} onProductImageFailed={(id) => productPage.handleProductImageFailed(id)}/>
	</section>
</PageContainer>
