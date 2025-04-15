import {
	range 
} from '../utils';
import {
	DrawService 
} from './drawService';

export class MergeSortDrawService extends DrawService {

	getBarColor(generation: Generation, index: number, hideSelection: boolean, options: SceneState<Generation>): string {
		if (generation.selectionIndizes && generation.selectionIndizes.includes(index) && !hideSelection) {
			return options.colorTheme.accentSecondary;
		}
		if (generation.subListRange) {
			const [start, stop] = generation.subListRange;
			if (range(start, stop-1).includes(index)) {
				return options.colorTheme.accent;
			}
		}
		return options.colorTheme.primary;
	}

	drawHalfBar(options: SceneState<Generation>, bar: Bar, top = true) {
		// Draw the bar
		const { gap, y, width, height } = this.getBarRect(options, bar.value);
		options.ctx.fillStyle = bar.color;
		options.ctx.fillRect(bar.x + gap, top ? y/2.1 : y + height/1.9, width - gap, height/2.1); // Leave some space between bars

		// Draw value in the bar
		const { size, x: xFontPosition, y: yFontPosition } = this.fontPosition(options, bar);
		options.ctx.font = `${size}px system-ui, arial`;
		options.ctx.textRendering = 'optimizeSpeed';
		options.ctx.fillStyle = options.colorTheme.secondary;
		options.ctx.fillText(`${bar.value}`, xFontPosition, top ? yFontPosition/2.12: yFontPosition);
	};


	newDrawBar(options: SceneState<Generation>, bar: NewBar) {
		// Draw the bar
		const { gap, width, height } = this.getBarRect(options, bar.value);
		options.ctx.fillStyle = bar.color;
		options.ctx.fillRect(bar.x + gap, bar.y, width - gap, height /2.1); // Leave some space between bars


		// Draw value in the bar
		const fontSize = (options.canvas.width - this.getBarGap(options.canvas.width)) * 0.015;
		const fontXPositionCorrection = fontSize * 0.5;
		const fontXPositionCorrectionSingleDigit = fontSize * 0.77;
		const xFontPosition = bar.value < 10
			? bar.x + fontXPositionCorrectionSingleDigit
			: bar.x + fontXPositionCorrection;
		options.ctx.font = `${fontSize}px system-ui, arial`;
		options.ctx.textRendering = 'optimizeSpeed';
		options.ctx.fillStyle = options.colorTheme.secondary;
		options.ctx.fillText(`${bar.value}`, xFontPosition, (bar.y + height/2.1)*0.985);
	};

	drawBarSwapAnimation(options: SceneState<Generation>): void {
		options.ctx.clearRect(0, 0, options.canvas.width, options.canvas.height);
		const generation = options.generations[options.index];
		const subListRange = generation.subListRange;
		generation.data.forEach((value, index) => {
			if (options.fylingBars && subListRange && range(subListRange[0], subListRange[1]-1)?.includes(index)) return;
			const { width } = this.getBarRect(options, 0);
			this.drawHalfBar(options, {
				value,
				x: index * width,
				color: this.getBarColor(generation, index, false, options)
			});
		});
		
		// draw flying bar
		if (options.fylingBars) {
			options.fylingBars.forEach(flyingBar => {
				this.newDrawBar(options, flyingBar.from);
			});
		}
	}
	
}