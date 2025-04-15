export class DrawService {

	getBarGap(canvasWidth: number): number {
		return canvasWidth * 0.0025;
	};

	getBarRect(options: SceneState<Generation>, barValue: number) {
		const barGap = this.getBarGap(options.canvas.width);
		const drawAreaWidth = options.canvas.width - barGap;
		const data = options.generations[options.index].data;
		const barWidth = drawAreaWidth / data.length;
		const maxBarHeight = Math.max(...data);
		const barSpaceFromTop = barGap;
		const barSpaceFromBottom = barGap;
		const barHeight = (barValue / maxBarHeight) * (options.canvas.height - barSpaceFromBottom - barSpaceFromTop); // Leave space for value text
		const y = options.canvas.height - barHeight - barSpaceFromBottom; // start from the top, begin to draw where the bar ends, leave space for the text
		return {
			gap: barGap,
			y,
			width: barWidth,
			height: barHeight,
		};
	};

	fontPosition(options: SceneState<Generation>, bar: Bar) {
		const fontSize = (options.canvas.width - this.getBarGap(options.canvas.width)) * 0.015;
		const fontXPositionCorrection = fontSize * 0.5;
		const fontXPositionCorrectionSingleDigit = fontSize * 0.77;
		const xFontPosition = bar.value < 10
			? bar.x + fontXPositionCorrectionSingleDigit
			: bar.x + fontXPositionCorrection;
		const yFontPosition = options.canvas.height * 0.985;
		return {
			x: xFontPosition,
			y: yFontPosition,
			size: fontSize
		};
	};

	drawBar(options: SceneState<Generation>, bar: Bar) {
		// Draw the bar
		const { gap, y, width, height } = this.getBarRect(options, bar.value);
		options.ctx.fillStyle = bar.color;
		options.ctx.fillRect(bar.x + gap, y, width - gap, height); // Leave some space between bars

		// Draw value in the bar
		const { size, x: xFontPosition, y: yFontPosition } = this.fontPosition(options, bar);
		options.ctx.font = `${size}px system-ui, arial`;
		options.ctx.textRendering = 'optimizeSpeed';
		options.ctx.fillStyle = options.colorTheme.secondary;
		options.ctx.fillText(`${bar.value}`, xFontPosition, yFontPosition);
	};


	shouldBarBeDrawn(generation: Generation, index: number, hideSelection: boolean) {
		return !(hideSelection && generation.selectionIndizes?.includes(index));
	};

	getBarColor(generation: Generation, index: number, hideSelection: boolean, options: SceneState<Generation>): string {
		if (generation.selectionIndizes && generation.selectionIndizes.includes(index) && !hideSelection) {
			return options.colorTheme.accent;
		}
		return options.colorTheme.primary;
	};

	drawBarChart(options: SceneState<Generation>, hideSelection = false) {
		options.ctx.clearRect(0, 0, options.canvas.width, options.canvas.height);
		const generation = options.generations[options.index];
		generation.data.forEach((value, index) => {
			if (!this.shouldBarBeDrawn(generation, index, hideSelection)) return;
			const { width } = this.getBarRect(options, 0);
			this.drawBar(options, {
				value,
				x: index * width,
				color: this.getBarColor(generation, index, hideSelection, options)
			});
		});
	};

	drawBarSwapAnimation(options: SceneState<Generation>) {
		// draw background
		this.drawBarChart(options, true);
		if (options.b1 && options.b2) {
			// draw swapping bars
			this.drawBar(options, options.b1);
			this.drawBar(options, options.b2);
		}
	};

	getBar(options: SceneState<Generation>, index: number, backwardIndex: number): Bar {
		const {width} = this.getBarRect(options, 0);
		const x = options.generations[options.index].selectionIndizes[index] * width;
		const value = options.generations[options.index].data[options.generations[options.index].selectionIndizes[options.isBackwards ? index : backwardIndex]];
		return {
			x,
			value,
			color: options.colorTheme.accentSecondary 
		};
	};
}