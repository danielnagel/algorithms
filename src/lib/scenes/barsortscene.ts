import {
	Scene 
} from './scene';


export class BarSortScene extends Scene<Generation> {

	constructor(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		colorTheme?: ColorTheme
	) {
		super(canvas, ctx, colorTheme);
	}

	updateSwapAnimation() {
		if (
			!this.state.b1 && !this.state.b2 &&
            this.state.initialB1x === undefined &&
            this.state.initialB2x === undefined
		) {
			// setup swapping
			this.state.swapping = true;
			this.state.b1 = this.drawService.getBar(this.state, 0, 1);
			this.state.b2 = this.drawService.getBar(this.state, 1, 0);
			this.state.initialB1x = this.state.b1.x;
			this.state.initialB2x = this.state.b2.x;
			this.state.swapSpeed = 3000 / this.state.frameDelay *
                (this.state.generations[this.state.index].selectionIndizes[1] -
                    this.state.generations[this.state.index]
                    	.selectionIndizes[0]);
		} else if (
			this.state.b1 && this.state.b2 &&
            this.state.initialB1x !== undefined &&
            this.state.initialB2x !== undefined &&
            this.state.swapSpeed !== undefined
		) {
			if (
				this.state.b1.x < this.state.initialB2x &&
                this.state.b2.x > this.state.initialB1x
			) {
				this.state.b1.x += this.state.swapSpeed;
				if (this.state.b1.x > this.state.initialB2x) {
					this.state.b1.x = this.state.initialB2x;
				}
				this.state.b2.x -= this.state.swapSpeed;
				if (this.state.b2.x < this.state.initialB1x) {
					this.state.b2.x = this.state.initialB1x;
				}
				this.state.swapping = true;
			} else {
				this.state.swapping = false;
				this.state.b1 = undefined;
				this.state.b2 = undefined;
				this.state.initialB1x = undefined;
				this.state.initialB2x = undefined;
				this.state.swapSpeed = undefined;
				// lastTimestamp = 0: immediatly draw the next generation
				this.state.lastTimestamp = 0;
			}
		}
	}

	draw() {
		if (
			this.state.generations[this.state.index].state ===
                'swap-selection' &&
            this.state.frameDelay > 0
		) {
			this.drawService.drawBarSwapAnimation(this.state);
		} else {
			this.drawService.drawBarChart(this.state);
		}
	}

	update() {
		if (
			this.state.generations[this.state.index].state ===
                'swap-selection' &&
            this.state.frameDelay > 0
		) {
			this.updateSwapAnimation();
			if (!this.state.swapping) {
				if (this.state.isBackwards) {
					this.state.index--;
					if (this.state.isStep) {
						this.state.isRunning = false;
						this.state.isStep = false;
						this.state.index--;
					}
				} else {
					this.state.index++;
					if (this.state.isStep) {
						this.state.isRunning = false;
						this.state.isStep = false;
						this.state.index++;
					}
				}
			}
		} else if (this.state.isBackwards) {
			this.state.index--;
			if (this.state.isStep) {
				this.state.isRunning = false;
				this.state.isStep = false;
			}
		} else {
			this.state.index++;
			if (this.state.isStep) {
				this.state.isRunning = false;
				this.state.isStep = false;
			}
		}
		// finshed condition
		return this.state.index < this.state.generations.length;
	}

	skipBackState() {
		super.skipBackState();
		this.state.b1 = undefined;
		this.state.b2 = undefined;
		this.state.initialB1x = undefined;
		this.state.initialB2x = undefined;
	}

	skipForwardState() {
		super.skipForwardState();
		this.state.b1 = undefined;
		this.state.b2 = undefined;
		this.state.initialB1x = undefined;
		this.state.initialB2x = undefined;
	}

	stepBackState() {
		super.stepBackState();
		this.state.b1 = undefined;
		this.state.b2 = undefined;
		this.state.initialB1x = undefined;
		this.state.initialB2x = undefined;
	}

	stepForwardState() {
		if (this.state.swapping) {
			this.state.b1 = undefined;
			this.state.b2 = undefined;
			this.state.initialB1x = undefined;
			this.state.initialB2x = undefined;
		}
		super.stepForwardState();
	}
}
