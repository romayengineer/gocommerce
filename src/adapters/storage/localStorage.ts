import type { KeyValueStorage } from '$core/ports/Storage';

/**
 * localStorage adapter. Falls back to a no-op when storage is unavailable
 * (e.g. during SSR/prerender).
 */
export class LocalStorageAdapter implements KeyValueStorage {
	private storage: Storage | null;

	constructor(storage: Storage | null = typeof localStorage !== 'undefined' ? localStorage : null) {
		this.storage = storage;
	}

	get(key: string): string | null {
		return this.storage?.getItem(key) ?? null;
	}

	set(key: string, value: string): void {
		this.storage?.setItem(key, value);
	}

	remove(key: string): void {
		this.storage?.removeItem(key);
	}
}