import {
	describe, expect, test 
} from 'vitest';
import {
	BubbleSort 
} from '../../../lib/scritps/bubblesort';

describe('BubbleSort Script', () => {

	const sampleData = [2, 5, 1, 3, 4];

	describe('test sort algorithm', () => {
		test('throw error when there is no selection', () => {
			const bubblesort = new BubbleSort([]);
			expect(() => bubblesort.sortAlgorithm()).toThrowError('two selection indizes');
		});
		test('throw error when the selection indizes is bigger than the available data', () => {
			const bubblesort = new BubbleSort([]);
			bubblesort.setSelectionIndizes([0, 1]);
			expect(() => bubblesort.sortAlgorithm()).toThrowError('index exceeds data');
		});
		test('update selection, when current indizes are sorted', () => {
			const bubblesort = new BubbleSort([...sampleData]);
			bubblesort.setSelectionIndizes([0, 1]);
			bubblesort.sortAlgorithm();
			expect(bubblesort.getData()).toStrictEqual(sampleData);
			expect(bubblesort.getSelectionIndizes()).toStrictEqual([1, 2]);
		});
		test('update data, when current indizes are not sorted', () => {
			const bubblesort = new BubbleSort([...sampleData]);
			bubblesort.setSelectionIndizes([1, 2]);
			bubblesort.sortAlgorithm();
			expect(bubblesort.getData()).toStrictEqual([2, 1, 5, 3, 4]);
			expect(bubblesort.getSelectionIndizes()).toStrictEqual([1, 2]);
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
					selectionIndizes:[2,3],
				},
				{
					data:[4,3,2,5,1],
					selectionIndizes:[2,3],
				},
				{
					data:[4,3,2,5,1],
					selectionIndizes:[3,4],
				},
				{
					data:[4,3,2,1,5],
					selectionIndizes:[3,4],
				},
				{
					data:[4,3,2,1,5],
					selectionIndizes:[0,1],
				},
				{
					data:[3,4,2,1,5],
					selectionIndizes:[0,1],
				},
				{
					data:[3,4,2,1,5],
					selectionIndizes:[1,2],
				},
				{
					data:[3,2,4,1,5],
					selectionIndizes:[1,2],
				},
				{
					data:[3,2,4,1,5],
					selectionIndizes:[2,3],
				},
				{
					data:[3,2,1,4,5],
					selectionIndizes:[2,3],
				},
				{
					data:[3,2,1,4,5],
					selectionIndizes:[0,1],
				},
				{
					data:[2,3,1,4,5],
					selectionIndizes:[0,1],
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
				}];
			const bubblesort = new BubbleSort([...expectedGenerations[0].data]);
			expect(bubblesort.getData()).toStrictEqual(expectedGenerations[0].data);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(0);
			expect(bubblesort.getGenerations()).toHaveLength(0);
			expect(bubblesort.sortData()).toStrictEqual(expectedGenerations);
			expect(bubblesort.getData()).toStrictEqual(expectedGenerations[expectedGenerations.length -1].data);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(0);
		});
	});
});