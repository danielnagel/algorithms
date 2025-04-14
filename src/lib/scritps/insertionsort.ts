import {
	GenerationSortScript 
} from './generationsortscript';

export class InsertionSort extends GenerationSortScript {

	protected insertionIndex: number = 1;
	protected insertionValue: number = -1;

	setInsertionIndex(insertionIndex: number): void {
		this.insertionIndex = insertionIndex;
	}

	setInsertionValue(insertionValue: number): void {
		this.insertionValue = insertionValue;
	}

	sortAlgorithm() {
		if (this.currentSelectionIndizes.length !== 2)
			throw Error('There have to be exactly two selection indizes!');

		const [firstIndex, lastIndex] = this.currentSelectionIndizes;

		if (lastIndex > this.insertionIndex)
			throw Error('Selection index exceeds data size!');

		const a = this.data[firstIndex];
		const b = this.data[lastIndex];

		if (a > b) {
			// sort
			this.data[firstIndex] = b;
			this.data[lastIndex] = a;
		} else if (firstIndex > 0 && this.data[firstIndex -1] > this.insertionValue) {
			// update seletion indizes
			this.currentSelectionIndizes = [firstIndex - 1, firstIndex];
		} else if (this.insertionIndex + 1 === this.data.length) {
			// data is sorted
			this.insertionIndex = 1;
			this.currentSelectionIndizes = [];
		} else {
			// end of data, but not started, start from the beginning
			this.insertionIndex += 1;
			this.insertionValue = this.data[this.insertionIndex];
			this.currentSelectionIndizes = [this.insertionIndex - 1, this.insertionIndex];
		}
	}

	sortData(data?: number[]) {
		this.insertionIndex = 1;
		this.insertionValue = -1;
		return super.sortData(data);
	}
}