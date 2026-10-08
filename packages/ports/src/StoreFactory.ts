import type { ReadableStore, WritableStore } from './Store';

/**
 * Abstract store construction so application services never depend on a
 * concrete implementation. The in-memory default lives in
 * `@gocommerce/foundation/store` (`memoryStoreFactory`); composition
 * injects it at the root.
 */
export interface StoreFactory {
	create<T>(initial: T): WritableStore<T>;
	derived<A, B>(source: ReadableStore<A>, compute: (value: A) => B): ReadableStore<B>;
	combine<B>(sources: ReadableStore<unknown>[], compute: () => B): ReadableStore<B>;
}
