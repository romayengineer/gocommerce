import { page } from '$app/state';
import { goto } from '$app/navigation';
import type { WritableStore } from '@gocommerce/ports/Store';
import type { StoreFactory } from '@gocommerce/ports/StoreFactory';
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
	private stopSync: (() => void) | null = null;

	constructor(stores: StoreFactory) {
		// Construction is side-effect free (no $effect here) so the
		// composition root builds in SSR/prerender/tests. The UI shell
		// opts into live sync via start() on mount / stop() on destroy.
		this.route = stores.create<Route>(toRoute(page.url));
	}

	start(): void {
		if (this.stopSync) return;
		// `page` from `$app/state` is SvelteKit's canonical reactive URL. It is
		// updated on every navigation (pushState/replaceState/back-forward),
		// unlike listening for `hashchange`, which SvelteKit's hash router does
		// not emit.
		this.stopSync = $effect.root(() => {
			$effect(() => {
				this.route.set(toRoute(page.url));
			});
		});
	}

	stop(): void {
		this.stopSync?.();
		this.stopSync = null;
	}

	navigate(href: string, options?: NavigationOptions): void {
		goto(href, options);
	}
}