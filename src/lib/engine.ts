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

export default class AlgorithmCanvasEngine {

	private options: AlgorithmCanvasOptions;
	private scene: Scene<Generation> | TableSortScene | null = null;
	private animationFrameId: number | null = null;

	constructor(options: AlgorithmCanvasOptions) {
		this.options = this.mergeIntoDefaultOptions(options);
		createAlgorithmCanvas(this.options);
		this.initClickHanlders();
		this.initResizeHanlder();
		this.initIntersectionObserver();
	}

	/**
	 * Merges the provided options with the default options.
	 * @param options - The options to merge.
	 * @returns The merged options.
	 */
	private mergeIntoDefaultOptions(options: AlgorithmCanvasOptions): AlgorithmCanvasOptions {
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

	private getScene(): Scene<Generation> | TableSortScene {
		if (!this.scene) throw new Error('Scene is not initialized.');
		return this.scene;
	};

	private initScene() {
		const { canvas, ctx } = getCanvas(this.options);
		if (this.options.selectedAlgorithm === 'bubblesort') {
			return new BubbleSortScene(canvas, ctx, this.options);
		} else if (this.options.selectedAlgorithm === 'insertionsort') {
			return new InsertionSortScene(canvas, ctx, this.options);
		} else if (this.options.selectedAlgorithm === 'selectionsort') {
			return new SelectionSortScene(canvas, ctx, this.options);
		} else if (this.options.selectedAlgorithm === 'shellsort') {
			return new ShellSortScene(canvas, ctx, this.options);
		} else if (this.options.selectedAlgorithm === 'quicksort') {
			return new QuickSortScene(canvas, ctx, this.options);
		} else if (this.options.selectedAlgorithm === 'mergesort') {
			return new MergeSortScene(canvas, ctx, this.options);
		} else if (this.options.selectedAlgorithm === 'countingsort') {
			return new CountingSortScene(canvas, ctx, this.options);
		} else if (this.options.selectedAlgorithm === 'playground') {
			return new TableSortScene(canvas, ctx, this.options);
		}
		throw new Error(`Unhandled Scene '${this.options.selectedAlgorithm}'`);
	};

	private setControlsDisabledState(state: boolean) {
		[
			getAppElement<HTMLButtonElement>(Elements.BTN_PLAY, this.options),
			getAppElement<HTMLButtonElement>(Elements.BTN_RANDOMIZE, this.options),
			getAppElement<HTMLButtonElement>(Elements.BTN_SKIP_BACK, this.options),
			getAppElement<HTMLButtonElement>(Elements.BTN_SKIP_FORWARD, this.options),
			getAppElement<HTMLButtonElement>(Elements.BTN_STEP_BACK, this.options),
			getAppElement<HTMLButtonElement>(Elements.BTN_STEP_FORWARD, this.options),
			getAppElement<HTMLSelectElement>(Elements.IPT_ALGORITHM_SELECTION, this.options)
		].forEach(el => {
			if (el instanceof HTMLButtonElement || el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
				el.disabled = state;
			}
			if (state) el.classList.add('disabled');
			else el.classList.remove('disabled');
		});
	};

	private mainLoop(animationFrameTimeStamp: number) {
		if (this.getScene().shouldDrawScene(animationFrameTimeStamp || performance.now())) {
			this.getScene().draw();
			this.getScene().update();
		}
		if (this.getScene().isIndexAtEnd()) {
			this.setControlsDisabledState(false);
		}
		requestAnimationFrame((aft) => this.mainLoop(aft));
	};

	private initClickHanlders() {
		const playButton = getAppElement<HTMLButtonElement>(Elements.BTN_PLAY, this.options);
		playButton.onclick = () => {
			if (this.getScene().loopState()) {
				this.setControlsDisabledState(true);
			} else {
				this.setControlsDisabledState(false);
			}
		};

		const animationFrameDelayInput = getAppElement<HTMLInputElement>(Elements.IPT_ANIMATION_SPEED, this.options);
		animationFrameDelayInput.oninput = () => {
			this.getScene().setAnimationSpeed(animationFrameDelayInput.valueAsNumber);
		};

		const randomizeButton = getAppElement<HTMLButtonElement>(Elements.BTN_RANDOMIZE, this.options);
		randomizeButton.onclick = () => {
			this.scene = this.initScene();
			this.scene.draw();
			this.scene.setAnimationSpeed(animationFrameDelayInput.valueAsNumber);
			if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = requestAnimationFrame((aft) => this.mainLoop(aft));
		};

		const skipBackButton = getAppElement<HTMLButtonElement>(Elements.BTN_SKIP_BACK, this.options);
		skipBackButton.onclick = () => this.getScene().skipBackState();

		const skipForwardButton = getAppElement<HTMLButtonElement>(Elements.BTN_SKIP_FORWARD, this.options);
		skipForwardButton.onclick = () => this.getScene().skipForwardState();

		const stepBackButton = getAppElement<HTMLButtonElement>(Elements.BTN_STEP_BACK, this.options);
		stepBackButton.onclick = () => this.getScene().stepBackState();

		const stepForwardButton = getAppElement<HTMLButtonElement>(Elements.BTN_STEP_FORWARD, this.options);
		stepForwardButton.onclick = () => this.getScene().stepForwardState();

		const algorithmSelect = getAppElement<HTMLSelectElement>(Elements.IPT_ALGORITHM_SELECTION, this.options);
		algorithmSelect.value = this.options.selectedAlgorithm;
		algorithmSelect.onchange = () => {
			this.options.selectedAlgorithm = algorithmSelect.value;
			randomizeButton.click();
		};

	};

	private initResizeHanlder() {
		window.onresize = () => {
			const width = Math.min(window.innerWidth - 15, this.options.canvasWidth || 1200);
			const height = Math.min(window.innerHeight - 15, this.options.canvasHeight || 720);
			const {canvas } = getCanvas(this.options);
			canvas.width = width;
			canvas.height = height;
			const appContainer = getAppElement<HTMLDivElement>(Elements.CNT_APP, this.options);
			appContainer.style.width = `${width}px`;
			appContainer.style.height = `${height}px`;
			this.getScene().draw();
		};
	};

	private initIntersectionObserver() {
		if (this.options.stopAnimationWhenCanvasNotVisible) {
			const appContainer = getAppElement<HTMLDivElement>(Elements.CNT_APP, this.options);
			const playButton = getAppElement<HTMLButtonElement>(Elements.BTN_PLAY, this.options);
			const observer = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						if (this.options.autoStartOnLoad && !this.getScene().state.isRunning) {
							playButton.click();
						}
					} else {
						if (this.getScene().state.isRunning) {
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

	execute() {
		// This click starts the main loop
		getAppElement<HTMLButtonElement>(Elements.BTN_RANDOMIZE, this.options).click();
		if (this.options.autoStartOnLoad) {
			const playButton = getAppElement<HTMLButtonElement>(Elements.BTN_PLAY, this.options);
			playButton.click();
		}
	};
}
