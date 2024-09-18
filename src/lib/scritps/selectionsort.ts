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

	nextGeneration(): SelectionSortGeneration {
		const nextGeneration = super.nextGeneration();
		const selectionSortGeneration = {
			...nextGeneration,
			insertionIndex: this.insertionIndex,
			minIndex: this.minIndex,
			switchAnimationStep: this.switchAnimationStep
		};
		this.generations.push(selectionSortGeneration);
		return selectionSortGeneration;
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
				this.currentSelectionIndizes = [this.insertionIndex, this.minIndex];
				this.switchAnimationStep++;
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

	prevGeneration(): Generation {
		const lastGeneration = super.prevGeneration();
		const {insertionIndex, minIndex, switchAnimationStep} = lastGeneration as SelectionSortGeneration;
		this.insertionIndex = insertionIndex;
		this.minIndex = minIndex;
		this.switchAnimationStep = switchAnimationStep;
		return lastGeneration;
	}

	resetScript(data?: number[]): Generation {
		const firstGeneration = super.resetScript(data);
		this.insertionIndex = 0;
		this.minIndex = this.insertionIndex;
		this.switchAnimationStep = 0;
		return firstGeneration;
	}

	initScript(): SelectionSortGeneration {
		const firstGeneration = super.initScript();
		this.insertionIndex = 0;
		this.minIndex = this.insertionIndex;
		this.switchAnimationStep = 0;
		const selectionSortGeneration = {
			...firstGeneration,
			insertionIndex: this.insertionIndex,
			minIndex: this.minIndex,
			switchAnimationStep: this.switchAnimationStep
		};
		this.generations.push(selectionSortGeneration);
		return selectionSortGeneration;
	}
}