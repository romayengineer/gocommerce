import type { KeyValueStorage } from '@gocommerce/ports/Storage';
import type { StorageCodec } from '@gocommerce/ports/StorageCodec';

export function readJSON<T>(storage: KeyValueStorage, key: string): T | null {
	const raw = storage.get(key);
	if (raw === null) return null;
	try {
		return JSON.parse(raw) as T;
	} catch {
		return null;
	}
}

export function writeJSON(storage: KeyValueStorage, key: string, value: unknown): void {
	storage.set(key, JSON.stringify(value));
}

/** Default JSON `StorageCodec` injected by the composition root. */
export const jsonStorageCodec: StorageCodec = {
	readJSON,
	writeJSON
};
