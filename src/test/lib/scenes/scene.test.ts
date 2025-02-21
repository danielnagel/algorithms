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
		animationFrameTimestamp: 0,
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
	describe('updateSwapAnimation', () => {
		test('swap', () => {
			const scene = new Scene(defaultState.canvas as HTMLCanvasElement, defaultState.ctx as CanvasRenderingContext2D);
			expect(scene.state).toStrictEqual(defaultState);
			scene.state.generations = [{
				state: 'swap-selection',
				data:  [2, 1, 3],
				selectionIndizes: [0,1],
			}];
			const initialB2x = 166.25;
			const swapSpeed = 6;
			for (let i = 0; i < initialB2x; i+=swapSpeed) {
				scene.updateSwapAnimation();
				expect(scene.state).toStrictEqual({
					...defaultState,
					generations: scene.state.generations,
					swapping: true,
					b1: {
						color: '#e55',
						value: 1,
						x: i,
					},
					b2: {
						color: '#e55',
						value: 2,
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
				swapping: true,
				b1: {
					color: '#e55',
					value: 1,
					x: 166.25,
				},
				b2: {
					color: '#e55',
					value: 2,
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
				swapping: false,
				b1: undefined,
				b2: undefined,
				initialB1x: undefined,
				initialB2x: undefined,
				swapSpeed: undefined
			});
		});
	});
});