export class CanvasTableHandlerImpl implements CanvasTableHandler {
	table: CanvasTable;
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

	constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
		this.canvas = canvas;
		this.ctx = ctx;
		this.table = {
			cells: [],
			rows: 0,
			columns: 0,
			x: 0,
			y: 0,
			w: 0,
			h: 0 
		};
	}

	create(rows: number, columns: number, x: number, y: number): CanvasTable {
		const size = (this.canvas.width - 2 * x) / columns;
		const cells: CanvasTableCell[] = [];

		for (let row = 0; row < rows; row++) {
			for (let column = 0; column < columns; column++) {
				cells.push({
					r: row,
					c: column,
					x: x + column * size,
					y: y + row * size,
					w: size,
					h: size,
					text: ''
				});
			}
		}

		this.table = {
			cells,
			rows,
			columns,
			x,
			y,
			w: this.canvas.width - 2 * x,
			h: rows * size 
		};
		return this.table;
	}

	draw(showIndex?: boolean): void {
		const cell = this.getCell(0, 0);
		if (!cell) {
			throw new Error('table is not initialized!');
		}
		const fontSize = Math.round(cell.w / 2);
		this.ctx.strokeStyle = 'black';
		this.ctx.lineWidth = 2;
		this.ctx.fillStyle = 'black';
		this.ctx.textAlign = 'center';
		this.ctx.textBaseline = 'middle';
		this.ctx.font = `${fontSize}px Arial`;

		for (const cell of this.table.cells) {
			this.ctx.strokeRect(cell.x, cell.y, cell.w, cell.h);
			this.ctx.fillText(cell.text, cell.x + cell.w / 2, cell.y + cell.h / 2, cell.w - 10);
		}

		if (showIndex) {
			this.ctx.fillStyle = 'blue';
			for (let column = 0; column < this.table.columns; column++) {
				const indexCellX = this.table.x + column * cell.w;
				this.ctx.fillText(
					column.toString(),
					indexCellX + cell.w / 2,
					this.table.y + this.table.h + cell.h / 2
				);
			}
		}
	}

	getCell(row: number, column: number): CanvasTableCell | null {
		return this.table.cells.find(cell => cell.r === row && cell.c === column) || null;
	}

	fillCell(row: number, column: number, text: string): void {
		const cell = this.getCell(row, column);
		if (cell) cell.text = text;
	}
}
