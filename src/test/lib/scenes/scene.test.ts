import {
	describe, expect, test 
} from 'vitest';
import {
	Scene
} from '../../../lib/scenes';

describe('Scene', () => {
	const defaultState = {
		canvas: {
			width:500
		},
		ctx: {
		},
		algorithmType: '',
		generations: [],
		index: 0,
		lastTimestamp: 0,
		frameDelay: 500,
		swapping: false,
		isRunning: false,
		isStep: false,
		colorTheme: {
			primary: '#101010',
			primaryLight: '#202020',
			primaryLighter: '#303030',
			secondary: '#dadada',
			accent: '#6e90ff',
			accentSecondary: '#e55'
		}
	};
	const generations: AnimationGeneration<Generation>[] = [{
		state: 'update-selection',
		data:  [2, 1, 3],
		selectionIndizes: [],
	},{
		state: 'update-selection',
		data:  [2, 1, 3],
		selectionIndizes: [0,1],
	},{
		state: 'swap-selection',
		data:  [1, 2, 3],
		selectionIndizes: [0,1],
	},{
		state: 'update-selection',
		data:  [1, 2, 3],
		selectionIndizes: [1,2],
	},{
		state: 'update-selection',
		data:  [1, 2, 3],
		selectionIndizes: [],
	}];
	describe('scene methods', () => {
		test('loopState', () => {
			const scene = new Scene(defaultState.canvas as HTMLCanvasElement, defaultState.ctx as CanvasRenderingContext2D, {} as AlgorithmCanvasOptions);
			expect(scene.state).toStrictEqual(defaultState);
			scene.state.generations = generations;
			expect(scene.loopState()).toBeTruthy();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations,
				index: 1,
				isBackwards: false,
				isRunning: true
			});
			scene.update();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations,
				index: 2,
				isBackwards: false,
				swapping: false,
				isStep: false,
				isRunning: true,
			});
			expect(scene.isIndexAtEnd()).toBeFalsy();
		});
		test('skipBackState', () => {
			const scene = new Scene(defaultState.canvas as HTMLCanvasElement, defaultState.ctx as CanvasRenderingContext2D, {} as AlgorithmCanvasOptions);
			expect(scene.state).toStrictEqual(defaultState);
			scene.state.generations = generations;
			scene.update();
			scene.update();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations: scene.state.generations,
				index: 2,
			});
			scene.skipBackState();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations,
				index: 0,
				isBackwards: true,
				swapping: false,
				isStep: true,
				isRunning: true,
				swapSpeed: undefined
			});
			expect(scene.isIndexAtEnd()).toBeFalsy();
			scene.update();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations,
				index: 1,
				isBackwards: true,
				swapping: false,
				isStep: true,
				isRunning: true,
				swapSpeed: undefined
			});
			expect(scene.isIndexAtEnd()).toBeFalsy();
		});
		test('skipForwardState', () => {
			const scene = new Scene(defaultState.canvas as HTMLCanvasElement, defaultState.ctx as CanvasRenderingContext2D, {} as AlgorithmCanvasOptions);
			expect(scene.state).toStrictEqual(defaultState);
			scene.state.generations = generations;
			scene.update();
			scene.update();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations: scene.state.generations,
				index: 2,
			});
			scene.skipForwardState();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations,
				index: 4,
				isBackwards: false,
				swapping: false,
				isStep: true,
				isRunning: true,
				swapSpeed: undefined
			});
			expect(scene.isIndexAtEnd()).toBeFalsy();
			scene.update();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations,
				index: 5,
				isBackwards: false,
				swapping: false,
				isStep: true,
				isRunning: true,
				swapSpeed: undefined
			});
			expect(scene.isIndexAtEnd()).toBeTruthy();
		});
		test('stepBackState and then loop', () => {
			const scene = new Scene(defaultState.canvas as HTMLCanvasElement, defaultState.ctx as CanvasRenderingContext2D, {} as AlgorithmCanvasOptions);
			expect(scene.state).toStrictEqual(defaultState);
			scene.state.generations = generations;
			scene.skipForwardState();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations,
				index: 4,
				isBackwards: false,
				swapping: false,
				isStep: true,
				isRunning: true,
				swapSpeed: undefined
			});
			scene.update();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations,
				index: 5,
				isBackwards: false,
				swapping: false,
				isStep: true,
				isRunning: true,
				swapSpeed: undefined
			});
			expect(scene.isIndexAtEnd()).toBeTruthy();
			scene.stepBackState();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations,
				index: 3,
				isBackwards: true,
				swapping: false,
				isStep: true,
				isRunning: true,
				swapSpeed: undefined
			});
			expect(scene.isIndexAtEnd()).toBeFalsy();
			scene.update();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations: scene.state.generations,
				index: 4,
				swapping: false,
				swapSpeed: undefined,
				isBackwards: true,
				isRunning: true,
				isStep: true
			});
			expect(scene.isIndexAtEnd()).toBeFalsy();
			scene.loopState();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations,
				index: 6,
				isBackwards: false,
				swapping: false,
				isStep: false,
				isRunning: false,
				swapSpeed: undefined
			});
			expect(scene.isIndexAtEnd()).toBeTruthy();
		});
		test('stepForwardState', () => {
			const scene = new Scene(defaultState.canvas as HTMLCanvasElement, defaultState.ctx as CanvasRenderingContext2D, {} as AlgorithmCanvasOptions);
			expect(scene.state).toStrictEqual(defaultState);
			scene.state.generations = generations;
			scene.stepForwardState();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations: scene.state.generations,
				index: 1,
				isBackwards: false,
				swapping: false,
				isStep: true,
				isRunning: true,
			});
			expect(scene.isIndexAtEnd()).toBeFalsy();
			scene.update();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations: scene.state.generations,
				index: 2,
				isBackwards: false,
				swapping: false,
				isStep: true,
				isRunning: true,
			});
			expect(scene.isIndexAtEnd()).toBeFalsy();
		});
		test('setAnimationSpeed', () => {
			const scene = new Scene(defaultState.canvas as HTMLCanvasElement, defaultState.ctx as CanvasRenderingContext2D, {} as AlgorithmCanvasOptions);
			scene.setAnimationSpeed(500);
			expect(scene.state).toStrictEqual({
				...defaultState,
				frameDelay: 1500
			});
		});
		test('shouldDrawScene', () => {
			const scene = new Scene(defaultState.canvas as HTMLCanvasElement, defaultState.ctx as CanvasRenderingContext2D, {} as AlgorithmCanvasOptions);
			scene.state.generations = generations;
			expect(scene.shouldDrawScene(0)).toBeFalsy();
			scene.state.isRunning = true;
			expect(scene.shouldDrawScene(0)).toBeFalsy();
			expect(scene.shouldDrawScene(500)).toBeTruthy();
			scene.state.swapping = true;
			expect(scene.shouldDrawScene(0)).toBeTruthy();
		});
	});
});