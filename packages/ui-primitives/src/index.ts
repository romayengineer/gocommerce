/**
 * Package root intentionally exports nothing.
 *
 * `@gocommerce/ui-primitives` is consumed via deep paths
 * (`@gocommerce/ui-primitives/Button.svelte`, …) — never via the bare barrel
 * (banned by `scripts/check-boundaries.ts` rule 10 so bundlers tree-shake
 * and dependencies stay explicit).
 */
export {};
