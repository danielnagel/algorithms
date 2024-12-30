import {
	generateRandomNumberArray 
} from './utils';

export class AnimationManager {
	#animationIntervalTimeout: number = 50;
	#animationIntervalId: ReturnType<typeof setInterval> | undefined = undefined;
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
	#intervalTimeoutInput: HTMLInputElement | null = null;
	#colorTheme: ColorTheme = {
		primary: '#101010',
		primaryLight: '#202020',
		primaryLighter: '#303030',
		secondary: '#dadada',
		accent: '#6e90ff',
		accentSecondary: '#000000'
	};

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
		this.#intervalTimeoutInput = document.getElementById('interval-timeout-input') as HTMLInputElement;
		if (!this.#intervalTimeoutInput) throw Error('There is no interval timeout input in the DOM!');

		// add event handler
		this.#randomizeButton.onclick = () => this.restartScript();
		this.#playButton.onclick = () => this.startAnimationClickHandler();
		this.#skipBackButton.onclick = () => this.skipBackClickHandler();
		this.#stepBackButton.onclick = () => this.stepBackwardClickHandler();
		this.#stepForwardButton.onclick = () => this.stepForwardClickHandler();
		this.#skipForwardButton.onclick = () => this.skipForwardClickHandler();
		this.#intervalTimeoutInput.oninput = (event) => this.animationIntervalTimeoutInputHandler(event as InputEvent);
		this.#intervalTimeoutInput.value = this.#animationIntervalTimeout.toString();
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
		const disableableElements = [this.#randomizeButton, this.#skipBackButton, this.#stepBackButton, this.#stepForwardButton, this.#skipForwardButton, this.#intervalTimeoutInput];
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

	mainLoop(options: AnimationLoopState) {
		console.log(`mainLoop[${options.index}] - state: ${options.generations[options.index].state}`);
		const now = options.animationFrameTimestamp || performance.now();
    	const elapsed = now - options.lastTimestamp;

		if (elapsed >= options.frameDelay || (options.swapping )) {
			options.lastTimestamp = now;
			options.ctx.clearRect(0, 0, options.canvas.width, options.canvas.height); // Clear the canvas

			// Draw logic
			if (options.generations[options.index].state === 'swap-selection') {
				// draw background
				this.drawBarChart(options.generations[options.index], true);
				if (options.b1 && options.b2) {
					console.log(`mainLoop[${options.index}] - draw: swap`);
					// draw swapping bars
					this.drawBar(options.canvas, options.ctx, options.generations[options.index], options.b1);
					this.drawBar(options.canvas, options.ctx, options.generations[options.index], options.b2);
				}
			} else {
				console.log(`mainLoop[${options.index}] - draw: bars selection`);
				this.drawBarChart(options.generations[options.index]);
			}

			// Update logic
			if (options.generations[options.index].state === 'swap-selection') {
				console.log(`mainLoop[${options.index}] - update: swap`);
				if (!options.b1 && !options.b2 && options.initialB1x === undefined && options.intialB2x === undefined) {
					console.log(`mainLoop[${options.index}] - update: setup swap`);
					// setup swapping
					options.swapping = true;
					options.b1 = {
						x: this.getBarXPosition(options.canvas, options.generations[options.index], options.generations[options.index].selectionIndizes[0]),
						value: options.generations[options.index].data[options.generations[options.index].selectionIndizes[1]] 
					};
					options.b2 = {
						x: this.getBarXPosition(options.canvas, options.generations[options.index], options.generations[options.index].selectionIndizes[1]),
						value: options.generations[options.index].data[options.generations[options.index].selectionIndizes[0]] 
					};
					options.initialB1x = options.b1.x;
					options.intialB2x = options.b2.x;
					// 1 px for 1000ms frame delay movement for bubblesort is good.
					options.swapSpeed = 1000 / options.frameDelay
					console.log("swapspeed", options.swapSpeed, "frames", (options.intialB2x - options.initialB1x) / options.swapSpeed)
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
						this.drawBarChart(options.generations[options.index]);
						options.index++;
					}
				}
			} else if (options.index < options.generations.length) {
				console.log(`mainLoop[${options.index}] - update: index`);
				options.index++;
			}
		}
		// finshed condition
		if (options.index < options.generations.length) {
			console.log(`mainLoop[${options.index}] - rerun mainLoop`);
			requestAnimationFrame((aft) => {
				options.animationFrameTimestamp = aft;
				this.mainLoop(options);
			});
		}
	}

	addStateToGenerations(generations: Generation[]): NewGeneration[] {
		return generations.map((g, index) => {
			if (index === 0) return {
				state: 'initial',
				...g
			};
			if (index === generations.length -1) return {
				state: 'sorted',
				...g
			};
			if (generations[index - 1].selectionIndizes[0] === g.selectionIndizes[0]) return {
				state: 'swap-selection',
				...g
			};
			return {
				state: 'update-selection',
				...g
			};
		});
	}

	async loadScript(scriptName: string) {
		switch (scriptName) {
		case 'bubblesort':
			const { BubbleSort } = await import('./scritps/bubblesort');
			this.#script = new BubbleSort(generateRandomNumberArray(this.#maxDataCount, this.#maxDataSize));
			this.drawBarChart(this.#script.resetScript());
			break;
		case 'insertionsort':
			const { InsertionSort } = await import('./scritps/insertionsort');
			this.#script = new InsertionSort(generateRandomNumberArray(this.#maxDataCount, this.#maxDataSize));
			this.drawBarChart(this.#script.resetScript());
			break;
		case 'selectionsort':
			const { SelectionSort } = await import('./scritps/selectionsort');
			this.#script = new SelectionSort(generateRandomNumberArray(this.#maxDataCount, this.#maxDataSize));
			this.drawBarChart(this.#script.resetScript());
			break;
		case 'test':

			const canvas = this.#canvasElement;
			if (!canvas) {
				throw Error('no canvas');
			}

			const ctx = canvas.getContext('2d');
			if (!ctx) {
				throw Error('no context');
			}

			const { BubbleSort : bs } = await import('./scritps/bubblesort');
			this.#script = new bs(generateRandomNumberArray(this.#maxDataCount, this.#maxDataSize));
			this.#script.finishScript();
			const generations = this.addStateToGenerations(this.#script.getGenerations());
			this.mainLoop({
				canvas,
				ctx,
				generations,
				index: 0,
				animationFrameTimestamp: 0,
				lastTimestamp: 0,
				frameDelay: 1000,
				swapping: false
			});
			break;
		default:
			throw Error(`Unknown script name: "${scriptName}".`);
		}
	}

	restartScript() {
		if (this.#script) this.drawBarChart(this.#script.resetScript(generateRandomNumberArray(this.#maxDataCount, this.#maxDataSize)));
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

	stepForwardClickHandler() {
		if (this.#script) this.drawBarChart(this.#script.nextGeneration());
	}

	stepBackwardClickHandler() {
		if (this.#script) this.drawBarChart(this.#script.prevGeneration());
	}

	clearAnimationInterval() {
		clearInterval(this.#animationIntervalId);
		this.#animationIntervalId = undefined;
		this.setControlsDisabledState(false);
	};

	startAnimationClickHandler() {
		if (!this.#script) return;

		// pause
		if (this.#animationIntervalId) {
			this.clearAnimationInterval();
			return;
		}

		// play
		this.setControlsDisabledState(true);
		this.#animationIntervalId = setInterval(async() => {
			if (!this.#script) {
				this.clearAnimationInterval();
				return;
			}
			const nextGeneration = this.#script.nextGeneration();
			this.drawBarChart(nextGeneration);
			if (!nextGeneration.selectionIndizes.length) {
				this.clearAnimationInterval();
			}
		}, this.#animationIntervalTimeout);
	};

	skipBackClickHandler() {
		if (this.#script) this.drawBarChart(this.#script.resetScript());
	};

	skipForwardClickHandler() {
		if (this.#script) this.drawBarChart(this.#script.finishScript());
	};

	animationIntervalTimeoutInputHandler(event: InputEvent) {
		if (!event.target || !(event.target instanceof HTMLInputElement)) return;
		const rawValue = event.target.value;
		let numberValue = this.#animationIntervalTimeout;
		try {
			numberValue = parseInt(rawValue);
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		}
		if (numberValue < 1) numberValue = 1;
		if (numberValue > 5000) numberValue = 5000;
		this.#animationIntervalTimeout = numberValue;
		event.target.value = this.#animationIntervalTimeout.toString();
	};
}
