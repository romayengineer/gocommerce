import { describe, it, expect } from 'vitest';
import { hashSeedString, mulberry32, shuffleFisherYates } from './random';

describe('hashSeedString', () => {
	it('is deterministic for equal inputs', () => {
		expect(hashSeedString('482917')).toBe(hashSeedString('482917'));
	});

	it('differs across distinct seeds', () => {
		expect(hashSeedString('482917')).not.toBe(hashSeedString('482918'));
	});
});

describe('mulberry32', () => {
	it('reproduces the same sequence for the same seed', () => {
		const a = mulberry32(12345);
		const b = mulberry32(12345);
		expect(Array.from({ length: 5 }, () => a())).toEqual(Array.from({ length: 5 }, () => b()));
	});

	it('emits values in [0, 1)', () => {
		const random = mulberry32(7);
		for (let i = 0; i < 100; i++) {
			const value = random();
			expect(value).toBeGreaterThanOrEqual(0);
			expect(value).toBeLessThan(1);
		}
	});
});

describe('seeded shuffle', () => {
	const items = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

	it('reproduces the same order for the same seed string', () => {
		const shuffle = (seed: string) => shuffleFisherYates(items, mulberry32(hashSeedString(seed)));
		expect(shuffle('482917')).toEqual(shuffle('482917'));
	});

	it('does not mutate the input', () => {
		const input = [...items];
		shuffleFisherYates(input, mulberry32(hashSeedString('482917')));
		expect(input).toEqual(items);
	});
});
