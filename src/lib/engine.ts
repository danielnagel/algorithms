import {
	Scene,
	BubbleSortScene,
	InsertionSortScene,
	SelectionSortScene,
	ShellSortScene,
	QuickSortScene
} from './scenes';
import {
	CountingSortScene 
} from './scenes/countingsortscene';
import {
	MergeSortScene 
} from './scenes/mergesortscene';
import {
	TableSortScene 
} from './scenes/tablesortscene';
import {
	createAlgorithmCanvas 
} from './ui';

const mainLoop = (animationFrameTimeStamp: number, scene: Scene<Generation> | TableSortScene) => {
	if (scene.shouldDrawScene(animationFrameTimeStamp || performance.now())) {
		scene.draw();
		scene.update();
	}
	if (scene.isIndexAtEnd()) {
		setControlsDisabledState(false);
	}
	requestAnimationFrame((aft) => mainLoop(aft, scene));
};

const elements: HTMLElement[] = [];

const setControlsDisabledState = (state: boolean) => {
	elements.forEach(el => {
		if (el instanceof HTMLButtonElement || el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
			el.disabled = state;
		}
		if (state) el.classList.add('disabled');
		else el.classList.remove('disabled');
	});
};

const initScene = (options: AlgorithmCanvasOptions, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D)  => {
	const {selectedAlgorithm: sceneName, colorTheme, dataSet } = options;
	if (sceneName === 'bubblesort') {
		return new BubbleSortScene(canvas, ctx, colorTheme, dataSet);
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
	} else if (sceneName === 'countingsort') {
		return new CountingSortScene(canvas, ctx, colorTheme);
	} else if (sceneName === 'playground') {
		return new TableSortScene(canvas, ctx, colorTheme);
	}
	throw new Error(`Unhandled Scene '${sceneName}'`);
};

export const run = (options: AlgorithmCanvasOptions) => {

	const {canvas,
		ctx,
		algorithmSelect,
		animationFrameDelayInput,
		playButton,
		randomizeButton,
		skipBackButton,
		skipForwardButton,
		stepBackButton,
		stepForwardButton,
		appContainer} = createAlgorithmCanvas(options);

	let scene = initScene(options, canvas, ctx);
	let animationFrameId: number | null = null;

	playButton.onclick = () => {
		if (scene.loopState()) {
			setControlsDisabledState(true);
		} else {
			setControlsDisabledState(false);
		}
	};

	const resetScene = () => {
		scene = initScene(options, canvas, ctx);
		scene.draw();
		scene.setAnimationSpeed(animationFrameDelayInput.valueAsNumber);
		if (animationFrameId) cancelAnimationFrame(animationFrameId);
		animationFrameId = requestAnimationFrame((aft) => mainLoop(aft, scene));
	};

	randomizeButton.onclick = () => {
		resetScene();
	};
	elements.push(randomizeButton);

	skipBackButton.onclick = () => scene.skipBackState();
	elements.push(skipBackButton);

	skipForwardButton.onclick = () => scene.skipForwardState();
	elements.push(skipForwardButton);

	stepBackButton.onclick = () => scene.stepBackState();
	elements.push(stepBackButton);

	stepForwardButton.onclick = () => scene.stepForwardState();
	elements.push(stepForwardButton);

	animationFrameDelayInput.oninput = () => {
		scene.setAnimationSpeed(animationFrameDelayInput.valueAsNumber);
	};

	algorithmSelect.value = options.selectedAlgorithm;
	algorithmSelect.onchange = () => {
		options.selectedAlgorithm = algorithmSelect.value;
		resetScene();
	};
	elements.push(algorithmSelect);

	resetScene();

	window.onresize = () => {
		const width = Math.min(window.innerWidth - 15, options.canvasWidth || 1200);
		const height = Math.min(window.innerHeight - 15, options.canvasHeight || 720);
		canvas.width = width;
		canvas.height = height;
		appContainer.style.width = `${width}px`;
		appContainer.style.height = `${height}px`;
		scene.draw();
	};
};