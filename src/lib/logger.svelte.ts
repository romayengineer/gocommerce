class CustomLogger {
	isEnabled = $state(this.checkDebugParam());

	private checkDebugParam(): boolean {
		if (typeof window === 'undefined') return false;
		const hash = window.location.hash;
		const enabled = hash.includes('debug');
		if (enabled) {
			console.log("logging enabled");
		}
		return enabled;
	}

	log(message: string, ...args: any[]) {
		if (this.isEnabled) {
			console.log(`[LOG]: ${message}`, ...args);
		}
	}

	warn(message: string, ...args: any[]) {
		if (this.isEnabled) {
			console.warn(`[WARN]: ${message}`, ...args);
		}
	}

	error(message: string, ...args: any[]) {
		// Errors always show regardless of enabled state
		console.error(`[ERROR]: ${message}`, ...args);
	}

	toggle() {
		this.isEnabled = !this.isEnabled;
	}

	setEnabled(value: boolean) {
		this.isEnabled = value;
	}
}

export const logger = new CustomLogger();
