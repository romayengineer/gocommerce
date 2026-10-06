import { goto } from '$app/navigation';
import { createStore, type WritableStore } from '$core/ports/Store';
import type { NavigationOptions, Route, RouterPort } from '$core/ports/Router';

function parseRoute(url: URL): Route {
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

	constructor(initialHref: string) {
		this.route = createStore<Route>(parseRoute(new URL(initialHref)));
		if (typeof window !== 'undefined') {
			window.addEventListener('hashchange', () => {
				this.route.set(parseRoute(new URL(window.location.href)));
			});
		}
	}

	navigate(href: string, options?: NavigationOptions): void {
		goto(href, options);
	}
}