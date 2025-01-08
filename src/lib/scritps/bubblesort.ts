import {
	SortScript 
} from './sortscript';

export class BubbleSort extends SortScript {

	protected alreadySortedIndex: number = 0;
	protected switched: boolean = false;

	constructor(data: number[]) {
		super(data);
		this.alreadySortedIndex = this.data.length - 1;
	}

	sortAlgorithm() {
		if (this.currentSelectionIndizes.length !== 2)
			throw Error('There have to be exactly two selection indizes!');

		const [firstIndex, lastIndex] = this.currentSelectionIndizes;

		if (lastIndex >= this.data.length)
			throw Error('Selection index exceeds data size!');

		// bubblesort at current selection
		const a = this.data[firstIndex];
		const b = this.data[lastIndex];

		if (a > b) {
			// sort data, but keep current selection indizes
			this.data[firstIndex] = b;
			this.data[lastIndex] = a;
			this.switched = true;
		} else if (lastIndex === this.alreadySortedIndex) {
			// end of unsorted data and nothing switched, everything is already sorted
			if (!this.switched || this.alreadySortedIndex <= 1) {
				this.currentSelectionIndizes = [];
				this.alreadySortedIndex = 1;
				return;
			}
			// reset selection to the begining, when its at the end
			this.alreadySortedIndex = this.alreadySortedIndex - 1;
			this.currentSelectionIndizes = [0, 1];
			this.switched = false;
		} else {
			// last index is data.length when script is initialized
			this.currentSelectionIndizes = [lastIndex, lastIndex + 1];
		}
	}

	sortData(data?: number[]) {
		this.alreadySortedIndex = data? data.length -1 :this.data.length - 1;
		this.switched = false;
		return super.sortData(data);
	}

}