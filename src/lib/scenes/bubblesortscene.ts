import {
	BubbleSort 
} from '../scritps/bubblesort';
import {
	generateRandomNumberArray 
} from '../utils';
import {
	Scene 
} from './scene';

export class BubbleSortScene extends Scene {
	constructor(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,) {
		super(canvas, ctx);
		this.script = new BubbleSort(generateRandomNumberArray(35, 100));
		this.state.generations = this.script.addStateToGenerations(this.script.sortData());
		this.state.algorithmType = 'bubblesort';
	}
}