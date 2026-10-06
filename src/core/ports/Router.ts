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
}
