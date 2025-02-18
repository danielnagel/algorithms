import {
	ShellSort 
} from '../scritps/shellsort';
import {
	getBarWidth 
} from '../utilities';
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
	}

	shouldBarBeDrawn(generation: Generation, index: number, hideSelection: boolean): boolean {
		if (!super.shouldBarBeDrawn(generation, index, hideSelection)) {
			if (generation.subListSelection && !(generation.selectionIndizes[generation.subListSelection[0]] === index || generation.selectionIndizes[generation.subListSelection[1]] === index)) {
				return true;
			}
			return false;
		}
		return true;
	}

	getBarColor(generation: Generation, index: number, hideSelection: boolean) {
		if (generation.selectionIndizes && generation.selectionIndizes.includes(index)&& generation.subListSelection && (generation.selectionIndizes[generation.subListSelection[0]] === index || generation.selectionIndizes[generation.subListSelection[1]] === index) && !hideSelection) {
			return this.state.colorTheme.accentSecondary;
		}
		return super.getBarColor(generation, index, hideSelection);
	}

	getBar(options: AnimationLoopState, index: number, backwardIndex: number) {
		const bar = super.getBar(options, index, backwardIndex);
		const subListSelection = options.generations[options.index].subListSelection;
		if (subListSelection && subListSelection[index]) {
			bar.x = options.generations[options.index].selectionIndizes[subListSelection[index]] * getBarWidth(options.canvas.width, options.generations[options.index].data.length);
			bar.value = options.generations[options.index].data[options.generations[options.index].selectionIndizes[options.isBackwards ? subListSelection[index] : subListSelection[backwardIndex]]];
		}
		return bar;
	}
}