import {
	describe, expect, test 
} from 'vitest';
import {
	SortScript 
} from '../../../lib/scritps/sortscript';

describe('SortScript Script', () => {
	describe('test sort data', () => {
		test('throw error when there is no data', () => {
			const sortscript = new SortScript([]);
			expect(() => sortscript.sortData()).toThrowError('no data available');
		});
	});
});