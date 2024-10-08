import {
	describe, expect, test 
} from 'vitest';
import {
	InsertionSort 
} from '../../../lib/scritps/insertionsort';

describe('Insertion Sort Script', () => {

	const sampleData = [2, 5, 1, 3, 4];
	const sortedSampleData = [1, 2, 3, 4, 5];

	describe('test next generation', () => {
		test('sort as expected until finished', () => {
			const expectedGenerations: InsertionSortGeneration[] = [
				{
					data: [2, 5, 1, 3, 4],
					selectionIndizes: [0, 1],
					insertionIndex: 1,
					insertionValue: 5
				},
				{
					data: [2, 5, 1, 3, 4],
					selectionIndizes: [0, 1],
					insertionIndex: 1,
					insertionValue: 5
				},
				{
					data: [2, 5, 1, 3, 4],
					selectionIndizes: [1, 2],
					insertionIndex: 2,
					insertionValue: 1
				},
				{
					data: [2, 1, 5, 3, 4],
					selectionIndizes: [1, 2],
					insertionIndex: 2,
					insertionValue: 1
				},
				{
					data: [2, 1, 5, 3, 4],
					selectionIndizes: [0, 1],
					insertionIndex: 2,
					insertionValue: 1
				},
				{
					data: [1, 2, 5, 3, 4],
					selectionIndizes: [0, 1],
					insertionIndex: 2,
					insertionValue: 1
				},
				{
					data: [1, 2, 5, 3, 4],
					selectionIndizes: [2, 3],
					insertionIndex: 3,
					insertionValue: 3
				},
				{
					data: [1, 2, 3, 5, 4],
					selectionIndizes: [2, 3],
					insertionIndex: 3,
					insertionValue: 3
				},
				{
					data: [1, 2, 3, 5, 4],
					selectionIndizes: [3, 4],
					insertionIndex: 4,
					insertionValue: 4
				},
				{
					data: [1, 2, 3, 4, 5],
					selectionIndizes: [3, 4],
					insertionIndex: 4,
					insertionValue: 4
				},
			];
			const insertionsort = new InsertionSort([...expectedGenerations[0].data]);
			for (let i = 1; i < expectedGenerations.length; i++) {
				const expectedGeneration = expectedGenerations[i];
				expect(insertionsort.nextGeneration()).toStrictEqual(expectedGeneration);
				const {data, selectionIndizes} = expectedGeneration;
				expect(insertionsort.getData()).toStrictEqual(data);
				expect(insertionsort.getSelectionIndizes()).toStrictEqual(selectionIndizes);
				expect(insertionsort.getGenerations()).toHaveLength(i+1);
			}

			expect(insertionsort.getGenerations()).toStrictEqual(expectedGenerations);

			expect(insertionsort.nextGeneration()).toStrictEqual(
				{
					data: [1, 2, 3, 4, 5],
					selectionIndizes: [],
					insertionIndex: 1,
					insertionValue: 4
				});
		});
	});
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
	describe('test finish script', () => {
		test('generate all generations', () => {
			const expectedGenerations: InsertionSortGeneration[] = [
				{
					data:[5,4,3,2,1],
					selectionIndizes:[0,1],
					insertionIndex: 1,
					insertionValue: 4
				},
				{
					data:[4,5,3,2,1],
					selectionIndizes:[0,1],
					insertionIndex: 1,
					insertionValue: 4
				},
				{
					data:[4,5,3,2,1],
					selectionIndizes:[1,2],
					insertionIndex: 2,
					insertionValue: 3
				},
				{
					data:[4,3,5,2,1],
					selectionIndizes:[1,2],
					insertionIndex: 2,
					insertionValue: 3
				},
				{
					data:[4,3,5,2,1],
					selectionIndizes:[0,1],
					insertionIndex: 2,
					insertionValue: 3
				},
				{
					data:[3,4,5,2,1],
					selectionIndizes:[0,1],
					insertionIndex: 2,
					insertionValue: 3
				},
				{
					data:[3,4,5,2,1],
					selectionIndizes:[2,3],
					insertionIndex: 3,
					insertionValue: 2
				},
				{
					data:[3,4,2,5,1],
					selectionIndizes:[2,3],
					insertionIndex: 3,
					insertionValue: 2
				},
				{
					data:[3,4,2,5,1],
					selectionIndizes:[1,2],
					insertionIndex: 3,
					insertionValue: 2
				},
				{
					data:[3,2,4,5,1],
					selectionIndizes:[1,2],
					insertionIndex: 3,
					insertionValue: 2
				},
				{
					data:[3,2,4,5,1],
					selectionIndizes:[0,1],
					insertionIndex: 3,
					insertionValue: 2
				},
				{
					data:[2,3,4,5,1],
					selectionIndizes:[0,1],
					insertionIndex: 3,
					insertionValue: 2
				},
				{
					data:[2,3,4,5,1],
					selectionIndizes:[3,4],
					insertionIndex: 4,
					insertionValue: 1
				},
				{
					data:[2,3,4,1,5],
					selectionIndizes:[3,4],
					insertionIndex: 4,
					insertionValue: 1
				},
				{
					data:[2,3,4,1,5],
					selectionIndizes:[2,3],
					insertionIndex: 4,
					insertionValue: 1
				},
				{
					data:[2,3,1,4,5],
					selectionIndizes:[2,3],
					insertionIndex: 4,
					insertionValue: 1
				},
				{
					data:[2,3,1,4,5],
					selectionIndizes:[1,2],
					insertionIndex: 4,
					insertionValue: 1
				},
				{
					data:[2,1,3,4,5],
					selectionIndizes:[1,2],
					insertionIndex: 4,
					insertionValue: 1
				},
				{
					data:[2,1,3,4,5],
					selectionIndizes:[0,1],
					insertionIndex: 4,
					insertionValue: 1
				},
				{
					data:[1,2,3,4,5],
					selectionIndizes:[0,1],
					insertionIndex: 4,
					insertionValue: 1
				},
				{
					data:[1,2,3,4,5],
					selectionIndizes:[],
					insertionIndex: 1,
					insertionValue: 1
				},
			];
			const insertionsort = new InsertionSort([...expectedGenerations[0].data]);
			expect(insertionsort.getData()).toStrictEqual(expectedGenerations[0].data);
			expect(insertionsort.getSelectionIndizes()).toHaveLength(0);
			expect(insertionsort.getGenerations()).toHaveLength(0);

			expect(insertionsort.finishScript()).toStrictEqual(expectedGenerations[expectedGenerations.length -1]);
			expect(insertionsort.getData()).toStrictEqual(expectedGenerations[expectedGenerations.length -1].data);
			expect(insertionsort.getSelectionIndizes()).toHaveLength(0);
			expect(insertionsort.getGenerations()).toStrictEqual(expectedGenerations);

			// tests if the script is "initialized" again
			expect(insertionsort.prevGeneration()).toStrictEqual({
				data: [1, 2, 3, 4, 5],
				selectionIndizes: [0,1],
				insertionIndex: 4,
				insertionValue: 1
			});
		});
		test('generate all generations, with existing generations', () => {
			const generations: InsertionSortGeneration[] = [
				{
					data:[5,4,3,2,1],
					selectionIndizes:[0,1],
					insertionIndex: 1,
					insertionValue: 4
				},
				{
					data:[4,5,3,2,1],
					selectionIndizes:[0,1],
					insertionIndex: 1,
					insertionValue: 4
				},
				{
					data:[4,5,3,2,1],
					selectionIndizes:[1,2],
					insertionIndex: 2,
					insertionValue: 3
				},
				{
					data:[4,3,5,2,1],
					selectionIndizes:[1,2],
					insertionIndex: 2,
					insertionValue: 3
				},
				{
					data:[4,3,5,2,1],
					selectionIndizes:[0,1],
					insertionIndex: 2,
					insertionValue: 3
				},
			];
			const expectedGenerations: InsertionSortGeneration[] = [
				...generations,
				{
					data:[3,4,5,2,1],
					selectionIndizes:[0,1],
					insertionIndex: 2,
					insertionValue: 3
				},
				{
					data:[3,4,5,2,1],
					selectionIndizes:[2,3],
					insertionIndex: 3,
					insertionValue: 2
				},
				{
					data:[3,4,2,5,1],
					selectionIndizes:[2,3],
					insertionIndex: 3,
					insertionValue: 2
				},
				{
					data:[3,4,2,5,1],
					selectionIndizes:[1,2],
					insertionIndex: 3,
					insertionValue: 2
				},
				{
					data:[3,2,4,5,1],
					selectionIndizes:[1,2],
					insertionIndex: 3,
					insertionValue: 2
				},
				{
					data:[3,2,4,5,1],
					selectionIndizes:[0,1],
					insertionIndex: 3,
					insertionValue: 2
				},
				{
					data:[2,3,4,5,1],
					selectionIndizes:[0,1],
					insertionIndex: 3,
					insertionValue: 2
				},
				{
					data:[2,3,4,5,1],
					selectionIndizes:[3,4],
					insertionIndex: 4,
					insertionValue: 1
				},
				{
					data:[2,3,4,1,5],
					selectionIndizes:[3,4],
					insertionIndex: 4,
					insertionValue: 1
				},
				{
					data:[2,3,4,1,5],
					selectionIndizes:[2,3],
					insertionIndex: 4,
					insertionValue: 1
				},
				{
					data:[2,3,1,4,5],
					selectionIndizes:[2,3],
					insertionIndex: 4,
					insertionValue: 1
				},
				{
					data:[2,3,1,4,5],
					selectionIndizes:[1,2],
					insertionIndex: 4,
					insertionValue: 1
				},
				{
					data:[2,1,3,4,5],
					selectionIndizes:[1,2],
					insertionIndex: 4,
					insertionValue: 1
				},
				{
					data:[2,1,3,4,5],
					selectionIndizes:[0,1],
					insertionIndex: 4,
					insertionValue: 1
				},
				{
					data:[1,2,3,4,5],
					selectionIndizes:[0,1],
					insertionIndex: 4,
					insertionValue: 1
				},
				{
					data:[1,2,3,4,5],
					selectionIndizes:[],
					insertionIndex: 1,
					insertionValue: 1
				},
			];
			const insertionsort = new InsertionSort([...generations[generations.length - 1].data]);
			expect(insertionsort.getData()).toStrictEqual(generations[generations.length - 1].data);
			insertionsort.setSelectionIndizes([...generations[generations.length - 1].selectionIndizes]);
			insertionsort.setInsertionIndex(2);
			insertionsort.setInsertionValue(generations[2].data[2]);
			insertionsort.setGenerations([...generations]);
			expect(insertionsort.getSelectionIndizes()).toHaveLength(2);
			expect(insertionsort.getGenerations()).toStrictEqual(generations);

			expect(insertionsort.finishScript()).toStrictEqual(expectedGenerations[expectedGenerations.length -1]);
			expect(insertionsort.getData()).toStrictEqual(expectedGenerations[expectedGenerations.length -1].data);
			expect(insertionsort.getSelectionIndizes()).toHaveLength(0);
			expect(insertionsort.getGenerations()).toStrictEqual(expectedGenerations);
		});
	});
	describe('test reset script', () => {
		test('reset, when there are no generations', () => {
			const insertionsort = new InsertionSort([...sampleData]);
			expect(insertionsort.getData()).toStrictEqual(sampleData);
			expect(insertionsort.getSelectionIndizes()).toHaveLength(0);
			expect(insertionsort.getGenerations()).toHaveLength(0);

			expect(insertionsort.resetScript()).toStrictEqual({
				data: sampleData,
				selectionIndizes: []
			});

			expect(insertionsort.getSelectionIndizes()).toHaveLength(0);
			expect(insertionsort.getGenerations()).toHaveLength(0);
		});
		test('reset, when there are no generations, new data', () => {
			const insertionsort = new InsertionSort([]);
			expect(insertionsort.getData()).toHaveLength(0);
			expect(insertionsort.getSelectionIndizes()).toHaveLength(0);
			expect(insertionsort.getGenerations()).toHaveLength(0);

			expect(insertionsort.resetScript([...sampleData])).toStrictEqual({
				data: sampleData,
				selectionIndizes: []
			});

			expect(insertionsort.getSelectionIndizes()).toHaveLength(0);
			expect(insertionsort.getGenerations()).toHaveLength(0);
		});
		test('reset to first generation', () => {
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
			];
			const insertionsort = new InsertionSort([...expectedGenerations[expectedGenerations.length - 1].data]);
			insertionsort.setSelectionIndizes([...expectedGenerations[expectedGenerations.length - 1].selectionIndizes]);
			insertionsort.setGenerations([...expectedGenerations]);
			expect(insertionsort.getGenerations()).toHaveLength(expectedGenerations.length);
			expect(insertionsort.getData()).toStrictEqual(expectedGenerations[expectedGenerations.length - 1].data);
			expect(insertionsort.getSelectionIndizes()).toStrictEqual(expectedGenerations[expectedGenerations.length - 1].selectionIndizes);

			expect(insertionsort.resetScript()).toStrictEqual({
				data: expectedGenerations[0].data,
				selectionIndizes: []
			});
			expect(insertionsort.getGenerations()).toHaveLength(0);
			expect(insertionsort.getData()).toStrictEqual(expectedGenerations[0].data);
			expect(insertionsort.getSelectionIndizes()).toHaveLength(0);
		});
		test('reset to new data, when there are generations', () => {
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
			];
			const insertionsort = new InsertionSort([...expectedGenerations[expectedGenerations.length - 1].data]);
			insertionsort.setSelectionIndizes([...expectedGenerations[expectedGenerations.length - 1].selectionIndizes]);
			insertionsort.setGenerations([...expectedGenerations]);
			expect(insertionsort.getGenerations()).toHaveLength(expectedGenerations.length);
			expect(insertionsort.getData()).toStrictEqual(expectedGenerations[expectedGenerations.length - 1].data);
			expect(insertionsort.getSelectionIndizes()).toStrictEqual(expectedGenerations[expectedGenerations.length - 1].selectionIndizes);

			expect(insertionsort.resetScript([...sortedSampleData])).toStrictEqual({
				data: sortedSampleData,
				selectionIndizes: []
			});
			expect(insertionsort.getGenerations()).toHaveLength(0);
			expect(insertionsort.getData()).toStrictEqual(sortedSampleData);
			expect(insertionsort.getSelectionIndizes()).toHaveLength(0);
		});
	});
	describe('test previous generation', () => {
		test('reset script, when there are no generations', () => {
			const insertionsort = new InsertionSort([...sampleData]);
			expect(insertionsort.getData()).toStrictEqual(sampleData);
			expect(insertionsort.getSelectionIndizes()).toHaveLength(0);
			expect(insertionsort.getGenerations()).toHaveLength(0);
			expect(insertionsort.prevGeneration()).toStrictEqual({
				data: sampleData,
				selectionIndizes: []
			});
		});

		test('run previous generations to the beginning, as expected', () => {
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
					selectionIndizes: [2, 3]
				},
				{
					data: [2, 1, 3, 5, 4],
					selectionIndizes: [2, 3]
				},
				{
					data: [2, 1, 3, 5, 4],
					selectionIndizes: [3, 4]
				},
				{
					data: [2, 1, 3, 4, 5],
					selectionIndizes: [3, 4]
				},
				{
					data: [2, 1, 3, 4, 5],
					selectionIndizes: [0, 1]
				},
				{
					data: [1, 2, 3, 4, 5],
					selectionIndizes: [0, 1]
				},
				{
					data: [1, 2, 3, 4, 5],
					selectionIndizes: []
				},
			];
			const insertionsort = new InsertionSort([...expectedGenerations[expectedGenerations.length - 1].data]);
			expect(insertionsort.getSelectionIndizes()).toHaveLength(0);
			insertionsort.setGenerations([...expectedGenerations]);
			expect(insertionsort.getGenerations()).toHaveLength(expectedGenerations.length);
			expect(insertionsort.getData()).toStrictEqual(expectedGenerations[expectedGenerations.length - 1].data);

			for (let i = expectedGenerations.length - 1; i > 0; i--) {
				const expectedGeneration = expectedGenerations[i-1];
				expect(insertionsort.prevGeneration()).toStrictEqual(expectedGeneration);
				const {data, selectionIndizes} = expectedGeneration;
				expect(insertionsort.getData()).toStrictEqual(data);
				expect(insertionsort.getSelectionIndizes()).toStrictEqual(selectionIndizes);
				expect(insertionsort.getGenerations()).toHaveLength(i);
			}
			expect(insertionsort.getGenerations()).toHaveLength(1);
			const expectedGeneration = expectedGenerations[0];
			expect(insertionsort.prevGeneration()).toStrictEqual(expectedGeneration);
			const {data, selectionIndizes} = expectedGeneration;
			expect(insertionsort.getData()).toStrictEqual(data);
			expect(insertionsort.getSelectionIndizes()).toStrictEqual(selectionIndizes);
			expect(insertionsort.getGenerations()).toHaveLength(0);

			// remove selection indizes, when there are no more generations left
			expect(insertionsort.prevGeneration()).toStrictEqual({
				data,
				selectionIndizes: []
			});
			expect(insertionsort.getData()).toStrictEqual(data);
			expect(insertionsort.getSelectionIndizes()).toStrictEqual([]);
			expect(insertionsort.getGenerations()).toHaveLength(0);
		});
		test('finish script, previous generation and finish again', () => {
			const expectedGenerations: InsertionSortGeneration[] = [
				{
					data: [2, 5, 1, 3, 4],
					selectionIndizes: [0, 1],
					insertionIndex: 1,
					insertionValue: 5
				},
				{
					data: [2, 5, 1, 3, 4],
					selectionIndizes: [1, 2],
					insertionIndex: 2,
					insertionValue: 1
				},
				{
					data: [2, 1, 5, 3, 4],
					selectionIndizes: [1, 2],
					insertionIndex: 2,
					insertionValue: 1
				},
				{
					data: [2, 1, 5, 3, 4],
					selectionIndizes: [0, 1],
					insertionIndex: 2,
					insertionValue: 1
				},
				{
					data: [1, 2, 5, 3, 4],
					selectionIndizes: [0, 1],
					insertionIndex: 2,
					insertionValue: 1
				},
				{
					data: [1, 2, 5, 3, 4],
					selectionIndizes: [2, 3],
					insertionIndex: 3,
					insertionValue: 3
				},
				{
					data: [1, 2, 3, 5, 4],
					selectionIndizes: [2, 3],
					insertionIndex: 3,
					insertionValue: 3
				},
				{
					data: [1, 2, 3, 5, 4],
					selectionIndizes: [3, 4],
					insertionIndex: 4,
					insertionValue: 4
				},
				{
					data: [1, 2, 3, 4, 5],
					selectionIndizes: [3, 4],
					insertionIndex: 4,
					insertionValue: 4
				},
				{
					data: [1, 2, 3, 4, 5],
					selectionIndizes: [],
					insertionIndex: 1,
					insertionValue: 4
				},
			];
			const insertionsort = new InsertionSort([...expectedGenerations[0].data]);
			insertionsort.finishScript();
			expect(insertionsort.getGenerations()).toStrictEqual(expectedGenerations);

			const previousGenerations = 5;

			for (let i = previousGenerations; i > 0; i--) {
				insertionsort.prevGeneration();
			}
	
				
			insertionsort.finishScript();
			expect(insertionsort.getGenerations()).toStrictEqual(expectedGenerations);
		});
	});
});