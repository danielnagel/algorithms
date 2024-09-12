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
});