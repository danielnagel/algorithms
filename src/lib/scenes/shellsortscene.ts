import {
	ShellSort 
} from '../scritps/shellsort';
import {
	ShellSortDrawService 
} from '../services/shellSortDrawService';
import {
	generateRandomNumberArray 
} from '../utils';
import {
	Scene 
} from './scene';

export class ShellSortScene extends Scene {
	constructor(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,) {
		super(canvas, ctx);
		this.script = new ShellSort(generateRandomNumberArray(35, 100));
		this.state.generations = this.script.addStateToGenerations(this.script.sortData());
		this.state.algorithmType = 'shellsort';
		this.drawService = new ShellSortDrawService();
	}

	getBar(options: SceneState, index: number, backwardIndex: number) {
		const bar = super.getBar(options, index, backwardIndex);
		const subListSelection = options.generations[options.index].subListSelection;
		if (subListSelection && subListSelection[index]) {
			const {width} = this.drawService.getBarRect(options.canvas.width, 0, options.generations[options.index].data, 0);
			bar.x = options.generations[options.index].selectionIndizes[subListSelection[index]] * width;
			bar.value = options.generations[options.index].data[options.generations[options.index].selectionIndizes[options.isBackwards ? subListSelection[index] : subListSelection[backwardIndex]]];
		}
		return bar;
	}
}