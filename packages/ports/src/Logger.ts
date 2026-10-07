export interface Logger {
	log(message: string, ...args: unknown[]): void;
	warn(message: string, ...args: unknown[]): void;
	error(message: string, ...args: unknown[]): void;
}

export const noopLogger: Logger = {
	log: () => {},
	warn: () => {},
	error: () => {}
};
