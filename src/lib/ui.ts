import {
	AlgorithmCanvasOptions 
} from '..';
import css from './styles/styling.css?inline';

export const enum Elements {
	BTN_PLAY = 'play-button',
	BTN_RANDOMIZE = 'randomize-button',
	BTN_SKIP_BACK = 'skip-back-button',
	BTN_SKIP_FORWARD = 'skip-forward-button',
	BTN_STEP_BACK = 'step-back-button',
	BTN_STEP_FORWARD = 'step-forward-button',
	BTN_MENU = 'menu-button',
	IPT_ANIMATION_SPEED = 'interval-timeout-input',
	IPT_ALGORITHM_SELECTION = 'algorithm-selection',
	CNT_APP = 'app-container',
	CANVAS = 'algorithm-canvas',
	TXT_ANIMATION_STATUS = 'animation-status',
	TXT_ANIMATION_PROGRESS = 'animation-progress',
}

/**
 * Creates and returns the full algorithm canvas UI including menu and controls.
 * @returns An object containing references to key UI elements.
 */
export const createAlgorithmCanvas = (options: AlgorithmCanvasOptions) => {
	const target = document.getElementById(options.containerId);
	if (!target) throw new Error(`Target element with id '${options.containerId}' not found.`);
	const canvas = createCanvas(options);
	applyStyle(options);
	target.appendChild(createAppContainer(canvas, options));
};

export const getAppElement = <T extends HTMLElement>(id: string, options: AlgorithmCanvasOptions): T => {
	const container = document.getElementById(options.containerId);
	if (!container) {
		throw new Error(`Container with id '${options.containerId}' not found.`);
	}
	const element = container.querySelector<T>(`#${id}`);
	if (!element) {
		throw new Error(`Element with id '${id}' not found in container '${options.containerId}'.`);
	}
	return element;
};

export const getCanvas = (options: AlgorithmCanvasOptions): {canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D} => {
	const canvas = getAppElement<HTMLCanvasElement>(Elements.CANVAS, options);
	if (!canvas) {
		throw new Error(`Canvas with id '${Elements.CANVAS}' not found in container '${options.containerId}'.`);
	}
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Failed to get 2D context from canvas');

	return { canvas,
		ctx };
};

const createAppContainer = (canvas: HTMLCanvasElement, options: AlgorithmCanvasOptions): HTMLDivElement => {
	const buttons = createButtons();
	const menu = createMenu(options, buttons);
	const controlsContainer = createControlsContainer(options, menu, buttons);

	const canvasContainer = document.createElement('div');
	canvasContainer.className = 'algorithm-canvas-container';
	canvasContainer.appendChild(canvas);
	canvasContainer.appendChild(controlsContainer);
	canvasContainer.appendChild(menu);

	const appContainer = document.createElement('div');
	appContainer.id = Elements.CNT_APP;
	appContainer.className = 'app-container';
	appContainer.appendChild(canvasContainer);
	appContainer.onkeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape' && !menu.classList.contains('hide')) {
			menu.classList.add('hide');
			e.stopPropagation();
		}
	};
	return appContainer;
};

const createButtons = () => {
	return { 
		[Elements.BTN_MENU]: createIconButton(Elements.BTN_MENU, 'ph:sliders-horizontal'),
		[Elements.BTN_RANDOMIZE]: createIconButton(Elements.BTN_RANDOMIZE, 'ph:shuffle'),
		[Elements.BTN_PLAY]: createIconButton(Elements.BTN_PLAY, 'ph:play-pause', true),
		[Elements.BTN_SKIP_BACK]: createIconButton(Elements.BTN_SKIP_BACK, 'ph:skip-back'),
		[Elements.BTN_SKIP_FORWARD]: createIconButton(Elements.BTN_SKIP_FORWARD, 'ph:skip-forward'),
		[Elements.BTN_STEP_BACK]: createIconButton(Elements.BTN_STEP_BACK, 'ph:caret-left'),
		[Elements.BTN_STEP_FORWARD]: createIconButton(Elements.BTN_STEP_FORWARD, 'ph:caret-right')
	};
};

/**
 * Injects required styles into the document.
 */
const applyStyle = (options: AlgorithmCanvasOptions): void => {
	const style = document.createElement('style');
	style.textContent = `:root {
		--primary: ${options.colorTheme?.primary || '#010101'};
		--primaryLight: ${options.colorTheme?.primaryLight || '#202020'};
		--primaryLighter: ${options.colorTheme?.primaryLighter || '#303030'};
		--secondary: ${options.colorTheme?.secondary || '#dadada'};
		--accent: ${options.colorTheme?.accent || '#6e90ff'};
		--accentSecondary: ${options.colorTheme?.accentSecondary || '#000'};
	}`;
	style.textContent += css;
	if (options.canvasWidth && options.canvasHeight) {
		const maxWidth = Math.min(window.innerWidth - 15, options.canvasWidth);
		const maxHeight = Math.min(window.innerHeight - 15, options.canvasHeight);
		style.textContent += `.app-container {width: ${maxWidth}px; height: ${maxHeight}px;}`;
	}
	document.head.appendChild(style);
};

/**
 * Creates the algorithm canvas.
 * @returns The canvas element.
 */
const createCanvas = (options: AlgorithmCanvasOptions): HTMLCanvasElement => {
	const canvas = document.createElement('canvas');
	canvas.id = Elements.CANVAS;
	if (options.canvasWidth && options.canvasHeight) {
		const maxWidth = Math.min(window.innerWidth -15, options.canvasWidth);
		const maxHeight = Math.min(window.innerHeight-15, options.canvasHeight);
		canvas.width = maxWidth;
		canvas.height = maxHeight;
	}
	return canvas;
};

