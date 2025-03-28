import {
	Scene 
} from './scene';

interface VirtualCell {
    row: number;
    column: number;
    x: number;
    y: number;
    w: number;
    h: number;
}

type VirtualTable = VirtualCell[];


export class TableSortScene extends Scene {
	draw() {
		this.state.ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
		this.state.ctx.fillStyle = 'gray';
		this.state.ctx.fillRect(0, 0, this.state.canvas.width, this.state.canvas.height);
		const virtualTable = this.drawTable(2, 30, 10, 10);
		this.fillCell(virtualTable, 1, 1, 'hi');
		const pos = virtualTable.filter(item => item.row === 1 && item.column === 1);
		if (pos.length && pos[0])
			this.drawCircle(pos[0].x +pos[0].w/2, pos[0].y +pos[0].h/2, pos[0].w/2);
	}


	drawTable(rows: number, columns: number, x: number, y: number) {
		const table: VirtualTable = [];
		const size = (this.state.canvas.width - 2 * x) / columns;
        
		this.state.ctx.strokeStyle = 'black';
		this.state.ctx.lineWidth = 1;
        
		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < columns; col++) {
				const cellX = x + col * size;
				const cellY = y + row * size;
				this.state.ctx.strokeRect(cellX, cellY, size, size);
                
				table.push({
					row,
					column: col,
					x: cellX,
					y: cellY,
					w: size,
					h: size 
				});
			}
		}
		return table;
	}

	fillCell(table: VirtualTable, row: number, col: number, text: string) {
		const cell = table.find(c => c.row === row && c.column === col);
		if (!cell) return;
        
		this.state.ctx.fillStyle = 'white';
		this.state.ctx.fillRect(cell.x, cell.y, cell.w, cell.h); // Clear the cell
		this.state.ctx.strokeRect(cell.x, cell.y, cell.w, cell.h); // Redraw the border
        
		this.state.ctx.fillStyle = 'black';
		this.state.ctx.font = '16px Arial';
		this.state.ctx.textAlign = 'center';
		this.state.ctx.textBaseline = 'middle';
        
		const textX = cell.x + cell.w / 2;
		const textY = cell.y + cell.h / 2;
		this.state.ctx.fillText(text, textX, textY, cell.w - 4); // Ensure text fits within the cell
	}

	drawCircle(x: number, y: number, r: number) {
		this.state.ctx.beginPath();
		this.state.ctx.arc(x, y, r, 0, Math.PI * 2);
		this.state.ctx.strokeStyle = 'red';
		this.state.ctx.lineWidth = 4;
		this.state.ctx.stroke();
	}
}