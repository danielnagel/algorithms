import {
	describe, expect, test 
} from 'vitest';
import {
	BarSortScene
} from '../../../lib/scenes';

describe('BarSortScene', () => {
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
	const generations: AnimationGeneration[] = [{
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
		test('udpateSwapAnimation', () => {
			const scene = new BarSortScene(defaultState.canvas as HTMLCanvasElement, defaultState.ctx as CanvasRenderingContext2D);
			expect(scene.state).toStrictEqual(defaultState);
			scene.state.generations = generations;
			scene.state.index = 2;
			const initialB2x = 166.25;
			const swapSpeed = 6;
			for (let i = 0; i < initialB2x; i+=swapSpeed) {
				scene.updateSwapAnimation();
				expect(scene.state).toStrictEqual({
					...defaultState,
					generations: scene.state.generations,
					index: 2,
					swapping: true,
					b1: {
						color: '#e55',
						value: 2,
						x: i,
					},
					b2: {
						color: '#e55',
						value: 1,
						x: initialB2x - i,
					},
					initialB1x: 0,
					initialB2x,
					swapSpeed: 6
				});
			}
			scene.updateSwapAnimation();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations: scene.state.generations,
				index: 2,
				swapping: true,
				b1: {
					color: '#e55',
					value: 2,
					x: 166.25,
				},
				b2: {
					color: '#e55',
					value: 1,
					x: 0,
				},
				initialB1x: 0,
				initialB2x,
				swapSpeed: 6
			});
			scene.updateSwapAnimation();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations: scene.state.generations,
				index: 2,
				swapping: false,
				b1: undefined,
				b2: undefined,
				initialB1x: undefined,
				initialB2x: undefined,
				swapSpeed: undefined
			});
		});
		test('update and isIndexAtEnd', () => {
			const scene = new BarSortScene(defaultState.canvas as HTMLCanvasElement, defaultState.ctx as CanvasRenderingContext2D);
			expect(scene.state).toStrictEqual(defaultState);
			scene.state.generations = generations;
			expect(scene.isIndexAtEnd()).toBeFalsy();
			scene.update();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations: scene.state.generations,
				index: 1,
			});
			expect(scene.isIndexAtEnd()).toBeFalsy();
			scene.update();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations: scene.state.generations,
				index: 2,
			});
			expect(scene.isIndexAtEnd()).toBeFalsy();
			scene.update();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations: scene.state.generations,
				index: 2,
				swapping: true,
				b1: {
					color: '#e55',
					value: 2,
					x: 0,
				},
				b2: {
					color: '#e55',
					value: 1,
					x: 166.25,
				},
				initialB1x: 0,
				initialB2x: 166.25,
				swapSpeed: 6
			});
			// mock updateSwapAnimation, to end the swap animation
			scene.updateSwapAnimation = () => {
				scene.state.swapping = false;
				scene.state.b1 = undefined;
				scene.state.b2 = undefined;
				scene.state.initialB1x = undefined;
				scene.state.initialB2x = undefined;
				scene.state.swapSpeed = undefined;
			};
			expect(scene.isIndexAtEnd()).toBeFalsy();
			scene.update();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations: scene.state.generations,
				index: 3,
				swapping: false,
				b1: undefined,
				b2: undefined,
				initialB1x: undefined,
				initialB2x: undefined,
				swapSpeed: undefined
			});
			expect(scene.isIndexAtEnd()).toBeFalsy();
			scene.update();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations: scene.state.generations,
				index: 4,
				swapping: false,
				b1: undefined,
				b2: undefined,
				initialB1x: undefined,
				initialB2x: undefined,
				swapSpeed: undefined
			});
			expect(scene.isIndexAtEnd()).toBeFalsy();
			scene.update();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations: scene.state.generations,
				index: 5,
				swapping: false,
				b1: undefined,
				b2: undefined,
				initialB1x: undefined,
				initialB2x: undefined,
				swapSpeed: undefined
			});
			expect(scene.isIndexAtEnd()).toBeTruthy();
		});
		test('skipBackState', () => {
			const scene = new BarSortScene(defaultState.canvas as HTMLCanvasElement, defaultState.ctx as CanvasRenderingContext2D);
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
				b1: undefined,
				b2: undefined,
				initialB1x: undefined,
				initialB2x: undefined,
				swapSpeed: undefined
			});
			expect(scene.isIndexAtEnd()).toBeFalsy();
			scene.update();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations,
				index: -1,
				isBackwards: true,
				swapping: false,
				isStep: false,
				isRunning: false,
				b1: undefined,
				b2: undefined,
				initialB1x: undefined,
				initialB2x: undefined,
				swapSpeed: undefined
			});
			expect(scene.isIndexAtEnd()).toBeFalsy();
		});
		test('skipBackState while swapping', () => {
			const scene = new BarSortScene(defaultState.canvas as HTMLCanvasElement, defaultState.ctx as CanvasRenderingContext2D);
			expect(scene.state).toStrictEqual(defaultState);
			scene.state.generations = generations;
			scene.update();
			scene.update();
			scene.update();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations: scene.state.generations,
				index: 2,
				swapping: true,
				b1: {
					color: '#e55',
					value: 2,
					x: 0,
				},
				b2: {
					color: '#e55',
					value: 1,
					x: 166.25,
				},
				initialB1x: 0,
				initialB2x: 166.25,
				swapSpeed: 6
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
				b1: undefined,
				b2: undefined,
				initialB1x: undefined,
				initialB2x: undefined,
				swapSpeed: undefined
			});
			expect(scene.isIndexAtEnd()).toBeFalsy();
			scene.update();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations,
				index: -1,
				isBackwards: true,
				swapping: false,
				isStep: false,
				isRunning: false,
				b1: undefined,
				b2: undefined,
				initialB1x: undefined,
				initialB2x: undefined,
				swapSpeed: undefined
			});
			expect(scene.isIndexAtEnd()).toBeFalsy();
		});
		test('skipForwardState', () => {
			const scene = new BarSortScene(defaultState.canvas as HTMLCanvasElement, defaultState.ctx as CanvasRenderingContext2D);
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
				b1: undefined,
				b2: undefined,
				initialB1x: undefined,
				initialB2x: undefined,
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
				isStep: false,
				isRunning: false,
				b1: undefined,
				b2: undefined,
				initialB1x: undefined,
				initialB2x: undefined,
				swapSpeed: undefined
			});
			expect(scene.isIndexAtEnd()).toBeTruthy();
		});
		test('skipForwardState while swapping', () => {
			const scene = new BarSortScene(defaultState.canvas as HTMLCanvasElement, defaultState.ctx as CanvasRenderingContext2D);
			expect(scene.state).toStrictEqual(defaultState);
			scene.state.generations = generations;
			scene.update();
			scene.update();
			scene.update();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations: scene.state.generations,
				index: 2,
				swapping: true,
				b1: {
					color: '#e55',
					value: 2,
					x: 0,
				},
				b2: {
					color: '#e55',
					value: 1,
					x: 166.25,
				},
				initialB1x: 0,
				initialB2x: 166.25,
				swapSpeed: 6
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
				b1: undefined,
				b2: undefined,
				initialB1x: undefined,
				initialB2x: undefined,
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
				isStep: false,
				isRunning: false,
				b1: undefined,
				b2: undefined,
				initialB1x: undefined,
				initialB2x: undefined,
				swapSpeed: undefined
			});
			expect(scene.isIndexAtEnd()).toBeTruthy();
		});
		test('stepBackState and then loop', () => {
			const scene = new BarSortScene(defaultState.canvas as HTMLCanvasElement, defaultState.ctx as CanvasRenderingContext2D);
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
				b1: undefined,
				b2: undefined,
				initialB1x: undefined,
				initialB2x: undefined,
				swapSpeed: undefined
			});
			scene.update();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations,
				index: 5,
				isBackwards: false,
				swapping: false,
				isStep: false,
				isRunning: false,
				b1: undefined,
				b2: undefined,
				initialB1x: undefined,
				initialB2x: undefined,
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
				b1: undefined,
				b2: undefined,
				initialB1x: undefined,
				initialB2x: undefined,
				swapSpeed: undefined
			});
			expect(scene.isIndexAtEnd()).toBeFalsy();
			scene.update();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations: scene.state.generations,
				index: 2,
				swapping: false,
				b1: undefined,
				b2: undefined,
				initialB1x: undefined,
				initialB2x: undefined,
				swapSpeed: undefined,
				isBackwards: true,
				isRunning: false,
				isStep: false
			});
			expect(scene.isIndexAtEnd()).toBeFalsy();
			scene.loopState();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations,
				index: 4,
				isBackwards: false,
				swapping: false,
				isStep: false,
				isRunning: true,
				b1: undefined,
				b2: undefined,
				initialB1x: undefined,
				initialB2x: undefined,
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
				isStep: false,
				isRunning: true,
				b1: undefined,
				b2: undefined,
				initialB1x: undefined,
				initialB2x: undefined,
				swapSpeed: undefined
			});
			expect(scene.isIndexAtEnd()).toBeTruthy();
		});
		test('stepBackState while swapping', () => {
			const scene = new BarSortScene(defaultState.canvas as HTMLCanvasElement, defaultState.ctx as CanvasRenderingContext2D);
			expect(scene.state).toStrictEqual(defaultState);
			scene.state.generations = generations;
			scene.update();
			scene.update();
			scene.update();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations: scene.state.generations,
				index: 2,
				swapping: true,
				b1: {
					color: '#e55',
					value: 2,
					x: 0,
				},
				b2: {
					color: '#e55',
					value: 1,
					x: 166.25,
				},
				initialB1x: 0,
				initialB2x: 166.25,
				swapSpeed: 6
			});
			scene.stepBackState();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations,
				index: 0,
				isBackwards: true,
				swapping: false,
				isStep: true,
				isRunning: true,
				b1: undefined,
				b2: undefined,
				initialB1x: undefined,
				initialB2x: undefined,
				swapSpeed: undefined
			});
			expect(scene.isIndexAtEnd()).toBeFalsy();
			scene.update();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations: scene.state.generations,
				index: -1,
				isBackwards: true,
				swapping: false,
				isStep: false,
				isRunning: false,
				b1: undefined,
				b2: undefined,
				initialB1x: undefined,
				initialB2x: undefined,
				swapSpeed: undefined
			});
			expect(scene.isIndexAtEnd()).toBeFalsy();
		});
		test('stepForwardState', () => {
			const scene = new BarSortScene(defaultState.canvas as HTMLCanvasElement, defaultState.ctx as CanvasRenderingContext2D);
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
				isStep: false,
				isRunning: false,
			});
			expect(scene.isIndexAtEnd()).toBeFalsy();
		});
		test('stepForwardState while swapping', () => {
			const scene = new BarSortScene(defaultState.canvas as HTMLCanvasElement, defaultState.ctx as CanvasRenderingContext2D);
			expect(scene.state).toStrictEqual(defaultState);
			scene.state.generations = generations;
			scene.update();
			scene.update();
			scene.update();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations: scene.state.generations,
				index: 2,
				swapping: true,
				b1: {
					color: '#e55',
					value: 2,
					x: 0,
				},
				b2: {
					color: '#e55',
					value: 1,
					x: 166.25,
				},
				initialB1x: 0,
				initialB2x: 166.25,
				swapSpeed: 6
			});
			scene.stepForwardState();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations,
				index: 3,
				isBackwards: false,
				swapping: false,
				isStep: true,
				isRunning: true,
				b1: undefined,
				b2: undefined,
				initialB1x: undefined,
				initialB2x: undefined,
				swapSpeed: undefined
			});
			expect(scene.isIndexAtEnd()).toBeFalsy();
			scene.update();
			expect(scene.state).toStrictEqual({
				...defaultState,
				generations: scene.state.generations,
				index: 4,
				isBackwards: false,
				swapping: false,
				isStep: false,
				isRunning: false,
				b1: undefined,
				b2: undefined,
				initialB1x: undefined,
				initialB2x: undefined,
				swapSpeed: undefined
			});
			expect(scene.isIndexAtEnd()).toBeFalsy();
		});
	});
});