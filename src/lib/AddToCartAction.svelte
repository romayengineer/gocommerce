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
	class="w-full py-3"
	{onclick}
>
	{$t('productDetail.addToCart')}
</Button>
