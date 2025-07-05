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
	createAlgorithmCanvas, 
	Elements,
	getAppElement,
	getCanvas
} from './ui';

let scene: Scene<Generation> | TableSortScene | null = null;
let animationFrameId: number | null = null;

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
			Elements.BTN_PLAY, Elements.BTN_RANDOMIZE, Elements.BTN_SKIP_BACK,
			Elements.BTN_SKIP_FORWARD, Elements.BTN_STEP_BACK, Elements.BTN_STEP_FORWARD
		],
		dataSet: undefined,
		dataSetSize: 35,
		visibleButtons: [Elements.BTN_MENU],
		animationFrameDelay: 1400
	};

	const mergedOptions = {
		...defaultOptions,
		...options
	};

	return {
		...mergedOptions,
		canvasWidth: Math.min(window.innerWidth - 15, mergedOptions.canvasWidth || 1200),
		canvasHeight: Math.min(window.innerHeight - 15, mergedOptions.canvasHeight || 720),
	};
};

const getScene = (): Scene<Generation> | TableSortScene => {
	if (!scene) throw new Error('Scene is not initialized.');
	return scene;
};

const initScene = (options: AlgorithmCanvasOptions)  => {
	const { canvas, ctx } = getCanvas(options);
	if (options.selectedAlgorithm === 'bubblesort') {
		return new BubbleSortScene(canvas, ctx, options);
	} else if (options.selectedAlgorithm === 'insertionsort') {
		return new InsertionSortScene(canvas, ctx, options);
	} else if (options.selectedAlgorithm === 'selectionsort') {
		return new SelectionSortScene(canvas, ctx, options);
	} else if (options.selectedAlgorithm === 'shellsort') {
		return new ShellSortScene(canvas, ctx, options);
	} else if (options.selectedAlgorithm === 'quicksort') {
		return new QuickSortScene(canvas, ctx, options);
	} else if (options.selectedAlgorithm === 'mergesort') {
		return new MergeSortScene(canvas, ctx, options);
	} else if (options.selectedAlgorithm === 'countingsort') {
		return new CountingSortScene(canvas, ctx, options);
	} else if (options.selectedAlgorithm === 'playground') {
		return new TableSortScene(canvas, ctx, options);
	}
	throw new Error(`Unhandled Scene '${options.selectedAlgorithm}'`);
};

const setControlsDisabledState = (state: boolean, options: AlgorithmCanvasOptions) => {
	[
		getAppElement<HTMLButtonElement>(Elements.BTN_PLAY, options),
		getAppElement<HTMLButtonElement>(Elements.BTN_RANDOMIZE, options),
		getAppElement<HTMLButtonElement>(Elements.BTN_SKIP_BACK, options),
		getAppElement<HTMLButtonElement>(Elements.BTN_SKIP_FORWARD, options),
		getAppElement<HTMLButtonElement>(Elements.BTN_STEP_BACK, options),
		getAppElement<HTMLButtonElement>(Elements.BTN_STEP_FORWARD, options),
		getAppElement<HTMLSelectElement>(Elements.IPT_ALGORITHM_SELECTION, options)
	].forEach(el => {
		if (el instanceof HTMLButtonElement || el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
			el.disabled = state;
		}
		if (state) el.classList.add('disabled');
		else el.classList.remove('disabled');
	});
};

const mainLoop = (animationFrameTimeStamp: number, options: AlgorithmCanvasOptions) => {
	if (getScene().shouldDrawScene(animationFrameTimeStamp || performance.now())) {
		getScene().draw();
		getScene().update();
	}
	if (getScene().isIndexAtEnd()) {
		setControlsDisabledState(false, options);
	}
	requestAnimationFrame((aft) => mainLoop(aft, options));
};

