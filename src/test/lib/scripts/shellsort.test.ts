import {
	describe, expect, test
} from 'vitest';
import {
	ShellSort
} from '../../../lib/scritps/shellsort';

describe('ShellSort Script', () => {

	describe('test sort data', () => {
		test('generate all generations', () => {
			const expectedGenerations: ShellSortGeneration[] = [
				{
					data: [4, 7, 6, 8, 3, 2, 5, 1],
					selectionIndizes: [],
				},
				{
					data: [4, 7, 6, 8, 3, 2, 5, 1],
					selectionIndizes: [0, 4],
					subListSelection: [0, 1],
				},
				{
					data: [3, 7, 6, 8, 4, 2, 5, 1],
					selectionIndizes: [0, 4],
					subListSelection: [0, 1],
				},
				{
					data: [3, 7, 6, 8, 4, 2, 5, 1],
					selectionIndizes: [1, 5],
					subListSelection: [0, 1],
				},
				{
					data: [3, 2, 6, 8, 4, 7, 5, 1],
					selectionIndizes: [1, 5],
					subListSelection: [0, 1],
				},
				{
					data: [3, 2, 6, 8, 4, 7, 5, 1],
					selectionIndizes: [2, 6],
					subListSelection: [0, 1],
				},
				{
					data: [3, 2, 5, 8, 4, 7, 6, 1],
					selectionIndizes: [2, 6],
					subListSelection: [0, 1],
				},
				{
					data: [3, 2, 5, 8, 4, 7, 6, 1],
					selectionIndizes: [3, 7],
					subListSelection: [0, 1],
				},
				{
					data: [3, 2, 5, 1, 4, 7, 6, 8],
					selectionIndizes: [3, 7],
					subListSelection: [0, 1],
				},
				{
					data: [3, 2, 5, 1, 4, 7, 6, 8],
					selectionIndizes: [0, 2, 4, 6],
					subListSelection: [0, 1],
				},
				{
					data: [3, 2, 5, 1, 4, 7, 6, 8],
					selectionIndizes: [0, 2, 4, 6],
					subListSelection: [1, 2],
				},
				{
					data: [3, 2, 4, 1, 5, 7, 6, 8],
					selectionIndizes: [0, 2, 4, 6],
					subListSelection: [1, 2],
				},
				{
					data: [3, 2, 4, 1, 5, 7, 6, 8],
					selectionIndizes: [0, 2, 4, 6],
					subListSelection: [2, 3],
				},
				{
					data: [3, 2, 4, 1, 5, 7, 6, 8],
					selectionIndizes: [1, 3, 5, 7],
					subListSelection: [0, 1],
				},
				{
					data: [3, 1, 4, 2, 5, 7, 6, 8],
					selectionIndizes: [1, 3, 5, 7],
					subListSelection: [0, 1],
				},
				{
					data: [3, 1, 4, 2, 5, 7, 6, 8],
					selectionIndizes: [1, 3, 5, 7],
					subListSelection: [1, 2],
				},
				{
					data: [3, 1, 4, 2, 5, 7, 6, 8],
					selectionIndizes: [1, 3, 5, 7],
					subListSelection: [2, 3],
				},
				{
					data: [3, 1, 4, 2, 5, 7, 6, 8],
					selectionIndizes: [0, 1],
				},
				{
					data: [1, 3, 4, 2, 5, 7, 6, 8],
					selectionIndizes: [0, 1],
				},
				{
					data: [1, 3, 4, 2, 5, 7, 6, 8],
					selectionIndizes: [1, 2],
				},
				{
					data: [1, 3, 4, 2, 5, 7, 6, 8],
					selectionIndizes: [2, 3],
				},
				{
					data: [1, 3, 2, 4, 5, 7, 6, 8],
					selectionIndizes: [2, 3],
				},
				{
					data: [1, 3, 2, 4, 5, 7, 6, 8],
					selectionIndizes: [1, 2],
				},
				{
					data: [1, 2, 3, 4, 5, 7, 6, 8],
					selectionIndizes: [1, 2],
				},
				{
					data: [1, 2, 3, 4, 5, 7, 6, 8],
					selectionIndizes: [3, 4],
				},
				{
					data: [1, 2, 3, 4, 5, 7, 6, 8],
					selectionIndizes: [4, 5],
				},
				{
					data: [1, 2, 3, 4, 5, 7, 6, 8],
					selectionIndizes: [5, 6],
				},
				{
					data: [1, 2, 3, 4, 5, 6, 7, 8],
					selectionIndizes: [5, 6],
				},
				{
					data: [1, 2, 3, 4, 5, 6, 7, 8],
					selectionIndizes: [6, 7],
				},
				{
					data: [1, 2, 3, 4, 5, 6, 7, 8],
					selectionIndizes: [],
				}
			];
			const shellsort = new ShellSort([...expectedGenerations[0].data]);
			expect(shellsort.getData()).toStrictEqual(expectedGenerations[0].data);
			expect(shellsort.getSelectionIndizes()).toHaveLength(0);
			expect(shellsort.getGenerations()).toHaveLength(0);
			expect(shellsort.sortData()).toStrictEqual(expectedGenerations);
			expect(shellsort.getData()).toStrictEqual(expectedGenerations[expectedGenerations.length - 1].data);
			expect(shellsort.getSelectionIndizes()).toHaveLength(0);
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
					data: [4, 7, 6, 8, 3, 2, 5, 1],
					selectionIndizes: [0, 4],
					subListSelection: [0, 1],
					state: 'update-selection'
				},
				{
					data: [3, 7, 6, 8, 4, 2, 5, 1],
					selectionIndizes: [0, 4],
					subListSelection: [0, 1],
					state: 'swap-selection'
				},
				{
					data: [3, 7, 6, 8, 4, 2, 5, 1],
					selectionIndizes: [0, 4],
					subListSelection: [0, 1],
					state: 'update-selection'
				},
				{
					data: [3, 7, 6, 8, 4, 2, 5, 1],
					selectionIndizes: [1, 5],
					subListSelection: [0, 1],
					state: 'update-selection'
				},
				{
					data: [3, 2, 6, 8, 4, 7, 5, 1],
					selectionIndizes: [1, 5],
					subListSelection: [0, 1],
					state: 'swap-selection'
				},
				{
					data: [3, 2, 6, 8, 4, 7, 5, 1],
					selectionIndizes: [1, 5],
					subListSelection: [0, 1],
					state: 'update-selection'
				},
				{
					data: [3, 2, 6, 8, 4, 7, 5, 1],
					selectionIndizes: [2, 6],
					subListSelection: [0, 1],
					state: 'update-selection'
				},
				{
					data: [3, 2, 5, 8, 4, 7, 6, 1],
					selectionIndizes: [2, 6],
					subListSelection: [0, 1],
					state: 'swap-selection'
				},
				{
					data: [3, 2, 5, 8, 4, 7, 6, 1],
					selectionIndizes: [2, 6],
					subListSelection: [0, 1],
					state: 'update-selection'
				},
				{
					data: [3, 2, 5, 8, 4, 7, 6, 1],
					selectionIndizes: [3, 7],
					subListSelection: [0, 1],
					state: 'update-selection'
				},
				{
					data: [3, 2, 5, 1, 4, 7, 6, 8],
					selectionIndizes: [3, 7],
					subListSelection: [0, 1],
					state: 'swap-selection'
				},
				{
					data: [3, 2, 5, 1, 4, 7, 6, 8],
					selectionIndizes: [3, 7],
					subListSelection: [0, 1],
					state: 'update-selection'
				},
				{
					data: [3, 2, 5, 1, 4, 7, 6, 8],
					selectionIndizes: [0, 2, 4, 6],
					subListSelection: [0, 1],
					state: 'update-selection'
				},
				{
					data: [3, 2, 5, 1, 4, 7, 6, 8],
					selectionIndizes: [0, 2, 4, 6],
					subListSelection: [1, 2],
					state: 'update-selection'
				},
				{
					data: [3, 2, 4, 1, 5, 7, 6, 8],
					selectionIndizes: [0, 2, 4, 6],
					subListSelection: [1, 2],
					state: 'swap-selection'
				},
				{
					data: [3, 2, 4, 1, 5, 7, 6, 8],
					selectionIndizes: [0, 2, 4, 6],
					subListSelection: [1, 2],
					state: 'update-selection'
				},
				{
					data: [3, 2, 4, 1, 5, 7, 6, 8],
					selectionIndizes: [0, 2, 4, 6],
					subListSelection: [2, 3],
					state: 'update-selection'
				},
				{
					data: [3, 2, 4, 1, 5, 7, 6, 8],
					selectionIndizes: [1, 3, 5, 7],
					subListSelection: [0, 1],
					state: 'update-selection'
				},
				{
					data: [3, 1, 4, 2, 5, 7, 6, 8],
					selectionIndizes: [1, 3, 5, 7],
					subListSelection: [0, 1],
					state: 'swap-selection'
				},
				{
					data: [3, 1, 4, 2, 5, 7, 6, 8],
					selectionIndizes: [1, 3, 5, 7],
					subListSelection: [0, 1],
					state: 'update-selection'
				},
				{
					data: [3, 1, 4, 2, 5, 7, 6, 8],
					selectionIndizes: [1, 3, 5, 7],
					subListSelection: [1, 2],
					state: 'update-selection'
				},
				{
					data: [3, 1, 4, 2, 5, 7, 6, 8],
					selectionIndizes: [1, 3, 5, 7],
					subListSelection: [2, 3],
					state: 'update-selection'
				},
				{
					data: [3, 1, 4, 2, 5, 7, 6, 8],
					selectionIndizes: [0, 1],
					state: 'update-selection'
				},
				{
					data: [1, 3, 4, 2, 5, 7, 6, 8],
					selectionIndizes: [0, 1],
					state: 'swap-selection'
				},
				{
					data: [1, 3, 4, 2, 5, 7, 6, 8],
					selectionIndizes: [0, 1],
					state: 'update-selection'
				},
				{
					data: [1, 3, 4, 2, 5, 7, 6, 8],
					selectionIndizes: [1, 2],
					state: 'update-selection'
				},
				{
					data: [1, 3, 4, 2, 5, 7, 6, 8],
					selectionIndizes: [2, 3],
					state: 'update-selection'
				},
				{
					data: [1, 3, 2, 4, 5, 7, 6, 8],
					selectionIndizes: [2, 3],
					state: 'swap-selection'
				},
				{
					data: [1, 3, 2, 4, 5, 7, 6, 8],
					selectionIndizes: [2, 3],
					state: 'update-selection'
				},
				{
					data: [1, 3, 2, 4, 5, 7, 6, 8],
					selectionIndizes: [1, 2],
					state: 'update-selection'
				},
				{
					data: [1, 2, 3, 4, 5, 7, 6, 8],
					selectionIndizes: [1, 2],
					state: 'swap-selection'
				},
				{
					data: [1, 2, 3, 4, 5, 7, 6, 8],
					selectionIndizes: [1, 2],
					state: 'update-selection'
				},
				{
					data: [1, 2, 3, 4, 5, 7, 6, 8],
					selectionIndizes: [3, 4],
					state: 'update-selection'
				},
				{
					data: [1, 2, 3, 4, 5, 7, 6, 8],
					selectionIndizes: [4, 5],
					state: 'update-selection'
				},
				{
					data: [1, 2, 3, 4, 5, 7, 6, 8],
					selectionIndizes: [5, 6],
					state: 'update-selection'
				},
				{
					data: [1, 2, 3, 4, 5, 6, 7, 8],
					selectionIndizes: [5, 6],
					state: 'swap-selection'
				},
				{
					data: [1, 2, 3, 4, 5, 6, 7, 8],
					selectionIndizes: [5, 6],
					state: 'update-selection'
				},
				{
					data: [1, 2, 3, 4, 5, 6, 7, 8],
					selectionIndizes: [6, 7],
					state: 'update-selection'
				},
				{
					data: [1, 2, 3, 4, 5, 6, 7, 8],
					selectionIndizes: [],
					state: 'update-selection'
				}
			];
			const shellsort = new ShellSort([...expectedGenerations[0].data]);
			expect(shellsort.addStateToGenerations(shellsort.sortData())).toStrictEqual(expectedGenerations);
		});
	});

});