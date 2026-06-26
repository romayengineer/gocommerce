<script lang="ts">
	import { t } from 'svelte-i18n';
	import { ShoppingCart } from 'lucide-svelte';
	import CheckoutForm from '$lib/CheckoutForm.svelte';
</script>

<div class="mx-auto max-w-6xl px-2 py-6 md:py-12">
	<div class="flex items-center gap-2 mb-2 md:mb-6">
		<ShoppingCart size={30} />
		<h1 class="capitalize x-text-xl">{$t('cart.checkout')}</h1>
	</div>
	<CheckoutForm />
</div>
