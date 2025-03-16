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

	updateSwapAnimation(): void {
		this.state.swapping = false;
		this.state.b1 = undefined;
		this.state.b2 = undefined;
		this.state.initialB1x = undefined;
		this.state.initialB2x = undefined;
		this.state.swapSpeed = undefined;
		// lastTimestamp = 0: immediatly draw the next generation
		//this.state.lastTimestamp = 0;
	}
}