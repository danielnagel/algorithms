import {
	Scene 
} from './scene';

const mainLoop = (scene: Scene) => {
	if (scene.shouldDrawScene()) {
		scene.draw();
		scene.update();
	}
	requestAnimationFrame(() => mainLoop(scene));
};


export const run = () => {
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

	const scene = new Scene(canvas, ctx);

	scene.draw();

	const playButton = document.getElementById('play-button') as HTMLButtonElement;
	if (!playButton) throw Error('There is no play button in the DOM!');
	playButton.onclick = () => {
		scene.loopState();
	};

	const randomizeButton = document.getElementById('randomize-button') as HTMLButtonElement;
	if (!randomizeButton) throw Error('There is no randomize button in the DOM!');
	randomizeButton.onclick = () => {
		scene.resetState();
	};

	const skipBackButton = document.getElementById('skip-back-button') as HTMLButtonElement;
	if (!skipBackButton) throw Error('There is no skip back button in the DOM!');
	skipBackButton.onclick = () => {
		scene.skipBackState();
	};

	const skipForwardButton = document.getElementById('skip-forward-button') as HTMLButtonElement;
	if (!skipForwardButton) throw Error('There is no skip forward button in the DOM!');
	skipForwardButton.onclick = () => {
		scene.skipForwardState();
	};

	const stepBackButton = document.getElementById('step-back-button') as HTMLButtonElement;
	if (!stepBackButton) throw Error('There is no step back button in the DOM!');
	stepBackButton.onclick = () => {
		scene.stepBackState();
	};

	const stepForwardButton = document.getElementById('step-forward-button') as HTMLButtonElement;
	if (!stepForwardButton) throw Error('There is no step forward button in the DOM!');
	stepForwardButton.onclick = () => {
		scene.stepForwardState();
	};

	requestAnimationFrame(() => mainLoop(scene));
};