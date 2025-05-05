import {
	CountingSort 
} from '../scritps/countingsort';
import {
	generateRandomNumberArray 
} from '../utils';
import {
	CanvasTableHandlerImpl 
} from './helper/CanvasTableHandlerImpl';
import {
	TableSortScene 
} from './tablesortscene';

export class CountingSortScene extends TableSortScene {

	// Position und Größe des Kreises für den Count State
	countCirclePosition: CirclePosition = {
		x: -1,
		y: -1,
		size: -1
	};
	// initiale Position des Kreises für den Count State
	initialCountCirclePosition: CirclePosition = {
		...this.countCirclePosition
	};
	// Position und Größe des Kreises für den Result State
	resultCirclePosition: CirclePosition = {
		x: -1,
		y: -1,
		size: -1
	};
	// initiale Position des Kreises für den Result State
	initialResultCirclePosition: CirclePosition = {
		...this.resultCirclePosition
	};
	initialTable: CanvasTableHandler;
	countTable: CanvasTableHandler;
	resultTable: CanvasTableHandler;

	constructor(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		colorTheme?: ColorTheme) {
		super(canvas, ctx, colorTheme);
		this.script = new CountingSort(generateRandomNumberArray(35, 35));
		this.state.generations = this.script.addStateToGenerations(this.script.sortData());
		this.initialTable = new CanvasTableHandlerImpl(this.state.canvas, this.state.ctx);
		this.initialTable.create(1, this.state.generations[0].initialTable.data.length, 10, 100, true);
		this.updateCanvasTableValues(this.initialTable, this.state.generations[0].initialTable.data, 0);
		this.countTable = new CanvasTableHandlerImpl(this.state.canvas, this.state.ctx);
		this.countTable.create(1, this.state.generations[0].countTable.data.length, 10, 300, true);
		this.updateCanvasTableValues(this.countTable, this.state.generations[0].countTable.data, 0);
		this.resultTable = new CanvasTableHandlerImpl(this.state.canvas, this.state.ctx);
		this.resultTable.create(1, this.state.generations[0].resultTable.data.length, 10, 500, true);
		this.updateCanvasTableValues(this.resultTable, this.state.generations[0].resultTable.data, 0);
		this.state.swapSpeed = 5000 / this.state.frameDelay;
	}

	updateCanvasTableValues(table: CanvasTableHandler, data: (number|undefined)[], row: number): void {
		data.forEach((value, index) => {
			table.fillCell(row, index, value === undefined ? '' : value.toString());
		});
	}

	update(): boolean {
		this.state.swapSpeed = 5000 / this.state.frameDelay;
		if (
			this.state.generations[this.state.index].state ===
                'count' &&
            this.state.frameDelay > 0
		) {
			this.state.swapping = this.updateCountCirclePosition();
			if (!this.state.swapping) {
				this.updateCanvasTableValues(this.countTable, this.state.generations[this.state.index].countTable.data, 0);
				this.state.index++;
			}
		} else if (
			this.state.generations[this.state.index].state ===
                'sort' &&
            this.state.frameDelay > 0
		) {
			this.state.swapping = this.updateSortCirclePosition();
			if (!this.state.swapping) {
				this.updateCanvasTableValues(this.resultTable, this.state.generations[this.state.index].resultTable.data, 0);
				this.state.index++;
			}
		} else {
			this.updateCanvasTableValues(this.initialTable, this.state.generations[this.state.index].initialTable.data, 0);
			this.updateCanvasTableValues(this.countTable, this.state.generations[this.state.index].countTable.data, 0);
			this.updateCanvasTableValues(this.resultTable, this.state.generations[this.state.index].resultTable.data, 0);
			this.state.index++;
		}
		// finshed condition
		return this.state.index < this.state.generations.length;
	}

