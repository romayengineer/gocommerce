export interface KeyValueStorage {
	get(key: string): string | null;
	set(key: string, value: string): void;
	remove(key: string): void;
}

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
