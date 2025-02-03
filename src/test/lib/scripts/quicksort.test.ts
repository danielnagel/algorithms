import {
	describe, expect, test
} from 'vitest';
import {
	QuickSort
} from '../../../lib/scritps/quicksort';

describe('QuickSort Script', () => {

	describe('test sort data', () => {
		test('generate all generations', () => {
			const expectedGenerations: Generation[] = [
				{
					data: [4, 7, 6, 8, 3, 2, 5, 1],
					selectionIndizes: [],
				},
			];
			const quicksort = new QuickSort([...expectedGenerations[0].data]);
			expect(quicksort.getData()).toStrictEqual(expectedGenerations[0].data);
			expect(quicksort.getSelectionIndizes()).toHaveLength(0);
			expect(quicksort.getGenerations()).toHaveLength(0);
			expect(quicksort.sortData()).toStrictEqual(expectedGenerations);
			expect(quicksort.getData()).toStrictEqual(expectedGenerations[expectedGenerations.length - 1].data);
			expect(quicksort.getSelectionIndizes()).toHaveLength(0);
		});
	});
	describe('test add state to generations', () => {
		test('generate all generations', () => {
			const expectedGenerations: NewGeneration[] = [
				{
					data: [4, 7, 6, 8, 3, 2, 5, 1],
					selectionIndizes: [],
					state: 'update-selection'
				},
			];
			const quicksort = new QuickSort([...expectedGenerations[0].data]);
			expect(quicksort.addStateToGenerations(quicksort.sortData())).toStrictEqual(expectedGenerations);
		});
	});

});