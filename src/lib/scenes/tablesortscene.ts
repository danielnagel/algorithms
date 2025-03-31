import {
	CanvasTableHandlerImpl 
} from './helper/CanvasTableHandlerImpl';
import {
	Scene 
} from './scene';

export class TableSortScene extends Scene {

	circlePosition: {x: number, y: number};
	srcTable: CanvasTableHandler;
	destTable: CanvasTableHandlerImpl;

	constructor(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		colorTheme?: ColorTheme) {
		super(canvas, ctx, colorTheme);
		this.circlePosition = {
			x: -30,
			y: -30
		};
		this.srcTable = new CanvasTableHandlerImpl(this.state.canvas, this.state.ctx);
		this.srcTable.create(2, 30, 10, 10);
		this.srcTable.fillCell(1, 1, '5');
		this.destTable = new CanvasTableHandlerImpl(this.state.canvas, this.state.ctx);
		this.destTable.create(2, 30, 10, 200);
	}

	draw() {
		this.state.ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
		this.state.ctx.fillStyle = 'gray';
		this.state.ctx.fillRect(0, 0, this.state.canvas.width, this.state.canvas.height);

		// TODO: move circle
		this.srcTable.draw();
		const srcCell = this.srcTable.getCell(1, 1);
		if (srcCell) {
			//this.drawCircle(cell.x +cell.w/2, cell.y +cell.h/2, cell.w/2);
		}

		this.destTable.draw();
		const cell2 = this.destTable.getCell(0, 10);
		if (cell2) {
			this.drawCircle(cell2.x +cell2.w/2, cell2.y +cell2.h/2, cell2.w/2);
		}
	}

	drawCircle(x: number, y: number, r: number) {
		this.state.ctx.beginPath();
		this.state.ctx.arc(x, y, r, 0, Math.PI * 2);
		this.state.ctx.strokeStyle = 'red';
		this.state.ctx.lineWidth = 4;
		this.state.ctx.stroke();
	}
}