	updateSortCirclePosition(): boolean {
		if(((this.initialResultCirclePosition.x === -1 && this.initialResultCirclePosition.y === -1) || (this.countCirclePosition.x === -1 && this.countCirclePosition.y === -1)) || !(this.initialCountCirclePosition.x !== this.countCirclePosition.x && this.initialCountCirclePosition.y !== this.countCirclePosition.y)) {
			const initialTableCell = this.initialTable.getCell(0, this.state.generations[this.state.index].initialTable.selectionIndex);
			if (initialTableCell === null) throw new Error('initial table cell not found');
			const countTableCell = this.countTable.getCell(1, this.state.generations[this.state.index].countTable.selectionIndex);
			if (countTableCell === null) throw new Error('count table cell not found');
			const count = this.updateCirclePosition(this.countCirclePosition, initialTableCell, countTableCell, false);
			if ((this.initialCountCirclePosition.x === -1 && this.initialCountCirclePosition.y === -1)) {
				// Wenn der Kreis nicht sichtbar ist, setze die Startposition
				this.initialCountCirclePosition = {
					...this.countCirclePosition
				};
			}
			if(count) return count;
			this.updateCanvasTableValues(this.countTable, this.state.generations[this.state.index].countTable.data, 0);
		}

		const countTableCell = this.countTable.getCell(0, this.state.generations[this.state.index].countTable.selectionIndex);
		if (countTableCell === null) throw new Error('count table cell not found');
		const resultTableCell = this.resultTable.getCell(1, this.state.generations[this.state.index].resultTable.selectionIndex);
		if (resultTableCell === null) throw new Error('result table cell not found');

		const result = this.updateCirclePosition(this.resultCirclePosition, countTableCell, resultTableCell);
		if ((this.initialResultCirclePosition.x === -1 && this.initialResultCirclePosition.y === -1) || (this.resultCirclePosition.x === -1 && this.resultCirclePosition.y === -1)) {
			// Wenn der Kreis nicht sichtbar ist, setze die Startposition
			// oder wenn der Kreis an der Zielposition ist, verstecke den Kreis
			this.initialResultCirclePosition = {
				...this.resultCirclePosition
			};
		}
		if(!result) {
			this.countCirclePosition = { x: -1, y: -1, size: -1 };
			this.initialCountCirclePosition = { ...this.countCirclePosition };
		}
		return result;
	}

	updateCountCirclePosition(): boolean {
		const initialTableCell = this.initialTable.getCell(0, this.state.generations[this.state.index].initialTable.selectionIndex);
		if (initialTableCell === null) throw new Error('initial table cell not found');
		const countTableCell = this.countTable.getCell(1, this.state.generations[this.state.index].countTable.selectionIndex);
		if (countTableCell === null) throw new Error('count table cell not found');

		const result = this.updateCirclePosition(this.countCirclePosition, initialTableCell, countTableCell);
		if ((this.initialCountCirclePosition.x === -1 && this.initialCountCirclePosition.y === -1) || (this.countCirclePosition.x === -1 && this.countCirclePosition.y === -1)) {
			// Wenn der Kreis nicht sichtbar ist, setze die Startposition
			// oder wenn der Kreis an der Zielposition ist, verstecke den Kreis
			this.initialCountCirclePosition = {
				...this.countCirclePosition
			};
		}
		return result;
	}

