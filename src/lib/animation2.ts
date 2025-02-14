import {
	BubbleSort 
} from './scritps/bubblesort';
import {
	generateRandomNumberArray 
} from './utils';

const mainLoop = (animation: {update: (options: AnimationLoopState & {isStep: boolean, isRunning: boolean}) => boolean, draw: (options: AnimationLoopState) => void}, options: AnimationLoopState & {animationFrameRequestId?: number, isRunning: boolean, isStep: boolean}) => {
	const now = options.animationFrameTimestamp || performance.now();
	const elapsed = now - options.lastTimestamp;

	if (options.isRunning && (elapsed >= options.frameDelay || (options.swapping ))) {
		options.lastTimestamp = now;
		animation.draw(options);
		animation.update(options);
	}
	options.animationFrameRequestId = requestAnimationFrame(() => mainLoop(animation, options));
};

const getBarGap = (canvasWidth: number): number => {
	return canvasWidth * 0.0025;
};

const getBarRect = (canvasWidth: number, canvasHeight: number, data: number[], barValue: number, barX: number) => {
	const barGap = getBarGap(canvasWidth);
	const drawAreaWidth = canvasWidth - barGap;
	const barWidth = drawAreaWidth / data.length;
	const maxBarHeight = Math.max(...data);
	const barSpaceFromTop = barGap;
	const barSpaceFromBottom = barGap;
	const barHeight = (barValue / maxBarHeight) * (canvasHeight - barSpaceFromBottom - barSpaceFromTop); // Leave space for value text
	const y = canvasHeight - barHeight - barSpaceFromBottom; // start from the top, begin to draw where the bar ends, leave space for the text
	const fontSize = drawAreaWidth * 0.015;
	const fontXPositionCorrection = fontSize * 0.5;
	const fontXPositionCorrectionSingleDigit = fontSize * 0.77;
	const xFontPosition = barValue < 10
		? barX + fontXPositionCorrectionSingleDigit
		: barX + fontXPositionCorrection;
	const yFontPosition = canvasHeight * 0.985;
	return {
		barGap,
		y,
		barWidth,
		barHeight,
		xFontPosition,
		yFontPosition,
		fontSize
	};
};

const drawBar = (options: AnimationLoopState, bar: Bar) => {
	const {barGap, y, barWidth, barHeight, xFontPosition, fontSize, yFontPosition} = getBarRect(options.canvas.width, options.canvas.height, options.generations[options.index].data, bar.value, bar.x);

	// Draw the bar
	options.ctx.fillStyle = bar.color;
	options.ctx.fillRect(bar.x + barGap, y, barWidth - barGap, barHeight); // Leave some space between bars

	// Draw value in the bar
	options.ctx.font = `${fontSize}px system-ui, arial`;
	options.ctx.textRendering = 'optimizeSpeed';
	options.ctx.fillStyle = 'white';
	options.ctx.fillText(`${bar.value}`, xFontPosition, yFontPosition);
};

const getBarColor = (generation: Generation, index: number) => {
	const primaryColor = 'black';
	const accentColor = 'blue';

	if (generation.selectionIndizes && generation.selectionIndizes.includes(index)) {
		return accentColor;
	}
	return primaryColor;
};



const getBarWidth = (canvasWidth: number, generationDataLength: number) : number => {
	return (canvasWidth - getBarGap(canvasWidth)) / generationDataLength;
};


const shouldBarBeDrawn = (generation: Generation, index: number, hideSelection: boolean) => {
	return !(hideSelection && generation.selectionIndizes?.includes(index));
};

const drawBarChart = (options: AnimationLoopState, hideSelection  = false) => {
	options.ctx.clearRect(0, 0, options.canvas.width, options.canvas.height);
	const generation = options.generations[options.index];
	generation.data.forEach((value, index) => {
		if (!shouldBarBeDrawn(generation, index, hideSelection)) return;
		drawBar(options, {
			value,
			x: index * getBarWidth(options.canvas.width, generation.data.length),
			color: getBarColor(generation, index)
		});
	});
};

const drawSwapAnimation = (options: AnimationLoopState) => {
	// draw background
	drawBarChart(options, true);
	if (options.b1 && options.b2) {
		// draw swapping bars
		drawBar(options, options.b1);
		drawBar(options, options.b2);
	}
};

const getBar = (options: AnimationLoopState, index: number, backwardIndex: number) => {
	const x = options.generations[options.index].selectionIndizes[index] * getBarWidth(options.canvas.width, options.generations[options.index].data.length);
	const value = options.generations[options.index].data[options.generations[options.index].selectionIndizes[options.isBackwards ? index : backwardIndex]];
	return {
		x,
		value,
		color: 'red' 
	};
};

const updateSwapAnimation = (options: AnimationLoopState) => {
	if (!options.b1 && !options.b2 && options.initialB1x === undefined && options.initialB2x === undefined) {
		// setup swapping
		options.swapping = true;
		options.b1 = getBar(options, 0, 1);
		options.b2 = getBar(options, 1, 0);
		options.initialB1x = options.b1.x;
		options.initialB2x = options.b2.x;
		options.swapSpeed = 3000 / options.frameDelay * (options.generations[options.index].selectionIndizes[1]-options.generations[options.index].selectionIndizes[0]);
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
			//this.#animationFrameRequestId = null;
		}
	}
};

