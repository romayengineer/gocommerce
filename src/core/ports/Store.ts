/**
 * Framework-agnostic reactive state primitives.
 *
 * The core never depends on Svelte (or any UI framework). Views subscribe to
 * these stores through a thin adapter (see `$adapters/svelte/store`).
 */

export type Unsubscriber = () => void;

export interface ReadableStore<T> {
	get(): T;
	subscribe(listener: (value: T) => void): Unsubscriber;
}

export interface WritableStore<T> extends ReadableStore<T> {
	set(value: T): void;
	update(updater: (value: T) => T): void;
}

export function createStore<T>(initial: T): WritableStore<T> {
	let value = initial;
	const listeners = new Set<(value: T) => void>();

	const store: WritableStore<T> = {
		get: () => value,
		set: (next: T) => {
			if (Object.is(next, value)) return;
			value = next;
			for (const listener of [...listeners]) listener(value);
		},
		update: (updater: (value: T) => T) => {
			store.set(updater(value));
		},
		subscribe: (listener: (value: T) => void) => {
			listeners.add(listener);
			listener(value);
			return () => {
				listeners.delete(listener);
			};
		}
	};

	return store;
}

export function derived<A, B>(source: ReadableStore<A>, compute: (value: A) => B): ReadableStore<B> {
	return {
		get: () => compute(source.get()),
		subscribe: (listener: (value: B) => void) =>
			source.subscribe((value) => listener(compute(value)))
	};
}

/**
 * Combine several stores into a single derived store. `compute` is re-run
 * whenever any dependency changes.
 */
export function combine<B>(sources: ReadableStore<unknown>[], compute: () => B): ReadableStore<B> {
	return {
		get: () => compute(),
		subscribe: (listener: (value: B) => void) => {
			let started = false;
			const unsubscribers = sources.map((source) =>
				source.subscribe(() => {
					if (started) listener(compute());
				})
			);
			listener(compute());
			started = true;
			return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
		}
	};
}
