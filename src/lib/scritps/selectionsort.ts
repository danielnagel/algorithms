import {
	SortScript 
} from './sortscript';

export class SelectionSort extends SortScript {

	protected insertionIndex: number;
	protected minIndex: number;
	protected switchAnimationStep: number;

	constructor(data: number[]) {
		super(data);
		this.insertionIndex = 0;
		this.minIndex = this.insertionIndex;
		this.switchAnimationStep = 0;
	}

	setInsertionIndex(insertionIndex: number) {
		this.insertionIndex = insertionIndex;
	}

	setMinIndex(minIndex: number) {
		this.minIndex = minIndex;
	}
	
	setSwitchAnimationStep(switchAnimationStep: number) {
		this.switchAnimationStep = switchAnimationStep;
	}

	sortAlgorithm() {
		if (this.currentSelectionIndizes.length !== 2)
			throw Error('There have to be exactly two selection indizes!');

		const [firstIndex, lastIndex] = this.currentSelectionIndizes;
        

		if (this.switchAnimationStep === 0) {
			const a = this.data[firstIndex];
			const b = this.data[lastIndex];

			if (a > b) {
				this.minIndex = lastIndex;
				this.currentSelectionIndizes = [lastIndex, lastIndex + 1];
			} else if (lastIndex + 1 < this.data.length) {
				this.currentSelectionIndizes = [firstIndex, lastIndex + 1];
			}
		}

		if (this.insertionIndex + 1 >= this.data.length) {
			this.insertionIndex = 0;
			this.minIndex = this.insertionIndex;
			this.switchAnimationStep = 0;
			this.currentSelectionIndizes = [];
		} else if (lastIndex + 1 >= this.data.length || this.switchAnimationStep > 0) {
			if (this.switchAnimationStep === 0) {
				if (this.minIndex === this.insertionIndex) {
					this.insertionIndex = this.insertionIndex + 1;
					this.minIndex = this.insertionIndex;
					if (this.insertionIndex +1 >= this.data.length) {
						this.insertionIndex = 0;
						this.minIndex = this.insertionIndex;
						this.switchAnimationStep = 0;
						this.currentSelectionIndizes = [];
					} else {
						this.currentSelectionIndizes = [this.insertionIndex, this.insertionIndex + 1];
					}
				} else {
					this.currentSelectionIndizes = [this.insertionIndex, this.minIndex];
					this.switchAnimationStep++;
				}
			} else if (this.switchAnimationStep === 1) {
				const insertionValue = this.data[this.insertionIndex];
				const minValue = this.data[this.minIndex];
				this.data[this.insertionIndex] = minValue;
				this.data[this.minIndex] = insertionValue;
				this.insertionIndex = this.insertionIndex + 1;
				this.minIndex = this.insertionIndex;
				this.switchAnimationStep++;
			} else {
				this.currentSelectionIndizes = [this.insertionIndex, this.insertionIndex + 1];
				this.switchAnimationStep = 0;
			}
		}
	}

	resetScript(data?: number[]): Generation {
		const firstGeneration = super.resetScript(data);
		this.insertionIndex = 0;
		this.minIndex = this.insertionIndex;
		this.switchAnimationStep = 0;
		return firstGeneration;
	}

	sortData(): Generation[] {
		if (this.data.length === 0)
			throw Error('There is no data available!');

		let lastGeneration = this.generations.length === 0
			? {
				data: [...this.data],
				selectionIndizes: [] 
			}
			: this.generations[this.generations.length -1];

		if (this.generations.length === 0) {
			this.generations.push(lastGeneration);
			this.currentSelectionIndizes = [0, 1];
			lastGeneration = {
				data: [...this.data],
				selectionIndizes: [...this.currentSelectionIndizes]
			};
			this.generations.push(lastGeneration);
		}
		while (this.currentSelectionIndizes.length) {
			lastGeneration = this.nextGeneration();
			this.generations.push(lastGeneration);
		}
		return this.generations;
	}
}