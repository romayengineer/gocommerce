import type { Clipboard } from '@gocommerce/ports/Clipboard';

export class NavigatorClipboard implements Clipboard {
	writeText(text: string): Promise<void> {
		return navigator.clipboard.writeText(text);
	}
}