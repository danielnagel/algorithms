import {
	describe, expect, test
} from 'vitest';
import {
	MergeSort
} from '../../../lib/scritps/mergesort';

describe.skip('MergeSort Script', () => {
	describe('test sort data', () => {
		test('generate all generations', () => {
			const expectedGenerations: Generation[] = [
				{
					data: [4, 7, 6, 8, 3, 2, 5, 1],
					selectionIndizes: [],
				},
				{
					data: [1, 2, 3, 4, 5, 6, 7, 8],
					selectionIndizes: [],
				}
			];
			const mergesort = new MergeSort([...expectedGenerations[0].data]);
			expect(mergesort.getData()).toStrictEqual(expectedGenerations[0].data);
			expect(mergesort.getSelectionIndizes()).toHaveLength(0);
			expect(mergesort.getGenerations()).toHaveLength(0);
			expect(mergesort.sortData()).toStrictEqual(expectedGenerations);
			expect(mergesort.getData()).toStrictEqual(expectedGenerations[expectedGenerations.length - 1].data);
			expect(mergesort.getSelectionIndizes()).toHaveLength(0);
		});
	});
});