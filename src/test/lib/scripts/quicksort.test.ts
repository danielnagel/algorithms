import {
	describe, expect, test
} from 'vitest';
import {
	QuickSort
} from '../../../lib/scritps/quicksort';

describe('QuickSort Script', () => {

	describe('test sort data', () => {
		test('generate all generations', () => {
			const expectedGenerations: QuickSortGeneration[] = [
				{
					data: [4, 7, 6, 8, 3, 2, 5, 1],
					selectionIndizes: [],
				},
				{
					data: [4,7,6,8,3,2,5,1],
					selectionIndizes: [0,6],
					subListRange: [0,7]
				},
				{
					data: [4,7,6,8,3,2,5,1],
					selectionIndizes: [0,5],
					subListRange: [0,7]
				},
				{
					data: [4,7,6,8,3,2,5,1],
					selectionIndizes: [0,4],
					subListRange: [0,7]
				},
				{
					data: [4,7,6,8,3,2,5,1],
					selectionIndizes: [0,3],
					subListRange: [0,7]
				},
				{
					data: [4,7,6,8,3,2,5,1],
					selectionIndizes: [0,2],
					subListRange: [0,7]
				},
				{
					data: [4,7,6,8,3,2,5,1],
					selectionIndizes: [0,1],
					subListRange: [0,7]
				},
				{
					data: [4,7,6,8,3,2,5,1],
					selectionIndizes: [0,0],
					subListRange: [0,7]
				},
				{
					data: [1,7,6,8,3,2,5,4],
					selectionIndizes: [0,0],
					subListRange: [0,7]
				},
				{
					data: [1,7,6,8,3,2,5,4],
					selectionIndizes: [1,6],
					subListRange: [1,7]
				},
				{
					data: [1,7,6,8,3,2,5,4],
					selectionIndizes: [1,5],
					subListRange: [1,7]
				},
				{
					data: [1,2,6,8,3,7,5,4],
					selectionIndizes: [1,5],
					subListRange: [1,7]
				},
				{
					data: [1,2,6,8,3,7,5,4],
					selectionIndizes: [2,5],
					subListRange: [1,7]
				},
				{
					data: [1,2,6,8,3,7,5,4],
					selectionIndizes: [2,4],
					subListRange: [1,7]
				},
				{
					data: [1,2,3,8,6,7,5,4],
					selectionIndizes: [2,4],
					subListRange: [1,7]
				},
				{
					data: [1,2,3,8,6,7,5,4],
					selectionIndizes: [3,4],
					subListRange: [1,7]
				},
				{
					data: [1,2,3,8,6,7,5,4],
					selectionIndizes: [3,3],
					subListRange: [1,7]
				},
				{
					data: [1,2,3,4,6,7,5,8],
					selectionIndizes: [3,3],
					subListRange: [1,7]
				},
				{
					data: [1,2,3,4,6,7,5,8],
					selectionIndizes: [1,1],
					subListRange: [1,2]
				},
				{
					data: [1,2,3,4,6,7,5,8],
					selectionIndizes: [1,0],
					subListRange: [1,1]
				},

				{
					data: [1,2,3,4,6,7,5,8],
					selectionIndizes: [4,6],
					subListRange: [4,7]
				},
				{
					data: [1,2,3,4,6,7,5,8],
					selectionIndizes: [5,6],
					subListRange: [4,7]
				},
				{
					data: [1,2,3,4,6,7,5,8],
					selectionIndizes: [6,6],
					subListRange: [4,7]
				},
				{
					data: [1,2,3,4,6,7,5,8],
					selectionIndizes: [4,5],
					subListRange: [4,6]
				},
				{
					data: [1,2,3,4,6,7,5,8],
					selectionIndizes: [4,4],
					subListRange: [4,6]
				},
				{
					data: [1,2,3,4,5,7,6,8],
					selectionIndizes: [4,4],
					subListRange: [4,6]
				},
				{
					data: [1,2,3,4,5,7,6,8],
					selectionIndizes: [5,5],
					subListRange: [5,6]
				},
				{
					data: [1,2,3,4,5,6,7,8],
					selectionIndizes: [5,5],
					subListRange: [5,6]
				},
				{
					data: [1,2,3,4,5,6,7,8],
					selectionIndizes: [6,5],
					subListRange: [6,6]
				},
				{
					data: [1, 2, 3, 4, 5, 6, 7, 8],
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
				{
					data: [4,7,6,8,3,2,5,1],
					selectionIndizes: [0,6],
					subListRange: [0,7],
					state: 'update-selection'
				},
				{
					data: [4,7,6,8,3,2,5,1],
					selectionIndizes: [0,5],
					subListRange: [0,7],
					state: 'update-selection'
				},
				{
					data: [4,7,6,8,3,2,5,1],
					selectionIndizes: [0,4],
					subListRange: [0,7],
					state: 'update-selection'
				},
				{
					data: [4,7,6,8,3,2,5,1],
					selectionIndizes: [0,3],
					subListRange: [0,7],
					state: 'update-selection'
				},
				{
					data: [4,7,6,8,3,2,5,1],
					selectionIndizes: [0,2],
					subListRange: [0,7],
					state: 'update-selection'
				},
				{
					data: [4,7,6,8,3,2,5,1],
					selectionIndizes: [0,1],
					subListRange: [0,7],
					state: 'update-selection'
				},
				{
					data: [4,7,6,8,3,2,5,1],
					selectionIndizes: [0,0],
					subListRange: [0,7],
					state: 'update-selection'
				},
				{
					data: [1,7,6,8,3,2,5,4],
					selectionIndizes: [0,0],
					subListRange: [0,7],
					state: 'swap-selection'
				},
				{
					data: [1,7,6,8,3,2,5,4],
					selectionIndizes: [0,0],
					subListRange: [0,7],
					state: 'update-selection'
				},
				{
					data: [1,7,6,8,3,2,5,4],
					selectionIndizes: [1,6],
					subListRange: [1,7],
					state: 'update-selection'
				},
				{
					data: [1,7,6,8,3,2,5,4],
					selectionIndizes: [1,5],
					subListRange: [1,7],
					state: 'update-selection'
				},
				{
					data: [1,2,6,8,3,7,5,4],
					selectionIndizes: [1,5],
					subListRange: [1,7],
					state: 'swap-selection'
				},
				{
					data: [1,2,6,8,3,7,5,4],
					selectionIndizes: [1,5],
					subListRange: [1,7],
					state: 'update-selection'
				},
				{
					data: [1,2,6,8,3,7,5,4],
					selectionIndizes: [2,5],
					subListRange: [1,7],
					state: 'update-selection'
				},
				{
					data: [1,2,6,8,3,7,5,4],
					selectionIndizes: [2,4],
					subListRange: [1,7],
					state: 'update-selection'
				},
				{
					data: [1,2,3,8,6,7,5,4],
					selectionIndizes: [2,4],
					subListRange: [1,7],
					state: 'swap-selection'
				},
				{
					data: [1,2,3,8,6,7,5,4],
					selectionIndizes: [2,4],
					subListRange: [1,7],
					state: 'update-selection'
				},
				{
					data: [1,2,3,8,6,7,5,4],
					selectionIndizes: [3,4],
					subListRange: [1,7],
					state: 'update-selection'
				},
				{
					data: [1,2,3,8,6,7,5,4],
					selectionIndizes: [3,3],
					subListRange: [1,7],
					state: 'update-selection'
				},
				{
					data: [1,2,3,4,6,7,5,8],
					selectionIndizes: [3,3],
					subListRange: [1,7],
					state: 'swap-selection'
				},
				{
					data: [1,2,3,4,6,7,5,8],
					selectionIndizes: [3,3],
					subListRange: [1,7],
					state: 'update-selection'
				},
				{
					data: [1,2,3,4,6,7,5,8],
					selectionIndizes: [1,1],
					subListRange: [1,2],
					state: 'update-selection'
				},
				{
					data: [1,2,3,4,6,7,5,8],
					selectionIndizes: [1,0],
					subListRange: [1,1],
					state: 'update-selection'
				},

				{
					data: [1,2,3,4,6,7,5,8],
					selectionIndizes: [4,6],
					subListRange: [4,7],
					state: 'update-selection'
				},
				{
					data: [1,2,3,4,6,7,5,8],
					selectionIndizes: [5,6],
					subListRange: [4,7],
					state: 'update-selection'
				},
				{
					data: [1,2,3,4,6,7,5,8],
					selectionIndizes: [6,6],
					subListRange: [4,7],
					state: 'update-selection'
				},
				{
					data: [1,2,3,4,6,7,5,8],
					selectionIndizes: [4,5],
					subListRange: [4,6],
					state: 'update-selection'
				},
				{
					data: [1,2,3,4,6,7,5,8],
					selectionIndizes: [4,4],
					subListRange: [4,6],
					state: 'update-selection'
				},
				{
					data: [1,2,3,4,5,7,6,8],
					selectionIndizes: [4,4],
					subListRange: [4,6],
					state: 'swap-selection'
				},
				{
					data: [1,2,3,4,5,7,6,8],
					selectionIndizes: [4,4],
					subListRange: [4,6],
					state: 'update-selection'
				},
				{
					data: [1,2,3,4,5,7,6,8],
					selectionIndizes: [5,5],
					subListRange: [5,6],
					state: 'update-selection'
				},
				{
					data: [1,2,3,4,5,6,7,8],
					selectionIndizes: [5,5],
					subListRange: [5,6],
					state: 'swap-selection'
				},
				{
					data: [1,2,3,4,5,6,7,8],
					selectionIndizes: [5,5],
					subListRange: [5,6],
					state: 'update-selection'
				},
				{
					data: [1,2,3,4,5,6,7,8],
					selectionIndizes: [6,5],
					subListRange: [6,6],
					state: 'update-selection'
				},
				{
					data: [1, 2, 3, 4, 5, 6, 7, 8],
					selectionIndizes: [],
					state: 'update-selection'
				},
			];
			const quicksort = new QuickSort([...expectedGenerations[0].data]);
			expect(quicksort.addStateToGenerations(quicksort.sortData())).toStrictEqual(expectedGenerations);
		});
	});

});