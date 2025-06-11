import {
	describe, it, expect, beforeEach, vi 
} from 'vitest';
import {
	createAlgorithmCanvas 
} from '../../lib/ui';

describe('createAlgorithmCanvas', () => {
	let root: HTMLDivElement;

	beforeEach(() => {
		document.body.innerHTML = '';
		root = document.createElement('div');
		root.id = 'test-root';
		document.body.appendChild(root);
		// canvas.getContext mocken
		vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => {
			return {
				fillRect: vi.fn(),
				clearRect: vi.fn(),
				// ggf. weitere Methoden hinzufügen
			} as unknown as CanvasRenderingContext2D;
		});
	});

	it('should throw if target container does not exist', () => {
		expect(() => createAlgorithmCanvas({
			containerId: 'non-existent-id',
			selectedAlgorithm: 'bubblesort',
		})).toThrowError(
			'Target element with id \'non-existent-id\' not found.'
		);
	});

	it('should render canvas and UI into specified container', () => {
		const ui = createAlgorithmCanvas({
			containerId: 'test-root',
			selectedAlgorithm: 'bubblesort',
		});

		const container = document.querySelector('#test-root .app-container');
		const canvas = document.getElementById('algorithm-canvas');
		const menu = document.querySelector('.menu');
		const controlButton = document.querySelector('.controls-container button');

		expect(container).toBeTruthy();
		expect(canvas).toBeInstanceOf(HTMLCanvasElement);
		expect(menu).toBeInstanceOf(HTMLDivElement);
		expect(controlButton).toBeInstanceOf(HTMLButtonElement);

		expect(ui.canvas).toBe(canvas);
		expect(ui.playButton.textContent).toBe('start/stop');
		expect(ui.randomizeButton.id).toBe('randomize-button');
	});

	it('should toggle menu visibility via control button', () => {
		createAlgorithmCanvas({
			containerId: 'test-root',
			selectedAlgorithm: 'bubblesort',
		});

		const menu = document.querySelector('.menu')!;
		const toggleButton = document.querySelector('.controls-container button')!;

		expect(menu.classList.contains('hide')).toBe(true);
		toggleButton.dispatchEvent(new MouseEvent('click'));
		expect(menu.classList.contains('hide')).toBe(false);
		toggleButton.dispatchEvent(new MouseEvent('click'));
		expect(menu.classList.contains('hide')).toBe(true);
	});

	it('should contain all expected buttons and inputs', () => {
		const ui = createAlgorithmCanvas({
			containerId: 'test-root',
			selectedAlgorithm: 'bubblesort',
		});

		expect(ui.playButton).toBeInstanceOf(HTMLButtonElement);
		expect(ui.randomizeButton).toBeInstanceOf(HTMLButtonElement);
		expect(ui.skipBackButton).toBeInstanceOf(HTMLButtonElement);
		expect(ui.skipForwardButton).toBeInstanceOf(HTMLButtonElement);
		expect(ui.stepBackButton).toBeInstanceOf(HTMLButtonElement);
		expect(ui.stepForwardButton).toBeInstanceOf(HTMLButtonElement);
		expect(ui.animationFrameDelayInput).toBeInstanceOf(HTMLInputElement);
		expect(ui.algorithmSelect).toBeInstanceOf(HTMLSelectElement);
	});
});
