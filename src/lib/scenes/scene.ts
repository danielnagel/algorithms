import {
	DrawService 
} from '../services/drawService';


export class Scene<T> {
	state: SceneState<T>;
	drawService: DrawService;

	constructor(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		options: AlgorithmCanvasOptions,
	) {
		this.state = {
			canvas,
			ctx,
			algorithmType: '',
			generations: [],
			index: 0,
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
		if (options.colorTheme !== undefined) {
			this.state.colorTheme = options.colorTheme;
		}
		this.drawService = new DrawService();
	}

	draw() {}

	update() {
		this.state.index++;
		// finshed condition
		return this.state.index < this.state.generations.length;
	}

	loopState() {
		if (this.state.index <= 0) this.state.index = 1;
		if (this.state.index >= this.state.generations.length) return;
		if (this.state.isBackwards) {
			// updated to the next iteration, but we want to make a step back
			// 0 next step, +1 currently visible, +2 step forward
			this.state.index = this.state.index < 0 || this.state.index === 1 ? 1 : this.state.index + 2;
		}
		this.state.isBackwards = false;
		this.state.isStep = false;
		if (this.state.isRunning) {
			this.state.isRunning = false;
		} else {
			this.state.isRunning = true;
		}
		return this.state.isRunning;
	}

	skipBackState() {
		this.state.isBackwards = true;
		this.state.index = 0;
		this.state.isRunning = true;
		this.state.isStep = true;
		this.state.swapping = false;
		this.state.swapSpeed = undefined;
	}

	skipForwardState() {
		this.state.isBackwards = false;
		this.state.index = this.state.generations.length - 1;
		this.state.isRunning = true;
		this.state.isStep = true;
		this.state.swapping = false;
		this.state.swapSpeed = undefined;
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
		this.state.swapping = false;
		this.state.swapSpeed = undefined;
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
		if (this.state.swapping) {
			this.state.swapping = false;
			this.state.swapSpeed = undefined;
			this.state.index += 1;
		}
	}

	shouldDrawScene(now: number) {
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

}
