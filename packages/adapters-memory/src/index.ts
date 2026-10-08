/**
 * Dependency-free in-memory defaults for `@gocommerce/ports` (stores,
 * storage, logger, clock, map constants). All `@gocommerce/ports/*` imports
 * are `import type` only, so `ports` is a peer+dev dependency, never a
 * runtime one. Application services never import these directly; they
 * receive `StoreFactory`/`StorageCodec` via constructor injection and the
 * composition root supplies `memoryStoreFactory`/`jsonStorageCodec`.
 * browser/SDK-backed implementations live in `adapters` / `adapters-maps`.
 */
export { createStore, derived, combine, memoryStoreFactory } from './store';
export { readJSON, writeJSON, jsonStorageCodec } from './storage';
export { noopLogger } from './logger';
export { systemClock } from './clock';
export {
	mapHasAddress,
	DEFAULT_CENTER,
	DEFAULT_ZOOM,
	FOUND_LOCATION_ZOOM
} from './maps';
