import { createContainer, type AppContainer, type ContainerInit } from './container';

/**
 * Lazy wired singleton for the app shell.
 *
 * Importing `view.ts` (or any `view/*` module) must NOT construct the
 * container eagerly: construction reads `import.meta.env` and `window.location`
 * (see `container.ts` bootHref), which breaks SSR/prerender and inflates every
 * bundle that only needs one slice. `getContainer()` memoizes a single default
 * container on first use; tests/tools keep using `createContainer(init)` with
 * injected fakes directly.
 */
let instance: AppContainer | undefined;

export function getContainer(init?: ContainerInit): AppContainer {
	if (!instance) instance = createContainer(init);
	return instance;
}

/** Release singleton-owned listeners and drop the memoized instance (HMR, tests). */
export function disposeSingleton(): void {
	instance?.dispose();
	instance = undefined;
}

export type { AppContainer, ContainerInit };
