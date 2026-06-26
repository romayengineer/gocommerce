<script lang="ts">
	import { t } from 'svelte-i18n';
	import { CreditCard } from 'lucide-svelte';
	import PaymentForm from '$lib/PaymentForm.svelte';
</script>

<div class="mx-auto max-w-6xl px-2 py-6 md:py-12">
	<div class="flex items-center gap-2 mb-2 md:mb-6">
		<CreditCard size={30} />
		<h1 class="capitalize x-text-xl">{$t('payment.title')}</h1>
	</div>
	<PaymentForm />
</div>
