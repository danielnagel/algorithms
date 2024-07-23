export class AnimationManger {
	#animationIntervalTimeout: number = 50;
	#animationIntervalId: ReturnType<typeof setInterval> | undefined = undefined;
	readonly #maxDataCount: number = 35;
	readonly #maxDataSize: number = 100;
	readonly #canvasHeightRatio: number = 0.6;
	#canvasElement: HTMLCanvasElement;
	#script: Script;
	#randomizeButton: HTMLButtonElement;
	#playButton: HTMLButtonElement;
	#skipBackButton: HTMLButtonElement;
	#stepBackButton: HTMLButtonElement;
	#stepForwardButton: HTMLButtonElement;
	#skipForwardButton: HTMLButtonElement;
	#intervalTimeoutInput: HTMLInputElement;

	constructor (scriptName?: string) {
		this.initElements();
		if (!scriptName) {
			throw Error('Provide a script name!');
		}
		this.initScript(scriptName);
	}

	initElements () {
		const canvasElement = document.getElementById('algorithm-canvas');
		if (!(canvasElement instanceof HTMLCanvasElement)) throw Error('There is no canvas in the DOM!');
		this.#canvasElement = canvasElement;
		this.#canvasElement.height = this.#canvasElement.width * this.#canvasHeightRatio;

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

	// animation control panel
	setControlsDisabledState = (state: boolean) => {
		this.#playButton.title = state ? 'pause' : 'play';
		const disableableElements = [this.#randomizeButton, this.#skipBackButton, this.#stepBackButton, this.#stepForwardButton, this.#skipForwardButton, this.#intervalTimeoutInput];
		disableableElements.forEach(el => {
			el.disabled = state;
			if (state) el.classList.add('disabled');
			else el.classList.remove('disabled');
		});
	};

	async initScript (scriptName: string) {
		switch (scriptName) {
		case 'bubblesort':
			const { BubbleSort } = await import('./scritps/bubblesort');
			this.#script = new BubbleSort(this.generateRandomNumberArray(this.#maxDataCount, this.#maxDataSize));
			break;
		default:
			throw Error(`Unknown script name: "${scriptName}".`);
		}
		this.drawBarChart(this.#script.getData());
	}

	restartScript () {
		this.clearAnimationInterval();
		const {data, selectionIndizes} = this.#script.resetScript(this.generateRandomNumberArray(this.#maxDataCount, this.#maxDataSize));
		this.drawBarChart(data, selectionIndizes);
	}

	// may be a part of a utility script?
	generateRandomNumberArray (count: number, maxNumberSize: number): number[] {
		const randomNumbers: number[] = [];
		for (let i = 0; i < count; i++) {
			const randomNumber = Math.floor(Math.random() * maxNumberSize);
			randomNumbers.push(randomNumber);
		}
		return randomNumbers;
	};


	// animation
	drawBarChart (data: number[], selection?: number[]) {
		const canvas = this.#canvasElement;
		if (!canvas) {
			console.error('no canvas');
			return;
		}
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			console.error('no context');
			return;
		}
		const canvasWidth = canvas.width;
		const canvasHeight = canvas.height;
		const drawAreaWidth = canvasWidth - 5;
		const barWidth = drawAreaWidth / data.length;
		const maxBarHeight = Math.max(...data);
		const barSpaceFromTop = 5;
		const barSpaceFromBottom = 5;
		const fontXPositionCorrection = 10;
		const fontXPositionCorrectionSingleDigit = 20;
		const barGap = 2;

		// TODO: pass color variables from layout... https://docs.astro.build/en/reference/directives-reference/#definevars
		const primaryColor = '#101010';
		const secondaryColor = '#dadada';
		const accentColor = '#2755ee';

		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		data.forEach((value, index) => {
			const barHeight = (value / maxBarHeight) * (canvasHeight - barSpaceFromBottom - barSpaceFromTop); // Leave space for value text
			const x = index * barWidth;
			const y = canvasHeight - barHeight - barSpaceFromBottom; // start from the top, begin to draw where the bar ends, leave space for the text

			// Draw the bar
			const barColor = selection?.includes(index) ? accentColor : primaryColor;
			ctx.fillStyle = barColor;
			ctx.fillRect(x + barGap, y, barWidth - barGap, barHeight); // Leave some space between bars

			// Draw the value below the bar
			ctx.fillStyle = secondaryColor;
			ctx.font = '35px system-ui, arial';
			ctx.textRendering = 'optimizeSpeed';
			const xPosition = value < 10
				? x + fontXPositionCorrectionSingleDigit
				: x + fontXPositionCorrection;
			ctx.fillText(`${value}`, xPosition, canvasHeight - barSpaceFromBottom - barSpaceFromTop);
		});
	};

	stepForwardClickHandler() {
		const {data, selectionIndizes} = this.stepForward();
		this.drawBarChart(data, selectionIndizes);
	}

	stepForward (): Generation {
		if (this.#script.isFinished() && this.#script.getSelectionIndizes().length === 0) {
			return { data: this.#script.getData(), selectionIndizes: [] };
		}

		if (this.#script.getData().length === 0) {
			throw Error('Script has no data!');
		}

		if (this.#script.getSelectionIndizes().length === 0) {
			// probably a new start, initialize script
			return this.#script.initScript();
		}
		return this.#script.nextGeneration();
	};

	stepBackwardClickHandler() {
		const {data, selectionIndizes} = this.stepBackward();
		this.drawBarChart(data, selectionIndizes);
	}

	stepBackward (): Generation {
		const { data, selectionIndizes } = this.#script.prevGeneration();
        
		// there is no more previous generation, show the initial state
		if (data.length === 0 && selectionIndizes.length === 0) {
			this.#script.setSelectionIndizes([]);
			return {data: this.#script.getData(), selectionIndizes: []};
		}

		return { data, selectionIndizes };
	};

	clearAnimationInterval () {
		clearInterval(this.#animationIntervalId);
		this.#animationIntervalId = undefined;
	};

	startAnimation () {
		this.#animationIntervalId = setInterval(async () => {
			const {data, selectionIndizes} = this.stepForward();
			this.drawBarChart(data, selectionIndizes);
			if (!selectionIndizes.length) {
				this.clearAnimationInterval();
				this.setControlsDisabledState(false);
			}
		}, this.#animationIntervalTimeout);
	};

	startAnimationClickHandler () {
		if (this.#animationIntervalId) {
			this.clearAnimationInterval();
			this.setControlsDisabledState(false);
			return;
		}
		this.setControlsDisabledState(true);
		this.startAnimation();
	};

	animationIntervalTimeoutInputHandler (event: InputEvent) {
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

	skipBackClickHandler () {
		this.clearAnimationInterval();
		const {data, selectionIndizes} = this.#script.resetScript();
		this.drawBarChart(data, selectionIndizes);
	};

	skipForwardClickHandler () {
		this.clearAnimationInterval();
		const lastGeneration = this.#script.finishScript();
		this.drawBarChart(lastGeneration.data, lastGeneration.selectionIndizes);
	};
}
