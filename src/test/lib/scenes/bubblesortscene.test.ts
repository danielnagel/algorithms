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

	it('should set state.algorithmType to "bubblesort"', () => {
		const scene = new BubbleSortScene(canvas, ctx, options);
		expect(scene.state.algorithmType).toBe('bubblesort');
	});
});