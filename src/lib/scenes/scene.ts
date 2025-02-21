import {
	SortScript 
} from '../scritps/sortscript';
import {
	drawBar,
	getBarRect,
	generateRandomNumberArray 
} from '../utils';

export class Scene {
	script: SortScript;
	state: SceneState;

	constructor(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
	) {
		this.script = new SortScript([]);
		this.state = {
			canvas,
			ctx,
			algorithmType: '',
			generations: [],
			index: 0,
			animationFrameTimestamp: 0,
			lastTimestamp: 0,
			frameDelay: 500,
			swapping: false,
			isRunning: false,
			isStep: false,
			colorTheme: {
				primary: '#101010',
				primaryLight: '#202020',
				primaryLighter: '#303030',
				secondary: '#dadada',
				accent: '#6e90ff',
				accentSecondary: '#e55'
			}
		};
	}

	updateSwapAnimation() {
		if (
			!this.state.b1 && !this.state.b2 &&
			this.state.initialB1x === undefined &&
			this.state.initialB2x === undefined
		) {
			// setup swapping
			this.state.swapping = true;
			this.state.b1 = this.getBar(this.state, 0, 1);
			this.state.b2 = this.getBar(this.state, 1, 0);
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
			this.drawSwapAnimation(this.state);
		} else {
			this.drawBarChart(this.state);
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

	loopState() {
		if (this.state.index <= 0) this.state.index = 1;
		if (this.state.index >= this.state.generations.length) return;
		this.state.isBackwards = false;
		this.state.isStep = false;
		if (this.state.isRunning) {
			this.state.isRunning = false;
		} else {
			this.state.isRunning = true;
		}
		return this.state.isRunning;
	}

	resetState() {
		this.state.generations = this.script.addStateToGenerations(this.script.sortData(generateRandomNumberArray(35, 100)));
		this.state.index = 0;
		this.state.isBackwards = false;
		this.state.isStep = true;
		this.state.isRunning = true;
	}

	skipBackState() {
		this.state.isBackwards = true;
		this.state.index = 0;
		this.state.isRunning = true;
		this.state.isStep = true;
	}

	skipForwardState() {
		this.state.isBackwards = false;
		this.state.index = this.state.generations.length - 1;
		this.state.isRunning = true;
		this.state.isStep = true;
	}

	stepBackState() {
		if (!this.state.isBackwards) {
			// updated to the next iteration, but we want to make a step back
			// 0 next step, -1 currently visible, -2 step back
			this.state.index = this.state.index - 2;
		}
		if (this.state.index < 0) this.state.index = 0;
		this.state.isStep = true;
		this.state.isBackwards = true;
		this.state.isRunning = true;
	}

	stepForwardState() {
		if (this.state.isBackwards) {
			// updated to the next iteration, but we want to make a step back
			// 0 next step, +1 currently visible, +2 step forward
			this.state.index = this.state.index < 0 ? 1 : this.state.index + 2;
		}
		if (this.state.index === 0) this.state.index = 1;
		if (this.state.index >= this.state.generations.length) this.state.index = this.state.generations.length - 1;
		this.state.isStep = true;
		this.state.isBackwards = false;
		this.state.isRunning = true;
	}

	shouldDrawScene() {
		const now = this.state.animationFrameTimestamp || performance.now();
		const elapsed = now - this.state.lastTimestamp;

		if (this.state.isRunning && (elapsed >= this.state.frameDelay || (this.state.swapping )) && !this.isIndexAtEnd()) {
			this.state.lastTimestamp = now;
			return true;
		}
		return false;
	}

	setAnimationSpeed(value: number) {
		this.state.frameDelay = 2000 - value;
	}

	isIndexAtEnd() {
		return this.state.index >= this.state.generations.length;
	}

	getBarColor(generation: Generation, index: number, hideSelection: boolean): string {
		if (generation.selectionIndizes && generation.selectionIndizes.includes(index) && !hideSelection) {
			return this.state.colorTheme.accent;
		}
		return this.state.colorTheme.primary;
	};
	
	shouldBarBeDrawn(generation: Generation, index: number, hideSelection: boolean) {
		return !(hideSelection && generation.selectionIndizes?.includes(index));
	};
	
	drawBarChart(options: SceneState, hideSelection  = false) {
		options.ctx.clearRect(0, 0, options.canvas.width, options.canvas.height);
		const generation = options.generations[options.index];
		generation.data.forEach((value, index) => {
			if (!this.shouldBarBeDrawn(generation, index, hideSelection)) return;
			const {width} = getBarRect(options.canvas.width, 0, generation.data, 0);
			drawBar(options, {
				value,
				x: index * width,
				color: this.getBarColor(generation, index, hideSelection)
			});
		});
	};

	getBar(options: SceneState, index: number, backwardIndex: number): Bar {
		const {width} = getBarRect(options.canvas.width, 0, options.generations[options.index].data, 0);
		const x = options.generations[options.index].selectionIndizes[index] * width;
		const value = options.generations[options.index].data[options.generations[options.index].selectionIndizes[options.isBackwards ? index : backwardIndex]];
		return {
			x,
			value,
			color: this.state.colorTheme.accentSecondary 
		};
	};

	drawSwapAnimation(options: SceneState) {
		// draw background
		this.drawBarChart(options, true);
		if (options.b1 && options.b2) {
			// draw swapping bars
			drawBar(options, options.b1);
			drawBar(options, options.b2);
		}
	};
}
