<script lang="ts">
	import { t } from 'svelte-i18n';
	import Button from './Button.svelte';

	const { onclick } = $props<{
		onclick: () => void;
	}>();
</script>

<Button
	variant="primary"
	class="w-full py-3"
	{onclick}
>
	{$t('productDetail.addToCart')}
</Button>
