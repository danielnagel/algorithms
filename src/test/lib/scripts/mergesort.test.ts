import {
	describe, expect, test
} from 'vitest';
import {
	MergeSort
} from '../../../lib/scritps/mergesort';

describe('MergeSort Script', () => {
	describe('test sort data', () => {
		test('generate all generations', () => {
			const expectedGenerations: Generation[] = [
				{
					data: [4, 7, 6, 8, 3, 2, 5, 1],
					selectionIndizes: [],
				},
				{
					data: [4, 7, 6, 8, 3, 2, 5, 1],
					selectionIndizes: [],
					subListRange: [0, 8],
				}, {
					data: [4, 7, 6, 8, 3, 2, 5, 1],
					selectionIndizes: [],
					subListRange: [0, 4], 
				}, {
					data: [4, 7, 6, 8, 3, 2, 5, 1],
					selectionIndizes: [],
					subListRange: [0, 2], 
				}, {
					data: [4, 7, 6, 8, 3, 2, 5, 1],
					mergeResult: [4],
					selectionIndizes: [0],
					subListRange: [0, 2], 
				}, {
					data: [4, 7, 6, 8, 3, 2, 5, 1],
					mergeResult: [4, 7],
					selectionIndizes: [1],
					subListRange: [0, 2], 
				}, {
					data: [4, 7, 6, 8, 3, 2, 5, 1],
					selectionIndizes: [],
					subListRange: [0, 2], 
				}, {
					data: [4, 7, 6, 8, 3, 2, 5, 1],
					selectionIndizes: [],
					subListRange: [2, 4], 
				}, {
					data: [4, 7, 6, 8, 3, 2, 5, 1],
					mergeResult: [6],
					selectionIndizes: [2],
					subListRange: [2, 4], 
				}, {
					data: [4, 7, 6, 8, 3, 2, 5, 1],
					mergeResult: [6, 8],
					selectionIndizes: [3],
					subListRange: [2, 4], 
				}, {
					data: [4, 7, 6, 8, 3, 2, 5, 1],
					selectionIndizes: [],
					subListRange: [2, 4], 
				}, {
					data: [4, 7, 6, 8, 3, 2, 5, 1],
					mergeResult: [4],
					selectionIndizes: [0],
					subListRange: [0, 4], 
				}, {
					data: [4, 7, 6, 8, 3, 2, 5, 1],
					mergeResult: [4, 6],
					selectionIndizes: [2],
					subListRange: [0, 4], 
				}, {
					data: [4, 7, 6, 8, 3, 2, 5, 1],
					mergeResult: [4, 6, 7],
					selectionIndizes: [1],
					subListRange: [0, 4], 
				}, {
					data: [4, 7, 6, 8, 3, 2, 5, 1],
					mergeResult: [4, 6, 7, 8],
					selectionIndizes: [3],
					subListRange: [0, 4], 
				}, {
					data: [4, 6, 7, 8, 3, 2, 5, 1],
					selectionIndizes: [],
					subListRange: [0, 4], 
				}, {
					data: [4, 6, 7, 8, 3, 2, 5, 1],
					selectionIndizes: [],
					subListRange: [4, 8], 
				}, {
					data: [4, 6, 7, 8, 3, 2, 5, 1],
					selectionIndizes: [],
					subListRange: [4, 6], 
				}, {
					data: [4, 6, 7, 8, 3, 2, 5, 1],
					mergeResult: [2],
					selectionIndizes: [5],
					subListRange: [4, 6], 
				}, {
					data: [4, 6, 7, 8, 3, 2, 5, 1],
					mergeResult: [2, 3],
					selectionIndizes: [4],
					subListRange: [4, 6], 
				}, {
					data: [4, 6, 7, 8, 2, 3, 5, 1],
					selectionIndizes: [],
					subListRange: [4, 6], 
				}, {
					data: [4, 6, 7, 8, 2, 3, 5, 1],
					selectionIndizes: [],
					subListRange: [6, 8], 
				}, {
					data: [4, 6, 7, 8, 2, 3, 5, 1],
					mergeResult: [1],
					selectionIndizes: [7],
					subListRange: [6, 8], 
				}, {
					data: [4, 6, 7, 8, 2, 3, 5, 1],
					mergeResult: [1, 5],
					selectionIndizes: [6],
					subListRange: [6, 8], 
				}, {
					data: [4, 6, 7, 8, 2, 3, 1, 5],
					selectionIndizes: [],
					subListRange: [6, 8], 
				}, {
					data: [4, 6, 7, 8, 2, 3, 1, 5],
					mergeResult: [1],
					selectionIndizes: [6],
					subListRange: [4, 8], 
				}, {
					data: [4, 6, 7, 8, 2, 3, 1, 5],
					mergeResult: [1, 2],
					selectionIndizes: [4],
					subListRange: [4, 8], 
				}, {
					data: [4, 6, 7, 8, 2, 3, 1, 5],
					mergeResult: [1, 2, 3],
					selectionIndizes: [5],
					subListRange: [4, 8], 
				}, {
					data: [4, 6, 7, 8, 2, 3, 1, 5],
					mergeResult: [1, 2, 3, 5],
					selectionIndizes: [7],
					subListRange: [4, 8], 
				}, {
					data: [4, 6, 7, 8, 1, 2, 3, 5],
					selectionIndizes: [],
					subListRange: [4, 8], 
				}, {
					data: [4, 6, 7, 8, 1, 2, 3, 5],
					mergeResult: [1],
					selectionIndizes: [4],
					subListRange: [0, 8], 
				}, {
					data: [4, 6, 7, 8, 1, 2, 3, 5],
					mergeResult: [1, 2],
					selectionIndizes: [5],
					subListRange: [0, 8], 
				}, {
					data: [4, 6, 7, 8, 1, 2, 3, 5],
					mergeResult: [1, 2, 3],
					selectionIndizes: [6],
					subListRange: [0, 8], 
				}, {
					data: [4, 6, 7, 8, 1, 2, 3, 5],
					mergeResult: [1, 2, 3, 4],
					selectionIndizes: [0],
					subListRange: [0, 8], 
				}, {
					data: [4, 6, 7, 8, 1, 2, 3, 5],
					mergeResult: [1, 2, 3, 4, 5],
					selectionIndizes: [7],
					subListRange: [0, 8], 
				}, {
					data: [4, 6, 7, 8, 1, 2, 3, 5],
					mergeResult: [1, 2, 3, 4, 5, 6],
					selectionIndizes: [1],
					subListRange: [0, 8], 
				}, {
					data: [4, 6, 7, 8, 1, 2, 3, 5],
					mergeResult: [1, 2, 3, 4, 5, 6, 7],
					selectionIndizes: [2],
					subListRange: [0, 8], 
				}, {
					data: [4, 6, 7, 8, 1, 2, 3, 5],
					mergeResult: [1, 2, 3, 4, 5, 6, 7, 8],
					selectionIndizes: [3],
					subListRange: [0, 8], 
				}, {
					data: [1, 2, 3, 4, 5, 6, 7, 8],
					selectionIndizes: [],
					subListRange: [0, 8], 
				}, {
					data: [1, 2, 3, 4, 5, 6, 7, 8],
					selectionIndizes: [],
				},
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