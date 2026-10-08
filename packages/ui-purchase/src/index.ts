/**
 * Package root intentionally exports nothing.
 *
 * `@gocommerce/ui-purchase` is consumed via deep paths
 * (`@gocommerce/ui-purchase/cart/CartItem.svelte`, …) — never via the bare barrel
 * (banned by `scripts/check-boundaries.ts` rule 10 so bundlers tree-shake
 * and dependencies stay explicit).
 */
export {};