	updateCirclePosition(circlePosition: CirclePosition, srcCell: CanvasTableCell, destCell: CanvasTableCell, resetCirclePosition = true): boolean {
		if (circlePosition.x === -1 && circlePosition.y === -1 && circlePosition.size === -1) {
			// Wenn der Kreis nicht sichtbar ist, setze die Startposition
			circlePosition.x = srcCell.x + srcCell.w / 2;
			circlePosition.y = srcCell.y + srcCell.h / 2;
			circlePosition.size = srcCell.h / 2;
			return true;
		}

		// Berechne die Zielposition des Kreises
		const targetX = destCell.x + destCell.w / 2;
		const targetY = destCell.y + destCell.h / 2;

		// Bewege den Kreis schrittweise in Richtung der Zielposition
		const speed = this.state.swapSpeed || 10; // Geschwindigkeit des Kreises
		const dx = targetX - circlePosition.x;
		const dy = targetY - circlePosition.y;
		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance > speed) {
			circlePosition.x += (dx / distance) * speed;
			circlePosition.y += (dy / distance) * speed;
		} else {
			if (circlePosition.x === targetX && circlePosition.y === targetY) {
				if(resetCirclePosition) {
					// Kreis Position zurücksetzen
					circlePosition.x = -1;
					circlePosition.y = -1;
					circlePosition.size = -1;
				}
				return false; // Kreis ist an der Zielposition
			} else {
				// Kreis hat die Zielposition erreicht
				circlePosition.x = targetX;
				circlePosition.y = targetY;
			}
		}
		return true; // Kreis ist noch nicht an der Zielposition
	}

	drawCountCircles() {
		if (
			this.state.generations[this.state.index].state ===
                'count' &&
            this.state.frameDelay > 0
		) {
			this.drawCircle(
				this.initialCountCirclePosition.x,
				this.initialCountCirclePosition.y,
				this.initialCountCirclePosition.size,
				'blue'
			);
			this.drawCircle(
				this.countCirclePosition.x,
				this.countCirclePosition.y,
				this.countCirclePosition.size,
				'blue'
			);
		}
	}

	drawSortCircles() {
		if (
			this.state.generations[this.state.index].state ===
                'sort' &&
            this.state.frameDelay > 0
		) {
			this.drawCircle(
				this.initialCountCirclePosition.x,
				this.initialCountCirclePosition.y,
				this.initialCountCirclePosition.size,
				'blue'
			);
			this.drawCircle(
				this.countCirclePosition.x,
				this.countCirclePosition.y,
				this.countCirclePosition.size,
				'blue'
			);
			this.drawCircle(
				this.initialResultCirclePosition.x,
				this.initialResultCirclePosition.y,
				this.initialResultCirclePosition.size,
				this.state.colorTheme.accent
			);
			this.drawCircle(
				this.resultCirclePosition.x,
				this.resultCirclePosition.y,
				this.resultCirclePosition.size,
				this.state.colorTheme.accent
			);
		}
	}

	drawHighlightedCells() {
		if (this.state.generations[this.state.index].state === 'update-count') {
			const countTableCell = this.countTable.getCell(0, this.state.generations[this.state.index].countTable.selectionIndex);
			if (countTableCell === null) throw new Error('count table cell not found');
			const previousCountTableCell = this.countTable.getCell(0, this.state.generations[this.state.index-1].countTable.selectionIndex);
			if (previousCountTableCell === null) throw new Error('previous count table cell not found');
			this.highlightCell(previousCountTableCell, this.state.colorTheme.accent);
			this.highlightCell(countTableCell, this.state.colorTheme.accent);
		}
	}
	
	draw() {
		this.state.ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
		this.state.ctx.fillStyle = 'gray';
		this.state.ctx.fillRect(0, 0, this.state.canvas.width, this.state.canvas.height);
	
		// Zeichne die Tabellen
		this.initialTable.draw();
		this.countTable.draw();
		this.resultTable.draw();

		// Count Phase
		this.drawCountCircles();
		// Update-Count Phase
		this.drawHighlightedCells();
		// Sort Phase
		this.drawSortCircles();
		
	}

	drawCircle(x: number, y: number, r: number, color: string) {
		if (x === -1 || y === -1 || r === -1) return;
		this.state.ctx.beginPath();
		this.state.ctx.arc(x, y, r, 0, Math.PI * 2);
		this.state.ctx.strokeStyle = color;
		this.state.ctx.lineWidth = 4;
		this.state.ctx.stroke();
	}

	highlightCell(cell: CanvasTableCell, color: string) {
		this.state.ctx.strokeStyle = color;
		this.state.ctx.lineWidth = 2;
		this.state.ctx.strokeRect(cell.x, cell.y, cell.w, cell.h);
	}
}