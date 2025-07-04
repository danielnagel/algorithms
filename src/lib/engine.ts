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

	randomizeButton.onclick = () => {
		scene = initScene(options, canvas, ctx);
		scene.draw();
		scene.setAnimationSpeed(animationFrameDelayInput.valueAsNumber);
		if (animationFrameId) cancelAnimationFrame(animationFrameId);
		animationFrameId = requestAnimationFrame((aft) => mainLoop(aft, scene));
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
		randomizeButton.click();
	};
	elements.push(algorithmSelect);

	randomizeButton.click();

	window.onresize = () => {
		const width = Math.min(window.innerWidth - 15, options.canvasWidth || 1200);
		const height = Math.min(window.innerHeight - 15, options.canvasHeight || 720);
		canvas.width = width;
		canvas.height = height;
		appContainer.style.width = `${width}px`;
		appContainer.style.height = `${height}px`;
		scene.draw();
	};

	if (options.autoStartOnLoad) {
		playButton.click();
	}

	if (options.stopAnimationWhenCanvasNotVisible) {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					if (options.autoStartOnLoad && !scene.state.isRunning) {
						playButton.click();
					}
				} else {
					if (scene.state.isRunning) {
						playButton.click();
					}
				}
			});
		}, {
			root: null,
			threshold: 0.1 // Trigger when at least 10% of the canvas is visible
		});
		observer.observe(canvas);
	}
};