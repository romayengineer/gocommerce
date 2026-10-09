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
		<h1 class="mb-4 text-6xl font-bold text-ink">404</h1>
		<p class="mb-2 text-2xl font-semibold text-ink-secondary">{$t('errors.notFoundTitle')}</p>
		<p class="mb-8 max-w-md text-ink-muted">
			{$t('errors.notFoundMessage')}
		</p>
		<Link href="#/" variant="button">{$t('errors.goHome')}</Link>
	</div>
</div>
