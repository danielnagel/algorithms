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
		options: AlgorithmCanvasOptions) {
		super(canvas, ctx, options);
		this.script = new BubbleSort(options.dataSet ? [...options.dataSet] : generateRandomNumberArray(options.dataSetSize ? options.dataSetSize : 35, 100));
		this.state.generations = this.script.addStateToGenerations(this.script.sortData());
		this.state.algorithmType = 'bubblesort';
	}
}