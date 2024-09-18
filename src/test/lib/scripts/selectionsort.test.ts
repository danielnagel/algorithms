import {
	describe, expect, test
} from 'vitest';
import {
	SelectionSort
} from '../../../lib/scritps/selectionsort';

describe('SelectionSort Script', () => {

	const sampleData = [2, 5, 1, 3, 4];
	const sortedSampleData = [1, 2, 3, 4, 5];

	describe('test init script', () => {
		test('first generation', () => {
			const selectionsort = new SelectionSort([...sampleData]);
			expect(selectionsort.getData()).toStrictEqual(sampleData);
			expect(selectionsort.getSelectionIndizes()).toHaveLength(0);
			expect(selectionsort.getGenerations()).toHaveLength(0);

			expect(selectionsort.initScript()).toStrictEqual({
				data: sampleData,
				selectionIndizes: [0, 1],
				insertionIndex: 0,
				minIndex: 0,
				switchAnimationStep: 0
			});

			expect(selectionsort.getSelectionIndizes()).toHaveLength(2);
			expect(selectionsort.getSelectionIndizes()).toStrictEqual([0, 1]);
			expect(selectionsort.getGenerations()).toHaveLength(1);
		});
	});

	describe('test next generation', () => {
		test('sort as expected until finished', () => {
			const expectedGenerations: SelectionSortGeneration[] = [
				{
					data: [2, 5, 1, 3, 4],
					selectionIndizes: [0, 1],
					insertionIndex: 0,
					minIndex: 0,
					switchAnimationStep: 0
				},
				{
					data: [2, 5, 1, 3, 4],
					selectionIndizes: [0, 1],
					insertionIndex: 0,
					minIndex: 0,
					switchAnimationStep: 0
				},
				{
					data: [2, 5, 1, 3, 4],
					selectionIndizes: [0, 2],
					insertionIndex: 0,
					minIndex: 0,
					switchAnimationStep: 0
				},
				{
					data: [2, 5, 1, 3, 4],
					selectionIndizes: [2, 3],
					insertionIndex: 0,
					minIndex: 2,
					switchAnimationStep: 0
				},
				{
					data: [2, 5, 1, 3, 4],
					selectionIndizes: [2, 4],
					insertionIndex: 0,
					minIndex: 2,
					switchAnimationStep: 0
				},
				{
					data: [2, 5, 1, 3, 4],
					selectionIndizes: [0, 2],
					insertionIndex: 0,
					minIndex: 2,
					switchAnimationStep: 1
				},
				{
					data: [1, 5, 2, 3, 4],
					selectionIndizes: [0, 2],
					insertionIndex: 1,
					minIndex: 1,
					switchAnimationStep: 2
				},
				{
					data: [1, 5, 2, 3, 4],
					selectionIndizes: [1, 2],
					insertionIndex: 1,
					minIndex: 1,
					switchAnimationStep: 0
				},
				{
					data: [1, 5, 2, 3, 4],
					selectionIndizes: [2, 3],
					insertionIndex: 1,
					minIndex: 2,
					switchAnimationStep: 0
				},
				{
					data: [1, 5, 2, 3, 4],
					selectionIndizes: [2, 4],
					insertionIndex: 1,
					minIndex: 2,
					switchAnimationStep: 0
				},
				{
					data: [1, 5, 2, 3, 4],
					selectionIndizes: [1, 2],
					insertionIndex: 1,
					minIndex: 2,
					switchAnimationStep: 1
				},
				{
					data: [1, 2, 5, 3, 4],
					selectionIndizes: [1, 2],
					insertionIndex: 2,
					minIndex: 2,
					switchAnimationStep: 2
				},
				{
					data: [1, 2, 5, 3, 4],
					selectionIndizes: [2, 3],
					insertionIndex: 2,
					minIndex: 2,
					switchAnimationStep: 0
				},
				{
					data: [1, 2, 5, 3, 4],
					selectionIndizes: [3, 4],
					insertionIndex: 2,
					minIndex: 3,
					switchAnimationStep: 0
				},
				{
					data: [1, 2, 5, 3, 4],
					selectionIndizes: [2, 3],
					insertionIndex: 2,
					minIndex: 3,
					switchAnimationStep: 1
				},
				{
					data: [1, 2, 3, 5, 4],
					selectionIndizes: [2, 3],
					insertionIndex: 3,
					minIndex: 3,
					switchAnimationStep: 2
				},
				{
					data: [1, 2, 3, 5, 4],
					selectionIndizes: [3, 4],
					insertionIndex: 3,
					minIndex: 3,
					switchAnimationStep: 0
				},
				{
					data: [1, 2, 3, 5, 4],
					selectionIndizes: [3, 4],
					insertionIndex: 3,
					minIndex: 4,
					switchAnimationStep: 1
				},
				{
					data: [1, 2, 3, 4, 5],
					selectionIndizes: [3, 4],
					insertionIndex: 4,
					minIndex: 4,
					switchAnimationStep: 2
				},
			];
			const selectionsort = new SelectionSort([...expectedGenerations[0].data]);
			// initScript always creates a generation, so the first generation needs to be skipped
			for (let i = 1; i < expectedGenerations.length; i++) {
				const expectedGeneration = expectedGenerations[i];
				expect(selectionsort.nextGeneration()).toStrictEqual(expectedGeneration);
				const { data, selectionIndizes } = expectedGeneration;
				expect(selectionsort.getData()).toStrictEqual(data);
				expect(selectionsort.getSelectionIndizes()).toStrictEqual(selectionIndizes);
				// initScript always creates a generation, so the first generation needs to be skipped
				expect(selectionsort.getGenerations()).toHaveLength(i + 1);
			}
			expect(selectionsort.getGenerations()).toStrictEqual(expectedGenerations);


			expect(selectionsort.nextGeneration()).toStrictEqual(
				{
					data: [1, 2, 3, 4, 5],
					selectionIndizes: [],
					insertionIndex: 0,
					minIndex: 0,
					switchAnimationStep: 0
				});
		});
	});
	describe('test sort algorithm', () => {
		test('throw error when there is no selection', () => {
			const selectionsort = new SelectionSort([]);
			expect(() => selectionsort.sortAlgorithm()).toThrowError('two selection indizes');
		});
	});
	describe('test previous generation', () => {
		test('reset script, when there are no generations', () => {
			const selectionsort = new SelectionSort([...sampleData]);
			expect(selectionsort.getData()).toStrictEqual(sampleData);
			expect(selectionsort.getSelectionIndizes()).toHaveLength(0);
			expect(selectionsort.getGenerations()).toHaveLength(0);
			expect(selectionsort.prevGeneration()).toStrictEqual({
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
			const selectionsort = new SelectionSort([...expectedGenerations[expectedGenerations.length - 1].data]);
			expect(selectionsort.getSelectionIndizes()).toHaveLength(0);
			selectionsort.setGenerations([...expectedGenerations]);
			expect(selectionsort.getGenerations()).toHaveLength(expectedGenerations.length);
			expect(selectionsort.getData()).toStrictEqual(expectedGenerations[expectedGenerations.length - 1].data);

			for (let i = expectedGenerations.length - 1; i > 0; i--) {
				const expectedGeneration = expectedGenerations[i - 1];
				expect(selectionsort.prevGeneration()).toStrictEqual(expectedGeneration);
				const { data, selectionIndizes } = expectedGeneration;
				expect(selectionsort.getData()).toStrictEqual(data);
				expect(selectionsort.getSelectionIndizes()).toStrictEqual(selectionIndizes);
				expect(selectionsort.getGenerations()).toHaveLength(i);
			}
			expect(selectionsort.getGenerations()).toHaveLength(1);
			const expectedGeneration = expectedGenerations[0];
			expect(selectionsort.prevGeneration()).toStrictEqual(expectedGeneration);
			const { data, selectionIndizes } = expectedGeneration;
			expect(selectionsort.getData()).toStrictEqual(data);
			expect(selectionsort.getSelectionIndizes()).toStrictEqual(selectionIndizes);
			expect(selectionsort.getGenerations()).toHaveLength(0);

			// remove selection indizes, when there are no more generations left
			expect(selectionsort.prevGeneration()).toStrictEqual({
				data,
				selectionIndizes: []
			});
			expect(selectionsort.getData()).toStrictEqual(data);
			expect(selectionsort.getSelectionIndizes()).toStrictEqual([]);
			expect(selectionsort.getGenerations()).toHaveLength(0);
		});
	});
	describe('test reset script', () => {
		test('reset, when there are no generations', () => {
			const selectionsort = new SelectionSort([...sampleData]);
			expect(selectionsort.getData()).toStrictEqual(sampleData);
			expect(selectionsort.getSelectionIndizes()).toHaveLength(0);
			expect(selectionsort.getGenerations()).toHaveLength(0);

			expect(selectionsort.resetScript()).toStrictEqual({
				data: sampleData,
				selectionIndizes: []
			});

			expect(selectionsort.getSelectionIndizes()).toHaveLength(0);
			expect(selectionsort.getGenerations()).toHaveLength(0);
		});
		test('reset, when there are no generations, new data', () => {
			const selectionsort = new SelectionSort([]);
			expect(selectionsort.getData()).toHaveLength(0);
			expect(selectionsort.getSelectionIndizes()).toHaveLength(0);
			expect(selectionsort.getGenerations()).toHaveLength(0);

			expect(selectionsort.resetScript([...sampleData])).toStrictEqual({
				data: sampleData,
				selectionIndizes: []
			});

			expect(selectionsort.getSelectionIndizes()).toHaveLength(0);
			expect(selectionsort.getGenerations()).toHaveLength(0);
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
			const selectionsort = new SelectionSort([...expectedGenerations[expectedGenerations.length - 1].data]);
			selectionsort.setSelectionIndizes([...expectedGenerations[expectedGenerations.length - 1].selectionIndizes]);
			selectionsort.setGenerations([...expectedGenerations]);
			expect(selectionsort.getGenerations()).toHaveLength(expectedGenerations.length);
			expect(selectionsort.getData()).toStrictEqual(expectedGenerations[expectedGenerations.length - 1].data);
			expect(selectionsort.getSelectionIndizes()).toStrictEqual(expectedGenerations[expectedGenerations.length - 1].selectionIndizes);

			expect(selectionsort.resetScript()).toStrictEqual({
				data: expectedGenerations[0].data,
				selectionIndizes: []
			});
			expect(selectionsort.getGenerations()).toHaveLength(0);
			expect(selectionsort.getData()).toStrictEqual(expectedGenerations[0].data);
			expect(selectionsort.getSelectionIndizes()).toHaveLength(0);
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
			const selectionsort = new SelectionSort([...expectedGenerations[expectedGenerations.length - 1].data]);
			selectionsort.setSelectionIndizes([...expectedGenerations[expectedGenerations.length - 1].selectionIndizes]);
			selectionsort.setGenerations([...expectedGenerations]);
			expect(selectionsort.getGenerations()).toHaveLength(expectedGenerations.length);
			expect(selectionsort.getData()).toStrictEqual(expectedGenerations[expectedGenerations.length - 1].data);
			expect(selectionsort.getSelectionIndizes()).toStrictEqual(expectedGenerations[expectedGenerations.length - 1].selectionIndizes);

			expect(selectionsort.resetScript([...sortedSampleData])).toStrictEqual({
				data: sortedSampleData,
				selectionIndizes: []
			});
			expect(selectionsort.getGenerations()).toHaveLength(0);
			expect(selectionsort.getData()).toStrictEqual(sortedSampleData);
			expect(selectionsort.getSelectionIndizes()).toHaveLength(0);
		});
	});
	
});