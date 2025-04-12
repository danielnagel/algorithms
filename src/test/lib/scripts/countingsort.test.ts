import {
	describe, expect, test 
} from 'vitest';
import {
	CountingSort 
} from '../../../lib/scritps/countingsort';
import {
	generateRandomNumberArray, isSorted 
} from '../../../lib/utils';

describe.skip('CountingSort Script', () => {

	const sampleData = [2, 5, 1, 3, 4];

	describe('test sort algorithm', () => {
		test('throw error when there is no selection', () => {
			const countingsort = new CountingSort([]);
			expect(() => countingsort.sortAlgorithm()).toThrowError('two selection indizes');
		});
		test('throw error when the selection indizes is bigger than the available data', () => {
			const countingsort = new CountingSort([]);
			countingsort.setSelectionIndizes([0, 1]);
			expect(() => countingsort.sortAlgorithm()).toThrowError('index exceeds data');
		});
		test('update selection, when current indizes are sorted', () => {
			const countingsort = new CountingSort([...sampleData]);
			countingsort.setSelectionIndizes([0, 1]);
			countingsort.sortAlgorithm();
			expect(countingsort.getData()).toStrictEqual(sampleData);
			expect(countingsort.getSelectionIndizes()).toStrictEqual([1, 2]);
		});
		test('update data, when current indizes are not sorted', () => {
			const countingsort = new CountingSort([...sampleData]);
			countingsort.setSelectionIndizes([1, 2]);
			countingsort.sortAlgorithm();
			expect(countingsort.getData()).toStrictEqual([2, 1, 5, 3, 4]);
			expect(countingsort.getSelectionIndizes()).toStrictEqual([1, 2]);
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
					data:[1,2,3,4,5],
					selectionIndizes:[],
				}];
			const countingsort = new CountingSort([...expectedGenerations[0].data]);
			expect(countingsort.getData()).toStrictEqual(expectedGenerations[0].data);
			expect(countingsort.getSelectionIndizes()).toHaveLength(0);
			expect(countingsort.getGenerations()).toHaveLength(0);
			expect(countingsort.sortData()).toStrictEqual(expectedGenerations);
			expect(countingsort.getData()).toStrictEqual(expectedGenerations[expectedGenerations.length -1].data);
			expect(countingsort.getSelectionIndizes()).toHaveLength(0);
		});
	});
	describe('test add state to generations', () => {
		test('generate all generations', () => {
			const expectedGenerations: NewGeneration[] = [
				{
					data:[5,4,3,2,1],
					selectionIndizes:[],
					state: 'update-selection'
				},
				
				{
					data:[1,2,3,4,5],
					selectionIndizes:[],
					state: 'update-selection'
				}];
			const countingsort = new CountingSort([...expectedGenerations[0].data]);
			expect(countingsort.addStateToGenerations(countingsort.sortData())).toStrictEqual(expectedGenerations);
		});
	});
	describe('test sorting random data', () => {
		test('random data set size 35', () => {
			const countingsort = new CountingSort(generateRandomNumberArray(35, 99));
			countingsort.sortData();
			expect(isSorted(countingsort.getGenerations()[countingsort.getGenerations().length-1].data)).toBeTruthy();
		});
		test('random data set size 50', () => {
			const countingsort = new CountingSort(generateRandomNumberArray(50, 99));
			countingsort.sortData();
			expect(isSorted(countingsort.getGenerations()[countingsort.getGenerations().length-1].data)).toBeTruthy();
		});
	});
});