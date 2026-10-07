export type TimerHandle = ReturnType<typeof setTimeout>;

export interface Clock {
	setTimeout(handler: () => void, ms: number): TimerHandle;
	clearTimeout(handle: TimerHandle): void;
}

export const systemClock: Clock = {
	setTimeout: (handler, ms) => globalThis.setTimeout(handler, ms),
	clearTimeout: (handle) => globalThis.clearTimeout(handle)
};
