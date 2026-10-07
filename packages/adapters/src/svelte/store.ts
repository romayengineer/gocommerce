import { readable } from 'svelte/store';
import type { Readable, Subscriber } from 'svelte/store';
import type { ReadableStore, Unsubscriber } from '@gocommerce/ports/Store';

/** Bridge a framework-agnostic core store to a Svelte store for `$` usage. */
export function toSvelte<T>(store: ReadableStore<T>): Readable<T> {
	return readable<T>(store.get(), (set: Subscriber<T>) => {
		const unsubscribe: Unsubscriber = store.subscribe((value) => set(value));
		return unsubscribe as () => void;
	});
}