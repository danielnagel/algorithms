import {
	describe, expect, test 
} from 'vitest';
import {
	SortScript 
} from '../../../lib/scritps/sortscript';

describe('SortScript Script', () => {

	describe('test init script', () => {
		test('throw error when there is no data', () => {
			const sortscript = new SortScript([]);
			expect(() => sortscript.initScript()).toThrowError('no data available');
		});
	});

	describe('test next generation', () => {
		test('throw error when there is no data', () => {
			const sortscript = new SortScript([]);
			expect(() => sortscript.nextGeneration()).toThrowError('no data available');
		});
		
	});
	
	describe('test previous generation', () => {
		test('throw error, when there is no data', () => {
			const sortscript = new SortScript([]);
			expect(() => sortscript.prevGeneration()).toThrowError('no data');
		});
	});
	describe('test finish script', () => {
		test('throw error when there is no data', () => {
			const sortscript = new SortScript([]);
			expect(() => sortscript.finishScript()).toThrowError('no data available');
		});
	});
	describe('test is equal generation', () => {
		test('two empty generations are the same', () => {
			const sortscript = new SortScript([]);
			const a: Generation = {
				data: [],
				selectionIndizes: []
			};
			const b: Generation = {
				data: [],
				selectionIndizes: []
			};
			expect(sortscript.isEqualGeneration(a, b)).toBeTruthy();
		});
		test('two generations are the same', () => {
			const sortscript = new SortScript([]);
			const a: Generation = {
				data: [1, 2, 3],
				selectionIndizes: [0, 1]
			};
			const b: Generation = {
				data: [1, 2, 3],
				selectionIndizes: [0, 1]
			};
			expect(sortscript.isEqualGeneration(a, b)).toBeTruthy();
		});
		test('two generations, different selection indizes length', () => {
			const sortscript = new SortScript([]);
			const a: Generation = {
				data: [1, 2, 3],
				selectionIndizes: [0, 1]
			};
			const b: Generation = {
				data: [1, 2, 3],
				selectionIndizes: [0]
			};
			expect(sortscript.isEqualGeneration(a, b)).toBeFalsy();
		});
		test('two generations, different selection indizes', () => {
			const sortscript = new SortScript([]);
			const a: Generation = {
				data: [1, 2, 3],
				selectionIndizes: [0, 1]
			};
			const b: Generation = {
				data: [1, 2, 3],
				selectionIndizes: [1, 2]
			};
			expect(sortscript.isEqualGeneration(a, b)).toBeFalsy();
		});
		test('two generations, different data length', () => {
			const sortscript = new SortScript([]);
			const a: Generation = {
				data: [1, 2, 3],
				selectionIndizes: [0, 1]
			};
			const b: Generation = {
				data: [1, 2],
				selectionIndizes: [0, 1]
			};
			expect(sortscript.isEqualGeneration(a, b)).toBeFalsy();
		});
		test('two generations, different data', () => {
			const sortscript = new SortScript([]);
			const a: Generation = {
				data: [1, 3, 2],
				selectionIndizes: [1, 2]
			};
			const b: Generation = {
				data: [1, 2, 3],
				selectionIndizes: [1, 2]
			};
			expect(sortscript.isEqualGeneration(a, b)).toBeFalsy();
		});
	});
});