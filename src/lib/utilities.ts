const getBarGap = (canvasWidth: number): number => {
	return canvasWidth * 0.0025;
};

const getBarRect = (canvasWidth: number, canvasHeight: number, data: number[], barValue: number) => {
	const barGap = getBarGap(canvasWidth);
	const drawAreaWidth = canvasWidth - barGap;
	const barWidth = drawAreaWidth / data.length;
	const maxBarHeight = Math.max(...data);
	const barSpaceFromTop = barGap;
	const barSpaceFromBottom = barGap;
	const barHeight = (barValue / maxBarHeight) * (canvasHeight - barSpaceFromBottom - barSpaceFromTop); // Leave space for value text
	const y = canvasHeight - barHeight - barSpaceFromBottom; // start from the top, begin to draw where the bar ends, leave space for the text
	return {
		gap: barGap,
		y,
		width: barWidth,
		height: barHeight,
	};
};

const fontPosition = (canvasWidth: number, canvasHeight: number, barValue: number, barX: number) => {
	const fontSize = (canvasWidth - getBarGap(canvasWidth)) * 0.015;
	const fontXPositionCorrection = fontSize * 0.5;
	const fontXPositionCorrectionSingleDigit = fontSize * 0.77;
	const xFontPosition = barValue < 10
		? barX + fontXPositionCorrectionSingleDigit
		: barX + fontXPositionCorrection;
	const yFontPosition = canvasHeight * 0.985;
	return {
		x: xFontPosition,
		y: yFontPosition,
		size: fontSize
	};
};

const drawBar = (options: ExtendedAnimationLoopState, bar: Bar) => {
	// Draw the bar
	const {gap, y, width, height} = getBarRect(options.canvas.width, options.canvas.height, options.generations[options.index].data, bar.value);
	options.ctx.fillStyle = bar.color;
	options.ctx.fillRect(bar.x + gap, y, width - gap, height); // Leave some space between bars

	// Draw value in the bar
	const {size, x: xFontPosition, y: yFontPosition} = fontPosition(options.canvas.width, options.canvas.height, bar.value, bar.x);
	options.ctx.font = `${size}px system-ui, arial`;
	options.ctx.textRendering = 'optimizeSpeed';
	options.ctx.fillStyle = options.colorTheme.secondary;
	options.ctx.fillText(`${bar.value}`, xFontPosition, yFontPosition);
};

export {
	drawBar, getBarRect
};