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
	BarSortScene 
} from './barsortscene';

export class ShellSortScene extends BarSortScene {
	constructor(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		options: AlgorithmCanvasOptions) {
		super(canvas, ctx, options);
		this.script = new ShellSort(options.dataSet ? [...options.dataSet] : generateRandomNumberArray(options.dataSetSize ? options.dataSetSize : 35, 100));
		this.state.generations = this.script.addStateToGenerations(this.script.sortData());
		this.state.algorithmType = 'shellsort';
		this.drawService = new ShellSortDrawService();
	}
}