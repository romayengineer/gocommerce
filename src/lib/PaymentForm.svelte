<script lang="ts">
	import { t } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { Copy, Check } from 'lucide-svelte';
	import Button from './Button.svelte';
	import OrderSummaryLine from './OrderSummaryLine.svelte';
	import SidePanel from './SidePanel.svelte';
	import { cartProducts } from './cart';

	const bankAccountAlias = import.meta.env.VITE_BANK_ACCOUNT_ALIAS;
	const bankAccountNumber = import.meta.env.VITE_BANK_ACCOUNT_NUMBER;
	const bankAccountName = import.meta.env.VITE_BANK_ACCOUNT_NAME;
	const bankName = import.meta.env.VITE_BANK_NAME;

	let copiedField = $state<string | null>(null);

	const total = $derived($cartProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0));

	function copyToClipboard(text: string, field: string) {
		navigator.clipboard.writeText(text).then(() => {
			copiedField = field;
			setTimeout(() => {
				copiedField = null;
			}, 2000);
		});
	}
</script>

<div class="mx-auto max-w-6xl px-2">
	<div class="grid grid-cols-1 lg:grid-cols-3 lg:gap-6">
		<div class="lg:col-span-2">
			<div class="bg-white rounded-lg shadow p-6">
				<h2 class="text-lg font-semibold mb-6">{$t('payment.bankDetails')}</h2>

				<div class="space-y-4">
					<div class="border rounded-lg p-4">
						<div class="text-sm text-gray-600 block mb-2">{$t('payment.accountAlias')}</div>
						<div class="flex items-center justify-between">
							<span class="font-mono text-lg font-semibold">{bankAccountAlias}</span>
							<button
								type="button"
								class="p-2 hover:bg-gray-100 rounded transition-colors"
								onclick={() => copyToClipboard(bankAccountAlias, 'alias')}
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
							<span class="font-mono text-lg font-semibold">{bankAccountNumber}</span>
							<button
								type="button"
								class="p-2 hover:bg-gray-100 rounded transition-colors"
								onclick={() => copyToClipboard(bankAccountNumber, 'number')}
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
							<span class="font-mono text-lg font-semibold">{bankAccountName}</span>
							<button
								type="button"
								class="p-2 hover:bg-gray-100 rounded transition-colors"
								onclick={() => copyToClipboard(bankAccountName, 'accountName')}
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
							<span class="font-mono text-lg font-semibold">{bankName}</span>
							<button
								type="button"
								class="p-2 hover:bg-gray-100 rounded transition-colors"
								onclick={() => copyToClipboard(bankName, 'bankName')}
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

				<div class="mt-8 pt-6 border-t">
					<Button class="w-full py-3" onclick={() => goto('#/products')}>
						{$t('payment.backToProducts')}
					</Button>
				</div>
			</div>
		</div>

		<div class="lg:col-span-1">
			<SidePanel sticky={true}>
				<h3 class="font-semibold mb-4">{$t('cart.orderSummary')}</h3>
				<div class="space-y-2 mb-6">
					{#each $cartProducts as item (item.product.itemId)}
						<OrderSummaryLine
							label={`${item.product.brand} ${item.product.productName}`}
							amount={item.product.price * item.quantity}
							size={item.product.size}
							quantity={item.quantity}
						/>
					{/each}
					<div class="border-t pt-2 mt-4">
						<OrderSummaryLine label="Total:" amount={total} isBold={true} />
					</div>
				</div>
			</SidePanel>
		</div>
	</div>
</div>
