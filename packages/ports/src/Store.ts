/**
 * Framework-agnostic reactive state primitives.
 *
 * The core never depends on Svelte (or any UI framework). Views subscribe to
 * these stores through a thin adapter (see `@gocommerce/adapters/svelte/store`).
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
