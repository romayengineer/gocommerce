<script lang="ts">
	import { t } from 'svelte-i18n';
	import { router } from '@gocommerce/composition/view/router';
	import Link from '@gocommerce/ui-primitives/Link.svelte';
	import PageContainer from '@gocommerce/ui-primitives/PageContainer.svelte';

	setTimeout(() => {
		router.navigate('#/products', { replaceState: true });
	}, 3000);
</script>

<PageContainer class="py-12">
	<p class="text-xl text-gray-600">{$t('errors.productNotFound')}</p>
	<Link href="#/products" class="mt-4 inline-block">{$t('errors.backToProducts')}</Link>
</PageContainer>
