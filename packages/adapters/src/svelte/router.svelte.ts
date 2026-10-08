import { page } from '$app/state';
import { goto } from '$app/navigation';
import type { WritableStore } from '@gocommerce/ports/Store';
import { createStore } from '@gocommerce/adapters-memory/store';
import type { NavigationOptions, Route, RouterPort } from '@gocommerce/ports/Router';

function toRoute(url: URL): Route {
	const hash = url.hash.replace(/^#/, '') || '/';
	const [path, search] = hash.split('?');
	return {
		href: url.href,
		path: path || '/',
		params: {},
		query: new URLSearchParams(search ?? '')
	};
}

export class SvelteKitRouter implements RouterPort {
	readonly route: WritableStore<Route>;

	constructor() {
		// `page` from `$app/state` is SvelteKit's canonical reactive URL. It is
		// updated on every navigation (pushState/replaceState/back-forward),
		// unlike listening for `hashchange`, which SvelteKit's hash router does
		// not emit.
		this.route = createStore<Route>(toRoute(page.url));

		$effect.root(() => {
			$effect(() => {
				this.route.set(toRoute(page.url));
			});
		});
	}

	navigate(href: string, options?: NavigationOptions): void {
		goto(href, options);
	}
}