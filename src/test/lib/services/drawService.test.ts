import {
	describe, expect, test 
} from 'vitest';
import {
	DrawService 
} from '../../../lib/services/drawService';

describe('Scene', () => {
	const defaultState = {
		canvas: {
			width:500,
			height:300
		},
		ctx: {
		},
		algorithmType: '',
		generations: [{
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
		}],
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
	test('getBarGap', () => {
		const drawService = new DrawService();
		expect(drawService.getBarGap(defaultState.canvas.width)).toBe(1.25);
	});
	test('getBarRect', () => {
		const drawService = new DrawService();
		expect(drawService.getBarRect(defaultState as SceneState<Generation>, 3)).toStrictEqual({
			gap: 1.25,
			y: 1.25,
			width: 166.25,
			height: 297.5
		});
	});
	test('fontPosition', () => {
		const drawService = new DrawService();
		expect(drawService.fontPosition(defaultState as SceneState<Generation>, {
			x: 332.5,
			value: 3,
			color: ''
		})).toStrictEqual({
			size: 7.481249999999999,
			x: 338.2605625,
			y: 295.5
		});
	});
	test('shouldBarBeDrawn', () => {
		const drawService = new DrawService();
		expect(drawService.shouldBarBeDrawn(defaultState.generations[3], 0, false)).toBeTruthy();
		expect(drawService.shouldBarBeDrawn(defaultState.generations[3], 0, true)).toBeTruthy();
		expect(drawService.shouldBarBeDrawn(defaultState.generations[3], 1, false)).toBeTruthy();
		expect(drawService.shouldBarBeDrawn(defaultState.generations[3], 1, true)).toBeFalsy();
	});
	test('getBarColor', () => {
		const drawService = new DrawService();
		expect(drawService.getBarColor(defaultState.generations[3], 0, false, defaultState as SceneState<Generation>)).toBe(defaultState.colorTheme.primary);
		expect(drawService.getBarColor(defaultState.generations[3], 1, false, defaultState as SceneState<Generation>)).toBe(defaultState.colorTheme.accent);
		expect(drawService.getBarColor(defaultState.generations[3], 1, true, defaultState as SceneState<Generation>)).toBe(defaultState.colorTheme.primary);
	});
	test('getBar', () => {
		const drawService = new DrawService();
		const stateCopy = {
			...defaultState
		};
		stateCopy.index = 3;
		expect(drawService.getBar(stateCopy as SceneState<Generation>, 0, 1)).toStrictEqual({
			x: 166.25,
			value: 3,
			color: defaultState.colorTheme.accentSecondary
		});
		expect(drawService.getBar(stateCopy as SceneState<Generation>, 1, 0)).toStrictEqual({
			x: 332.5,
			value: 2,
			color: defaultState.colorTheme.accentSecondary
		});
	});
});