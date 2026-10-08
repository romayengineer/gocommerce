<script lang="ts">
	import { t } from 'svelte-i18n';
	import { Copy, Check } from 'lucide-svelte';
	import Button from '$lib/ui/Button.svelte';
	import OrderSummaryLine from '$lib/cart/OrderSummaryLine.svelte';
	import Card from '$lib/ui/Card.svelte';
	import { cartProducts, cartTotal, paymentService, clipboard, router } from '@gocommerce/composition/view';

	const bank = paymentService.bank;

	let total = $derived($cartTotal);

	let copiedField = $state<string | null>(null);

	const fields = $derived([
		{ key: 'alias', label: $t('payment.accountAlias'), value: bank.alias },
		{ key: 'number', label: $t('payment.accountNumber'), value: bank.number },
		{ key: 'accountName', label: $t('payment.accountOwnerName'), value: bank.name },
		{ key: 'bankName', label: $t('payment.bankName'), value: bank.bankName }
	]);

	function copyToClipboard(text: string, field: string) {
		clipboard.writeText(text).then(() => {
			copiedField = field;
			setTimeout(() => {
				copiedField = null;
			}, 2000);
		});
	}
</script>

<div class="mx-auto max-w-page">
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<div class="lg:col-span-2">
			<div class="card px-4 py-6">
				<h2 class="mb-6 text-lg font-semibold">{$t('payment.bankDetails')}</h2>

				<div class="space-y-4">
					{#each fields as field (field.key)}
						<div class="rounded-lg border p-4">
							<div class="mb-2 block text-sm text-gray-600">{field.label}</div>
							<div class="flex items-center justify-between">
								<span class="font-mono text-lg font-semibold">{field.value}</span>
								<button
									type="button"
									class="rounded p-2 transition-colors hover:bg-gray-100"
									onclick={() => copyToClipboard(field.value, field.key)}
									aria-label={`${$t('payment.copy')} ${field.label}`}
									title={`${$t('payment.copy')} ${field.label}`}
								>
									{#if copiedField === field.key}
										<Check size={20} class="text-green-600" />
									{:else}
										<Copy size={20} class="text-gray-600" />
									{/if}
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="lg:col-span-1">
			<Card sticky={true}>
				<h2 class="mb-4 text-lg font-semibold">{$t('cart.orderSummary')}</h2>

				<div class="mb-6 space-y-2">
					<div class="mt-4 pt-2">
						<OrderSummaryLine label={$t('cart.total') + ':'} amount={total} isBold={true} />
					</div>
					{#each $cartProducts as item (item.product.itemId)}
						<OrderSummaryLine
							label={`${item.product.brand} ${item.product.productName}`}
							amount={item.product.price * item.quantity}
							size={item.product.size}
							quantity={item.quantity}
						/>
					{/each}
				</div>

				<div class="mt-8 pt-6">
					<Button class="w-full py-3" onclick={() => router.navigate('#/products')}>
						{$t('payment.backToProducts')}
					</Button>
				</div>
			</Card>
		</div>
	</div>
</div>
