import {
	describe, expect, test 
} from 'vitest';
import {
	generateRandomNumberArray, 
	range
} from '../../lib/utils';

describe('Utils', () => {
	describe('generateRandomNumberArray', () => {
		test('create 1000 numbers', () => {
			const dataCount = 1000;
			const maxNumberSize = 100;
			const randomNumberArray = generateRandomNumberArray(dataCount, maxNumberSize);
			expect(randomNumberArray).toHaveLength(dataCount);
			randomNumberArray.forEach(data => {
				expect(data).toBeGreaterThanOrEqual(0);
				expect(data).toBeLessThan(maxNumberSize);
			});
		});
	});
	describe('range', () => {
		test('create range', () => {
			const result = range(0, 7);
			expect(result).toHaveLength(8);
			expect(result).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7]);
		})
		test('create range, custom step', () => {
			const result = range(1, 7, 2);
			expect(result).toHaveLength(4);
			expect(result).toStrictEqual([1, 3, 5, 7]);
		})
	})
});