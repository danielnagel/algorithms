import {
	generateRandomNumberArray 
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

	drawBarChart(options: AnimationLoopState, hideSelection = false) {
		const {primary: primaryColor, accent: accentColor, accentSecondary: accentSecondaryColor} = this.#colorTheme;
		options.ctx.clearRect(0, 0, options.canvas.width, options.canvas.height);
		const generation = options.generations[options.index];
		generation.data.forEach((value, index) => {
			if (hideSelection && generation.selectionIndizes?.includes(index) && !generation.subListSelection) return;
			let color = primaryColor;
			if (generation.selectionIndizes && generation.selectionIndizes.includes(index)) {
				color = accentColor;
				if (generation.subListSelection) {
					if ((generation.selectionIndizes[generation.subListSelection[0]] === index || generation.selectionIndizes[generation.subListSelection[1]] === index)) {
						if (hideSelection) return;
						color = accentSecondaryColor;
					}
				}
			}
			this.drawBar(options, {
				value,
				x: index * this.getBarWidth(options.canvas.width, generation.data.length),
				color
			});
		});
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

	drawBar(options: AnimationLoopState, bar: Bar) {
		const barGap = this.getBarGap(options.canvas.width);
		const drawAreaWidth = options.canvas.width - barGap;
		const barWidth = drawAreaWidth / options.generations[options.index].data.length;
		const maxBarHeight = Math.max(...options.generations[options.index].data);
		const barSpaceFromTop = barGap;
		const barSpaceFromBottom = barGap;
		const barHeight = (bar.value / maxBarHeight) * (options.canvas.height - barSpaceFromBottom - barSpaceFromTop); // Leave space for value text
		const y = options.canvas.height - barHeight - barSpaceFromBottom; // start from the top, begin to draw where the bar ends, leave space for the text
		const fontSize = drawAreaWidth * this.#fontSize;
		const fontXPositionCorrection = fontSize * this.#fontSizeCorrection;
		const fontXPositionCorrectionSingleDigit = fontSize * this.#fontSizeSingleDigitCorrection;

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
		const yPosition = options.canvas.height * this.#fontVerticalPositionGap;
		options.ctx.fillText(`${bar.value}`, xFontPosition, yPosition);
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

	updateSwapAnimation(options: AnimationLoopState) {
		if (!options.b1 && !options.b2 && options.initialB1x === undefined && options.initialB2x === undefined) {
			// setup swapping
			options.swapping = true;
			const {accentSecondary: secondaryColor} = this.#colorTheme;
			let b1x = options.generations[options.index].selectionIndizes[0] * this.getBarWidth(options.canvas.width, options.generations[options.index].data.length);
			let b1v = options.generations[options.index].data[options.generations[options.index].selectionIndizes[options.isBackwards ? 0 : 1]];
			const subListSelection = options.generations[options.index].subListSelection;
			if (subListSelection && subListSelection[0]) {
				b1x = options.generations[options.index].selectionIndizes[subListSelection[0]] * this.getBarWidth(options.canvas.width, options.generations[options.index].data.length);
				b1v = options.generations[options.index].data[options.generations[options.index].selectionIndizes[options.isBackwards ? subListSelection[0] : subListSelection[1]]];
			}
			options.b1 = {
				x: b1x,
				value: b1v,
				color: secondaryColor
			};
			let b2x = options.generations[options.index].selectionIndizes[1] * this.getBarWidth(options.canvas.width, options.generations[options.index].data.length);
			let b2v = options.generations[options.index].data[options.generations[options.index].selectionIndizes[options.isBackwards ? 1 : 0]];
			if (subListSelection && subListSelection[1]) {
				b2x = options.generations[options.index].selectionIndizes[subListSelection[1]] * this.getBarWidth(options.canvas.width, options.generations[options.index].data.length);
				b2v = options.generations[options.index].data[options.generations[options.index].selectionIndizes[options.isBackwards ? subListSelection[1] : subListSelection[0]]];
			}
			options.b2 = {
				x: b2x,
				value: b2v,
				color: secondaryColor 
			};
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
		case 'shellsort':
			const { ShellSort } = await import('./scritps/shellsort');
			this.#script = new ShellSort(generateRandomNumberArray(this.#maxDataCount, this.#maxDataSize));
			this.#generations = this.initGenerations(this.#script);
			initialOptions.generations = this.#generations;
			this.drawBarChart(initialOptions);
			break;
		default:
			throw Error(`Unknown script name: "${scriptName}".`);
		}
	}

	constructor(scriptName?: string, customColorTheme?: CustomColorTheme) {
		if (!scriptName) throw Error('Provide a script name!');
		this.setCustomColorTheme(customColorTheme);
		this.initElements();
		this.loadScript(scriptName);
	}

	
}
