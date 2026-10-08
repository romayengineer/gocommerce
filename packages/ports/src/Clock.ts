export type TimerHandle = ReturnType<typeof setTimeout>;

export interface Clock {
	setTimeout(handler: () => void, ms: number): TimerHandle;
	clearTimeout(handle: TimerHandle): void;
}
