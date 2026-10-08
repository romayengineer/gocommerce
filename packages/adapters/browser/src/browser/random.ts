/**
 * Generate a fresh product-order seed (numeric string). Prefers
 * `crypto.getRandomValues` for unpredictable startup shuffles; falls back to
 * `Math.random` outside secure contexts. SSR-safe: returns a deterministic
 * placeholder when neither source exists (the shell only calls this onMount).
 */
export function generateSeed(digits = 6): string {
	const max = 10 ** digits;
	if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
		const buffer = new Uint32Array(1);
		crypto.getRandomValues(buffer);
		const value: number = buffer[0] ?? 0;
		return String(value % max).padStart(digits, '0');
	}
	return String(Math.floor(Math.random() * max)).padStart(digits, '0');
}
