import {
	BubbleSort 
} from './scritps/bubblesort';
import {
	generateRandomNumberArray 
} from './utils';

const mainLoop = (animation: {update: (options: AnimationLoopState) => boolean, draw: (options: AnimationLoopState) => void}, options: AnimationLoopState & {animationFrameRequestId?: number}) => {
	animation.draw(options);

	if (!animation.update(options) && options.animationFrameRequestId) {
		cancelAnimationFrame(options.animationFrameRequestId);
		options.animationFrameRequestId = undefined;
		return;
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

const animation: {update: (options: AnimationLoopState) => boolean, draw: (options: AnimationLoopState) => void} = {
	draw(options: AnimationLoopState) {
		options.ctx.clearRect(0, 0, options.canvas.width, options.canvas.height);
		const generation = options.generations[options.index];
		generation.data.forEach((value, index) => {
			drawBar(options, {
				value,
				x: index * getBarWidth(options.canvas.width, generation.data.length),
				color: getBarColor(generation, index)
			});
		});
	},
	update(options: AnimationLoopState) {
		if (options.isBackwards) {
			options.index--;
		} else {
		    options.index++;
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
	const animationLoopState: AnimationLoopState & {animationFrameRequestId?: number} = {
		canvas,
		ctx,
		algorithmType: '',
		generations: bs.addStateToGenerations(bs.sortData()),
		index: 0,
		animationFrameTimestamp: 0,
		lastTimestamp: 0,
		frameDelay: 0,
		swapping: false
	};

	animation.draw(animationLoopState);

	const playButton = document.getElementById('play-button') as HTMLButtonElement;
	if (!playButton) throw Error('There is no play button in the DOM!');
	playButton.onclick = () => {
		if (animationLoopState.animationFrameRequestId) {
			cancelAnimationFrame(animationLoopState.animationFrameRequestId);
			animationLoopState.animationFrameRequestId = undefined;
		} else {
			animationLoopState.animationFrameRequestId = requestAnimationFrame(() => mainLoop(animation, animationLoopState));
		}
	};

	const randomizeButton = document.getElementById('randomize-button') as HTMLButtonElement;
	if (!randomizeButton) throw Error('There is no randomize button in the DOM!');
	randomizeButton.onclick = () => {
		animationLoopState.generations = bs.addStateToGenerations(bs.sortData(generateRandomNumberArray(35, 100)));
		animation.draw(animationLoopState);
	};

	const skipBackButton = document.getElementById('skip-back-button') as HTMLButtonElement;
	if (!skipBackButton) throw Error('There is no skip back button in the DOM!');
	skipBackButton.onclick = () => {
		animationLoopState.isBackwards = true;
		animationLoopState.index = 0;
		animation.draw(animationLoopState);
	};

	const skipForwardButton = document.getElementById('skip-forward-button') as HTMLButtonElement;
	if (!skipForwardButton) throw Error('There is no skip forward button in the DOM!');
	skipForwardButton.onclick = () => {
		animationLoopState.isBackwards = false;
		animationLoopState.index = animationLoopState.generations.length - 1;
		animation.draw(animationLoopState);
	};

	const stepBackButton = document.getElementById('step-back-button') as HTMLButtonElement;
	if (!stepBackButton) throw Error('There is no step back button in the DOM!');
	stepBackButton.onclick = () => {
		if (animationLoopState.index > 0) {
			animationLoopState.isBackwards = true;
			animation.update(animationLoopState);
			animation.draw(animationLoopState);
		}
	};

	const stepForwardButton = document.getElementById('step-forward-button') as HTMLButtonElement;
	if (!stepForwardButton) throw Error('There is no step forward button in the DOM!');
	stepForwardButton.onclick = () => {
		if (animationLoopState.index < animationLoopState.generations.length - 1) {
			animationLoopState.isBackwards = false;
			animation.update(animationLoopState);
			animation.draw(animationLoopState);
		}
	};
};