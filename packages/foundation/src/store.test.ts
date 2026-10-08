import { describe, it, expect } from 'vitest';
import { createStore, derived, combine } from './store';

describe('createStore', () => {
	it('holds and updates a value', () => {
		const store = createStore(1);
		expect(store.get()).toBe(1);
		store.set(2);
		expect(store.get()).toBe(2);
		store.update((v) => v + 1);
		expect(store.get()).toBe(3);
	});

	it('notifies subscribers and supports unsubscribe', () => {
		const store = createStore(0);
		const seen: number[] = [];
		const unsubscribe = store.subscribe((v) => seen.push(v));
		store.set(1);
		store.set(2);
		unsubscribe();
		store.set(3);
		expect(seen).toEqual([0, 1, 2]);
	});

	it('does not notify when the value is unchanged', () => {
		const store = createStore({ a: 1 });
		let count = 0;
		store.subscribe(() => count++);
		const value = store.get();
		store.set(value);
		store.set(value);
		expect(count).toBe(1);
	});
});

describe('derived', () => {
	it('computes values reactively', () => {
		const source = createStore(2);
		const double = derived(source, (v) => v * 2);
		const seen: number[] = [];
		double.subscribe((v) => seen.push(v));
		source.set(5);
		expect(double.get()).toBe(10);
		expect(seen).toEqual([4, 10]);
	});
});

describe('combine', () => {
	it('recomputes when any source changes', () => {
		const a = createStore(1);
		const b = createStore(10);
		const sum = combine([a, b], () => a.get() + b.get());
		const seen: number[] = [];
		sum.subscribe((v) => seen.push(v));
		a.set(2);
		b.set(20);
		expect(sum.get()).toBe(22);
		expect(seen).toEqual([11, 12, 22]);
	});
});