/**
 * Creates the algorithm selection and control menu.
 * @returns The menu element and references to important UI elements.
 */
const createMenu = (options: AlgorithmCanvasOptions, buttons: {[key: string]: HTMLElement}): HTMLDivElement => {
	const menu = document.createElement('div');
	menu.className = 'menu hide';
	menu.appendChild(createAlgorithmSelectionSection(options));
	menu.appendChild(createControlsSection(options, buttons));
	menu.appendChild(createSpeedSection(options));
	menu.appendChild(createStatusContainer());
	return menu;
};

/**
 * Creates the algorithm selection section.
 */
const createAlgorithmSelectionSection = (options: AlgorithmCanvasOptions): HTMLDivElement => {
	const algorithmSection = document.createElement('div');
	algorithmSection.className = 'menu-section';

	const algorithmLabel = document.createElement('label');
	algorithmLabel.htmlFor = Elements.IPT_ALGORITHM_SELECTION;
	algorithmLabel.textContent = 'algorithm';
	
	const algorithmSelect = document.createElement('select');
	algorithmSelect.id = Elements.IPT_ALGORITHM_SELECTION;
	(options.selectableAlgorithms || [options.selectedAlgorithm]).forEach(name => {
		const option = document.createElement('option');
		option.textContent = name;
		algorithmSelect.appendChild(option);
	});

	const selectWrapper = document.createElement('div');
	selectWrapper.className = 'select-wrapper';
	selectWrapper.appendChild(algorithmSelect);

	algorithmSection.appendChild(algorithmLabel);
	algorithmSection.appendChild(selectWrapper);

	return algorithmSection;
};

/**
 * Creates the controls section with all control buttons.
 */
const createControlsSection = (options: AlgorithmCanvasOptions, buttons: {[key: string]: HTMLElement}): HTMLDivElement => {
	const controlsSection = document.createElement('div');
	controlsSection.className = 'menu-section';

	const controlsLabel = document.createElement('label');
	controlsLabel.htmlFor = 'button-container';
	controlsLabel.textContent = 'controls';

	const buttonContainer = document.createElement('div');
	buttonContainer.className = 'menu-buttons-container';

	(options.menuButtons || [Elements.BTN_MENU])
		.map(button => buttons[button])
		.forEach(button => buttonContainer.appendChild(button));

	controlsSection.appendChild(controlsLabel);
	controlsSection.appendChild(buttonContainer);

	return controlsSection;
};

/**
 * Creates the animation speed section.
 */
const createSpeedSection = (options: AlgorithmCanvasOptions): HTMLDivElement => {
	const speedSection = document.createElement('div');
	speedSection.className = 'menu-section';

	const speedLabel = document.createElement('label');
	speedLabel.htmlFor = Elements.IPT_ANIMATION_SPEED;
	speedLabel.textContent = 'animation speed';

	const speedInput = document.createElement('input');
	speedInput.id = Elements.IPT_ANIMATION_SPEED;
	speedInput.type = 'range';
	speedInput.min = '200';
	speedInput.max = '2000';
	speedInput.step = '200';
	speedInput.value = options.animationFrameDelay ? options.animationFrameDelay.toString() : '1400';

	speedSection.appendChild(speedLabel);
	speedSection.appendChild(speedInput);

	return speedSection;
};

/**
 * Creates an icon button.
 * 
 * @param icon - The icon name to use for the button.
 * @returns iconify-icon element 
 */
const createIconButton = (id: string, icon: string, primary = false) => {
	const iconButton = document.createElement('iconify-icon');
	iconButton.icon = icon; 
	iconButton.id = id;
	iconButton.className = 'icon-button';
	iconButton.role = 'button';
	iconButton.tabIndex = 0;
	iconButton.setAttribute('aria-label', id.replace('-', ' '));
	if (primary) iconButton.classList.add('primary');
	iconButton.onkeydown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			iconButton.click();
		}
	};
	iconButton.width = '2em';
	iconButton.height = '2em';
	return iconButton;
};

/**
 * Creates the floating control button to toggle menu visibility.
 * @param menu - The menu element to toggle.
 * @returns The controls container.
 */
const createControlsContainer = (options: AlgorithmCanvasOptions, menu: HTMLDivElement, buttons: {[key: string]: HTMLElement}): HTMLDivElement => {
	const controls = document.createElement('div');
	controls.className = 'controls-container';

	(options.visibleButtons || [Elements.BTN_MENU])
		.map(button => {
			if (button === Elements.BTN_MENU && menu) {
				buttons[button].onclick = () => menu.classList.toggle('hide');
			}
			return buttons[button];
		})
		.forEach(button => controls.appendChild(button));

	return controls;
};

/**
 * Creates the status container that displays animation status and progress.
 */
const createStatusContainer = (): HTMLDivElement => {
	const statusContainer = document.createElement('div');
	statusContainer.className = 'menu-section';

	const animationStatus = document.createElement('span');
	animationStatus.id = Elements.TXT_ANIMATION_STATUS;
	animationStatus.textContent = 'animation stopped';

	const animationProgress = document.createElement('span');
	animationProgress.id = Elements.TXT_ANIMATION_PROGRESS;
	animationProgress.textContent = 'step 0/0';

	const watermark = document.createElement('a');
	watermark.href = 'https://dnagel.de';
	watermark.textContent = 'made by daniel';
	watermark.target = '_blank';

	statusContainer.appendChild(animationStatus);
	statusContainer.appendChild(animationProgress);
	statusContainer.appendChild(watermark);

	return statusContainer;
};