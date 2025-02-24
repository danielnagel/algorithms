export class DrawService {

	getBarGap(canvasWidth: number): number {
		return canvasWidth * 0.0025;
	};

	getBarRect(canvasWidth: number, canvasHeight: number, data: number[], barValue: number) {
		const barGap = this.getBarGap(canvasWidth);
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

	fontPosition(canvasWidth: number, canvasHeight: number, barValue: number, barX: number) {
		const fontSize = (canvasWidth - this.getBarGap(canvasWidth)) * 0.015;
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

	drawBar(options: SceneState, bar: Bar) {
		// Draw the bar
		const { gap, y, width, height } = this.getBarRect(options.canvas.width, options.canvas.height, options.generations[options.index].data, bar.value);
		options.ctx.fillStyle = bar.color;
		options.ctx.fillRect(bar.x + gap, y, width - gap, height); // Leave some space between bars

		// Draw value in the bar
		const { size, x: xFontPosition, y: yFontPosition } = this.fontPosition(options.canvas.width, options.canvas.height, bar.value, bar.x);
		options.ctx.font = `${size}px system-ui, arial`;
		options.ctx.textRendering = 'optimizeSpeed';
		options.ctx.fillStyle = options.colorTheme.secondary;
		options.ctx.fillText(`${bar.value}`, xFontPosition, yFontPosition);
	};


	shouldBarBeDrawn(generation: Generation, index: number, hideSelection: boolean) {
		return !(hideSelection && generation.selectionIndizes?.includes(index));
	};

	getBarColor(generation: Generation, index: number, hideSelection: boolean, options: SceneState): string {
		if (generation.selectionIndizes && generation.selectionIndizes.includes(index) && !hideSelection) {
			return options.colorTheme.accent;
		}
		return options.colorTheme.primary;
	};

	drawBarChart(options: SceneState, hideSelection = false) {
		options.ctx.clearRect(0, 0, options.canvas.width, options.canvas.height);
		const generation = options.generations[options.index];
		generation.data.forEach((value, index) => {
			if (!this.shouldBarBeDrawn(generation, index, hideSelection)) return;
			const { width } = this.getBarRect(options.canvas.width, 0, generation.data, 0);
			this.drawBar(options, {
				value,
				x: index * width,
				color: this.getBarColor(generation, index, hideSelection, options)
			});
		});
	};

	drawBarSwapAnimation(options: SceneState) {
		// draw background
		this.drawBarChart(options, true);
		if (options.b1 && options.b2) {
			// draw swapping bars
			this.drawBar(options, options.b1);
			this.drawBar(options, options.b2);
		}
	};
}