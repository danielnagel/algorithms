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

const getBarWidth = (canvasWidth: number, generationDataLength: number) : number => {
	return (canvasWidth - getBarGap(canvasWidth)) / generationDataLength;
};

export {
	getBarWidth, drawBar, getBarRect
};