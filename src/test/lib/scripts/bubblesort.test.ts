import {
	describe, expect, test 
} from 'vitest';
import {
	BubbleSort 
} from '../../../lib/scritps/bubblesort';

describe('BubbleSort Script', () => {
	const sampleData = [2, 5, 1, 3, 4];
	describe('test init script', () => {
		test('throw error when there is no data', () => {
			const bubblesort = new BubbleSort([]);
			expect(() => bubblesort.initScript()).toThrowError('no data available');
		});
		test('first generation', () => {
			const bubblesort = new BubbleSort(sampleData);
			expect(bubblesort.getData()).toStrictEqual(sampleData);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(0);
			expect(bubblesort.getGenerations()).toHaveLength(0);
			expect(bubblesort.initScript()).toStrictEqual({
				data: sampleData,
				selectionIndizes: [0, 1]
			});
			expect(bubblesort.getSelectionIndizes()).toHaveLength(2);
			expect(bubblesort.getSelectionIndizes()).toStrictEqual([0, 1]);
			expect(bubblesort.getGenerations()).toHaveLength(1);
		});
	});
	test('return data', () => {
		const bubblesort = new BubbleSort(sampleData);
		expect(bubblesort.getData()).toStrictEqual(sampleData);
	});
});