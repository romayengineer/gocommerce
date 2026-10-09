<script lang="ts">
	import { t } from 'svelte-i18n';
	import { ShoppingCart } from '@lucide/svelte';
	import CheckoutForm from '@gocommerce/ui-purchase/checkout/CheckoutForm.svelte';
	import PageContainer from '@gocommerce/ui-primitives/PageContainer.svelte';
	import PageTitle from '@gocommerce/ui-primitives/PageTitle.svelte';
</script>

<PageContainer>
	<PageTitle title={$t('cart.checkout')}>
		<ShoppingCart size={30} />
	</PageTitle>
	<CheckoutForm />
</PageContainer>
