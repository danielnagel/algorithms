import {
	Scene,
	BubbleSortScene,
	InsertionSortScene
} from './scenes';

const mainLoop = (scene: Scene) => {
	if (scene.shouldDrawScene()) {
		scene.draw();
		scene.update();
	}
	requestAnimationFrame(() => mainLoop(scene));
};


export const run = (sceneName: string) => {
	const canvasElement = document.getElementById('algorithm-canvas');
	if (!(canvasElement instanceof HTMLCanvasElement)) throw Error('There is no canvas in the DOM!');
	const canvas = canvasElement;
	if (!canvas) {
		throw Error('getInitialOptions: no canvas');
	}
	const ctx = canvas.getContext('2d');
	if (!ctx) {
		throw Error('getInitialOptions: no 2d rendering context');
	}

	let scene = null;

	if (sceneName === 'bubblesort') {
		scene = new BubbleSortScene(canvas, ctx);
	} else if (sceneName === 'insertionsort') {
		scene = new InsertionSortScene(canvas, ctx);
	} else {
		throw new Error(`Unhandled Scene '${sceneName}'`);
	}

	scene.draw();

	const playButton = document.getElementById('play-button') as HTMLButtonElement;
	if (!playButton) throw Error('There is no play button in the DOM!');
	playButton.onclick = () => scene.loopState();

	const randomizeButton = document.getElementById('randomize-button') as HTMLButtonElement;
	if (!randomizeButton) throw Error('There is no randomize button in the DOM!');
	randomizeButton.onclick = () => scene.resetState();

	const skipBackButton = document.getElementById('skip-back-button') as HTMLButtonElement;
	if (!skipBackButton) throw Error('There is no skip back button in the DOM!');
	skipBackButton.onclick = () => scene.skipBackState();

	const skipForwardButton = document.getElementById('skip-forward-button') as HTMLButtonElement;
	if (!skipForwardButton) throw Error('There is no skip forward button in the DOM!');
	skipForwardButton.onclick = () => scene.skipForwardState();

	const stepBackButton = document.getElementById('step-back-button') as HTMLButtonElement;
	if (!stepBackButton) throw Error('There is no step back button in the DOM!');
	stepBackButton.onclick = () => scene.stepBackState();

	const stepForwardButton = document.getElementById('step-forward-button') as HTMLButtonElement;
	if (!stepForwardButton) throw Error('There is no step forward button in the DOM!');
	stepForwardButton.onclick = () => scene.stepForwardState();

	const animationFrameDelayInput = document.getElementById('interval-timeout-input') as HTMLInputElement;
	if (!animationFrameDelayInput) throw Error('There is no interval timeout input in the DOM!');
	scene.setAnimationSpeed(animationFrameDelayInput.valueAsNumber);
	animationFrameDelayInput.oninput = () => {
		scene.setAnimationSpeed(animationFrameDelayInput.valueAsNumber);
	};

	requestAnimationFrame(() => mainLoop(scene));
};