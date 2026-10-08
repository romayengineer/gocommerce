/**
 * Dependency-free runtime kernel for `@gocommerce/ports` (stores, storage,
 * logger, clock). All `@gocommerce/ports/*` imports are `import type` only,
 * so `ports` is a peer+dev dependency, never a runtime one. Application
 * services never import these directly; they receive `StoreFactory`/
 * `StorageCodec` via constructor injection and the composition root supplies
 * `memoryStoreFactory`/`jsonStorageCodec`. browser/Svelte implementations
 * live in `adapters`, map SDKs in `adapters-maps`, geography values in
 * `@gocommerce/domain/geo`.
 */
export { createStore, derived, combine, memoryStoreFactory } from './store';
export { readJSON, writeJSON, jsonStorageCodec } from './storage';
export { noopLogger } from './logger';
export { systemClock } from './clock';
