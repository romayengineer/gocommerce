<script lang="ts">
	import { t } from 'svelte-i18n';
	import Button from './Button.svelte';

	interface Props {
		onclick: () => void;
	}

	const { onclick }: Props = $props();
</script>

<Button
	variant="primary"
	class="w-full max-w-48 py-3 text-sm lg:text-base whitespace-nowrap"
	{onclick}
>
	{$t('productDetail.addToCart')}
</Button>
