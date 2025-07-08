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
	 * 
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

	/**
	 * Retrieves the current scene instance.
	 * 
	 * @returns The current scene instance.
	 * @throws {Error} If the scene is not initialized.
	 */
	private getScene(): Scene<Generation> | TableSortScene {
		if (!this.scene) throw new Error('Scene is not initialized.');
		return this.scene;
	};

	/**
	 * This method creates a new scene instance based on the selected algorithm from the options.
	 * 
	 * It uses the `getCanvas` utility to retrieve the canvas and context, and then
	 * instantiates the appropriate scene class based on the `selectedAlgorithm` property.
	 * 
	 * @returns The current scene.
	 * @throws {Error} If the selected algorithm is not handled.
	 */
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

	/**
	 * Disables or enables the control buttons based on the provided state.
	 * @param state - The state to set the controls to.
	 */
	private setControlsDisabledState(state: boolean) {
		[
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
			if (state) {
				el.classList.add('disabled');
				el.tabIndex = -1;
			} else {
				el.classList.remove('disabled');
				el.tabIndex = 0;
			}
		});
	};

	/**
	 * The main loop of the application that handles the drawing and updating of the scene.
	 * 
	 * @param animationFrameTimeStamp - The timestamp of the current animation frame.
	 */
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

	/**
	 * Starts the main loop with the specified animation speed.
	 * 
	 * @param speed - The speed of the animation in milliseconds.
	 */
	private startMainLoop(speed: number) {
		this.scene = this.initScene();
		this.scene.draw();
		this.scene.setAnimationSpeed(speed);
		if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
		this.animationFrameId = requestAnimationFrame((aft) => this.mainLoop(aft));
	}

	/**
	 * Initializes the click handlers for the control buttons.
	 */
	private initClickHanlders() {
		const playButton = getAppElement<HTMLButtonElement>(Elements.BTN_PLAY, this.options);
		playButton.onclick = () => {
			const statusText = getAppElement<HTMLSpanElement>(Elements.TXT_ANIMATION_STATUS, this.options);
			if (this.getScene().loopState()) {
				this.setControlsDisabledState(true);
				statusText.textContent = 'animation running...';
			} else {
				this.setControlsDisabledState(false);
				statusText.textContent = 'animation stopped';
			}
		};
		const animationFrameDelayInput = getAppElement<HTMLInputElement>(Elements.IPT_ANIMATION_SPEED, this.options);
		animationFrameDelayInput.oninput = () => {
			this.getScene().setAnimationSpeed(animationFrameDelayInput.valueAsNumber);
		};
		const randomizeButton = getAppElement<HTMLButtonElement>(Elements.BTN_RANDOMIZE, this.options);
		randomizeButton.onclick = () => {
			this.startMainLoop(animationFrameDelayInput.valueAsNumber);
		};
		const algorithmSelect = getAppElement<HTMLSelectElement>(Elements.IPT_ALGORITHM_SELECTION, this.options);
		algorithmSelect.value = this.options.selectedAlgorithm;
		algorithmSelect.onchange = () => {
			this.options.selectedAlgorithm = algorithmSelect.value;
			randomizeButton.click();
		};
		getAppElement<HTMLButtonElement>(Elements.BTN_SKIP_BACK, this.options).onclick = () => this.getScene().skipBackState();
		getAppElement<HTMLButtonElement>(Elements.BTN_SKIP_FORWARD, this.options).onclick = () => this.getScene().skipForwardState();
		getAppElement<HTMLButtonElement>(Elements.BTN_STEP_BACK, this.options).onclick = () => this.getScene().stepBackState();
		getAppElement<HTMLButtonElement>(Elements.BTN_STEP_FORWARD, this.options).onclick = () => this.getScene().stepForwardState();
	};

	/**
	 * Initializes the resize handler to adjust the canvas and app container size on window resize.
	 */
	private initResizeHanlder() {
		window.onresize = () => {
			const maxHeight = window.innerHeight - 15;
			const maxWidth = window.innerWidth - 15;
			const minWidth = (this.options.canvasWidth || 1200) - 15;
			const minHeight = (this.options.canvasHeight || 720) - 15;
			const width = maxWidth < minWidth ? maxWidth : minWidth;
			const height = maxHeight < minHeight ? maxHeight : minHeight;
			const {canvas } = getCanvas(this.options);
			canvas.width = width;
			canvas.height = height;
			const appContainer = getAppElement<HTMLDivElement>(Elements.CNT_APP, this.options);
			appContainer.style.width = `${width}px`;
			appContainer.style.height = `${height}px`;
			this.getScene().draw();
		};
	};

	/**
	 * Initializes the Intersection Observer to handle visibility of the canvas.
	 * If the canvas is not visible, it stops the animation.
	 * If it becomes visible again, it starts the animation if autoStartOnLoad is true.
	 */
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

	/**
	 * Entry point of this application.
	 * It starts the main loop and optionally clicks the play button if autoStartOnLoad is true.
	 */
	start() {
		this.startMainLoop(this.options.animationFrameDelay || 1400);
		if (this.options.autoStartOnLoad) {
			const playButton = getAppElement<HTMLButtonElement>(Elements.BTN_PLAY, this.options);
			playButton.click();
		}
	};
}
