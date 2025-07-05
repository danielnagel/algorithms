import {
	describe, it, expect, beforeEach, vi 
} from 'vitest';
import {
	createAlgorithmCanvas, 
	Elements, 
	getAppElement
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
		const options ={
			containerId: 'test-root',
			selectedAlgorithm: 'bubblesort',
			visibleButtons: ['play-button', 'randomize-button', 'menu-button'],
		};
		createAlgorithmCanvas(options);

		const container = document.querySelector('#test-root .app-container');
		const menu = document.querySelector('.menu');

		expect(container).toBeTruthy();
		expect(getAppElement(Elements.CNT_APP, options)).toBeInstanceOf(HTMLDivElement);
		expect(getAppElement(Elements.CNT_APP, options)).toBe(container);
		expect(getAppElement(Elements.CANVAS, options)).toBeInstanceOf(HTMLCanvasElement);
		expect(menu).toBeInstanceOf(HTMLDivElement);
		expect((getAppElement(Elements.BTN_MENU, options) as IconifyIconHTMLElement).icon).toBe('ph:sliders-horizontal');
		expect((getAppElement(Elements.BTN_PLAY, options) as IconifyIconHTMLElement).icon).toBe('ph:play-pause');
		expect((getAppElement(Elements.BTN_RANDOMIZE, options) as IconifyIconHTMLElement).icon).toBe('ph:shuffle');
		expect(getAppElement(Elements.IPT_ANIMATION_SPEED, options)).toBeInstanceOf(HTMLInputElement);
		expect(getAppElement(Elements.IPT_ALGORITHM_SELECTION, options)).toBeInstanceOf(HTMLSelectElement);
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
		const appOptions = {
			containerId: 'test-root',
			selectedAlgorithm: 'bubblesort',
			selectableAlgorithms: selectable
		};
		createAlgorithmCanvas(appOptions);

		const options = Array.from(getAppElement(Elements.IPT_ALGORITHM_SELECTION, appOptions).querySelectorAll('option')).map(o => o.textContent);
		expect(options).toEqual(selectable);
	});

	it('should set animationFrameDelayInput value from options', () => {
		const options = {
			containerId: 'test-root',
			selectedAlgorithm: 'bubblesort',
			animationFrameDelay: 600
		};
		createAlgorithmCanvas(options);
		expect(getAppElement<HTMLInputElement>(Elements.IPT_ANIMATION_SPEED, options).value).toBe('600');
	});

	it('should handle Enter/Space keydown on icon buttons', () => {
		const options = {
			containerId: 'test-root',
			selectedAlgorithm: 'bubblesort',
			visibleButtons: ['play-button', 'randomize-button']
		};
		createAlgorithmCanvas(options);
		const playButton = getAppElement<HTMLButtonElement>(Elements.BTN_PLAY, options);
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
