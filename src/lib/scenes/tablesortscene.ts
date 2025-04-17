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
		colorTheme?: ColorTheme) {
		super(canvas, ctx, colorTheme);
		this.script = new SortScript<TableGeneration>([]);
	}

}