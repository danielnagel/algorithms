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
		if (!(el instanceof HTMLButtonElement || el instanceof HTMLInputElement)) return;
		el.disabled = state;
		if (state) el.classList.add('disabled');
		else el.classList.remove('disabled');
	});
};

const initScene = (sceneName: string, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, colorTheme?: ColorTheme)  => {
	if (!canvas) {
		throw Error('getInitialOptions: no canvas');
	}
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
	} else if (sceneName === 'countingsort') {
		return new CountingSortScene(canvas, ctx, colorTheme);
	} else if (sceneName === 'playground') {
		return new TableSortScene(canvas, ctx, colorTheme);
	}
	throw new Error(`Unhandled Scene '${sceneName}'`);
};

// TODO: option ideas:
// - target container ID
// - custom canvas size
// - custom canvas background color
// - custom canvas border
// - custom canvas border radius
// - custom canvas font
// - custom canvas font size
// - custom canvas font color
// - custom canvas font family
// - custom color theme
// - custom array size
// - autostart on load
// - selectable algorithms
// - set algorithm
// - initial animation speed
export const run = (sceneName: string, colorTheme?: ColorTheme) => {

	const {canvas,
		ctx,
		algorithmSelect,
		animationFrameDelayInput,
		playButton,
		randomizeButton,
		skipBackButton,
		skipForwardButton,
		stepBackButton,
		stepForwardButton} = createAlgorithmCanvas({
		id: 'app',
		width: 1200 
	});

	let scene = initScene(sceneName, canvas, ctx, colorTheme);
	let animationFrameId: number | null = null;

	playButton.onclick = () => {
		if (scene.loopState()) {
			setControlsDisabledState(true);
		} else {
			setControlsDisabledState(false);
		}
	};

	const resetScene = () => {
		scene = initScene(sceneName, canvas, ctx);
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

	algorithmSelect.value = sceneName;
	algorithmSelect.onchange = () => {
		sceneName = algorithmSelect.value;
		resetScene();
	};

	resetScene();
};