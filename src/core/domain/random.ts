export type RandomFn = () => number;

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 * O(n) time and guarantees a uniform random distribution (each permutation
 * has probability 1/n!). Don't use `array.sort(() => Math.random() - 0.5)`.
 */
export function shuffleFisherYates<T>(array: T[], random: RandomFn = Math.random): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
