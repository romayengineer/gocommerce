<script lang="ts">
	import { t } from 'svelte-i18n';
	import CheckoutForm from '$lib/CheckoutForm.svelte';
</script>

<div class="max-w-2xl mx-auto px-4 py-12">
	<h1 class="text-4xl font-bold mb-8">{$t('cart.checkout')}</h1>
	<CheckoutForm />
</div>
