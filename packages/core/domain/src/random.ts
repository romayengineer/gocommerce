export type RandomFn = () => number;

/**
 * Hash an arbitrary seed string (e.g. a `?seed=` URL param) to a uint32.
 * FNV-1a: tiny, deterministic, dependency-free. Any non-empty string works;
 * callers treat empty/missing seeds as "generate one" instead.
 */
export function hashSeedString(seed: string): number {
	let hash = 0x811c9dc5;
	for (let i = 0; i < seed.length; i++) {
		hash ^= seed.charCodeAt(i) ?? 0;
		hash = Math.imul(hash, 0x01000193);
	}
	return hash >>> 0;
}

/**
 * Seeded PRNG (mulberry32). Same seed yields the same sequence, so catalog
 * shuffles via `shuffleFisherYates(items, mulberry32(hashSeedString(seed)))`
 * reproduce the exact same order for equal seeds.
 */
export function mulberry32(seed: number): RandomFn {
	let state = seed >>> 0;
	return () => {
		state = (state + 0x6d2b79f5) | 0;
		let t = Math.imul(state ^ (state >>> 15), 1 | state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 * O(n) time and guarantees a uniform random distribution (each permutation
 * has probability 1/n!). Don't use `array.sort(() => Math.random() - 0.5)`.
 */
export function shuffleFisherYates<T>(array: T[], random: RandomFn = Math.random): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(random() * (i + 1));
		const current: T | undefined = shuffled[i];
		const other: T | undefined = shuffled[j];
		if (current === undefined || other === undefined) continue; // unreachable: i, j < length
		shuffled[i] = other;
		shuffled[j] = current;
	}
	return shuffled;
}
