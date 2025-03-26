import {
	InsertionSort 
} from '../scritps/insertionsort';
import {
	generateRandomNumberArray 
} from '../utils';
import {
	BarSortScene 
} from './barsortscene';

export class InsertionSortScene extends BarSortScene {
	constructor(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		colorTheme?: ColorTheme) {
		super(canvas, ctx, colorTheme);
		this.script = new InsertionSort(generateRandomNumberArray(35, 100));
		this.state.generations = this.script.addStateToGenerations(this.script.sortData());
		this.state.algorithmType = 'insertionsort';
	}
}