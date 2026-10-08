import type { ReadableStore } from './Store';

export interface Route {
	href: string;
	path: string;
	params: Record<string, string>;
	query: URLSearchParams;
}

export interface NavigationOptions {
	replaceState?: boolean;
	noScroll?: boolean;
}

export interface RouterPort {
	readonly route: ReadableStore<Route>;
	navigate(href: string, options?: NavigationOptions): void;
	/**
	 * Begin syncing the underlying framework router (e.g. SvelteKit's page
	 * store) into `route`. Called by the UI shell on mount — construction
	 * stays side-effect free so containers build in SSR/prerender/tests.
	 */
	start(): void;
	/** Stop the sync started by `start()` (unmount, HMR, tests). */
	stop(): void;
}
