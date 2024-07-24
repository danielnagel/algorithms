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

			expect(bubblesort.nextGeneration()).toStrictEqual({data: sortedSampleData, selectionIndizes: []});

			expect(bubblesort.getData()).toStrictEqual(sortedSampleData);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(0);
			expect(bubblesort.getGenerations()).toHaveLength(0);
		})
		test('sort data at specified index', () => {
			const bubblesort = new BubbleSort([...sampleData]);
			expect(bubblesort.getData()).toStrictEqual(sampleData);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(0);
			expect(bubblesort.getGenerations()).toHaveLength(0);

			bubblesort.setSelectionIndizes([1,2]);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(2);

			const expectedData = [2, 1, 5, 3, 4];
			expect(bubblesort.nextGeneration()).toStrictEqual({data: expectedData, selectionIndizes: [1,2]});

			expect(bubblesort.getData()).toStrictEqual(expectedData);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(2);
			expect(bubblesort.getGenerations()).toHaveLength(1);
		})
		test('update selection indizes, when data is sorted at specified index', () => {
			const bubblesort = new BubbleSort([...sampleData]);
			expect(bubblesort.getData()).toStrictEqual(sampleData);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(0);
			expect(bubblesort.getGenerations()).toHaveLength(0);

			bubblesort.setSelectionIndizes([0,1]);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(2);

			expect(bubblesort.nextGeneration()).toStrictEqual({data: sampleData, selectionIndizes: [1,2]});

			expect(bubblesort.getData()).toStrictEqual(sampleData);
			expect(bubblesort.getSelectionIndizes()).toHaveLength(2);
			expect(bubblesort.getGenerations()).toHaveLength(1);
		})
	});
	test('return data', () => {
		const bubblesort = new BubbleSort(sampleData);
		expect(bubblesort.getData()).toStrictEqual(sampleData);
	});
});