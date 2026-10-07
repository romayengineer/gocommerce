<script lang="ts">
	import { t } from 'svelte-i18n';
	import { CreditCard } from 'lucide-svelte';
	import PaymentForm from '$lib/payment/PaymentForm.svelte';
	import PageContainer from '$lib/ui/PageContainer.svelte';
	import PageTitle from '$lib/ui/PageTitle.svelte';
</script>

<PageContainer>
	<PageTitle title={$t('payment.title')}>
		<CreditCard size={30} />
	</PageTitle>
	<PaymentForm />
</PageContainer>
