// Test double for `$app/state` (see vitest.config.ts alias). SvelteKit's
// `page` store has no server in unit tests; tests mutate `page.url` to
// simulate navigations (e.g. a `?seed=` hash arriving after boot).
export const page = {
	url: new URL('https://shop.test/#/')
};
