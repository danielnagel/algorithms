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
		default:
			throw Error(`Unknown script name: "${scriptName}".`);
		}
	}

	restartScript() {
		if (this.#script) this.drawBarChart(this.#script.resetScript(generateRandomNumberArray(this.#maxDataCount, this.#maxDataSize)));
	}

	drawBarChart(generation: Generation) {
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
