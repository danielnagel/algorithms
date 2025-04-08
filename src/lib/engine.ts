import {
	Scene,
	BubbleSortScene,
	InsertionSortScene,
	SelectionSortScene,
	ShellSortScene,
	QuickSortScene
} from './scenes';
import {
	MergeSortScene 
} from './scenes/mergesortscene';
import {
	TableSortScene 
} from './scenes/tablesortscene';

const mainLoop = (animationFrameTimeStamp: number, scene: Scene) => {
	if (scene.shouldDrawScene(animationFrameTimeStamp || performance.now())) {
		console.log('Drawing scene');
		scene.draw();
		scene.update();
	}
	if (scene.isIndexAtEnd()) {
		setControlsDisabledState(false);
	}
	requestAnimationFrame((aft) => mainLoop(aft, scene));
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

const initScene = (sceneName: string, colorTheme?: ColorTheme): Scene => {
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
	if (sceneName === 'bubblesort') {
		return new BubbleSortScene(canvas, ctx, colorTheme);
	} else if (sceneName === 'insertionsort') {
		return new InsertionSortScene(canvas, ctx, colorTheme);
	} else if (sceneName === 'selectionsort') {
		return new SelectionSortScene(canvas, ctx, colorTheme);
	} else if (sceneName === 'shellsort') {
		return new ShellSortScene(canvas, ctx, colorTheme);
	} else if (sceneName === 'quicksort') {
		return new QuickSortScene(canvas, ctx, colorTheme);
	} else if (sceneName === 'mergesort') {
		return new MergeSortScene(canvas, ctx, colorTheme);
	} else if (sceneName === 'playground') {
		return new TableSortScene(canvas, ctx, colorTheme);
	}
	throw new Error(`Unhandled Scene '${sceneName}'`);
};

export const run = (sceneName: string, colorTheme?: ColorTheme) => {

	let scene = initScene(sceneName, colorTheme);
	let animationFrameId: number | null = null;

	playButton = document.getElementById('play-button') as HTMLButtonElement;
	if (!playButton) throw Error('There is no play button in the DOM!');
	playButton.onclick = () => {
		if (!(playButton instanceof HTMLButtonElement)) return;
		if (scene.loopState()) {
			setControlsDisabledState(true);
		} else {
			setControlsDisabledState(false);
		}
	};

	const randomizeButton = document.getElementById('randomize-button') as HTMLButtonElement;
	if (!randomizeButton) throw Error('There is no randomize button in the DOM!');
	randomizeButton.onclick = () => {
		scene = initScene(sceneName);
		scene.draw();
		scene.setAnimationSpeed(animationFrameDelayInput.valueAsNumber);
		if (animationFrameId) cancelAnimationFrame(animationFrameId);
		animationFrameId = requestAnimationFrame((aft) => mainLoop(aft, scene));
	};
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
	animationFrameDelayInput.oninput = () => {
		scene.setAnimationSpeed(animationFrameDelayInput.valueAsNumber);
	};

	scene.draw();
	scene.setAnimationSpeed(animationFrameDelayInput.valueAsNumber);
	animationFrameId = requestAnimationFrame((aft) => mainLoop(aft, scene));
};