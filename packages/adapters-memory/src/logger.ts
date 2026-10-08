import type { Logger } from '@gocommerce/ports/Logger';

export const noopLogger: Logger = {
	log: () => {},
	warn: () => {},
	error: () => {}
};
