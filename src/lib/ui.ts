import css from './styles/styling.css?inline';

export const enum Buttons {
	PLAY = 'play-button',
	RANDOMIZE = 'randomize-button',
	SKIP_BACK = 'skip-back-button',
	SKIP_FORWARD = 'skip-forward-button',
	STEP_BACK = 'step-back-button',
	STEP_FORWARD = 'step-forward-button',
	MENU = 'menu-button'
}

const mergeIntoDefaultOptions = (options: AlgorithmCanvasOptions): AlgorithmCanvasOptions => {
	const defaultOptions: AlgorithmCanvasOptions = {
		containerId: 'algorithm-canvas-container',
		canvasWidth: 1200,
		canvasHeight: 720,
		selectedAlgorithm: 'bubblesort',
		selectableAlgorithms: [
			'bubblesort', 'selectionsort', 'insertionsort',
			'shellsort', 'quicksort', 'mergesort', 'countingsort', 'playground'
		],
		menuButtons: [
			Buttons.PLAY, Buttons.RANDOMIZE, Buttons.SKIP_BACK,
			Buttons.SKIP_FORWARD, Buttons.STEP_BACK, Buttons.STEP_FORWARD
		],
		dataSet: undefined,
		dataSetSize: 35,
		visibleButtons: [Buttons.MENU],
	};

	return {
		...defaultOptions,
		...options
	};
};

/**
 * Creates and returns the full algorithm canvas UI including menu and controls.
 * @returns An object containing references to key UI elements.
 */
export const createAlgorithmCanvas = (options: AlgorithmCanvasOptions): UIElements => {

	const mergedOptions = mergeIntoDefaultOptions(options);

	const target = document.getElementById(mergedOptions.containerId);
	if (!target) throw new Error(`Target element with id '${mergedOptions.containerId}' not found.`);

	const canvas = createCanvas(mergedOptions);
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Failed to get 2D context from canvas');

	applyStyle(mergedOptions);

	const buttons = createButtons();
	const { menu, animationFrameDelayInput, algorithmSelect } = createMenu(mergedOptions, buttons);
	const controlsContainer = createControlsContainer(mergedOptions, menu, buttons);

	const canvasContainer = document.createElement('div');
	canvasContainer.className = 'algorithm-canvas-container';
	canvasContainer.appendChild(canvas);
	canvasContainer.appendChild(menu);
	canvasContainer.appendChild(controlsContainer);

	const appContainer = document.createElement('div');
	appContainer.className = 'app-container';
	appContainer.appendChild(canvasContainer);
	target.appendChild(appContainer);

	return {
		canvas,
		ctx,
		playButton: buttons[Buttons.PLAY],
		randomizeButton: buttons[Buttons.RANDOMIZE],
		skipBackButton: buttons[Buttons.SKIP_BACK],
		skipForwardButton: buttons[Buttons.SKIP_FORWARD],
		stepBackButton: buttons[Buttons.STEP_BACK],
		stepForwardButton: buttons[Buttons.STEP_FORWARD],
		animationFrameDelayInput,
		algorithmSelect,
	};
};

const createButtons = () => {
	return { 
		[Buttons.MENU]: createIconButton('ph:sliders-horizontal'),
		[Buttons.RANDOMIZE]: createIconButton('ph:shuffle'),
		[Buttons.PLAY]: createIconButton('ph:play-pause'),
		[Buttons.SKIP_BACK]: createIconButton('ph:skip-back'),
		[Buttons.SKIP_FORWARD]: createIconButton('ph:skip-forward'),
		[Buttons.STEP_BACK]: createIconButton('ph:caret-left'),
		[Buttons.STEP_FORWARD]: createIconButton('ph:caret-right')
	};
};

/**
 * Injects required styles into the document.
 */
