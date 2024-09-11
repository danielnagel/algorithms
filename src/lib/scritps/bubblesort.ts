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

	initScript(): BubbleSortGeneration {
		const firstGeneration = super.initScript();
		const bubbleSortGeneration = {
			...firstGeneration,
			alreadySortedIndex: this.alreadySortedIndex,
			switched: this.switched
		};
		this.generations.push(bubbleSortGeneration);
		return bubbleSortGeneration;
	}

	nextGeneration(): BubbleSortGeneration {
		if (this.data.length > 0 && this.alreadySortedIndex <= 1 && this.currentSelectionIndizes.length === 0)
			return {
				data: this.data,
				selectionIndizes: [],
				alreadySortedIndex: this.data.length - 1,
				switched: false
			};
		
		const nextGeneration = super.nextGeneration();
		const bubbleSortGeneration = {
			...nextGeneration,
			alreadySortedIndex: this.alreadySortedIndex,
			switched: this.switched
		};
		this.generations.push(bubbleSortGeneration);
		return bubbleSortGeneration;
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

	resetScript(data?: number[]): Generation {
		const firstGeneration = super.resetScript(data);
		this.alreadySortedIndex = this.data.length - 1;
		return firstGeneration;
	}

}