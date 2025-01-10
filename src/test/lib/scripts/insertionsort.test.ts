import {
	describe, expect, test 
} from 'vitest';
import {
	InsertionSort 
} from '../../../lib/scritps/insertionsort';

describe('Insertion Sort Script', () => {

	const sampleData = [2, 5, 1, 3, 4];

	describe('test sort algorithm', () => {
		test('throw error when there is no selection', () => {
			const insertionsort = new InsertionSort([]);
			expect(() => insertionsort.sortAlgorithm()).toThrowError('two selection indizes');
		});
		test('update selection, when current indizes are sorted', () => {
			const insertionsort = new InsertionSort([...sampleData]);
			insertionsort.setSelectionIndizes([0, 1]);
			insertionsort.sortAlgorithm();
			expect(insertionsort.getData()).toStrictEqual(sampleData);
			expect(insertionsort.getSelectionIndizes()).toStrictEqual([1, 2]);
		});
		test('update data, when current indizes are not sorted', () => {
			const insertionsort = new InsertionSort([...sampleData]);
			insertionsort.setSelectionIndizes([1, 2]);
			insertionsort.setInsertionIndex(2);
			insertionsort.setInsertionValue(sampleData[2]);
			insertionsort.sortAlgorithm();
			expect(insertionsort.getData()).toStrictEqual([2, 1, 5, 3, 4]);
			expect(insertionsort.getSelectionIndizes()).toStrictEqual([1, 2]);
		});
	});
	describe('test sort data', () => {
		test('generate all generations', () => {
			const expectedGenerations: Generation[] = [
				{
					data:[5,4,3,2,1],
					selectionIndizes:[],
				},
				{
					data:[5,4,3,2,1],
					selectionIndizes:[0,1],
				},
				{
					data:[4,5,3,2,1],
					selectionIndizes:[0,1],
				},
				{
					data:[4,5,3,2,1],
					selectionIndizes:[1,2],
				},
				{
					data:[4,3,5,2,1],
					selectionIndizes:[1,2],
				},
				{
					data:[4,3,5,2,1],
					selectionIndizes:[0,1],
				},
				{
					data:[3,4,5,2,1],
					selectionIndizes:[0,1],
				},
				{
					data:[3,4,5,2,1],
					selectionIndizes:[2,3],
				},
				{
					data:[3,4,2,5,1],
					selectionIndizes:[2,3],
				},
				{
					data:[3,4,2,5,1],
					selectionIndizes:[1,2],
				},
				{
					data:[3,2,4,5,1],
					selectionIndizes:[1,2],
				},
				{
					data:[3,2,4,5,1],
					selectionIndizes:[0,1],
				},
				{
					data:[2,3,4,5,1],
					selectionIndizes:[0,1],
				},
				{
					data:[2,3,4,5,1],
					selectionIndizes:[3,4],
				},
				{
					data:[2,3,4,1,5],
					selectionIndizes:[3,4],
				},
				{
					data:[2,3,4,1,5],
					selectionIndizes:[2,3],
				},
				{
					data:[2,3,1,4,5],
					selectionIndizes:[2,3],
				},
				{
					data:[2,3,1,4,5],
					selectionIndizes:[1,2],
				},
				{
					data:[2,1,3,4,5],
					selectionIndizes:[1,2],
				},
				{
					data:[2,1,3,4,5],
					selectionIndizes:[0,1],
				},
				{
					data:[1,2,3,4,5],
					selectionIndizes:[0,1],
				},
				{
					data:[1,2,3,4,5],
					selectionIndizes:[],
				},
			];
			const insertionsort = new InsertionSort([...expectedGenerations[0].data]);
			expect(insertionsort.getData()).toStrictEqual(expectedGenerations[0].data);
			expect(insertionsort.getSelectionIndizes()).toHaveLength(0);
			expect(insertionsort.getGenerations()).toHaveLength(0);

			expect(insertionsort.sortData()).toStrictEqual(expectedGenerations);
			expect(insertionsort.getData()).toStrictEqual(expectedGenerations[expectedGenerations.length -1].data);
			expect(insertionsort.getSelectionIndizes()).toHaveLength(0);
			expect(insertionsort.getGenerations()).toStrictEqual(expectedGenerations);
		});
	});
	describe('test add state to generation', () => {
		test('generate all generations', () => {
			const expectedGenerations: NewGeneration[] = [
				{
					data:[5,4,3,2,1],
					selectionIndizes:[],
					state: 'update-selection'
				},
				{
					data:[5,4,3,2,1],
					selectionIndizes:[0,1],
					state: 'update-selection'
				},
				{
					data:[4,5,3,2,1],
					selectionIndizes:[0,1],
					state: 'swap-selection'
				},
				{
					data:[4,5,3,2,1],
					selectionIndizes:[0,1],
					state: 'update-selection'
				},
				{
					data:[4,5,3,2,1],
					selectionIndizes:[1,2],
					state: 'update-selection'
				},
				{
					data:[4,3,5,2,1],
					selectionIndizes:[1,2],
					state: 'swap-selection'
				},
				{
					data:[4,3,5,2,1],
					selectionIndizes:[1,2],
					state: 'update-selection'
				},
				{
					data:[4,3,5,2,1],
					selectionIndizes:[0,1],
					state: 'update-selection'
				},
				{
					data:[3,4,5,2,1],
					selectionIndizes:[0,1],
					state: 'swap-selection'
				},
				{
					data:[3,4,5,2,1],
					selectionIndizes:[0,1],
					state: 'update-selection'
				},
				{
					data:[3,4,5,2,1],
					selectionIndizes:[2,3],
					state: 'update-selection'
				},
				{
					data:[3,4,2,5,1],
					selectionIndizes:[2,3],
					state: 'swap-selection'
				},
				{
					data:[3,4,2,5,1],
					selectionIndizes:[2,3],
					state: 'update-selection'
				},
				{
					data:[3,4,2,5,1],
					selectionIndizes:[1,2],
					state: 'update-selection'
				},
				{
					data:[3,2,4,5,1],
					selectionIndizes:[1,2],
					state: 'swap-selection'
				},
				{
					data:[3,2,4,5,1],
					selectionIndizes:[1,2],
					state: 'update-selection'
				},
				{
					data:[3,2,4,5,1],
					selectionIndizes:[0,1],
					state: 'update-selection'
				},
				{
					data:[2,3,4,5,1],
					selectionIndizes:[0,1],
					state: 'swap-selection'
				},
				{
					data:[2,3,4,5,1],
					selectionIndizes:[0,1],
					state: 'update-selection'
				},
				{
					data:[2,3,4,5,1],
					selectionIndizes:[3,4],
					state: 'update-selection'
				},
				{
					data:[2,3,4,1,5],
					selectionIndizes:[3,4],
					state: 'swap-selection'
				},
				{
					data:[2,3,4,1,5],
					selectionIndizes:[3,4],
					state: 'update-selection'
				},
				{
					data:[2,3,4,1,5],
					selectionIndizes:[2,3],
					state: 'update-selection'
				},
				{
					data:[2,3,1,4,5],
					selectionIndizes:[2,3],
					state: 'swap-selection'
				},
				{
					data:[2,3,1,4,5],
					selectionIndizes:[2,3],
					state: 'update-selection'
				},
				{
					data:[2,3,1,4,5],
					selectionIndizes:[1,2],
					state: 'update-selection'
				},
				{
					data:[2,1,3,4,5],
					selectionIndizes:[1,2],
					state: 'swap-selection'
				},
				{
					data:[2,1,3,4,5],
					selectionIndizes:[1,2],
					state: 'update-selection'
				},
				{
					data:[2,1,3,4,5],
					selectionIndizes:[0,1],
					state: 'update-selection'
				},
				{
					data:[1,2,3,4,5],
					selectionIndizes:[0,1],
					state: 'swap-selection'
				},
				{
					data:[1,2,3,4,5],
					selectionIndizes:[0,1],
					state: 'update-selection'
				},
				{
					data:[1,2,3,4,5],
					selectionIndizes:[],
					state: 'update-selection'
				},
			];
			const insertionsort = new InsertionSort([...expectedGenerations[0].data]);
			expect(insertionsort.addStateToGenerations(insertionsort.sortData())).toStrictEqual(expectedGenerations);
		});
	});
});