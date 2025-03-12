import {
	MergeSort 
} from '../scritps/mergesort';
import {
	MergeSortDrawService 
} from '../services/mergeSortDrawService';
import {
	generateRandomNumberArray 
} from '../utils';
import {
	Scene 
} from './scene';

export class MergeSortScene extends Scene {
	constructor(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		colorTheme?: ColorTheme) {
		super(canvas, ctx, colorTheme);
		this.script = new MergeSort(generateRandomNumberArray(35, 100));
		this.state.generations = this.script.addStateToGenerations(this.script.sortData());
		this.state.algorithmType = 'mergesort';
		this.drawService = new MergeSortDrawService();
	}
}