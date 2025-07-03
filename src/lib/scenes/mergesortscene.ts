import {
	MergeSort 
} from '../scritps/mergesort';
import {
	MergeSortDrawService 
} from '../services/mergeSortDrawService';
import {
	generateRandomNumberArray, 
	range
} from '../utils';
import {
	BarSortScene 
} from './barsortscene';

export class MergeSortScene extends BarSortScene {
	constructor(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		options: AlgorithmCanvasOptions) {
		super(canvas, ctx, options);
		this.script = new MergeSort(generateRandomNumberArray(35, 100));
		this.state.generations = this.script.addStateToGenerations(this.script.sortData());
		this.state.algorithmType = 'mergesort';
		this.drawService = new MergeSortDrawService();
	}

	updateSwapAnimation(): void {
		const subListRange = this.state.generations[this.state.index].subListRange;
		const selectionIndex = this.state.generations[this.state.index].selectionIndizes[0];
		if (subListRange === undefined || selectionIndex === undefined || subListRange.length !== 2) {
			this.state.swapping = false;
			this.state.fylingBars = undefined;
			this.state.swapSpeed = undefined;
		} else {
			if (!this.state.fylingBars) {
				// setup swapping
				this.state.swapping = true;
				this.state.swapSpeed = 3000 / this.state.frameDelay;
				this.state.fylingBars = [];
				const subList = range(subListRange[0], subListRange[1] -1);
				subList.forEach(index => {
					const value = this.state.generations[this.state.index].data[index];
					const { width, height, y } = this.drawService.getBarRect(this.state, value);
					const srcBar = {
						value,
						x: index * width,
						color: this.state.colorTheme.accent,
						y: y /2.1
					};
					const destBar = {
						value,
						x: index * width,
						color: this.state.colorTheme.accent,
						y: y+height/1.9
					};
					this.state.fylingBars?.push({
						from: srcBar,
						initialFrom: srcBar,
						to: destBar
					});
				});
			} else {
				this.state.swapping = true;
				this.state.swapSpeed = 3000 / this.state.frameDelay;
				const flyingBarIndex = selectionIndex - subListRange[0];
				const currentFlyingBar = this.state.fylingBars[flyingBarIndex];
				currentFlyingBar.from.color = this.state.colorTheme.accentSecondary;
				const mergeResult = this.state.generations[this.state.index].mergeResult;
				if (mergeResult && mergeResult.length > 0) {
					const destBar = currentFlyingBar.to;
					const { width } = this.drawService.getBarRect(this.state, destBar.value);
					destBar.x = (subListRange[0] + mergeResult.length) * width - width;
				}
				if (currentFlyingBar.from.y < currentFlyingBar.to.y) {
					currentFlyingBar.from.y += this.state.swapSpeed;
					if (currentFlyingBar.from.y > currentFlyingBar.to.y) {
						currentFlyingBar.from.y = currentFlyingBar.to.y;
					}
					if (currentFlyingBar.initialFrom.x > currentFlyingBar.to.x) {
						currentFlyingBar.from.x -= this.state.swapSpeed*2;
						if (currentFlyingBar.from.x < currentFlyingBar.to.x) {
							currentFlyingBar.from.x = currentFlyingBar.to.x;
						}
					} else {
						currentFlyingBar.from.x += this.state.swapSpeed*2;
						if (currentFlyingBar.from.x > currentFlyingBar.to.x) {
							currentFlyingBar.from.x = currentFlyingBar.to.x;
						}
					}
				} else {
					currentFlyingBar.from.color = this.state.colorTheme.accent;
					this.state.swapping = false;
					this.state.swapSpeed = undefined;
					// lastTimestamp = 0: immediatly draw the next generation
					this.state.lastTimestamp = 0;
				}
			}
		}
	}
}