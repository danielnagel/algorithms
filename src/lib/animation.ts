import {
	generateRandomNumberArray, 
	range
} from './utils';

export class AnimationManager {
	readonly #maxDataCount: number = 35;
	readonly #maxDataSize: number = 100;
	readonly #canvasHeightRatio: number = 0.6;
	readonly #barGap: number = 0.0025;
	readonly #fontSize: number = 0.015;
	readonly #fontSizeCorrection: number = 0.5;
	readonly #fontSizeSingleDigitCorrection: number = 0.77;
	readonly #fontVerticalPositionGap: number = 0.985;
	readonly #swapSpeed = 3000;
	readonly #scriptName: string;
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
	readonly #maxAnimationFrameDelay = 2000;

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
			algorithmType: this.#scriptName,
			generations: this.#generations,
			index: this.#animationIndex,
			animationFrameTimestamp: 0,
			lastTimestamp: 0,
			frameDelay: this.#maxAnimationFrameDelay - this.#animationFrameDelay,
			swapping: false
		};
	}

	initGenerations(script: Script | null, data?: number[]) {
		if (!script) {
			throw Error('initGenerations: No script available.');
		}
		const generations = script.addStateToGenerations(script.sortData(data));
		if (!generations.length) {
			throw Error('initGenerations: Could not create generations from data.');
		}
		return generations;
	}

	getBarGap(canvasWidth: number): number {
		return canvasWidth * this.#barGap;
	}

	getBarWidth(canvasWidth: number, generationDataLength: number) : number {
		return (canvasWidth - this.getBarGap(canvasWidth)) / generationDataLength;
	}

	shouldBarBeDrawn(generation: Generation, index: number, hideSelection: boolean) {
		if (hideSelection && generation.selectionIndizes?.includes(index)) {
			if (this.#scriptName === 'shellsort' && generation.subListSelection && !(generation.selectionIndizes[generation.subListSelection[0]] === index || generation.selectionIndizes[generation.subListSelection[1]] === index)) {
				return true;
			}
			return false;
		}
		return true;
	}

	getBarColor(generation: Generation, index: number, hideSelection: boolean) {
		const {primary: primaryColor, accent: accentColor, accentSecondary: accentSecondaryColor} = this.#colorTheme;

		if (this.#scriptName === 'quicksort') {
			if (generation.selectionIndizes && generation.selectionIndizes.includes(index)) {
				return accentSecondaryColor;
			}
			if (generation.subListRange) {
				const [start, stop] = generation.subListRange;
				if (range(start, stop).includes(index)) {
					return accentColor;
				}
			}
			return primaryColor;
		}

		if (generation.selectionIndizes && generation.selectionIndizes.includes(index)) {
			if (this.#scriptName === 'shellsort' && generation.subListSelection && (generation.selectionIndizes[generation.subListSelection[0]] === index || generation.selectionIndizes[generation.subListSelection[1]] === index) && !hideSelection) {
				return accentSecondaryColor;
			}
			return accentColor;
		}
		return primaryColor;
	}

	drawBarChart(options: AnimationLoopState, hideSelection = false) {
		options.ctx.clearRect(0, 0, options.canvas.width, options.canvas.height);
		const generation = options.generations[options.index];
		generation.data.forEach((value, index) => {
			if (!this.shouldBarBeDrawn(generation, index, hideSelection)) return;
			this.drawBar(options, {
				value,
				x: index * this.getBarWidth(options.canvas.width, generation.data.length),
				color: this.getBarColor(generation, index, hideSelection)
			});
		});
		if (this.#scriptName === 'quicksort' && generation.subListRange) {
			const {barGap, y, barHeight} = this.getBarRect(options.canvas.width, options.canvas.height, generation.data, generation.data[generation.subListRange[1]], 0);
			options.ctx.fillStyle = this.#colorTheme.secondary;
			options.ctx.fillRect(barGap, y, options.canvas.width - barGap*2, barGap);
			const pivotTextY = options.canvas.height - barHeight;
			let textPositionCorrection = -10;
			if (pivotTextY < 25) {
				textPositionCorrection = 15;
			}
			options.ctx.fillText('p', 10, pivotTextY + textPositionCorrection);
		}
	};

	restartScript() {
		this.#generations = this.initGenerations(this.#script, generateRandomNumberArray(this.#maxDataCount, this.#maxDataSize));
		this.#animationIndex = 0;
		this.#animationDirection = undefined;
		this.drawBarChart(this.getInitialOptions());
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

	getBarRect(canvasWidth: number, canvasHeight: number, data: number[], barValue: number, barX: number) {
		const barGap = this.getBarGap(canvasWidth);
		const drawAreaWidth = canvasWidth - barGap;
		const barWidth = drawAreaWidth / data.length;
		const maxBarHeight = Math.max(...data);
		const barSpaceFromTop = barGap;
		const barSpaceFromBottom = barGap;
		const barHeight = (barValue / maxBarHeight) * (canvasHeight - barSpaceFromBottom - barSpaceFromTop); // Leave space for value text
		const y = canvasHeight - barHeight - barSpaceFromBottom; // start from the top, begin to draw where the bar ends, leave space for the text
		const fontSize = drawAreaWidth * this.#fontSize;
		const fontXPositionCorrection = fontSize * this.#fontSizeCorrection;
		const fontXPositionCorrectionSingleDigit = fontSize * this.#fontSizeSingleDigitCorrection;
		const xFontPosition = barValue < 10
			? barX + fontXPositionCorrectionSingleDigit
			: barX + fontXPositionCorrection;
		const yFontPosition = canvasHeight * this.#fontVerticalPositionGap;
		return {
			barGap,
			y,
			barWidth,
			barHeight,
			xFontPosition,
			yFontPosition,
			fontSize
		};
	}

	drawBar(options: AnimationLoopState, bar: Bar) {
		const {barGap, y, barWidth, barHeight, xFontPosition, fontSize, yFontPosition} = this.getBarRect(options.canvas.width, options.canvas.height, options.generations[options.index].data, bar.value, bar.x);

		// Draw the bar
		options.ctx.fillStyle = bar.color;
		options.ctx.fillRect(bar.x + barGap, y, barWidth - barGap, barHeight); // Leave some space between bars

		// Draw value in the bar
		options.ctx.font = `${fontSize}px system-ui, arial`;
		options.ctx.textRendering = 'optimizeSpeed';
		options.ctx.fillStyle = this.#colorTheme.secondary;
		options.ctx.fillText(`${bar.value}`, xFontPosition, yFontPosition);
	}

	drawSwapAnimation(options: AnimationLoopState) {
		// draw background
		this.drawBarChart(options, true);
		if (options.b1 && options.b2) {
			// draw swapping bars
			this.drawBar(options, options.b1);
			this.drawBar(options, options.b2);
		}
	}

	getBar(options: AnimationLoopState, index: number, backwardIndex: number) {
		const {accentSecondary: color} = this.#colorTheme;
		let x = options.generations[options.index].selectionIndizes[index] * this.getBarWidth(options.canvas.width, options.generations[options.index].data.length);
		let value = options.generations[options.index].data[options.generations[options.index].selectionIndizes[options.isBackwards ? index : backwardIndex]];
		if (options.algorithmType === 'shellsort') {
			const subListSelection = options.generations[options.index].subListSelection;
			if (subListSelection && subListSelection[index]) {
				x = options.generations[options.index].selectionIndizes[subListSelection[index]] * this.getBarWidth(options.canvas.width, options.generations[options.index].data.length);
				value = options.generations[options.index].data[options.generations[options.index].selectionIndizes[options.isBackwards ? subListSelection[index] : subListSelection[backwardIndex]]];
			}
		}
		return {
			x,
			value,
			color 
		};
	}

	updateSwapAnimation(options: AnimationLoopState) {
		if (!options.b1 && !options.b2 && options.initialB1x === undefined && options.initialB2x === undefined) {
			// setup swapping
			options.swapping = true;
			options.b1 = this.getBar(options, 0, 1);
			options.b2 = this.getBar(options, 1, 0);
			options.initialB1x = options.b1.x;
			options.initialB2x = options.b2.x;
			options.swapSpeed = this.#swapSpeed / options.frameDelay * (options.generations[options.index].selectionIndizes[1]-options.generations[options.index].selectionIndizes[0]);
		} else if (options.b1 && options.b2 && options.initialB1x !== undefined && options.initialB2x !== undefined && options.swapSpeed !== undefined)  {
			if (options.b1.x < options.initialB2x && options.b2.x > options.initialB1x) {
				options.b1.x += options.swapSpeed;
				if (options.b1.x > options.initialB2x) options.b1.x = options.initialB2x;
				options.b2.x -= options.swapSpeed;
				if (options.b2.x < options.initialB1x) options.b2.x = options.initialB1x;
				options.swapping = true;
			} else {
				options.swapping = false;
				options.b1 = undefined;
				options.b2 = undefined;
				options.initialB1x = undefined;
				options.initialB2x = undefined;
				// lastTimestamp = 0: immediatly draw the next generation
				options.lastTimestamp = 0;
				this.#animationFrameRequestId = null;
			}
		}
	}

	mainLoop(options: AnimationLoopState) {
		const now = options.animationFrameTimestamp || performance.now();
    	const elapsed = now - options.lastTimestamp;

		if (elapsed >= options.frameDelay || (options.swapping )) {
			options.lastTimestamp = now;

			// Draw logic
			if (options.generations[options.index].state === 'swap-selection' && options.frameDelay > 0) {
				this.drawSwapAnimation(options);
			} else {
				this.drawBarChart(options);
			}

			// Update logic
			if (options.generations[options.index].state === 'swap-selection' && options.frameDelay > 0) {
				this.updateSwapAnimation(options);
				if (!options.swapping) options.index++;
			} else {
				options.index++;
			}
		}
		// finshed condition
		if (options.index < options.generations.length) {
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

	startAnimationClickHandler() {
		// play
		this.setControlsDisabledState(true);

		if (this.#animationDirection === 'backward') {
			// updated to the next iteration, but we want to make a step back
			// 0 next step, +1 currently visible, +2 step forward
			this.#animationIndex = this.#animationIndex < 0 ? 1 : this.#animationIndex + 2;
		}
		this.#animationDirection = 'forward';
		if (this.#animationIndex === 0) this.#animationIndex = 1;

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
	}

	skipBackClickHandler() {
		this.#animationIndex = -1;
		const options = this.getInitialOptions();
		options.index = 0;
		this.drawBarChart(options);
		if (this.#animationFrameRequestId) cancelAnimationFrame(this.#animationFrameRequestId);
		this.#animationFrameRequestId = null;
		this.setControlsDisabledState(false);
		this.#animationDirection = 'backward';
	}

	swapAnimationLoop(options: AnimationLoopState) {
		// Draw logic
		if (options.generations[options.index].state === 'swap-selection') {
			this.drawSwapAnimation(options);
		} else {
			this.drawBarChart(options);
		}

		// Update logic
		if (options.generations[options.index].state === 'swap-selection') {
			this.updateSwapAnimation(options);
			if (!options.swapping && !options.isBackwards) {
				// draw the next selection after the swap animation 
				options.index++;
				this.drawBarChart(options);
				options.index++;
			} else if (!options.swapping && options.isBackwards) {
				options.index--;
				this.drawBarChart(options);
				options.index--;
			}
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

	stepForwardClickHandler() {
		if (this.#animationDirection === 'backward') {
			// updated to the next iteration, but we want to make a step back
			// 0 next step, +1 currently visible, +2 step forward
			this.#animationIndex = this.#animationIndex < 0 ? 1 : this.#animationIndex + 2;
		}
		this.#animationDirection = 'forward';
		if (this.#animationIndex === 0) this.#animationIndex = 1;

		// stop animation if clicked during an animation
		if (this.#animationFrameRequestId) {
			cancelAnimationFrame(this.#animationFrameRequestId);
			this.#animationFrameRequestId = null;
			this.#animationIndex++;
		}

		if (this.#animationIndex >= this.#generations.length) this.#animationIndex = this.#generations.length - 1;
		this.swapAnimationLoop(this.getInitialOptions());
	}

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
		if (numberValue > this.#maxAnimationFrameDelay) numberValue = this.#maxAnimationFrameDelay;
		this.#animationFrameDelay = numberValue;
		event.target.value = this.#animationFrameDelay.toString();
	};

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

	async loadScript() {
		const initialOptions = this.getInitialOptions();
		switch (initialOptions.algorithmType) {
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
		case 'shellsort':
			const { ShellSort } = await import('./scritps/shellsort');
			this.#script = new ShellSort(generateRandomNumberArray(this.#maxDataCount, this.#maxDataSize));
			this.#generations = this.initGenerations(this.#script);
			initialOptions.generations = this.#generations;
			this.drawBarChart(initialOptions);
			break;
		case 'quicksort':
			const { QuickSort } = await import('./scritps/quicksort');
			this.#script = new QuickSort(generateRandomNumberArray(this.#maxDataCount, this.#maxDataSize));
			this.#generations = this.initGenerations(this.#script);
			initialOptions.generations = this.#generations;
			this.drawBarChart(initialOptions);
			break;
		default:
			throw Error(`Unknown script name: "${initialOptions.algorithmType}".`);
		}
	}

	constructor(scriptName?: string, customColorTheme?: CustomColorTheme) {
		if (!scriptName) throw Error('Provide a script name!');
		this.#scriptName = scriptName;
		this.setCustomColorTheme(customColorTheme);
		this.initElements();
		this.loadScript();
	}

	
}
