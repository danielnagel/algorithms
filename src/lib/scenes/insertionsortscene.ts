import {
	InsertionSort 
} from '../scritps/insertionsort';
import {
	generateRandomNumberArray 
} from '../utils';
import {
	Scene 
} from './scene';

export class InsertionSortScene extends Scene {
	constructor(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,) {
		super(canvas, ctx);
		this.script = new InsertionSort(generateRandomNumberArray(35, 100));
		this.state.generations = this.script.addStateToGenerations(this.script.sortData());
		this.state.algorithmType = 'insertionsort';
	}
}