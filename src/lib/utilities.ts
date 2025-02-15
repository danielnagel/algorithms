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

export {
	drawBarChart, getBar, drawSwapAnimation
};