/**
 * UI Elements exposed for external control.
 */
export type UIElements = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  playButton: HTMLButtonElement;
  randomizeButton: HTMLButtonElement;
  skipBackButton: HTMLButtonElement;
  skipForwardButton: HTMLButtonElement;
  stepBackButton: HTMLButtonElement;
  stepForwardButton: HTMLButtonElement;
  animationFrameDelayInput: HTMLInputElement;
  algorithmSelect: HTMLSelectElement;
};

/**
 * Creates and returns the full algorithm canvas UI including menu and controls.
 * @returns An object containing references to key UI elements.
 */
export const createAlgorithmCanvas = (options: { id: string, width: number }): UIElements => {
	injectStyle(options.width);

	const appContainer = document.createElement('div');
	appContainer.id = 'app-container';
	appContainer.className = 'app-container';

	const canvasContainer = document.createElement('div');
	canvasContainer.className = 'algorithm-canvas-container';

	const canvas = createCanvas(options.width);
	const {menu,
		playButton,
		randomizeButton,
		skipBackButton,
		skipForwardButton,
		stepBackButton,
		stepForwardButton,
		animationFrameDelayInput,
		algorithmSelect} = createMenu();

	const controls = createControls(menu);

	canvasContainer.appendChild(canvas);
	canvasContainer.appendChild(menu);
	canvasContainer.appendChild(controls);

	appContainer.appendChild(canvasContainer);
	const target = document.getElementById(options.id);
	if (!target) throw new Error(`Target element with id '${options.id}' not found.`);
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
const injectStyle = (width: number): void => {
	const style = document.createElement('style');
	style.textContent = `
    .app-container {
      display: flex;
      flex-direction: column;
      width: ${width}px;
      margin: auto;
      margin-top: 1%;
      position: relative;
    }
    .menu {
      position: absolute;
      bottom: 10%;
      right: 1%;
      display: flex;
      justify-content: center;
      background-color: #ccc;
      padding: 10px;
      border-radius: 5px;
      flex-direction: column;
    }
    .hide {
      display: none;
    }
    .menu-section {
      padding: 10px;
      display: flex;
      flex-direction: column;
    }
    .controls-container {
      position: absolute;
      bottom: 5%;
      right: 1%;
      display: flex;
      justify-content: center;
      gap: 10px;
    }
  `;
	document.head.appendChild(style);
};

/**
 * Creates the algorithm canvas.
 * @returns The canvas element.
 */
const createCanvas = (width: number): HTMLCanvasElement => {
	const canvas = document.createElement('canvas');
	canvas.id = 'algorithm-canvas';
	canvas.width = width;
	canvas.height = 720;
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
	const menu = document.createElement('div');
	menu.className = 'menu hide';

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

	speedSection.appendChild(speedLabel);
	speedSection.appendChild(speedInput);

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
 * Creates the floating control button to toggle menu visibility.
 * @param menu - The menu element to toggle.
 * @returns The controls container.
 */
const createControls = (menu: HTMLDivElement): HTMLDivElement => {
	const controls = document.createElement('div');
	controls.className = 'controls-container';

	const toggleButton = document.createElement('button');
	toggleButton.textContent = 'menu';
	toggleButton.onclick = () => menu.classList.toggle('hide');

	controls.appendChild(toggleButton);
	return controls;
};
