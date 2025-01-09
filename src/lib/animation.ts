import {
	generateRandomNumberArray 
} from './utils';

export class AnimationManager {
	readonly #maxDataCount: number = 35;
	readonly #maxDataSize: number = 100;
	readonly #canvasHeightRatio: number = 0.6;
	#canvasElement: HTMLCanvasElement | null = null;
	#script: Script | null = null;
	#randomizeButton: HTMLButtonElement | null = null;
	#playButton: HTMLButtonElement | null = null;
	#skipBackButton: HTMLButtonElement | null = null;
	#stepBackButton: HTMLButtonElement | null = null;
	#stepForwardButton: HTMLButtonElement | null = null;
	#skipForwardButton: HTMLButtonElement | null = null;
	#animationFrameDelayInput: HTMLInputElement | null = null;
	#colorTheme: ColorTheme = {
		primary: '#101010',
		primaryLight: '#202020',
		primaryLighter: '#303030',
		secondary: '#dadada',
		accent: '#6e90ff',
		accentSecondary: 'red'
	};
	#animationFrameRequestId: number | null = null;
	#animationIndex: number = 0;
	#animationFrameDelay: number = 1000;
	#animationDirection: 'forward' | 'backward' | undefined = undefined;
	#generations: NewGeneration[] = [];

	constructor(scriptName?: string, customColorTheme?: CustomColorTheme) {
		if (!scriptName) throw Error('Provide a script name!');
		this.setCustomColorTheme(customColorTheme);
		this.initElements();
		this.loadScript(scriptName);
	}

	initElements() {
		const canvasElement = document.getElementById('algorithm-canvas');
		if (!(canvasElement instanceof HTMLCanvasElement)) throw Error('There is no canvas in the DOM!');
		this.#canvasElement = canvasElement;
		this.#canvasElement.height = this.#canvasElement.width * this.#canvasHeightRatio;
		this.#canvasElement.style.background = this.#colorTheme.primaryLighter;

		// animation control-panel
		this.#randomizeButton = document.getElementById('randomize-button') as HTMLButtonElement;
		if (!this.#randomizeButton) throw Error('There is no randomize button in the DOM!');
		this.#playButton = document.getElementById('play-button') as HTMLButtonElement;
		if (!this.#playButton) throw Error('There is no play button in the DOM!');
		this.#skipBackButton = document.getElementById('skip-back-button') as HTMLButtonElement;
		if (!this.#skipBackButton) throw Error('There is no skip back button in the DOM!');
		this.#stepBackButton = document.getElementById('step-back-button') as HTMLButtonElement;
		if (!this.#stepBackButton) throw Error('There is no step back button in the DOM!');
		this.#stepForwardButton = document.getElementById('step-forward-button') as HTMLButtonElement;
		if (!this.#stepForwardButton) throw Error('There is no step forward button in the DOM!');
		this.#skipForwardButton = document.getElementById('skip-forward-button') as HTMLButtonElement;
		if (!this.#skipForwardButton) throw Error('There is no skip forward button in the DOM!');
		this.#animationFrameDelayInput = document.getElementById('interval-timeout-input') as HTMLInputElement;
		if (!this.#animationFrameDelayInput) throw Error('There is no interval timeout input in the DOM!');

		// add event handler
		this.#randomizeButton.onclick = () => this.restartScript();
		this.#playButton.onclick = () => this.startAnimationClickHandler();
		this.#skipBackButton.onclick = () => this.skipBackClickHandler();
		this.#stepBackButton.onclick = () => this.stepBackwardClickHandler();
		this.#stepForwardButton.onclick = () => this.stepForwardClickHandler();
		this.#skipForwardButton.onclick = () => this.skipForwardClickHandler();
		this.#animationFrameDelayInput.oninput = (event) => this.animationFrameDelayInputHandler(event as InputEvent);
		this.#animationFrameDelayInput.value = this.#animationFrameDelay.toString();
	}

	setCustomColorTheme(customColorTheme?: CustomColorTheme) {
		if (customColorTheme) {
			if (customColorTheme.primary)
				this.#colorTheme.primary = customColorTheme.primary;
			if (customColorTheme.primaryLight)
				this.#colorTheme.primaryLight = customColorTheme.primaryLight;
			if (customColorTheme.primaryLighter)
				this.#colorTheme.primaryLighter = customColorTheme.primaryLighter;
			if (customColorTheme.secondary)
				this.#colorTheme.secondary = customColorTheme.secondary;
			if (customColorTheme.accent)
				this.#colorTheme.accent = customColorTheme.accent;
			if (customColorTheme.accentSecondary)
				this.#colorTheme.accentSecondary = customColorTheme.accentSecondary;
		}
	}

	setControlsDisabledState = (state: boolean) => {
		if (!this.#playButton) return;
		this.#playButton.title = state ? 'pause' : 'play';
		const disableableElements = [this.#randomizeButton, this.#skipBackButton, this.#stepBackButton, this.#stepForwardButton, this.#skipForwardButton, this.#animationFrameDelayInput];
		disableableElements.forEach(el => {
			if (!(el instanceof HTMLButtonElement || el instanceof HTMLInputElement)) return;
			el.disabled = state;
			if (state) el.classList.add('disabled');
			else el.classList.remove('disabled');
		});
	};

	drawSwapAnimation(options: AnimationLoopState) {
		// draw background
		this.drawBarChart(options, true);
		if (options.b1 && options.b2) {
			// draw swapping bars
			this.drawBar(options, options.b1);
			this.drawBar(options, options.b2);
		}
	}

	updateSwapAnimation(options: AnimationLoopState) {
		if (!options.b1 && !options.b2 && options.initialB1x === undefined && options.intialB2x === undefined) {
			// setup swapping
			options.swapping = true;
			const {accentSecondary: secondaryColor} = this.#colorTheme;
			options.b1 = {
				x: options.generations[options.index].selectionIndizes[0] * this.getBarWidth(options.canvas.width, options.generations[options.index].data.length),
				value: options.generations[options.index].data[options.generations[options.index].selectionIndizes[options.isBackwards ? 0 : 1]],
				color: secondaryColor
			};
			options.b2 = {
				x: options.generations[options.index].selectionIndizes[1] * this.getBarWidth(options.canvas.width, options.generations[options.index].data.length),
				value: options.generations[options.index].data[options.generations[options.index].selectionIndizes[options.isBackwards ? 1 : 0]] ,
				color: secondaryColor
			};
			options.initialB1x = options.b1.x;
			options.intialB2x = options.b2.x;
			// TODO: remove magic number
			options.swapSpeed = 3000 / options.frameDelay * (options.generations[options.index].selectionIndizes[1]-options.generations[options.index].selectionIndizes[0]);
		} else if (options.b1 && options.b2 && options.initialB1x !== undefined && options.intialB2x !== undefined && options.swapSpeed !== undefined)  {
			if (options.b1.x < options.intialB2x && options.b2.x > options.initialB1x) {
				options.b1.x += options.swapSpeed;
				options.b2.x -= options.swapSpeed;
				options.swapping = true;
			} else {
				options.swapping = false;
				options.b1 = undefined;
				options.b2 = undefined;
				options.initialB1x = undefined;
				options.intialB2x = undefined;
				// lastTimestamp = 0: immediatly draw the next generation
				options.lastTimestamp = 0;
				this.#animationFrameRequestId = null;
			}
		}
	}

	mainLoop(options: AnimationLoopState) {
		console.log(`mainLoop[${options.index}] - state: ${options.generations[options.index].state}`);
		const now = options.animationFrameTimestamp || performance.now();
    	const elapsed = now - options.lastTimestamp;

		if (elapsed >= options.frameDelay || (options.swapping )) {
			options.lastTimestamp = now;
			options.ctx.clearRect(0, 0, options.canvas.width, options.canvas.height); // Clear the canvas

			// Draw logic
			if (options.generations[options.index].state === 'swap-selection') {
				console.log(`mainLoop[${options.index}] - draw: swap`);
				this.drawSwapAnimation(options);
			} else {
				console.log(`mainLoop[${options.index}] - draw: bars selection`);
				this.drawBarChart(options);
			}

			// Update logic
			if (options.generations[options.index].state === 'swap-selection') {
				console.log(`mainLoop[${options.index}] - update: swap`);
				this.updateSwapAnimation(options);
				if (!options.swapping) options.index++;
			} else {
				console.log(`mainLoop[${options.index}] - update: index`);
				options.index++;
			}
		}
		// finshed condition
		if (options.index < options.generations.length) {
			console.log(`mainLoop[${options.index}] - rerun mainLoop`);
			this.#animationFrameRequestId = requestAnimationFrame((aft) => {
				options.animationFrameTimestamp = aft;
				this.mainLoop(options);
			});
		} else {
			// nothing to do
			this.setControlsDisabledState(false);
			if (this.#animationFrameRequestId) cancelAnimationFrame(this.#animationFrameRequestId);
			options.index++;
		}
		this.#animationIndex = options.index;
	}

	addStateToGenerations(generations: Generation[]): NewGeneration[] {
		const newGenerations: NewGeneration[] = [];
		generations.forEach((gen, index) => {
			if (
				index > 0 &&
				generations[index - 1].selectionIndizes[0] === gen.selectionIndizes[0] &&
				generations[index - 1].selectionIndizes[1] === gen.selectionIndizes[1]
			) {
				newGenerations.push({
					state: 'swap-selection',
					pastData: generations[index-1].data,
					...gen
				});
			}
			newGenerations.push({
				state: 'update-selection',
				...gen
			});
		});
		return newGenerations;
	}

	initGenerations(script: Script | null, data?: number[]) {
		if (!script) {
			throw Error('initGenerations: No script available.');
		}
		const generations = this.addStateToGenerations(script.sortData(data));
		if (!generations.length) {
			throw Error('initGenerations: Could not create generations from data.');
		}
		return generations;
	}

	getInitialOptions(): AnimationLoopState {
		const canvas = this.#canvasElement;
		if (!canvas) {
			throw Error('getInitialOptions: no canvas');
		}
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			throw Error('getInitialOptions: no 2d rendering context');
		}
		return {
			canvas,
			ctx,
			generations: this.#generations,
			index: this.#animationIndex,
			animationFrameTimestamp: 0,
			lastTimestamp: 0,
			frameDelay: this.#animationFrameDelay,
			swapping: false
		};
	}

	async loadScript(scriptName: string) {
		const initialOptions = this.getInitialOptions();
		switch (scriptName) {
		case 'bubblesort':
			const { BubbleSort } = await import('./scritps/bubblesort');
			this.#script = new BubbleSort(generateRandomNumberArray(this.#maxDataCount, this.#maxDataSize));
			this.#generations = this.initGenerations(this.#script);
			initialOptions.generations = this.#generations;
			this.drawBarChart(initialOptions);
			break;
		case 'insertionsort':
			const { InsertionSort } = await import('./scritps/insertionsort');
			this.#script = new InsertionSort(generateRandomNumberArray(this.#maxDataCount, this.#maxDataSize));
			this.#generations = this.initGenerations(this.#script);
			initialOptions.generations = this.#generations;
			this.drawBarChart(initialOptions);
			break;
		case 'selectionsort':
			const { SelectionSort } = await import('./scritps/selectionsort');
			this.#script = new SelectionSort(generateRandomNumberArray(this.#maxDataCount, this.#maxDataSize));
			this.#generations = this.initGenerations(this.#script);
			initialOptions.generations = this.#generations;
			this.drawBarChart(initialOptions);
			break;
		case 'test':
			// playground
			break;
		default:
			throw Error(`Unknown script name: "${scriptName}".`);
		}
	}

	restartScript() {
		this.#generations = this.initGenerations(this.#script, generateRandomNumberArray(this.#maxDataCount, this.#maxDataSize));
		this.#animationIndex = 0;
		this.#animationDirection = undefined;
		this.drawBarChart(this.getInitialOptions());
	}

	drawBar(options: AnimationLoopState, bar: Bar) {
		const barGap = this.getBarGap(options.canvas.width);
		const drawAreaWidth = options.canvas.width - barGap;
		const barWidth = drawAreaWidth / options.generations[options.index].data.length;
		const maxBarHeight = Math.max(...options.generations[options.index].data);
		const barSpaceFromTop = barGap;
		const barSpaceFromBottom = barGap;
		const barHeight = (bar.value / maxBarHeight) * (options.canvas.height - barSpaceFromBottom - barSpaceFromTop); // Leave space for value text
		const y = options.canvas.height - barHeight - barSpaceFromBottom; // start from the top, begin to draw where the bar ends, leave space for the text
		// TODO: remove magic number
		const fontSize = drawAreaWidth * 0.015;
		const fontXPositionCorrection = fontSize * 0.5;
		const fontXPositionCorrectionSingleDigit = fontSize * 0.77;

		// Draw the bar
		options.ctx.fillStyle = bar.color;
		options.ctx.fillRect(bar.x + barGap, y, barWidth - barGap, barHeight); // Leave some space between bars

		// Draw the value below the bar
		options.ctx.font = `${fontSize}px system-ui, arial`;
		options.ctx.textRendering = 'optimizeSpeed';
		options.ctx.fillStyle = this.#colorTheme.secondary;
		const xFontPosition = bar.value < 10
			? bar.x + fontXPositionCorrectionSingleDigit
			: bar.x + fontXPositionCorrection;
		// TODO: remove magic number
		const yPosition = options.canvas.height * 0.985;
		options.ctx.fillText(`${bar.value}`, xFontPosition, yPosition);
	}

	getBarGap(canvasWidth: number): number {
		// TODO: remove magic number
		return canvasWidth * 0.0025;
	}

	getBarWidth(canvasWidth: number, generationDataLength: number) : number {
		return (canvasWidth - this.getBarGap(canvasWidth)) / generationDataLength;
	}

	drawBarChart(options: AnimationLoopState, hideSelection = false) {
		const {primary: primaryColor, accent: accentColor} = this.#colorTheme;
		options.ctx.clearRect(0, 0, options.canvas.width, options.canvas.height);
		const generation = options.generations[options.index];
		generation.data.forEach((value, index) => {
			if (hideSelection && generation.selectionIndizes?.includes(index)) return;
			this.drawBar(options, {
				value,
				x: index * this.getBarWidth(options.canvas.width, generation.data.length),
				color: generation.selectionIndizes?.includes(index) ? accentColor : primaryColor
			});
		});
	};

	swapAnimationLoop(options: AnimationLoopState) {
		options.ctx.clearRect(0, 0, options.canvas.width, options.canvas.height); // Clear the canvas

		// Draw logic
		if (options.generations[options.index].state === 'swap-selection') {
			this.drawSwapAnimation(options);
		} else {
			this.drawBarChart(options);
		}

		// Update logic
		if (options.generations[options.index].state === 'swap-selection') {
			this.updateSwapAnimation(options);
			if (!options.swapping && !options.isBackwards) options.index++;
			else if (!options.swapping && options.isBackwards) options.index--;
		} else if (options.isBackwards) {
			options.index--;
		} else {
			options.index++;
		}

		if (options.swapping) {
			this.#animationFrameRequestId = requestAnimationFrame(() => this.swapAnimationLoop(options));
		}
		this.#animationIndex = options.index;
	}

	stepForwardClickHandler() {
		if (this.#animationDirection === 'backward') {
			// updated to the next iteration, but we want to make a step back
			// 0 next step, +1 currently visible, +2 step forward
			this.#animationIndex = this.#animationIndex < 0 ? 1 : this.#animationIndex + 2;
		}
		this.#animationDirection = 'forward';

		// stop animation if clicked during an animation
		if (this.#animationFrameRequestId) {
			cancelAnimationFrame(this.#animationFrameRequestId);
			this.#animationIndex++;
		}

		if (this.#animationIndex >= this.#generations.length) this.#animationIndex = this.#generations.length - 1;
		this.swapAnimationLoop(this.getInitialOptions());
	}

	stepBackwardClickHandler() {
		if (this.#animationDirection === 'forward') {
			// updated to the next iteration, but we want to make a step back
			// 0 next step, -1 currently visible, -2 step back
			this.#animationIndex = this.#animationIndex - 2;
		}
		this.#animationDirection = 'backward';
		if (this.#animationIndex < 0) this.#animationIndex = 0;

		// stop animation if clicked during an animation
		if (this.#animationFrameRequestId) {
			cancelAnimationFrame(this.#animationFrameRequestId);
			this.#animationFrameRequestId = null;
			this.#animationIndex--;
		}

		const options = this.getInitialOptions();
		options.isBackwards = true;
		this.swapAnimationLoop(options);
	}

	startAnimationClickHandler() {
		// play
		this.setControlsDisabledState(true);

		if (this.#animationDirection === 'backward') {
			// updated to the next iteration, but we want to make a step back
			// 0 next step, +1 currently visible, +2 step forward
			this.#animationIndex = this.#animationIndex < 0 ? 1 : this.#animationIndex + 2;
		}
		this.#animationDirection = 'forward';

		if (this.#animationFrameRequestId) {
			cancelAnimationFrame(this.#animationFrameRequestId);
			this.#animationFrameRequestId = null;
			this.setControlsDisabledState(false);
			return;
		}

		if (this.#animationIndex >= this.#generations.length) {
			this.setControlsDisabledState(false);
			this.#animationIndex = this.#generations.length;
			return;
		}
		this.mainLoop(this.getInitialOptions());
	};

	skipBackClickHandler() {
		this.#animationIndex = -1;
		const options = this.getInitialOptions();
		options.index = 0;
		this.drawBarChart(options);
		if (this.#animationFrameRequestId) cancelAnimationFrame(this.#animationFrameRequestId);
		this.#animationFrameRequestId = null;
		this.setControlsDisabledState(false);
		this.#animationDirection = 'backward';
	};

	skipForwardClickHandler() {
		this.#animationIndex = this.#generations.length;
		const options = this.getInitialOptions();
		options.index = this.#animationIndex - 1;
		this.drawBarChart(options);
		if (this.#animationFrameRequestId) cancelAnimationFrame(this.#animationFrameRequestId);
		this.#animationFrameRequestId = null;
		this.setControlsDisabledState(false);
		this.#animationDirection = 'forward';
	};

	animationFrameDelayInputHandler(event: InputEvent) {
		if (!event.target || !(event.target instanceof HTMLInputElement)) return;
		const rawValue = event.target.value;
		let numberValue = this.#animationFrameDelay;
		try {
			numberValue = parseInt(rawValue);
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		}
		if (numberValue < 100) numberValue = 100;
		if (numberValue > 5000) numberValue = 5000;
		this.#animationFrameDelay = numberValue;
		event.target.value = this.#animationFrameDelay.toString();
	};
}
