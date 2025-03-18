import {
	MergeSort 
} from '../scritps/mergesort';
import {
	MergeSortDrawService 
} from '../services/mergeSortDrawService';
import {
	generateRandomNumberArray 
} from '../utils';
import {
	Scene 
} from './scene';

export class MergeSortScene extends Scene {
	constructor(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		colorTheme?: ColorTheme) {
		super(canvas, ctx, colorTheme);
		this.script = new MergeSort(generateRandomNumberArray(35, 100));
		this.state.generations = this.script.addStateToGenerations(this.script.sortData());
		this.state.algorithmType = 'mergesort';
		this.drawService = new MergeSortDrawService();
	}

	updateSwapAnimation(): void {
		const mergeResult = this.state.generations[this.state.index].mergeResult;
		if (!mergeResult) return;
		if (mergeResult.length === 0) {
			console.log('a');
			this.state.swapping = false;
			this.state.b1 = undefined;
			this.state.b2 = undefined;
			this.state.initialB1x = undefined;
			this.state.initialB2x = undefined;
			this.state.swapSpeed = undefined;
			// lastTimestamp = 0: immediatly draw the next generation
			//this.state.lastTimestamp = 0;
		} else {
			if (!this.state.b1 && !this.state.b2) {
				// setup swapping
				this.state.swapping = true;
				const value = this.state.generations[this.state.index].data[this.state.generations[this.state.index].selectionIndizes[0]];
				const { width: w, y } = this.drawService.getBarRect(this.state, value);
				console.log('oben', value, w, y);
				this.state.b1 = {
					value,
					x: this.state.generations[this.state.index].selectionIndizes[0] * w,
					color: this.state.colorTheme.accentSecondary,
					y: y /2.1
				};
				this.state.initialB1x = this.state.b1.x;
				const { width, height, y: yy } = this.drawService.getBarRect(this.state, value);
				this.state.b2 = {
					value,
					x: (mergeResult.length-1) * width,
					color: this.state.colorTheme.accentSecondary,
					y: yy + height/1.9
				};
				this.state.initialB2x = this.state.b2.x;
				this.state.swapSpeed = 3000 / this.state.frameDelay;
			} else if (this.state.b1 && this.state.b2 && this.state.initialB1x !== undefined && this.state.initialB2x !== undefined && this.state.swapSpeed !== undefined) {
				if ((this.state.b1.y as number) < (this.state.b2.y as number)) {
					(this.state.b1.y as number) += this.state.swapSpeed;
					if ((this.state.b1.y as number) > (this.state.b2.y as number)) {
						this.state.b1.y = this.state.b2.y;
					}
					if (this.state.initialB1x > this.state.initialB2x) {
						this.state.b1.x -= this.state.swapSpeed;
						if (this.state.b1.x < this.state.b2.x) {
							this.state.b1.x = this.state.b2.x;
						}
					} else {
						this.state.b1.x += this.state.swapSpeed;
						if (this.state.b1.x > this.state.b2.x) {
							this.state.b1.x = this.state.b2.x;
						}
					}
					this.state.swapping = true;
				} else {
					console.log('b');
					this.state.swapping = false;
					this.state.b1 = undefined;
					this.state.b2 = undefined;
					this.state.initialB1x = undefined;
					this.state.initialB2x = undefined;
					this.state.swapSpeed = undefined;
					// lastTimestamp = 0: immediatly draw the next generation
					//this.state.lastTimestamp = 0;
				}
			}
		}
	}
}