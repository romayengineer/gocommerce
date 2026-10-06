import type { Clipboard } from '$core/ports/Clipboard';

export class NavigatorClipboard implements Clipboard {
	writeText(text: string): Promise<void> {
		return navigator.clipboard.writeText(text);
	}
}