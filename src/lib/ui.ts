import css from './styles/styling.css?inline';

/**
 * Creates and returns the full algorithm canvas UI including menu and controls.
 * @returns An object containing references to key UI elements.
 */
export const createAlgorithmCanvas = (options: AlgorithmCanvasOptions): UIElements => {

	const defaultOptions: AlgorithmCanvasOptions = {
		containerId: 'algorithm-canvas-container',
		canvasWidth: 1200,
		canvasHeight: 720,
		selectedAlgorithm: 'bubblesort',
		selectableAlgorithms: [
			'bubblesort', 'selectionsort', 'insertionsort',
			'shellsort', 'quicksort', 'mergesort', 'countingsort', 'playground'
		],
		dataSet: undefined,
		dataSetSize: 35,
		visibleButtons: ['menu']
	};

	const mergedOptions = {
		...defaultOptions,
		...options
	};

	const target = document.getElementById(mergedOptions.containerId);
	if (!target) throw new Error(`Target element with id '${mergedOptions.containerId}' not found.`);

	applyStyle(mergedOptions);

	const appContainer = document.createElement('div');
	appContainer.className = 'app-container';

	const canvasContainer = document.createElement('div');
	canvasContainer.className = 'algorithm-canvas-container';

	const canvas = createCanvas(mergedOptions);
	const {menu,
		playButton,
		randomizeButton,
		skipBackButton,
		skipForwardButton,
		stepBackButton,
		stepForwardButton,
		animationFrameDelayInput,
		algorithmSelect} = createMenu();

	const controls = createControls(menu, mergedOptions);

	canvasContainer.appendChild(canvas);
	canvasContainer.appendChild(menu);
	canvasContainer.appendChild(controls);

	appContainer.appendChild(canvasContainer);
	target.appendChild(appContainer);

	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Failed to get 2D context from canvas');

	return {
		canvas,
		ctx,
		playButton,
		randomizeButton,
		skipBackButton,
		skipForwardButton,
		stepBackButton,
		stepForwardButton,
		animationFrameDelayInput,
		algorithmSelect,
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
 * Creates a button element.
 * @param id - The ID of the button.
 * @param text - The visible text on the button.
 * @returns The button element.
 */
const createButton = (id: string, text: string): HTMLButtonElement => {
	const button = document.createElement('button');
	button.id = id;
	button.textContent = text;
	return button;
};

/**
 * Creates the algorithm selection and control menu.
 * @returns The menu element and references to important UI elements.
 */
const createMenu = (): {
	menu: HTMLDivElement;
	playButton: HTMLButtonElement;
	randomizeButton: HTMLButtonElement;
	skipBackButton: HTMLButtonElement;
	skipForwardButton: HTMLButtonElement;
	stepBackButton: HTMLButtonElement;
	stepForwardButton: HTMLButtonElement;
	animationFrameDelayInput: HTMLInputElement;
	algorithmSelect: HTMLSelectElement;
} => {

	const { algorithmSection, algorithmSelect } = createAlgorithmSelectionSection();
	const {controlsSection,
		playButton,
		randomizeButton,
		skipBackButton,
		skipForwardButton,
		stepBackButton,
		stepForwardButton} = createControlsSection();
	const { speedSection, speedInput } = createSpeedSection();

	const menu = document.createElement('div');
	menu.className = 'menu hide';
	menu.appendChild(algorithmSection);
	menu.appendChild(controlsSection);
	menu.appendChild(speedSection);

	return {
		menu,
		playButton,
		randomizeButton,
		skipBackButton,
		skipForwardButton,
		stepBackButton,
		stepForwardButton,
		animationFrameDelayInput: speedInput,
		algorithmSelect,
	};
};

/**
 * Creates the algorithm selection section.
 */
const createAlgorithmSelectionSection = (): {
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
	const algorithms = [
		'bubblesort', 'selectionsort', 'insertionsort',
		'shellsort', 'quicksort', 'mergesort', 'countingsort', 'playground'
	];
	algorithms.forEach(name => {
		const option = document.createElement('option');
		option.textContent = name;
		algorithmSelect.appendChild(option);
	});

	algorithmSection.appendChild(algorithmLabel);
	algorithmSection.appendChild(algorithmSelect);

	return {
		algorithmSection,
		algorithmSelect 
	};
};

/**
 * Creates the controls section with all control buttons.
 */
const createControlsSection = (): {
	controlsSection: HTMLDivElement;
	playButton: HTMLButtonElement;
	randomizeButton: HTMLButtonElement;
	skipBackButton: HTMLButtonElement;
	skipForwardButton: HTMLButtonElement;
	stepBackButton: HTMLButtonElement;
	stepForwardButton: HTMLButtonElement;
} => {
	const controlsSection = document.createElement('div');
	controlsSection.className = 'menu-section';

	const controlsLabel = document.createElement('label');
	controlsLabel.htmlFor = 'button-container';
	controlsLabel.textContent = 'controls';

	const buttonContainer = document.createElement('div');
	buttonContainer.id = 'button-container';

	const randomizeButton = createButton('randomize-button', 'randomize');
	const playButton = createButton('play-button', 'start/stop');
	const skipBackButton = createButton('skip-back-button', 'skip back');
	const stepBackButton = createButton('step-back-button', 'step back');
	const stepForwardButton = createButton('step-forward-button', 'step forward');
	const skipForwardButton = createButton('skip-forward-button', 'skip forward');

	[
		randomizeButton, playButton, skipBackButton,
		stepBackButton, stepForwardButton, skipForwardButton
	].forEach(button => buttonContainer.appendChild(button));

	controlsSection.appendChild(controlsLabel);
	controlsSection.appendChild(buttonContainer);

	return {
		controlsSection,
		playButton,
		randomizeButton,
		skipBackButton,
		skipForwardButton,
		stepBackButton,
		stepForwardButton
	};
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
	const toggleButton = document.createElement('iconify-icon');
	toggleButton.icon = icon; 
	toggleButton.className = 'icon-button';
	toggleButton.width = '2em';
	toggleButton.height = '2em';
	return toggleButton;
};

/**
 * Creates the floating control button to toggle menu visibility.
 * @param menu - The menu element to toggle.
 * @returns The controls container.
 */
const createControls = (menu: HTMLDivElement, options: AlgorithmCanvasOptions): HTMLDivElement => {
	const controls = document.createElement('div');
	controls.className = 'controls-container';

	options.visibleButtons?.forEach(button => {
		if ('menu' === button) {
			const toggleButton = createIconButton('ph:sliders-horizontal');
			toggleButton.onclick = () => menu.classList.toggle('hide');
			controls.appendChild(toggleButton);
		} else {
			console.warn(`Unknown control button: ${button}`);
		}
	});

	return controls;
};
