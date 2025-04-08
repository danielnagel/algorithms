import {
	CanvasTableHandlerImpl 
} from './helper/CanvasTableHandlerImpl';
import {
	Scene 
} from './scene';

export class TableSortScene extends Scene {

	// Position und Größe des Kreises
	circlePosition: {x: number, y: number, size: number} = {
		x: -1,
		y: -1,
		size: -1
	};
	srcTable: CanvasTableHandler;
	destTable: CanvasTableHandlerImpl;

	// Globale Zustände für srcCell und destCell
	srcCellCoords: { row: number, col: number } = {
		row: 1,
		col: 1 
	};
	destCellCoords: { row: number, col: number } = {
		row: 0,
		col: 10 
	};

	constructor(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		colorTheme?: ColorTheme) {
		super(canvas, ctx, colorTheme);
		this.srcTable = new CanvasTableHandlerImpl(this.state.canvas, this.state.ctx);
		this.srcTable.create(2, 30, 10, 10);
		this.srcTable.fillCell(1, 1, '5');
		this.destTable = new CanvasTableHandlerImpl(this.state.canvas, this.state.ctx);
		this.destTable.create(2, 30, 10, 200);
	}

	// Methode zum Setzen von srcCell und destCell
	setCells(srcRow: number, srcCol: number, destRow: number, destCol: number): void {
		this.srcCellCoords = {
			row: srcRow,
			col: srcCol 
		};
		this.destCellCoords = {
			row: destRow,
			col: destCol 
		};
	}

	getCells(): { srcCell: CanvasTableCell | null, destCell: CanvasTableCell | null } {
		const srcCell = this.srcTable.getCell(this.srcCellCoords.row, this.srcCellCoords.col); // Hole die Startzelle
		const destCell = this.destTable.getCell(this.destCellCoords.row, this.destCellCoords.col); // Hole die Zielzelle
		return {
			srcCell,
			destCell 
		};
	}

	update(): boolean {
		this.updateCirclePosition(); // Ausgelagerte Logik für die Kreisbewegung
		return super.update();
	}

	updateCirclePosition(): void {
		const { srcCell, destCell } = this.getCells(); // Hole die Zellen basierend auf den Koordinaten
	
		if (srcCell && destCell) {
			if (this.circlePosition.x === -1 && this.circlePosition.y === -1 && this.circlePosition.size === -1) {
				// Wenn der Kreis nicht sichtbar ist, setze die Startposition
				this.circlePosition.x = srcCell.x + srcCell.w / 2;
				this.circlePosition.y = srcCell.y + srcCell.h / 2;
				this.circlePosition.size = srcCell.h / 2;
				return;
			}
	
			// Berechne die Zielposition des Kreises
			const targetX = destCell.x + destCell.w / 2;
			const targetY = destCell.y + destCell.h / 2;
	
			// Bewege den Kreis schrittweise in Richtung der Zielposition
			const speed = 10; // Geschwindigkeit des Kreises
			const dx = targetX - this.circlePosition.x;
			const dy = targetY - this.circlePosition.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
	
			if (distance > speed) {
				this.circlePosition.x += (dx / distance) * speed;
				this.circlePosition.y += (dy / distance) * speed;
			} else {
				// Kreis hat die Zielposition erreicht
				this.circlePosition.x = targetX;
				this.circlePosition.y = targetY;
			}
		}
	}

	shouldDrawScene(now: number): boolean {
		const { destCell } = this.getCells(); // Hole die Zielzelle
		if (this.state.lastTimestamp + this.state.frameDelay < now && destCell && this.circlePosition.x !== destCell.x + destCell.w / 2 && this.circlePosition.y !== destCell.y + destCell.h / 2) {
			this.state.lastTimestamp = now;
			return true;
		}
		return false;
	}
	
	draw() {
		this.state.ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
		this.state.ctx.fillStyle = 'gray';
		this.state.ctx.fillRect(0, 0, this.state.canvas.width, this.state.canvas.height);
	
		// Zeichne die Tabellen
		this.srcTable.draw();
		this.destTable.draw();
	
		// Zeichne den Kreis an seiner aktuellen Position
		this.drawCircle(this.circlePosition.x, this.circlePosition.y, this.circlePosition.size);
	}

	drawCircle(x: number, y: number, r: number) {
		if (x === -1 || y === -1 || r === -1) return;
		this.state.ctx.beginPath();
		this.state.ctx.arc(x, y, r, 0, Math.PI * 2);
		this.state.ctx.strokeStyle = 'red';
		this.state.ctx.lineWidth = 4;
		this.state.ctx.stroke();
	}
}