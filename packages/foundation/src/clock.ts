import type { Clock } from '@gocommerce/ports/Clock';

export const systemClock: Clock = {
	setTimeout: (handler, ms) => globalThis.setTimeout(handler, ms),
	clearTimeout: (handle) => globalThis.clearTimeout(handle)
};
