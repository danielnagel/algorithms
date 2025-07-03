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
		options: AlgorithmCanvasOptions) {
		super(canvas, ctx, options);
		this.script = new InsertionSort(options.dataSet ? [...options.dataSet] : generateRandomNumberArray(options.dataSetSize ? options.dataSetSize : 35, 100));
		this.state.generations = this.script.addStateToGenerations(this.script.sortData());
		this.state.algorithmType = 'insertionsort';
	}
}