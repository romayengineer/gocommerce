<script lang="ts">
	import { t } from 'svelte-i18n';
	import Link from '@gocommerce/ui-primitives/Link.svelte';
	import { config } from '@gocommerce/composition/view/app';
</script>

<footer class="mt-16 bg-footer text-oncolor">
	<div class="mx-auto w-full max-w-page px-page-x py-12">
		<div class="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
			<div>
				<h3 class="mb-4 text-xl font-bold">{config.shop.name}</h3>
				<p class="text-footer-fg">{$t('footer.description')}</p>
			</div>

			{#if config.footer.showShop}
				<div>
					<h4 class="mb-4 font-semibold">{$t('footer.shop')}</h4>
					<ul class="space-y-2 text-footer-fg">
						<li><Link href="#/products" variant="muted">{$t('footer.allProducts')}</Link></li>
						<li><Link href="#/products" variant="muted">{$t('footer.categories')}</Link></li>
						<li><Link href="#/products" variant="muted">{$t('footer.sale')}</Link></li>
					</ul>
				</div>
			{/if}

			{#if config.footer.showCompany}
				<div>
					<h4 class="mb-4 font-semibold">{$t('footer.company')}</h4>
					<ul class="space-y-2 text-footer-fg">
						<li><Link href="#/" variant="muted">{$t('footer.about')}</Link></li>
						<li><Link href="#/" variant="muted">{$t('footer.contact')}</Link></li>
						<li><Link href="#/" variant="muted">{$t('footer.blog')}</Link></li>
					</ul>
				</div>
			{/if}

			{#if config.footer.showLegal}
				<div>
					<h4 class="mb-4 font-semibold">{$t('footer.legal')}</h4>
					<ul class="space-y-2 text-footer-fg">
						<li><Link href="#/" variant="muted">{$t('footer.privacy')}</Link></li>
						<li><Link href="#/" variant="muted">{$t('footer.terms')}</Link></li>
						<li><Link href="#/" variant="muted">{$t('footer.shipping')}</Link></li>
					</ul>
				</div>
			{/if}
		</div>

		<div class="border-t border-footer-border pt-8 text-center text-footer-fg">
			<p>{$t('footer.copyright', { values: { year: config.footer.copyrightYear, shopName: config.shop.name } })}{#if config.footer.showBuiltBy} | {$t('footer.builtWith')}{/if}</p>
		</div>
	</div>
</footer>
