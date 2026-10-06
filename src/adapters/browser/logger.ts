import type { Logger } from '$core/ports/Logger';

export class ConsoleLogger implements Logger {
	private enabled: boolean;

	constructor() {
		this.enabled = this.checkDebugParam();
	}

	private checkDebugParam(): boolean {
		if (typeof window === 'undefined') return false;
		const enabled = window.location.hash.includes('debug');
		if (enabled) {
			console.log('logging enabled');
		}
		return enabled;
	}

	log(message: string, ...args: unknown[]): void {
		if (this.enabled) {
			console.log(`[LOG]: ${message}`, ...args);
		}
	}

	warn(message: string, ...args: unknown[]): void {
		if (this.enabled) {
			console.warn(`[WARN]: ${message}`, ...args);
		}
	}

	error(message: string, ...args: unknown[]): void {
		console.error(`[ERROR]: ${message}`, ...args);
	}
}

export const logger = new ConsoleLogger();