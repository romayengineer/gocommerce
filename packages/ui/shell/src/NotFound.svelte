<script lang="ts">
	import { t } from 'svelte-i18n';
	import { router } from '@gocommerce/composition/view/router';
	import Link from '@gocommerce/ui-primitives/Link.svelte';

	setTimeout(() => {
		router.navigate('#/products', { replaceState: true });
	}, 3000);
</script>

<div class="flex min-h-screen flex-col items-center justify-center px-4">
	<div class="text-center">
		<h1 class="mb-4 text-6xl font-bold text-gray-900">404</h1>
		<p class="mb-2 text-2xl font-semibold text-gray-700">{$t('errors.notFoundTitle')}</p>
		<p class="mb-8 max-w-md text-gray-600">
			{$t('errors.notFoundMessage')}
		</p>
		<Link href="#/" variant="button">{$t('errors.goHome')}</Link>
	</div>
</div>
