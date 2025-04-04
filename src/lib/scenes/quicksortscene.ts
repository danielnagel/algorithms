import {
	QuickSort 
} from '../scritps/quicksort';
import {
	QuickSortDrawService 
} from '../services/quickSortDrawService';
import {
	generateRandomNumberArray, 
} from '../utils';
import {
	BarSortScene 
} from './barsortscene';

export class QuickSortScene extends BarSortScene {
	constructor(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		colorTheme?: ColorTheme) {
		super(canvas, ctx, colorTheme);
		this.script = new QuickSort(generateRandomNumberArray(35, 100));
		this.state.generations = this.script.addStateToGenerations(this.script.sortData());
		this.state.algorithmType = 'quicksort';
		this.drawService = new QuickSortDrawService();
	}
}