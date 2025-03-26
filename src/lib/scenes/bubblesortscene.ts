import {
	BarSortScene 
} from './barsortscene';
import {
	BubbleSort 
} from '../scritps/bubblesort';
import {
	generateRandomNumberArray 
} from '../utils';

export class BubbleSortScene extends BarSortScene {
	constructor(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		colorTheme?: ColorTheme) {
		super(canvas, ctx, colorTheme);
		this.script = new BubbleSort(generateRandomNumberArray(35, 100));
		this.state.generations = this.script.addStateToGenerations(this.script.sortData());
		this.state.algorithmType = 'bubblesort';
	}
}