import {
	AlgorithmCanvasOptions 
} from '../..';
import {
	SortScript 
} from '../scritps/sortscript';
import {
	Scene 
} from './scene';

export class TableSortScene extends Scene<TableGeneration> {

	script: SortScript<TableGeneration>;

	constructor(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		options: AlgorithmCanvasOptions) {
		super(canvas, ctx, options);
		this.script = new SortScript<TableGeneration>([]);
	}

}