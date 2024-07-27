import {
	describe, expect, test 
} from 'vitest';
import {
	BubbleSort 
} from '../../../lib/scritps/bubblesort';

describe('BubbleSort Script', () => {

	const sampleData = [2, 5, 1, 3, 4];
	const sortedSampleData = [1, 2, 3, 4, 5];

	describe('test init script', () => {
		test('throw error when there is no data', () => {
			const bubblesort = new BubbleSort([]);
			expect(() => bubblesort.initScript()).toThrowError('no data available');
		});
		test('first generation', () => {
			const bubblesort = new BubbleSort([...sampleData]);
			expect(bubblesort.getData()).toStrictEqual(sampleData);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(0);
			expect(bubblesort.getGenerations()).toHaveLength(0);

			expect(bubblesort.initScript()).toStrictEqual({
				data: sampleData,
				selectionIndizes: [0, 1]
			});

			expect(bubblesort.getSelectionIndizes()).toHaveLength(2);
			expect(bubblesort.getSelectionIndizes()).toStrictEqual([0, 1]);
			expect(bubblesort.getGenerations()).toHaveLength(1);
		});
	});

	describe('test next generation', () => {
		test('throw error when there is no data', () => {
			const bubblesort = new BubbleSort([]);
			expect(() => bubblesort.nextGeneration()).toThrowError('no data available');
		});
		test('data is sorted and there is no selection indizes, do nothing', () => {
			const bubblesort = new BubbleSort([...sortedSampleData]);
			expect(bubblesort.getData()).toStrictEqual(sortedSampleData);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(0);
			expect(bubblesort.getGenerations()).toHaveLength(0);

			expect(bubblesort.nextGeneration()).toStrictEqual({
				data: sortedSampleData,
				selectionIndizes: []
			});

			expect(bubblesort.getData()).toStrictEqual(sortedSampleData);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(0);
			expect(bubblesort.getGenerations()).toHaveLength(0);
		});
		test('sort data at specified index', () => {
			const bubblesort = new BubbleSort([...sampleData]);
			expect(bubblesort.getData()).toStrictEqual(sampleData);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(0);
			expect(bubblesort.getGenerations()).toHaveLength(0);

			bubblesort.setSelectionIndizes([1,2]);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(2);

			const expectedData = [2, 1, 5, 3, 4];
			expect(bubblesort.nextGeneration()).toStrictEqual({
				data: expectedData,
				selectionIndizes: [1,2]
			});

			expect(bubblesort.getData()).toStrictEqual(expectedData);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(2);
			expect(bubblesort.getGenerations()).toHaveLength(1);
		});
		test('update selection indizes, when data is sorted at specified index', () => {
			const bubblesort = new BubbleSort([...sampleData]);
			expect(bubblesort.getData()).toStrictEqual(sampleData);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(0);
			expect(bubblesort.getGenerations()).toHaveLength(0);

			bubblesort.setSelectionIndizes([0,1]);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(2);

			expect(bubblesort.nextGeneration()).toStrictEqual({
				data: sampleData,
				selectionIndizes: [1,2]
			});

			expect(bubblesort.getData()).toStrictEqual(sampleData);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(2);
			expect(bubblesort.getGenerations()).toHaveLength(1);
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
			const bubblesort = new BubbleSort([...expectedGenerations[0].data]);
			bubblesort.initScript();
			expect(bubblesort.getSelectionIndizes()).toHaveLength(2);
			expect(bubblesort.getSelectionIndizes()).toStrictEqual([0, 1]);
			expect(bubblesort.getGenerations()).toHaveLength(1);
			expect(bubblesort.getGenerations()[0]).toStrictEqual(expectedGenerations[0]);

			for (let i = 1; i < expectedGenerations.length; i++) {
				const expectedGeneration = expectedGenerations[i];
				expect(bubblesort.nextGeneration()).toStrictEqual(expectedGeneration);
				const {data, selectionIndizes} = expectedGeneration;
				expect(bubblesort.getData()).toStrictEqual(data);
				expect(bubblesort.getSelectionIndizes()).toStrictEqual(selectionIndizes);
				expect(bubblesort.getGenerations()).toHaveLength(i+1);
			}
		});
	});
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
		test('remove selection when sorted and selection is at the end of data', () => {
			const bubblesort = new BubbleSort([...sortedSampleData]);
			bubblesort.setSelectionIndizes([3, 4]);
			bubblesort.sortAlgorithm();
			expect(bubblesort.getData()).toStrictEqual(sortedSampleData);
			expect(bubblesort.getSelectionIndizes()).toStrictEqual([]);
		});
		test('set selection to the beginning, when the data is not sorted and the selection is at the end of data', () => {
			const bubblesort = new BubbleSort([...sampleData]);
			bubblesort.setSelectionIndizes([3, 4]);
			bubblesort.sortAlgorithm();
			expect(bubblesort.getData()).toStrictEqual(sampleData);
			expect(bubblesort.getSelectionIndizes()).toStrictEqual([0, 1]);
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
	describe('test previous generation', () => {
		test('reset script, when there are no generations', () => {
			const bubblesort = new BubbleSort([...sampleData]);
			expect(bubblesort.getData()).toStrictEqual(sampleData);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(0);
			expect(bubblesort.getGenerations()).toHaveLength(0);
			expect(bubblesort.prevGeneration()).toStrictEqual({
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
				// TODO: this needs to be skipped
				{
					data: [1, 2, 3, 4, 5],
					selectionIndizes: []
				},
			];
			const bubblesort = new BubbleSort([...expectedGenerations[expectedGenerations.length - 1].data]);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(0);
			bubblesort.setGenerations(expectedGenerations);
			expect(bubblesort.getGenerations()).toHaveLength(expectedGenerations.length);
			expect(bubblesort.getData()).toStrictEqual(expectedGenerations[expectedGenerations.length - 1].data);

			for (let i = expectedGenerations.length - 1; i > 0; i--) {
				const expectedGeneration = expectedGenerations[i];
				expect(bubblesort.prevGeneration()).toStrictEqual(expectedGeneration);
				const {data, selectionIndizes} = expectedGeneration;
				expect(bubblesort.getData()).toStrictEqual(data);
				expect(bubblesort.getSelectionIndizes()).toStrictEqual(selectionIndizes);
				expect(bubblesort.getGenerations()).toHaveLength(i);
			}
			expect(bubblesort.getGenerations()).toHaveLength(1);
			const expectedGeneration = expectedGenerations[0];
			expect(bubblesort.prevGeneration()).toStrictEqual(expectedGeneration);
			const {data, selectionIndizes} = expectedGeneration;
			expect(bubblesort.getData()).toStrictEqual(data);
			expect(bubblesort.getSelectionIndizes()).toStrictEqual(selectionIndizes);
			expect(bubblesort.getGenerations()).toHaveLength(0);

			// remove selection indizes, when there are no more generations left
			expect(bubblesort.prevGeneration()).toStrictEqual({
				data,
				selectionIndizes: []
			});
			expect(bubblesort.getData()).toStrictEqual(data);
			expect(bubblesort.getSelectionIndizes()).toStrictEqual([]);
			expect(bubblesort.getGenerations()).toHaveLength(0);
		});
	});
	describe('test reset script', () => {
		test('throw error when there is no data', () => {
			const bubblesort = new BubbleSort([]);
			expect(() => bubblesort.resetScript()).toThrowError('no data available');
		});
		test('reset, when there are no generations', () => {
			const bubblesort = new BubbleSort([...sampleData]);
			expect(bubblesort.getData()).toStrictEqual(sampleData);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(0);
			expect(bubblesort.getGenerations()).toHaveLength(0);

			expect(bubblesort.resetScript()).toStrictEqual({
				data: sampleData,
				selectionIndizes: []
			});

			expect(bubblesort.getSelectionIndizes()).toHaveLength(0);
			expect(bubblesort.getGenerations()).toHaveLength(0);
		});
		test('reset, when there are no generations, new data', () => {
			const bubblesort = new BubbleSort([]);
			expect(bubblesort.getData()).toHaveLength(0);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(0);
			expect(bubblesort.getGenerations()).toHaveLength(0);

			expect(bubblesort.resetScript([...sampleData])).toStrictEqual({
				data: sampleData,
				selectionIndizes: []
			});

			expect(bubblesort.getSelectionIndizes()).toHaveLength(0);
			expect(bubblesort.getGenerations()).toHaveLength(0);
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
			const bubblesort = new BubbleSort([...expectedGenerations[expectedGenerations.length - 1].data]);
			bubblesort.setSelectionIndizes([...expectedGenerations[expectedGenerations.length - 1].selectionIndizes]);
			bubblesort.setGenerations([...expectedGenerations]);
			expect(bubblesort.getGenerations()).toHaveLength(expectedGenerations.length);
			expect(bubblesort.getData()).toStrictEqual(expectedGenerations[expectedGenerations.length - 1].data);
			expect(bubblesort.getSelectionIndizes()).toStrictEqual(expectedGenerations[expectedGenerations.length - 1].selectionIndizes);

			expect(bubblesort.resetScript()).toStrictEqual({
				data: expectedGenerations[0].data,
				selectionIndizes: []
			});
			expect(bubblesort.getGenerations()).toHaveLength(0);
			expect(bubblesort.getData()).toStrictEqual(expectedGenerations[0].data);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(0);
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
			const bubblesort = new BubbleSort([...expectedGenerations[expectedGenerations.length - 1].data]);
			bubblesort.setSelectionIndizes([...expectedGenerations[expectedGenerations.length - 1].selectionIndizes]);
			bubblesort.setGenerations([...expectedGenerations]);
			expect(bubblesort.getGenerations()).toHaveLength(expectedGenerations.length);
			expect(bubblesort.getData()).toStrictEqual(expectedGenerations[expectedGenerations.length - 1].data);
			expect(bubblesort.getSelectionIndizes()).toStrictEqual(expectedGenerations[expectedGenerations.length - 1].selectionIndizes);

			expect(bubblesort.resetScript([...sortedSampleData])).toStrictEqual({
				data: sortedSampleData,
				selectionIndizes: []
			});
			expect(bubblesort.getGenerations()).toHaveLength(0);
			expect(bubblesort.getData()).toStrictEqual(sortedSampleData);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(0);
		});
	});
	describe('test finish script', () => {
		test('throw error when there is no data', () => {
			const bubblesort = new BubbleSort([]);
			expect(() => bubblesort.finishScript()).toThrowError('no data available');
		});
		test('generate all generations', () => {
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
			const bubblesort = new BubbleSort([...expectedGenerations[0].data]);
			expect(bubblesort.getData()).toStrictEqual(expectedGenerations[0].data);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(0);
			expect(bubblesort.getGenerations()).toHaveLength(0);

			expect(bubblesort.finishScript()).toStrictEqual(expectedGenerations[expectedGenerations.length -1]);
			expect(bubblesort.getData()).toStrictEqual(expectedGenerations[expectedGenerations.length -1].data);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(0);
			expect(bubblesort.getGenerations()).toHaveLength(expectedGenerations.length);
		});
	});
});