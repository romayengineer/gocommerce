<script lang="ts">
	import { t } from 'svelte-i18n';
	import Link from '$lib/ui/Link.svelte';
	import LanguageSwitcher from '$lib/layout/LanguageSwitcher.svelte';
	import CartLink from '$lib/layout/CartLink.svelte';
</script>

<nav class="sticky top-0 z-50 bg-white shadow-md">
	<div class="mx-auto max-w-page px-4">
		<div class="flex h-16 items-center justify-between">
			<Link href="#/" class="truncate text-xl font-bold text-primary-600 hover:text-primary-700 md:text-2xl">{$t('header.title')}</Link>

			<div class="ml-4 flex items-center gap-2 md:gap-8">
				<Link href="#/" variant="secondary" class="hidden sm:inline">{$t('home.featured').split(' ')[0]}</Link>
				<Link href="#/products" variant="secondary">{$t('products.title')}</Link>

				<LanguageSwitcher />

				<CartLink />
			</div>
		</div>
	</div>
</nav>
