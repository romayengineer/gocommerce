<script lang="ts">
	import { t } from 'svelte-i18n';
	import Link from './Link.svelte';
</script>

<footer class="bg-gray-900 text-white mt-16">
	<div class="max-w-8xl mx-auto px-4 py-12">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
			<div>
				<h3 class="text-xl font-bold mb-4">{$t('header.title')}</h3>
				<p class="text-gray-400">{$t('footer.description')}</p>
			</div>

			<div>
				<h4 class="font-semibold mb-4">{$t('footer.shop')}</h4>
				<ul class="space-y-2 text-gray-400">
					<li><Link href="#/products" variant="muted">{$t('footer.allProducts')}</Link></li>
					<li><Link href="#/products" variant="muted">{$t('footer.categories')}</Link></li>
					<li><Link href="#/products" variant="muted">{$t('footer.sale')}</Link></li>
				</ul>
			</div>

			<div>
				<h4 class="font-semibold mb-4">{$t('footer.company')}</h4>
				<ul class="space-y-2 text-gray-400">
					<li><Link href="#/" variant="muted">{$t('footer.about')}</Link></li>
					<li><Link href="#/" variant="muted">{$t('footer.contact')}</Link></li>
					<li><Link href="#/" variant="muted">{$t('footer.blog')}</Link></li>
				</ul>
			</div>

			<div>
				<h4 class="font-semibold mb-4">{$t('footer.legal')}</h4>
				<ul class="space-y-2 text-gray-400">
					<li><Link href="#/" variant="muted">{$t('footer.privacy')}</Link></li>
					<li><Link href="#/" variant="muted">{$t('footer.terms')}</Link></li>
					<li><Link href="#/" variant="muted">{$t('footer.shipping')}</Link></li>
				</ul>
			</div>
		</div>

		<div class="border-t border-gray-700 pt-8 text-center text-gray-400">
			<p>{$t('footer.copyright')}</p>
		</div>
	</div>
</footer>
