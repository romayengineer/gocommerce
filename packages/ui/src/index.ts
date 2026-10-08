/**
 * Package root intentionally exports nothing.
 *
 * `@gocommerce/ui` is consumed via deep paths (`$lib/...`, which resolves to
 * this package's `src/` via `kit.files.lib`) — never via the bare barrel
 * `@gocommerce/ui` (banned by `scripts/check-boundaries.ts` rule 10 so
 * bundlers tree-shake and dependencies stay explicit). This empty module
 * satisfies the `package.json` `"."` export while making accidental
 * bare-barrel imports a loud no-op instead of a silent bundle blowup.
 */
export {};
