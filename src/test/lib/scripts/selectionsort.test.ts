import {
	describe, expect, test
} from 'vitest';
import {
	SelectionSort
} from '../../../lib/scritps/selectionsort';
import {
	generateRandomNumberArray, isSorted 
} from '../../../lib/utils';

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

	describe('test add state to generations', () => {
		test('generate all generations', () => {
			const expectedGenerations: NewGeneration[] = [
				{
					data: [5, 4, 3, 2, 1],
					selectionIndizes: [],
					state: 'update-selection'
				},
				{
					data: [5, 4, 3, 2, 1],
					selectionIndizes: [0, 1],
					state: 'update-selection'
				},
				{
					data: [5, 4, 3, 2, 1],
					selectionIndizes: [1, 2],
					state: 'update-selection'
				},
				{
					data: [5, 4, 3, 2, 1],
					selectionIndizes: [2, 3],
					state: 'update-selection'
				},
				{
					data: [5, 4, 3, 2, 1],
					selectionIndizes: [3, 4],
					state: 'update-selection'
				},
				{
					data: [5, 4, 3, 2, 1],
					selectionIndizes: [0, 4],
					state: 'update-selection'
				},
				{
					data: [1, 4, 3, 2, 5],
					selectionIndizes: [0, 4],
					state: 'swap-selection'
				},
				{
					data: [1, 4, 3, 2, 5],
					selectionIndizes: [0, 4],
					state: 'update-selection'
				},
				{
					data: [1, 4, 3, 2, 5],
					selectionIndizes: [1, 2],
					state: 'update-selection'
				},
				{
					data: [1, 4, 3, 2, 5],
					selectionIndizes: [2, 3],
					state: 'update-selection'
				},
				{
					data: [1, 4, 3, 2, 5],
					selectionIndizes: [3, 4],
					state: 'update-selection'
				},
				{
					data: [1, 4, 3, 2, 5],
					selectionIndizes: [1, 3],
					state: 'update-selection'
				},
				{
					data: [1, 2, 3, 4, 5],
					selectionIndizes: [1, 3],
					state: 'swap-selection'
				},
				{
					data: [1, 2, 3, 4, 5],
					selectionIndizes: [1, 3],
					state: 'update-selection'
				},
				{
					data: [1, 2, 3, 4, 5],
					selectionIndizes: [2, 3],
					state: 'update-selection'
				},
				{
					data: [1, 2, 3, 4, 5],
					selectionIndizes: [2, 4],
					state: 'update-selection'
				},
				{
					data: [1, 2, 3, 4, 5],
					selectionIndizes: [3, 4],
					state: 'update-selection'
				},
				{
					data: [1, 2, 3, 4, 5],
					selectionIndizes: [],
					state: 'update-selection'
				}
			];
			const selectionsort = new SelectionSort([...expectedGenerations[0].data]);
			expect(selectionsort.addStateToGenerations(selectionsort.sortData())).toStrictEqual(expectedGenerations);
		});
	});
	describe('test sorting random data', () => {
		test('random data set size 35', () => {
			const selectionsort = new SelectionSort(generateRandomNumberArray(35, 99));
			selectionsort.sortData();
			expect(isSorted(selectionsort.getGenerations()[selectionsort.getGenerations().length-1].data)).toBeTruthy();
		});
		test('random data set size 50', () => {
			const selectionsort = new SelectionSort(generateRandomNumberArray(50, 99));
			selectionsort.sortData();
			expect(isSorted(selectionsort.getGenerations()[selectionsort.getGenerations().length-1].data)).toBeTruthy();
		});
	});
});