<script lang="ts">
	import { t } from 'svelte-i18n';
	import Button from '@gocommerce/ui-primitives/Button.svelte';

	interface Props {
		onclick: () => void;
	}

	const { onclick }: Props = $props();
</script>

<Button
	variant="primary"
	class="w-full max-w-48 py-3 text-sm whitespace-nowrap lg:text-base"
	{onclick}
>
	{$t('productDetail.addToCart')}
</Button>
