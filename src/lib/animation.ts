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
		accentSecondary: '#000000'
	};
	#animationFrameRequestId: number | null = null;
	#animationIndex: number = 0;
	#animationFrameDelay: number = 1000;
	#animationDirection: 'forward' | 'backward' | undefined = undefined;
	#generations: Generation[] = [];

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

	getBarXPosition(canvas: HTMLCanvasElement, g: Generation, index: number): number {
		// TODO: konstanten sind aus drawBarChart
		const barGap = canvas.width * 0.0025;
		const drawAreaWidth = canvas.width - barGap;
		const barWidth = drawAreaWidth / g.data.length;
		// Berechnung der Konstante x in drawBarChart
		return index * barWidth;
	}

	drawSwapAnimation(options: AnimationLoopState) {
		// draw background
		this.drawBarChart(options.generations[options.index], true);
		if (options.b1 && options.b2) {
			// draw swapping bars
			this.drawBar(options.canvas, options.ctx, options.generations[options.index], options.b1);
			this.drawBar(options.canvas, options.ctx, options.generations[options.index], options.b2);
		}
	}

	updateSwapAnimation(options: AnimationLoopState) {
		if (!options.b1 && !options.b2 && options.initialB1x === undefined && options.intialB2x === undefined) {
			// setup swapping
			options.swapping = true;
			options.b1 = {
				x: this.getBarXPosition(options.canvas, options.generations[options.index], options.generations[options.index].selectionIndizes[0]),
				value: options.generations[options.index].data[options.generations[options.index].selectionIndizes[options.isBackwards ? 0 : 1]] 
			};
			options.b2 = {
				x: this.getBarXPosition(options.canvas, options.generations[options.index], options.generations[options.index].selectionIndizes[1]),
				value: options.generations[options.index].data[options.generations[options.index].selectionIndizes[options.isBackwards ? 1 : 0]] 
			};
			options.initialB1x = options.b1.x;
			options.intialB2x = options.b2.x;
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
				this.drawBarChart(options.generations[options.index]);
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

	async loadScript(scriptName: string) {
		switch (scriptName) {
		case 'bubblesort':
			const { BubbleSort } = await import('./scritps/bubblesort');
			this.#script = new BubbleSort(generateRandomNumberArray(this.#maxDataCount, this.#maxDataSize));
			this.#generations = this.#script.sortData();
			if (!this.#generations.length) {
				throw Error('Could not create generations from data.');
			}
			this.drawBarChart(this.#generations[0]);
			break;
		case 'insertionsort':
			const { InsertionSort } = await import('./scritps/insertionsort');
			this.#script = new InsertionSort(generateRandomNumberArray(this.#maxDataCount, this.#maxDataSize));
			this.#generations = this.#script.sortData();
			if (!this.#generations.length) {
				throw Error('Could not create generations from data.');
			}
			this.drawBarChart(this.#generations[0]);
			break;
		case 'selectionsort':
			const { SelectionSort } = await import('./scritps/selectionsort');
			this.#script = new SelectionSort(generateRandomNumberArray(this.#maxDataCount, this.#maxDataSize));
			this.#generations = this.#script.sortData();
			if (!this.#generations.length) {
				throw Error('Could not create generations from data.');
			}
			this.drawBarChart(this.#generations[0]);
			break;
		case 'test':
			// playground
			break;
		default:
			throw Error(`Unknown script name: "${scriptName}".`);
		}
	}

	restartScript() {
		if (!this.#script) return;
		this.#generations = this.#script.sortData(generateRandomNumberArray(this.#maxDataCount, this.#maxDataSize));
		if (!this.#generations.length) {
			throw Error('Could not create generations from data.');
		}
		this.drawBarChart(this.#generations[0]);
		this.#animationIndex = 0;
		this.#animationDirection = undefined;
	}

	drawBar(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, g: Generation, bar: Bar) {
		const barGap = canvas.width * 0.0025;
		const drawAreaWidth = canvas.width - barGap;
		const barWidth = drawAreaWidth / g.data.length;
		const maxBarHeight = Math.max(...g.data);
		const barSpaceFromTop = barGap;
		const barSpaceFromBottom = barGap;
		const barHeight = (bar.value / maxBarHeight) * (canvas.height - barSpaceFromBottom - barSpaceFromTop); // Leave space for value text
		const y = canvas.height - barHeight - barSpaceFromBottom; // start from the top, begin to draw where the bar ends, leave space for the text
		const fontSize = drawAreaWidth * 0.015;
		const fontXPositionCorrection = fontSize * 0.5;
		const fontXPositionCorrectionSingleDigit = fontSize * 0.77;

		// Draw the bar
		ctx.fillStyle = 'red';
		ctx.fillRect(bar.x + barGap, y, barWidth - barGap, barHeight); // Leave some space between bars

		// Draw the value below the bar
		ctx.font = `${fontSize}px system-ui, arial`;
		ctx.textRendering = 'optimizeSpeed';
		ctx.fillStyle = this.#colorTheme.secondary;
		const xFontPosition = bar.value < 10
			? bar.x + fontXPositionCorrectionSingleDigit
			: bar.x + fontXPositionCorrection;
		const yPosition = canvas.height * 0.985;
		ctx.fillText(`${bar.value}`, xFontPosition, yPosition);
	}

	drawBarChart(generation: Generation, hideSelection = false) {
		const canvas = this.#canvasElement;
		if (!canvas) {
			throw Error('no canvas');
		}

		const ctx = canvas.getContext('2d');
		if (!ctx) {
			throw Error('no context');
		}

		const barGap = canvas.width * 0.0025;
		const drawAreaWidth = canvas.width - barGap;
		const barWidth = drawAreaWidth / generation.data.length;
		const maxBarHeight = Math.max(...generation.data);
		const barSpaceFromTop = barGap;
		const barSpaceFromBottom = barGap;
		const fontSize = drawAreaWidth * 0.015;
		const fontXPositionCorrection = fontSize * 0.5;
		const fontXPositionCorrectionSingleDigit = fontSize * 0.77;
		const {primary: primaryColor, secondary: secondaryColor, accent: accentColor} = this.#colorTheme;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		generation.data.forEach((value, index) => {
			if (hideSelection && generation.selectionIndizes?.includes(index)) return;
			const barHeight = (value / maxBarHeight) * (canvas.height - barSpaceFromBottom - barSpaceFromTop); // Leave space for value text
			const x = index * barWidth;
			const y = canvas.height - barHeight - barSpaceFromBottom; // start from the top, begin to draw where the bar ends, leave space for the text

			// Draw the bar
			const barColor = generation.selectionIndizes?.includes(index) ? accentColor : primaryColor;
			ctx.fillStyle = barColor;
			ctx.fillRect(x + barGap, y, barWidth - barGap, barHeight); // Leave some space between bars
			ctx.fillStyle = generation.selectionIndizes?.includes(index) ? primaryColor : secondaryColor;

			// Draw the value below the bar
			ctx.font = `${fontSize}px system-ui, arial`;
			ctx.textRendering = 'optimizeSpeed';
			ctx.fillStyle = this.#colorTheme.secondary;
			const xPosition = value < 10
				? x + fontXPositionCorrectionSingleDigit
				: x + fontXPositionCorrection;
			const yPosition = canvas.height * 0.985;
			ctx.fillText(`${value}`, xPosition, yPosition);
		});
	};

	swapAnimationLoop(options: AnimationLoopState) {
		options.ctx.clearRect(0, 0, options.canvas.width, options.canvas.height); // Clear the canvas

		// Draw logic
		if (options.generations[options.index].state === 'swap-selection') {
			this.drawSwapAnimation(options);
		} else {
			this.drawBarChart(options.generations[options.index]);
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
		const canvas = this.#canvasElement;
		if (!canvas) {
			throw Error('no canvas');
		}

		const ctx = canvas.getContext('2d');
		if (!ctx) {
			throw Error('no context');
		}

		if (!this.#script) {
			throw Error('no script');
		}

		if (this.#animationDirection === 'backward') {
			// updated to the next iteration, but we want to make a step back
			// 0 next step, +1 currently visible, +2 step forward
			this.#animationIndex = this.#animationIndex < 0 ? 1 : this.#animationIndex + 2;
		}
		this.#animationDirection = 'forward';

		// stop animation if clicked during an animation
		if (this.#animationFrameRequestId) {
			cancelAnimationFrame(this.#animationFrameRequestId);
			this.#animationFrameRequestId = null;
			this.#animationIndex++;
		}

		const generations = this.addStateToGenerations(this.#generations);
		if (this.#animationIndex >= generations.length) this.#animationIndex = generations.length - 1;
		this.swapAnimationLoop({
			canvas,
			ctx,
			generations,
			index: this.#animationIndex,
			animationFrameTimestamp: 0,
			lastTimestamp: 0,
			frameDelay: this.#animationFrameDelay,
			swapping: false
		});
	}

	stepBackwardClickHandler() {
		const canvas = this.#canvasElement;
		if (!canvas) {
			throw Error('no canvas');
		}

		const ctx = canvas.getContext('2d');
		if (!ctx) {
			throw Error('no context');
		}

		if (!this.#script) {
			throw Error('no script');
		}

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

		const generations = this.addStateToGenerations(this.#generations);
		this.swapAnimationLoop({
			canvas,
			ctx,
			generations,
			index: this.#animationIndex,
			animationFrameTimestamp: 0,
			lastTimestamp: 0,
			frameDelay: this.#animationFrameDelay,
			swapping: false,
			isBackwards: true
		});
	}

	startAnimationClickHandler() {
		if (!this.#script) return;

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

		const canvas = this.#canvasElement;
		if (!canvas) {
			throw Error('no canvas');
		}

		const ctx = canvas.getContext('2d');
		if (!ctx) {
			throw Error('no context');
		}
		const generations = this.addStateToGenerations(this.#generations);
		if (this.#animationIndex >= generations.length) {
			this.setControlsDisabledState(false);
			this.#animationIndex = generations.length;
			return;
		}
		this.mainLoop({
			canvas,
			ctx,
			generations,
			index: this.#animationIndex,
			animationFrameTimestamp: 0,
			lastTimestamp: 0,
			frameDelay: this.#animationFrameDelay,
			swapping: false
		});
	};

	skipBackClickHandler() {
		if (this.#generations.length) {
			this.#animationIndex = -1;
			this.drawBarChart(this.#generations[0]);
			if (this.#animationFrameRequestId) cancelAnimationFrame(this.#animationFrameRequestId);
			this.#animationFrameRequestId = null;
			this.setControlsDisabledState(false);
			this.#animationDirection = 'backward';
		}
	};

	skipForwardClickHandler() {
		if (this.#generations.length) {
			const generations = this.addStateToGenerations(this.#generations);
			this.#animationIndex = generations.length;
			this.drawBarChart(generations[this.#animationIndex - 1]);
			if (this.#animationFrameRequestId) cancelAnimationFrame(this.#animationFrameRequestId);
			this.#animationFrameRequestId = null;
			this.setControlsDisabledState(false);
			this.#animationDirection = 'forward';
		}
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
