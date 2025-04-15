import {
	describe, expect, test
} from 'vitest';
import {
	CountingSort
} from '../../../lib/scritps/countingsort';
import {
	generateRandomNumberArray, isSorted
} from '../../../lib/utils';

describe('CountingSort Script', () => {
	test('test constructor', () => {
		const countingsort = new CountingSort([5, 4, 3, 2, 1]);
		expect(countingsort.getData()).toStrictEqual([5, 4, 3, 2, 1]);
		expect(countingsort.getSelectionIndizes()).toHaveLength(0);
		expect(countingsort.getGenerations()).toHaveLength(0);
	});
	describe('test sort data', () => {
		test('generate all generations', () => {
			const expectedGenerations: TableGeneration[] = [
				{
					countTable: {
						data: [0,0,0,0,0,0,],
						selectionIndex: -1,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: -1,
					},
					resultTable: {
						data: [],
						selectionIndex: -1,
					},
				},
				{
					countTable: {
						data: [0,0,0,0,0,1,],
						selectionIndex: 5,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: 0,
					},
					resultTable: {
						data: [],
						selectionIndex: -1,
					},
				},
				{
					countTable: {
						data: [0,0,0,0,1,1,],
						selectionIndex: 4,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: 1,
					},
					resultTable: {
						data: [],
						selectionIndex: -1,
					},
				},
				{
					countTable: {
						data: [0,0,0,1,1,1,],
						selectionIndex: 3,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: 2,
					},
					resultTable: {
						data: [],
						selectionIndex: -1,
					},
				},
				{
					countTable: {
						data: [0,0,1,1,1,1,],
						selectionIndex: 2,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: 3,
					},
					resultTable: {
						data: [],
						selectionIndex: -1,
					},
				},
				{
					countTable: {
						data: [0,1,1,1,1,1,],
						selectionIndex: 1,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: 4,
					},
					resultTable: {
						data: [],
						selectionIndex: -1,
					},
				},
				{
					countTable: {
						data: [0,1,1,1,1,1,],
						selectionIndex: 1,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: -1,
					},
					resultTable: {
						data: [],
						selectionIndex: -1,
					},
				},
				{
					countTable: {
						data: [0,1,2,1,1,1,],
						selectionIndex: 2,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: -1,
					},
					resultTable: {
						data: [],
						selectionIndex: -1,
					},
				},
				{
					countTable: {
						data: [0,1,2,3,1,1,],
						selectionIndex: 3,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: -1,
					},
					resultTable: {
						data: [],
						selectionIndex: -1,
					},
				},
				{
					countTable: {
						data: [0,1,2,3,4,1,],
						selectionIndex: 4,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: -1,
					},
					resultTable: {
						data: [],
						selectionIndex: -1,
					},
				},
				{
					countTable: {
						data: [0,1,2,3,4,5,],
						selectionIndex: 5,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: -1,
					},
					resultTable: {
						data: [],
						selectionIndex: -1,
					},
				},
				{
					countTable: {
						data: [0,0,2,3,4,5,],
						selectionIndex: 1,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: 4,
					},
					resultTable: {
						data: [1,undefined,undefined,undefined,undefined,],
						selectionIndex: -1,
					},
				},
				{
					countTable: {
						data: [0,0,1,3,4,5,],
						selectionIndex: 2,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: 3,
					},
					resultTable: {
						data: [1,2,undefined,undefined,undefined,],
						selectionIndex: 0,
					},
				},
				{
					countTable: {
						data: [0,0,1,2,4,5,],
						selectionIndex: 3,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: 2,
					},
					resultTable: {
						data: [1,2,3,undefined,undefined,],
						selectionIndex: 1,
					},
				},
				{
					countTable: {
						data: [0,0,1,2,3,5,],
						selectionIndex: 4,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: 1,
					},
					resultTable: {
						data: [1,2,3,4,undefined,],
						selectionIndex: 2,
					},
				},
				{
					countTable: {
						data: [0,0,1,2,3,4,],
						selectionIndex: 5,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: 0,
					},
					resultTable: {
						data: [1,2,3,4,5,],
						selectionIndex: 3,
					},
				},
				{
					countTable: {
						data: [0,0,1,2,3,4,],
						selectionIndex: -1,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: -1,
					},
					resultTable: {
						data: [1,2,3,4,5,],
						selectionIndex: -1,
					},
				},
			];
			const countingsort = new CountingSort([...expectedGenerations[0].initialTable.data]);
			expect(countingsort.getData()).toStrictEqual(expectedGenerations[0].initialTable.data);
			expect(countingsort.getSelectionIndizes()).toHaveLength(0);
			expect(countingsort.getGenerations()).toHaveLength(0);
			expect(countingsort.sortData()).toStrictEqual(expectedGenerations);
			expect(countingsort.getData()).toStrictEqual(expectedGenerations[expectedGenerations.length - 1].resultTable.data);
			expect(countingsort.getSelectionIndizes()).toHaveLength(0);
		});
	});
	describe('test add state to generations', () => {
		test('generate all generations', () => {
			const expectedGenerations: AnimationGeneration<TableGeneration>[] = [
				{
					countTable: {
						data: [0,0,0,0,0,0,],
						selectionIndex: -1,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: -1,
					},
					resultTable: {
						data: [],
						selectionIndex: -1,
					},
					state: 'update-selection',
				},
				{
					countTable: {
						data: [0,0,0,0,0,1,],
						selectionIndex: 5,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: 0,
					},
					resultTable: {
						data: [],
						selectionIndex: -1,
					},
					state: 'update-selection',
				},
				{
					countTable: {
						data: [0,0,0,0,1,1,],
						selectionIndex: 4,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: 1,
					},
					resultTable: {
						data: [],
						selectionIndex: -1,
					},
					state: 'update-selection',
				},
				{
					countTable: {
						data: [0,0,0,1,1,1,],
						selectionIndex: 3,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: 2,
					},
					resultTable: {
						data: [],
						selectionIndex: -1,
					},
					state: 'update-selection',
				},
				{
					countTable: {
						data: [0,0,1,1,1,1,],
						selectionIndex: 2,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: 3,
					},
					resultTable: {
						data: [],
						selectionIndex: -1,
					},
					state: 'update-selection',
				},
				{
					countTable: {
						data: [0,1,1,1,1,1,],
						selectionIndex: 1,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: 4,
					},
					resultTable: {
						data: [],
						selectionIndex: -1,
					},
					state: 'update-selection',
				},
				{
					countTable: {
						data: [0,1,1,1,1,1,],
						selectionIndex: 1,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: -1,
					},
					resultTable: {
						data: [],
						selectionIndex: -1,
					},
					state: 'update-selection',
				},
				{
					countTable: {
						data: [0,1,2,1,1,1,],
						selectionIndex: 2,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: -1,
					},
					resultTable: {
						data: [],
						selectionIndex: -1,
					},
					state: 'update-selection',
				},
				{
					countTable: {
						data: [0,1,2,3,1,1,],
						selectionIndex: 3,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: -1,
					},
					resultTable: {
						data: [],
						selectionIndex: -1,
					},
					state: 'update-selection',
				},
				{
					countTable: {
						data: [0,1,2,3,4,1,],
						selectionIndex: 4,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: -1,
					},
					resultTable: {
						data: [],
						selectionIndex: -1,
					},
					state: 'update-selection',
				},
				{
					countTable: {
						data: [0,1,2,3,4,5,],
						selectionIndex: 5,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: -1,
					},
					resultTable: {
						data: [],
						selectionIndex: -1,
					},
					state: 'update-selection',
				},
				{
					countTable: {
						data: [0,0,2,3,4,5,],
						selectionIndex: 1,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: 4,
					},
					resultTable: {
						data: [1,undefined,undefined,undefined,undefined,],
						selectionIndex: -1,
					},
					state: 'update-selection',
				},
				{
					countTable: {
						data: [0,0,1,3,4,5,],
						selectionIndex: 2,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: 3,
					},
					resultTable: {
						data: [1,2,undefined,undefined,undefined,],
						selectionIndex: 0,
					},
					state: 'update-selection',
				},
				{
					countTable: {
						data: [0,0,1,2,4,5,],
						selectionIndex: 3,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: 2,
					},
					resultTable: {
						data: [1,2,3,undefined,undefined,],
						selectionIndex: 1,
					},
					state: 'update-selection',
				},
				{
					countTable: {
						data: [0,0,1,2,3,5,],
						selectionIndex: 4,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: 1,
					},
					resultTable: {
						data: [1,2,3,4,undefined,],
						selectionIndex: 2,
					},
					state: 'update-selection',
				},
				{
					countTable: {
						data: [0,0,1,2,3,4,],
						selectionIndex: 5,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: 0,
					},
					resultTable: {
						data: [1,2,3,4,5,],
						selectionIndex: 3,
					},
					state: 'update-selection',
				},
				{
					countTable: {
						data: [0,0,1,2,3,4,],
						selectionIndex: -1,
					},
					initialTable: {
						data: [5,4,3,2,1,],
						selectionIndex: -1,
					},
					resultTable: {
						data: [1,2,3,4,5,],
						selectionIndex: -1,
					},
					state: 'update-selection',
				},
			];
			const countingsort = new CountingSort([...expectedGenerations[0].initialTable.data]);
			expect(countingsort.addStateToGenerations(countingsort.sortData())).toStrictEqual(expectedGenerations);
		});
	});
	describe('test sorting random data', () => {
		test('random data set size 35', () => {
			const countingsort = new CountingSort(generateRandomNumberArray(35, 99));
			countingsort.sortData();
			expect(isSorted(countingsort.getData())).toBeTruthy();
		});
		test('random data set size 50', () => {
			const countingsort = new CountingSort(generateRandomNumberArray(50, 99));
			countingsort.sortData();
			expect(isSorted(countingsort.getData())).toBeTruthy();
		});
	});
});