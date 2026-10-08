/**
 * Package root intentionally exports nothing.
 *
 * `@gocommerce/ui-shell` is consumed via deep paths
 * (`@gocommerce/ui-shell/Navigation.svelte`, …) — never via the bare barrel
 * (banned by `scripts/check-boundaries.ts` rule 10 so bundlers tree-shake
 * and dependencies stay explicit).
 */
export {};
