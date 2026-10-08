<script lang="ts">
	import { t } from 'svelte-i18n';
	import { CreditCard } from 'lucide-svelte';
	import PaymentForm from '@gocommerce/ui-purchase/payment/PaymentForm.svelte';
	import PageContainer from '@gocommerce/ui-primitives/PageContainer.svelte';
	import PageTitle from '@gocommerce/ui-primitives/PageTitle.svelte';
</script>

<PageContainer>
	<PageTitle title={$t('payment.title')}>
		<CreditCard size={30} />
	</PageTitle>
	<PaymentForm />
</PageContainer>