const animation: {update: (options: AnimationLoopState & {isStep: boolean, isRunning: boolean}) => boolean, draw: (options: AnimationLoopState) => void} = {
	draw(options: AnimationLoopState) {
		if (options.generations[options.index].state === 'swap-selection' && options.frameDelay > 0) {
			drawSwapAnimation(options);
		} else {
			drawBarChart(options);
		}
	},
	update(options: AnimationLoopState & {isStep: boolean, isRunning: boolean}) {
		// Update logic
		if (options.generations[options.index].state === 'swap-selection' && options.frameDelay > 0) {
			updateSwapAnimation(options);
			if (!options.swapping) {
				if (options.isBackwards) {
					options.index--;
					if (options.isStep) {
						options.isRunning = false;
						options.isStep = false;
						this.draw(options);
						options.index--;
					}
				} else {
					options.index++;
					if (options.isStep) {
						options.isRunning = false;
						options.isStep = false;
						this.draw(options);
						options.index++;
					}
				}
			}
		} else if (options.isBackwards) {
			options.index--;
			if (options.isStep) {
				options.isRunning = false;
				options.isStep = false;
			}
		} else {
		    options.index++;
			if (options.isStep) {
				options.isRunning = false;
				options.isStep = false;
			}
		}
		// finshed condition
		return options.index < options.generations.length;
	}
};

export const run = () => {
	const canvasElement = document.getElementById('algorithm-canvas');
	if (!(canvasElement instanceof HTMLCanvasElement)) throw Error('There is no canvas in the DOM!');
	const canvas = canvasElement;
	if (!canvas) {
		throw Error('getInitialOptions: no canvas');
	}
	const ctx = canvas.getContext('2d');
	if (!ctx) {
		throw Error('getInitialOptions: no 2d rendering context');
	}

	const bs = new BubbleSort(generateRandomNumberArray(35, 100));
	const animationLoopState: AnimationLoopState & {animationFrameRequestId?: number, isRunning: boolean, isStep: boolean} = {
		canvas,
		ctx,
		algorithmType: '',
		generations: bs.addStateToGenerations(bs.sortData()),
		index: 0,
		animationFrameTimestamp: 0,
		lastTimestamp: 0,
		frameDelay: 500,
		swapping: false,
		isRunning: false,
		isStep: false
	};

	animation.draw(animationLoopState);

	const playButton = document.getElementById('play-button') as HTMLButtonElement;
	if (!playButton) throw Error('There is no play button in the DOM!');
	playButton.onclick = () => {
		if (animationLoopState.index <= 0) animationLoopState.index = 1;
		if (animationLoopState.index >= animationLoopState.generations.length) return;
		animationLoopState.isBackwards = false;
		animationLoopState.isStep = false;
		if (animationLoopState.isRunning) {
			animationLoopState.isRunning = false;
		} else {
			animationLoopState.isRunning = true;
		}
	};

	const randomizeButton = document.getElementById('randomize-button') as HTMLButtonElement;
	if (!randomizeButton) throw Error('There is no randomize button in the DOM!');
	randomizeButton.onclick = () => {
		animationLoopState.generations = bs.addStateToGenerations(bs.sortData(generateRandomNumberArray(35, 100)));
		animationLoopState.index = 0;
		animationLoopState.isBackwards = false;
		animationLoopState.isStep = true;
		animationLoopState.isRunning = true;
	};

	const skipBackButton = document.getElementById('skip-back-button') as HTMLButtonElement;
	if (!skipBackButton) throw Error('There is no skip back button in the DOM!');
	skipBackButton.onclick = () => {
		animationLoopState.isBackwards = true;
		animationLoopState.index = 0;
		animationLoopState.isRunning = true;
		animationLoopState.isStep = true;
	};

	const skipForwardButton = document.getElementById('skip-forward-button') as HTMLButtonElement;
	if (!skipForwardButton) throw Error('There is no skip forward button in the DOM!');
	skipForwardButton.onclick = () => {
		animationLoopState.isBackwards = false;
		animationLoopState.index = animationLoopState.generations.length - 1;
		animationLoopState.isRunning = true;
		animationLoopState.isStep = true;
	};

	const stepBackButton = document.getElementById('step-back-button') as HTMLButtonElement;
	if (!stepBackButton) throw Error('There is no step back button in the DOM!');
	stepBackButton.onclick = () => {
		if (!animationLoopState.isBackwards) {
			// updated to the next iteration, but we want to make a step back
			// 0 next step, -1 currently visible, -2 step back
			animationLoopState.index = animationLoopState.index - 2;
		}
		if (animationLoopState.index < 0) animationLoopState.index = 0;
		animationLoopState.isStep = true;
		animationLoopState.isBackwards = true;
		animationLoopState.isRunning = true;
	};

	const stepForwardButton = document.getElementById('step-forward-button') as HTMLButtonElement;
	if (!stepForwardButton) throw Error('There is no step forward button in the DOM!');
	stepForwardButton.onclick = () => {
		if (animationLoopState.isBackwards) {
			// updated to the next iteration, but we want to make a step back
			// 0 next step, +1 currently visible, +2 step forward
			animationLoopState.index = animationLoopState.index < 0 ? 1 : animationLoopState.index + 2;
		}
		if (animationLoopState.index === 0) animationLoopState.index = 1;
		if (animationLoopState.index >= animationLoopState.generations.length) animationLoopState.index = animationLoopState.generations.length - 1;
		animationLoopState.isStep = true;
		animationLoopState.isBackwards = false;
		animationLoopState.isRunning = true;
	};

	animationLoopState.animationFrameRequestId = requestAnimationFrame(() => mainLoop(animation, animationLoopState));
};