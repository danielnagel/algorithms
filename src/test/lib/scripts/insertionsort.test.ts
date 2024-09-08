import {
	describe, expect, test 
} from 'vitest';
import {
	InsertionSort 
} from '../../../lib/scritps/insertionsort';

describe('Insertion Sort Script', () => {

	describe('test next generation', () => {
		test('throw error when there is no data', () => {
			const insertionsort = new InsertionSort([]);
			expect(() => insertionsort.nextGeneration()).toThrowError('no data available');
		});
		test('sort as expected until finished', () => {
			const expectedGenerations: Generation[] = [
				{
					data: [2, 5, 1, 3, 4],
					selectionIndizes: [0, 1]
				},
				{
					data: [2, 5, 1, 3, 4],
					selectionIndizes: [1, 2]
				},
				{
					data: [2, 1, 5, 3, 4],
					selectionIndizes: [1, 2]
				},
				{
					data: [2, 1, 5, 3, 4],
					selectionIndizes: [0, 1]
				},
				{
					data: [1, 2, 5, 3, 4],
					selectionIndizes: [0, 1]
				},
				{
					data: [1, 2, 5, 3, 4],
					selectionIndizes: [2, 3]
				},
				{
					data: [1, 2, 3, 5, 4],
					selectionIndizes: [2, 3]
				},
				{
					data: [1, 2, 3, 5, 4],
					selectionIndizes: [3, 4]
				},
				{
					data: [1, 2, 3, 4, 5],
					selectionIndizes: [3, 4]
				},
			];
			const insertionsort = new InsertionSort([...expectedGenerations[0].data]);
			for (let i = 0; i < expectedGenerations.length; i++) {
				const expectedGeneration = expectedGenerations[i];
				expect(insertionsort.nextGeneration()).toStrictEqual(expectedGeneration);
				const {data, selectionIndizes} = expectedGeneration;
				expect(insertionsort.getData()).toStrictEqual(data);
				expect(insertionsort.getSelectionIndizes()).toStrictEqual(selectionIndizes);
				expect(insertionsort.getGenerations()).toHaveLength(i+1);
			}

			expect(insertionsort.nextGeneration()).toStrictEqual(
				{
					data: [1, 2, 3, 4, 5],
					selectionIndizes: []
				});
		});
	});
	describe('test sort algorithm', () => {
		test('throw error when there is no selection', () => {
			const insertionsort = new InsertionSort([]);
			expect(() => insertionsort.sortAlgorithm()).toThrowError('two selection indizes');
		});
		test('throw error when the selection indizes is bigger than the insertion index', () => {
			const insertionsort = new InsertionSort([]);
			insertionsort.setSelectionIndizes([1, 2]);
			expect(() => insertionsort.sortAlgorithm()).toThrowError('index exceeds data');
		});
	});
});