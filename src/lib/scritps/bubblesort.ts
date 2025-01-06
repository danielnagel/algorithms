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

		// already correct, update selection indizes
		if (a <= b) {
			if (this.alreadySortedIndex <= 1) {
				// is the data sorted? then remove selection
				this.currentSelectionIndizes = [];
			} else if (lastIndex === this.alreadySortedIndex) {
				// end of unsorted data and nothing switched, everything is already sorted
				if (!this.switched) {
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
			return;
		}

		// sort data, but keep current selection indizes
		this.data[firstIndex] = b;
		this.data[lastIndex] = a;
		this.switched = true;
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

	resetScript(data?: number[]): Generation {
		const firstGeneration = super.resetScript(data);
		this.alreadySortedIndex = this.data.length - 1;
		this.switched = false;
		return firstGeneration;
	}

}