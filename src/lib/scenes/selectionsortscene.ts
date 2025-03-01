import {
	SelectionSort 
} from '../scritps/selectionsort';
import {
	generateRandomNumberArray 
} from '../utils';
import {
	Scene 
} from './scene';

export class SelectionSortScene extends Scene {
	constructor(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		colorTheme?: ColorTheme) {
		super(canvas, ctx, colorTheme);
		this.script = new SelectionSort(generateRandomNumberArray(35, 100));
		this.state.generations = this.script.addStateToGenerations(this.script.sortData());
		this.state.algorithmType = 'selectionsort';
	}
}