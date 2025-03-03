import {
	describe, expect, test
} from 'vitest';
import {
	ShellSort
} from '../../../lib/scritps/shellsort';

describe('ShellSort Script', () => {
	describe('test sort data', () => {
		test('generate all generations', () => {
			const expectedGenerations: Generation[] = [
				{
					data: [4, 7, 6, 8, 3, 2, 5, 1],
					selectionIndizes: [],
				},
				{
					data: [1, 2, 3, 4, 5, 6, 7, 8],
					selectionIndizes: [],
				}
			];
			const shellsort = new ShellSort([...expectedGenerations[0].data]);
			expect(shellsort.getData()).toStrictEqual(expectedGenerations[0].data);
			expect(shellsort.getSelectionIndizes()).toHaveLength(0);
			expect(shellsort.getGenerations()).toHaveLength(0);
			// TODO: test sort data
		});
	});
});