import {
	CanvasTableHandlerImpl 
} from './helper/CanvasTableHandlerImpl';
import {
	Scene 
} from './scene';

export class TableSortScene extends Scene {
	draw() {
		this.state.ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
		this.state.ctx.fillStyle = 'gray';
		this.state.ctx.fillRect(0, 0, this.state.canvas.width, this.state.canvas.height);
		const tableHandler = new CanvasTableHandlerImpl(this.state.canvas, this.state.ctx);
		tableHandler.create(2, 30, 10, 10);
		tableHandler.fillCell(1, 1, 'hi');
		tableHandler.draw();
		const cell = tableHandler.getCell(1, 1);
		if (cell) {
			this.drawCircle(cell.x +cell.w/2, cell.y +cell.h/2, cell.w/2);
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