const applyStyle = (options: AlgorithmCanvasOptions): void => {
	const style = document.createElement('style');
	style.textContent = css;
	if (options.canvasWidth && options.canvasHeight) {
		style.textContent += `.app-container {width: ${options.canvasWidth}px;height: ${options.canvasHeight}px;}`;
	}
	document.head.appendChild(style);
};

/**
 * Creates the algorithm canvas.
 * @returns The canvas element.
 */
const createCanvas = (options: AlgorithmCanvasOptions): HTMLCanvasElement => {
	const canvas = document.createElement('canvas');
	canvas.id = 'algorithm-canvas';
	if (options.canvasWidth && options.canvasHeight) {
		canvas.width = options.canvasWidth;
		canvas.height = options.canvasHeight;
	}
	return canvas;
};

/**
 * Creates the algorithm selection and control menu.
 * @returns The menu element and references to important UI elements.
 */
const createMenu = (options: AlgorithmCanvasOptions, buttons: {[key: string]: HTMLElement}): { menu: HTMLDivElement; animationFrameDelayInput: HTMLInputElement; algorithmSelect: HTMLSelectElement; } => {
	const { algorithmSection, algorithmSelect } = createAlgorithmSelectionSection(options);
	const controlsSection = createControlsSection(options, buttons);
	const { speedSection, speedInput } = createSpeedSection();

	const menu = document.createElement('div');
	menu.className = 'menu hide';
	menu.appendChild(algorithmSection);
	menu.appendChild(controlsSection);
	menu.appendChild(speedSection);

	return {
		menu,
		animationFrameDelayInput: speedInput,
		algorithmSelect,
	};
};

/**
 * Creates the algorithm selection section.
 */
const createAlgorithmSelectionSection = (options: AlgorithmCanvasOptions): {
	algorithmSection: HTMLDivElement;
	algorithmSelect: HTMLSelectElement;
} => {
	const algorithmSection = document.createElement('div');
	algorithmSection.className = 'menu-section';

	const algorithmLabel = document.createElement('label');
	algorithmLabel.htmlFor = 'algorithm-selection';
	algorithmLabel.textContent = 'algorithm';
	
	const algorithmSelect = document.createElement('select');
	algorithmSelect.id = 'algorithm-selection';
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

	return {
		algorithmSection,
		algorithmSelect 
	};
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

	(options.menuButtons || [Buttons.MENU])
		.map(button => buttons[button])
		.forEach(button => buttonContainer.appendChild(button));

	controlsSection.appendChild(controlsLabel);
	controlsSection.appendChild(buttonContainer);

	return controlsSection;
};

/**
 * Creates the animation speed section.
 */
const createSpeedSection = (): {
	speedSection: HTMLDivElement;
	speedInput: HTMLInputElement;
} => {
	const speedSection = document.createElement('div');
	speedSection.className = 'menu-section';

	const speedLabel = document.createElement('label');
	speedLabel.htmlFor = 'interval-timeout-input';
	speedLabel.textContent = 'animation speed';

	const speedInput = document.createElement('input');
	speedInput.id = 'interval-timeout-input';
	speedInput.type = 'range';
	speedInput.min = '200';
	speedInput.max = '2000';
	speedInput.step = '200';
	speedInput.value = '1400'; // Default speed

	speedSection.appendChild(speedLabel);
	speedSection.appendChild(speedInput);

	return {
		speedSection,
		speedInput 
	};
};

/**
 * Creates an icon button.
 * 
 * @param icon - The icon name to use for the button.
 * @returns iconify-icon element 
 */
const createIconButton = (icon: string) => {
	const iconButton = document.createElement('iconify-icon');
	iconButton.icon = icon; 
	iconButton.className = 'icon-button';
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

	(options.visibleButtons || [Buttons.MENU])
		.map(button => {
			if (button === Buttons.MENU && menu) {
				buttons[button].onclick = () => menu.classList.toggle('hide');
			}
			return buttons[button];
		})
		.forEach(button => controls.appendChild(button));

	return controls;
};
