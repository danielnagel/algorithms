import {
	QuickSort 
} from '../scritps/quicksort';
import {
	getBarRect
} from '../utilities';
import {
	generateRandomNumberArray, 
	range
} from '../utils';
import {
	Scene 
} from './scene';

export class QuickSortScene extends Scene {
	constructor(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,) {
		super(canvas, ctx);
		this.script = new QuickSort(generateRandomNumberArray(35, 100));
		this.state.generations = this.script.addStateToGenerations(this.script.sortData());
		this.state.algorithmType = 'quicksort';
	}

	getBarColor(generation: Generation, index: number, hideSelection: boolean) {
		if (generation.selectionIndizes && generation.selectionIndizes.includes(index) && !hideSelection) {
			return this.state.colorTheme.accentSecondary;
		}
		if (generation.subListRange) {
			const [start, stop] = generation.subListRange;
			if (range(start, stop).includes(index)) {
				return this.state.colorTheme.accent;
			}
		}
		return this.state.colorTheme.primary;
	}
	
	drawBarChart(options: ExtendedAnimationLoopState, hideSelection?: boolean): void {
		super.drawBarChart(options, hideSelection);
		const generation = options.generations[options.index];
		if (generation.subListRange) {
			const {gap, y, height} = getBarRect(options.canvas.width, options.canvas.height, generation.data, generation.data[generation.subListRange[1]]);
			options.ctx.fillStyle = this.state.colorTheme.secondary;
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