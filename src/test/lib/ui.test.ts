import {
	describe, it, expect, beforeEach, vi 
} from 'vitest';
import {
	createAlgorithmCanvas 
} from '../../lib/ui';
import {
	IconifyIconHTMLElement 
} from 'iconify-icon/dist/iconify-icon.js';

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

		expect(container).toBeTruthy();
		expect(canvas).toBeInstanceOf(HTMLCanvasElement);
		expect(menu).toBeInstanceOf(HTMLDivElement);

		expect(ui.canvas).toBe(canvas);
		expect((ui.playButton as IconifyIconHTMLElement).icon).toBe('ph:play-pause');
		expect((ui.randomizeButton as IconifyIconHTMLElement).icon).toBe('ph:shuffle');
	});

	it('should toggle menu visibility via control button', () => {
		createAlgorithmCanvas({
			containerId: 'test-root',
			selectedAlgorithm: 'bubblesort',
		});

		const menu = document.querySelector('.menu')!;
		const toggleButton = document.querySelector('.controls-container iconify-icon')!;

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

		expect(ui.animationFrameDelayInput).toBeInstanceOf(HTMLInputElement);
		expect(ui.algorithmSelect).toBeInstanceOf(HTMLSelectElement);
	});

	it('should apply custom color theme and canvas size', () => {
		createAlgorithmCanvas({
			containerId: 'test-root',
			selectedAlgorithm: 'bubblesort',
			canvasWidth: 800,
			canvasHeight: 400,
			colorTheme: {
				primary: '#123456',
				primaryLight: '#234567',
				primaryLighter: '#345678',
				secondary: '#abcdef',
				accent: '#ff0000',
				accentSecondary: '#00ff00'
			}
		});

		const style = Array.from(document.head.querySelectorAll('style'))
			.find(s => s.textContent?.includes('--primary: #123456'));
		expect(style).toBeTruthy();
		expect(style!.textContent).toContain('--primary: #123456');
		expect(style!.textContent).toContain('--accent: #ff0000');
		expect(style!.textContent).toContain('width: 800px');
		expect(style!.textContent).toContain('height: 400px');
	});

	it('should only show specified visibleButtons in controls', () => {
		createAlgorithmCanvas({
			containerId: 'test-root',
			selectedAlgorithm: 'bubblesort',
			visibleButtons: ['play-button', 'randomize-button']
		});

		const controls = document.querySelector('.controls-container')!;
		const icons = Array.from(controls.querySelectorAll('iconify-icon')).map(i => i.id);
		expect(icons).toContain('play-button');
		expect(icons).toContain('randomize-button');
		expect(icons).not.toContain('menu-button');
	});

	it('should only show specified menuButtons in menu', () => {
		createAlgorithmCanvas({
			containerId: 'test-root',
			selectedAlgorithm: 'bubblesort',
			menuButtons: ['play-button', 'step-forward-button']
		});

		const menuButtons = Array.from(document.querySelectorAll('.menu-buttons-container iconify-icon'))
			.map(btn => btn.id);
		expect(menuButtons).toEqual(['play-button', 'step-forward-button']);
	});

	it('should populate algorithm select with selectableAlgorithms', () => {
		const selectable = ['bubblesort', 'quicksort', 'mergesort'];
		const ui = createAlgorithmCanvas({
			containerId: 'test-root',
			selectedAlgorithm: 'bubblesort',
			selectableAlgorithms: selectable
		});

		const options = Array.from(ui.algorithmSelect.querySelectorAll('option')).map(o => o.textContent);
		expect(options).toEqual(selectable);
	});

	it('should set animationFrameDelayInput value from options', () => {
		const ui = createAlgorithmCanvas({
			containerId: 'test-root',
			selectedAlgorithm: 'bubblesort',
			animationFrameDelay: 600
		});
		expect(ui.animationFrameDelayInput.value).toBe('600');
	});

	it('should handle Enter/Space keydown on icon buttons', () => {
		const ui = createAlgorithmCanvas({
			containerId: 'test-root',
			selectedAlgorithm: 'bubblesort'
		});
		const playButton = ui.playButton as HTMLElement;
		const clickSpy = vi.fn();
		playButton.onclick = clickSpy;

		const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
		playButton.dispatchEvent(enterEvent);
		expect(clickSpy).toHaveBeenCalled();

		clickSpy.mockClear();
		const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
		playButton.dispatchEvent(spaceEvent);
		expect(clickSpy).toHaveBeenCalled();
	});

	it('should close menu on Escape keydown', () => {
		createAlgorithmCanvas({
			containerId: 'test-root',
			selectedAlgorithm: 'bubblesort'
		});
		const menu = document.querySelector('.menu')!;
		const appContainer = document.querySelector('.app-container')!;

		// Open menu
		menu.classList.remove('hide');
		const escEvent = new KeyboardEvent('keydown', { key: 'Escape',
			bubbles: true });
		appContainer.dispatchEvent(escEvent);
		expect(menu.classList.contains('hide')).toBe(true);
	});
});
