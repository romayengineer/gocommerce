<script lang="ts">
	import { t } from 'svelte-i18n';
	import Link from './Link.svelte';
	import LanguageSwitcher from './LanguageSwitcher.svelte';
	import CartLink from './CartLink.svelte';
</script>

<nav class="bg-white shadow-md sticky top-0 z-50">
	<div class="max-w-7xl mx-auto px-4">
		<div class="flex items-center justify-between h-16">
			<Link href="#/" class="text-xl md:text-2xl font-bold text-blue-600 hover:text-blue-700 truncate">{$t('header.title')}</Link>

			<div class="flex items-center gap-2 md:gap-8 ml-4">
				<Link href="#/" variant="secondary" class="hidden sm:inline">{$t('home.featured').split(' ')[0]}</Link>
				<Link href="#/products" variant="secondary">{$t('products.title')}</Link>

				<LanguageSwitcher />

				<CartLink />
			</div>
		</div>
	</div>
</nav>
