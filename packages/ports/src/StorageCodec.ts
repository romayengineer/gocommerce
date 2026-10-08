import type { KeyValueStorage } from './Storage';

/**
 * Abstract JSON persistence over `KeyValueStorage` so application services
 * never depend on a concrete codec. The default lives in
 * `@gocommerce/adapters-memory/storage` (`jsonStorageCodec`); composition
 * injects it at the root.
 */
export interface StorageCodec {
	readJSON<T>(storage: KeyValueStorage, key: string): T | null;
	writeJSON(storage: KeyValueStorage, key: string, value: unknown): void;
}
