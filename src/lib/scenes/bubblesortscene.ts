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
		colorTheme?: ColorTheme,
		data?: number[]) {
		super(canvas, ctx, colorTheme);
		console.log('BubbleSortScene initialized with data:', data);
		this.script = new BubbleSort(data ? [...data] : generateRandomNumberArray(35, 100));
		this.state.generations = this.script.addStateToGenerations(this.script.sortData());
		this.state.algorithmType = 'bubblesort';
	}
}