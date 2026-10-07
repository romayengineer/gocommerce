<script lang="ts">
	import { t } from 'svelte-i18n';
	import { router } from '$lib/view';
	import Link from '$lib/ui/Link.svelte';

	setTimeout(() => {
		router.navigate('#/products', { replaceState: true });
	}, 3000);
</script>

<div class="mx-auto max-w-page px-4 py-12">
	<p class="text-xl text-gray-600">{$t('errors.productNotFound')}</p>
	<Link href="#/products" class="mt-4 inline-block">{$t('errors.backToProducts')}</Link>
</div>
