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
	if (scene.isIndexAtEnd()) {
		setControlsDisabledState(false);
		if (!(playButton instanceof HTMLButtonElement)) return;
		playButton.title = 'start';
		playButton.innerText = 'start';
	}
	requestAnimationFrame(() => mainLoop(scene));
};

const elements: HTMLElement[] = [];
let playButton: HTMLButtonElement | undefined = undefined;

const setControlsDisabledState = (state: boolean) => {
	elements.forEach(el => {
		if (!(el instanceof HTMLButtonElement || el instanceof HTMLInputElement)) return;
		el.disabled = state;
		if (state) el.classList.add('disabled');
		else el.classList.remove('disabled');
	});
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

	playButton = document.getElementById('play-button') as HTMLButtonElement;
	if (!playButton) throw Error('There is no play button in the DOM!');
	playButton.onclick = () => {
		if (!(playButton instanceof HTMLButtonElement)) return;
		if (scene.loopState()) {
			playButton.title = 'stop';
			playButton.innerText = 'stop';
			setControlsDisabledState(true);
		} else {
			playButton.title = 'start';
			playButton.innerText = 'start';
			setControlsDisabledState(false);
		}
	};

	const randomizeButton = document.getElementById('randomize-button') as HTMLButtonElement;
	if (!randomizeButton) throw Error('There is no randomize button in the DOM!');
	randomizeButton.onclick = () => scene.resetState();
	elements.push(randomizeButton);

	const skipBackButton = document.getElementById('skip-back-button') as HTMLButtonElement;
	if (!skipBackButton) throw Error('There is no skip back button in the DOM!');
	skipBackButton.onclick = () => scene.skipBackState();
	elements.push(skipBackButton);

	const skipForwardButton = document.getElementById('skip-forward-button') as HTMLButtonElement;
	if (!skipForwardButton) throw Error('There is no skip forward button in the DOM!');
	skipForwardButton.onclick = () => scene.skipForwardState();
	elements.push(skipForwardButton);

	const stepBackButton = document.getElementById('step-back-button') as HTMLButtonElement;
	if (!stepBackButton) throw Error('There is no step back button in the DOM!');
	stepBackButton.onclick = () => scene.stepBackState();
	elements.push(stepBackButton);

	const stepForwardButton = document.getElementById('step-forward-button') as HTMLButtonElement;
	if (!stepForwardButton) throw Error('There is no step forward button in the DOM!');
	stepForwardButton.onclick = () => scene.stepForwardState();
	elements.push(stepForwardButton);

	const animationFrameDelayInput = document.getElementById('interval-timeout-input') as HTMLInputElement;
	if (!animationFrameDelayInput) throw Error('There is no interval timeout input in the DOM!');
	scene.setAnimationSpeed(animationFrameDelayInput.valueAsNumber);
	animationFrameDelayInput.oninput = () => {
		scene.setAnimationSpeed(animationFrameDelayInput.valueAsNumber);
	};

	requestAnimationFrame(() => mainLoop(scene));
};