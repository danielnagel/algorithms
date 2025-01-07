import {
	describe, expect, test
} from 'vitest';
import {
	SelectionSort
} from '../../../lib/scritps/selectionsort';

describe('SelectionSort Script', () => {

	describe('test sort algorithm', () => {
		test('throw error when there is no selection', () => {
			const selectionsort = new SelectionSort([]);
			expect(() => selectionsort.sortAlgorithm()).toThrowError('two selection indizes');
		});
	});
	
	describe('test sort data', () => {
		test('generate all generations', () => {
			const expectedGenerations: Generation[] = [
				{
					data: [5, 4, 3, 2, 1],
					selectionIndizes: [],
				},
				{
					data: [5, 4, 3, 2, 1],
					selectionIndizes: [0, 1],
				},
				{
					data: [5, 4, 3, 2, 1],
					selectionIndizes: [1, 2],
				},
				{
					data: [5, 4, 3, 2, 1],
					selectionIndizes: [2, 3],
				},
				{
					data: [5, 4, 3, 2, 1],
					selectionIndizes: [3, 4],
				},
				{
					data: [5, 4, 3, 2, 1],
					selectionIndizes: [0, 4],
				},
				{
					data: [1, 4, 3, 2, 5],
					selectionIndizes: [0, 4],
				},
				{
					data: [1, 4, 3, 2, 5],
					selectionIndizes: [1, 2],
				},
				{
					data: [1, 4, 3, 2, 5],
					selectionIndizes: [2, 3],
				},
				{
					data: [1, 4, 3, 2, 5],
					selectionIndizes: [3, 4],
				},
				{
					data: [1, 4, 3, 2, 5],
					selectionIndizes: [1, 3],
				},
				{
					data: [1, 2, 3, 4, 5],
					selectionIndizes: [1, 3],
				},
				{
					data: [1, 2, 3, 4, 5],
					selectionIndizes: [2, 3],
				},
				{
					data: [1, 2, 3, 4, 5],
					selectionIndizes: [2, 4],
				},
				{
					data: [1, 2, 3, 4, 5],
					selectionIndizes: [3, 4],
				},
				{
					data: [1, 2, 3, 4, 5],
					selectionIndizes: [],
				}
			];
			const selectionsort = new SelectionSort([...expectedGenerations[0].data]);
			expect(selectionsort.getData()).toStrictEqual(expectedGenerations[0].data);
			expect(selectionsort.getSelectionIndizes()).toHaveLength(0);
			expect(selectionsort.getGenerations()).toHaveLength(0);

			expect(selectionsort.sortData()).toStrictEqual(expectedGenerations);
			expect(selectionsort.getSelectionIndizes()).toHaveLength(0);
		});
	});
});