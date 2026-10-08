<script lang="ts">
	import { t } from 'svelte-i18n';
	import Link from '@gocommerce/ui-primitives/Link.svelte';
	import LanguageSwitcher from './LanguageSwitcher.svelte';
	import CartLink from './CartLink.svelte';
	import { config } from '@gocommerce/composition/view/app';
</script>

<nav class="{config.layout.stickyNav ? 'sticky top-0 z-50' : 'relative'} bg-white shadow-md">
	<div class="mx-auto w-full max-w-page px-page-x">
		<div class="flex h-16 items-center justify-between">
			<Link href="#/" class="truncate text-xl font-bold text-primary-600 hover:text-primary-700 md:text-2xl">
				{#if config.shop.logoUrl}
					<img src={config.shop.logoUrl} alt={config.shop.name} class="h-8 max-w-full object-contain" />
				{:else}
					{config.shop.name}
				{/if}
			</Link>

			<div class="ml-4 flex items-center gap-2 md:gap-8">
				<Link href="#/" variant="secondary" class="hidden sm:inline">{$t('home.featured').split(' ')[0]}</Link>
				<Link href="#/products" variant="secondary">{$t('products.title')}</Link>

				<LanguageSwitcher />

				<CartLink />
			</div>
		</div>
	</div>
</nav>
