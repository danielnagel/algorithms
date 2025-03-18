import {
	range 
} from '../utils';
import {
	DrawService 
} from './drawService';

export class MergeSortDrawService extends DrawService {

	getBarColor(generation: Generation, index: number, hideSelection: boolean, options: SceneState): string {
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

	drawHalfBar(options: SceneState, bar: Bar, top = true) {
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


	newDrawBar(options: SceneState, bar: Bar) {
		// Draw the bar
		const { gap, width, height } = this.getBarRect(options, bar.value);
		options.ctx.fillStyle = bar.color;
		options.ctx.fillRect(bar.x + gap, bar.y as number, width - gap, height /2.1); // Leave some space between bars
	};

	drawBarSwapAnimation(options: SceneState): void {
		options.ctx.clearRect(0, 0, options.canvas.width, options.canvas.height);
		const generation = options.generations[options.index];
		generation.data.forEach((value, index) => {
			if (generation.mergeResult && generation.selectionIndizes?.includes(index)) return;
			const { width } = this.getBarRect(options, 0);
			this.drawHalfBar(options, {
				value,
				x: index * width,
				color: this.getBarColor(generation, index, false, options),
				y: 0
			});
		});
		generation.mergeResult?.forEach((value, index) => {
			if (index +1 === generation.mergeResult?.length) return;
			const { width } = this.getBarRect(options, 0);
			this.drawHalfBar(options, {
				value,
				x: index * width,
				color: options.colorTheme.primary,
				y: 0
			}, false);
		});
		if (options.b1) {
			// draw flying bar
			this.newDrawBar(options, options.b1);
		}
	}
	
}