const initClickHanlders = (options: AlgorithmCanvasOptions) => {
	const playButton = getAppElement<HTMLButtonElement>(Elements.BTN_PLAY, options);
	playButton.onclick = () => {
		if (getScene().loopState()) {
			setControlsDisabledState(true, options);
		} else {
			setControlsDisabledState(false, options);
		}
	};

	const animationFrameDelayInput = getAppElement<HTMLInputElement>(Elements.IPT_ANIMATION_SPEED, options);
	animationFrameDelayInput.oninput = () => {
		getScene().setAnimationSpeed(animationFrameDelayInput.valueAsNumber);
	};

	const randomizeButton = getAppElement<HTMLButtonElement>(Elements.BTN_RANDOMIZE, options);
	randomizeButton.onclick = () => {
		scene = initScene(options);
		scene.draw();
		scene.setAnimationSpeed(animationFrameDelayInput.valueAsNumber);
		if (animationFrameId) cancelAnimationFrame(animationFrameId);
		animationFrameId = requestAnimationFrame((aft) => mainLoop(aft, options));
	};

	const skipBackButton = getAppElement<HTMLButtonElement>(Elements.BTN_SKIP_BACK, options);
	skipBackButton.onclick = () => getScene().skipBackState();

	const skipForwardButton = getAppElement<HTMLButtonElement>(Elements.BTN_SKIP_FORWARD, options);
	skipForwardButton.onclick = () => getScene().skipForwardState();

	const stepBackButton = getAppElement<HTMLButtonElement>(Elements.BTN_STEP_BACK, options);
	stepBackButton.onclick = () => getScene().stepBackState();

	const stepForwardButton = getAppElement<HTMLButtonElement>(Elements.BTN_STEP_FORWARD, options);
	stepForwardButton.onclick = () => getScene().stepForwardState();

	const algorithmSelect = getAppElement<HTMLSelectElement>(Elements.IPT_ALGORITHM_SELECTION, options);
	algorithmSelect.value = options.selectedAlgorithm;
	algorithmSelect.onchange = () => {
		options.selectedAlgorithm = algorithmSelect.value;
		randomizeButton.click();
	};

};

const initResizeHanlder = (options: AlgorithmCanvasOptions) => {
	window.onresize = () => {
		const width = Math.min(window.innerWidth - 15, options.canvasWidth || 1200);
		const height = Math.min(window.innerHeight - 15, options.canvasHeight || 720);
		const {canvas } = getCanvas(options);
		canvas.width = width;
		canvas.height = height;
		const appContainer = getAppElement<HTMLDivElement>(Elements.CNT_APP, options);
		appContainer.style.width = `${width}px`;
		appContainer.style.height = `${height}px`;
		getScene().draw();
	};
};

const initIntersectionObserver = (options: AlgorithmCanvasOptions) => {
	if (options.stopAnimationWhenCanvasNotVisible) {
		const appContainer = getAppElement<HTMLDivElement>(Elements.CNT_APP, options);
		const playButton = getAppElement<HTMLButtonElement>(Elements.BTN_PLAY, options);
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					if (options.autoStartOnLoad && !getScene().state.isRunning) {
						playButton.click();
					}
				} else {
					if (getScene().state.isRunning) {
						playButton.click();
					}
				}
			});
		}, {
			root: null,
			threshold: 0.1 // Trigger when at least 10% of the canvas is visible
		});
		observer.observe(appContainer);
	}
};

export const run = (options: AlgorithmCanvasOptions) => {
	const mergedOptions = mergeIntoDefaultOptions(options);
	createAlgorithmCanvas(mergedOptions);
	initClickHanlders(mergedOptions);
	initResizeHanlder(mergedOptions);
	initIntersectionObserver(mergedOptions);

	// This click starts the main loop
	getAppElement<HTMLButtonElement>(Elements.BTN_RANDOMIZE, mergedOptions).click();
	if (options.autoStartOnLoad) {
		const playButton = getAppElement<HTMLButtonElement>(Elements.BTN_PLAY, mergedOptions);
		playButton.click();
	}
};
