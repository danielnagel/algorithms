import {
	SortScript 
} from './sortscript';

export class InsertionSort extends SortScript {

	protected insertionIndex: number = 1;
	protected insertionValue: number = -1;

	setInsertionIndex(insertionIndex: number): void {
		this.insertionIndex = insertionIndex;
	}

	setInsertionValue(insertionValue: number): void {
		this.insertionValue = insertionValue;
	}

	initScript(): InsertionSortGeneration {
		const firstGeneration = super.initScript();
		this.insertionValue = this.data[this.insertionIndex];
		const insertionSortGeneration = {
			...firstGeneration,
			insertionIndex: this.insertionIndex,
			insertionValue: this.insertionValue
		};
		this.generations.push(insertionSortGeneration);
		return insertionSortGeneration;
	}

	nextGeneration(): InsertionSortGeneration {
		const nextGeneration = super.nextGeneration();
		const insertionSortGeneration = {
			...nextGeneration,
			insertionIndex: this.insertionIndex,
			insertionValue: this.insertionValue
		};
		this.generations.push(insertionSortGeneration);
		return insertionSortGeneration;
	}

	sortAlgorithm() {
		if (this.currentSelectionIndizes.length !== 2)
			throw Error('There have to be exactly two selection indizes!');

		const [firstIndex, lastIndex] = this.currentSelectionIndizes;

		if (lastIndex > this.insertionIndex || firstIndex < 0)
			throw Error('Selection index exceeds data size!');

		const a = this.data[firstIndex];
		const b = this.data[lastIndex];

		if (a > b) {
			// data needs to be sorted
			this.data[firstIndex] = b;
			this.data[lastIndex] = a;
		} else if (firstIndex === 0) {
			// "inner" loop is at the beginning
			if (this.insertionIndex + 1 === this.data.length) {
				// data is sorted
				this.insertionIndex = 1;
				this.currentSelectionIndizes = [];
			} else {
				// update insertion index
				this.insertionIndex += 1;
				this.insertionValue = this.data[this.insertionIndex];
				this.currentSelectionIndizes = [this.insertionIndex - 1, this.insertionIndex];
			}
		} else if (firstIndex > 0) {
			// "inner" loop has data left
			if (this.data[firstIndex -1] > this.insertionValue) {
				// next pair of data has to be sorted
				this.currentSelectionIndizes = [firstIndex - 1, firstIndex];
			} else if (this.insertionIndex + 1 === this.data.length) {
				// data is sorted
				this.insertionIndex = 1;
				this.currentSelectionIndizes = [];
			} else {
				// no more data to sort in this iteration, update insertion index
				this.insertionIndex += 1;
				this.insertionValue = this.data[this.insertionIndex];
				this.currentSelectionIndizes = [this.insertionIndex - 1, this.insertionIndex];
			}
		}
	}

	prevGeneration(): Generation {
		const lastGeneration = super.prevGeneration();
		const {insertionIndex, insertionValue} = lastGeneration as InsertionSortGeneration;
		this.insertionIndex = insertionIndex;
		this.insertionValue = insertionValue;
		return lastGeneration;
	}

	resetScript(data?: number[]): Generation {
		const firstGeneration = super.resetScript(data);
		this.insertionIndex = 1;
		this.insertionValue = -1;
		return firstGeneration;
	}    
}