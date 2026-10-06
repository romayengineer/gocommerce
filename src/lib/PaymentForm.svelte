<script lang="ts">
	import { t } from 'svelte-i18n';
	import { Copy, Check } from 'lucide-svelte';
	import Button from './Button.svelte';
	import OrderSummaryLine from './OrderSummaryLine.svelte';
	import SidePanel from './SidePanel.svelte';
	import { cartProducts, cartTotal, paymentService, clipboard, router } from './view';

	const bank = paymentService.bank;

	let total = $derived($cartTotal);

	let copiedField = $state<string | null>(null);

	function copyToClipboard(text: string, field: string) {
		clipboard.writeText(text).then(() => {
			copiedField = field;
			setTimeout(() => {
				copiedField = null;
			}, 2000);
		});
	}
</script>

<div class="mx-auto max-w-6xl">
	<div class="grid grid-cols-1 lg:grid-cols-3 lg:gap-6">
		<div class="lg:col-span-2">
			<div class="bg-white rounded-lg shadow px-4 py-6">
				<h2 class="text-lg font-semibold mb-6">{$t('payment.bankDetails')}</h2>

				<div class="space-y-4">
					<div class="border rounded-lg p-4">
						<div class="text-sm text-gray-600 block mb-2">{$t('payment.accountAlias')}</div>
						<div class="flex items-center justify-between">
							<span class="font-mono text-lg font-semibold">{bank.alias}</span>
							<button
								type="button"
								class="p-2 hover:bg-gray-100 rounded transition-colors"
								onclick={() => copyToClipboard(bank.alias, 'alias')}
								title="Copy account alias"
							>
								{#if copiedField === 'alias'}
									<Check size={20} class="text-green-600" />
								{:else}
									<Copy size={20} class="text-gray-600" />
								{/if}
							</button>
						</div>
					</div>

					<div class="border rounded-lg p-4">
						<div class="text-sm text-gray-600 block mb-2">{$t('payment.accountNumber')}</div>
						<div class="flex items-center justify-between">
							<span class="font-mono text-lg font-semibold">{bank.number}</span>
							<button
								type="button"
								class="p-2 hover:bg-gray-100 rounded transition-colors"
								onclick={() => copyToClipboard(bank.number, 'number')}
								title="Copy account number"
							>
								{#if copiedField === 'number'}
									<Check size={20} class="text-green-600" />
								{:else}
									<Copy size={20} class="text-gray-600" />
								{/if}
							</button>
						</div>
					</div>
					<div class="border rounded-lg p-4">
						<div class="text-sm text-gray-600 block mb-2">{$t('payment.accountOwnerName')}</div>
						<div class="flex items-center justify-between">
							<span class="font-mono text-lg font-semibold">{bank.name}</span>
							<button
								type="button"
								class="p-2 hover:bg-gray-100 rounded transition-colors"
								onclick={() => copyToClipboard(bank.name, 'accountName')}
								title="Copy account owner name"
							>
								{#if copiedField === 'accountName'}
									<Check size={20} class="text-green-600" />
								{:else}
									<Copy size={20} class="text-gray-600" />
								{/if}
							</button>
						</div>
					</div>

					<div class="border rounded-lg p-4">
						<div class="text-sm text-gray-600 block mb-2">{$t('payment.bankName')}</div>
						<div class="flex items-center justify-between">
							<span class="font-mono text-lg font-semibold">{bank.bankName}</span>
							<button
								type="button"
								class="p-2 hover:bg-gray-100 rounded transition-colors"
								onclick={() => copyToClipboard(bank.bankName, 'bankName')}
								title="Copy bank name"
							>
								{#if copiedField === 'bankName'}
									<Check size={20} class="text-green-600" />
								{:else}
									<Copy size={20} class="text-gray-600" />
								{/if}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="lg:col-span-1">
			<SidePanel sticky={true}>
				<h2 class="font-semibold text-lg mb-4">{$t('cart.orderSummary')}</h2>

				<div class="space-y-2 mb-6">
					<div class="pt-2 mt-4">
						<OrderSummaryLine label="Total:" amount={total} isBold={true} />
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
			</SidePanel>
		</div>
	</div>
</div>