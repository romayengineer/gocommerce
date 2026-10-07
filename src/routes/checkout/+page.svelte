<script lang="ts">
	import { t } from 'svelte-i18n';
	import { ShoppingCart } from 'lucide-svelte';
	import CheckoutForm from '$lib/checkout/CheckoutForm.svelte';
	import PageContainer from '$lib/ui/PageContainer.svelte';
	import PageTitle from '$lib/ui/PageTitle.svelte';
</script>

<PageContainer>
	<PageTitle title={$t('cart.checkout')}>
		<ShoppingCart size={30} />
	</PageTitle>
	<CheckoutForm />
</PageContainer>
