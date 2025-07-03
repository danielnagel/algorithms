import {
	describe, it, expect, vi, beforeEach 
} from 'vitest';
import {
	BubbleSortScene 
} from '../../../lib/scenes/bubblesortscene';
import {
	BubbleSort 
} from '../../../lib/scritps/bubblesort';
import * as utils from '../../../lib/utils';

describe('BubbleSortScene', () => {
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let options: AlgorithmCanvasOptions;

	beforeEach(() => {
		canvas = {} as HTMLCanvasElement;
		ctx = {} as CanvasRenderingContext2D;
		options = { dataSet: [5, 3, 2, 4, 1] } as AlgorithmCanvasOptions;
	});

	it('should create an instance of BubbleSortScene', () => {
		const scene = new BubbleSortScene(canvas, ctx, options);
		expect(scene).toBeInstanceOf(BubbleSortScene);
	});

	it('should initialize script as BubbleSort with provided dataSet', () => {
		const scene = new BubbleSortScene(canvas, ctx, options);
		expect(scene.script).toBeInstanceOf(BubbleSort);
		expect(scene.script.getData()).toEqual([1, 2, 3, 4, 5]);
	});

	it('should initialize script as BubbleSort with random data if no dataSet', () => {
		const spy = vi.spyOn(utils, 'generateRandomNumberArray').mockReturnValue([9, 8, 7]);
		const scene = new BubbleSortScene(canvas, ctx, {} as AlgorithmCanvasOptions);
		expect(scene.script.getData()).toEqual([7, 8, 9]);
		spy.mockRestore();
	});

	it('should use default dataSetSize and max value if not provided', () => {
		const spy = vi.spyOn(utils, 'generateRandomNumberArray');
		new BubbleSortScene(canvas, ctx, {} as AlgorithmCanvasOptions);
		expect(spy).toHaveBeenCalledWith(35, 100);
		spy.mockRestore();
	});

	it('should use provided dataSetSize if given', () => {
		const spy = vi.spyOn(utils, 'generateRandomNumberArray');
		const customOptions = { dataSetSize: 10 } as AlgorithmCanvasOptions;
		new BubbleSortScene(canvas, ctx, customOptions);
		expect(spy).toHaveBeenCalledWith(10, 100);
		spy.mockRestore();
	});

	it('should clone the dataSet array before passing to BubbleSort', () => {
		const dataSet = [10, 20, 30];
		const optionsWithData = { dataSet } as AlgorithmCanvasOptions;
		const scene = new BubbleSortScene(canvas, ctx, optionsWithData);
		expect((scene.script as BubbleSort).getData()).not.toBe(dataSet);
		expect((scene.script as BubbleSort).getData()).toEqual([10, 20, 30].sort((a, b) => a - b));
	});
});