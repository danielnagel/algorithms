import {
	range 
} from '../utils';
import {
	DrawService 
} from './drawService';

export class QuickSortDrawService extends DrawService {

	getBarColor(generation: Generation, index: number, hideSelection: boolean, options: SceneState<Generation>): string {
		if (generation.selectionIndizes && generation.selectionIndizes.includes(index) && !hideSelection) {
			return options.colorTheme.accentSecondary;
		}
		if (generation.subListRange) {
			const [start, stop] = generation.subListRange;
			if (range(start, stop).includes(index)) {
				return options.colorTheme.accent;
			}
		}
		return options.colorTheme.primary;
	}
	
	drawBarChart(options: SceneState<Generation>, hideSelection?: boolean): void {
		super.drawBarChart(options, hideSelection);
		const generation = options.generations[options.index];
		if (generation.subListRange) {
			const {gap, y, height} = this.getBarRect(options, generation.data[generation.subListRange[1]]);
			options.ctx.fillStyle = options.colorTheme.secondary;
			options.ctx.fillRect(gap, y, options.canvas.width - gap*2, gap);
			const pivotTextY = options.canvas.height - height;
			let textPositionCorrection = -10;
			if (pivotTextY < 25) {
				textPositionCorrection = 15;
			}
			options.ctx.fillText('p', 10, pivotTextY + textPositionCorrection);
		}
	}
}