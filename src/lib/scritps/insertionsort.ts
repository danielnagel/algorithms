export class InsertionSort implements Script {
	// TODO: remove duplicate
	protected data: number[] = [];
	// TODO: remove duplicate
	protected generations: Generation[] = [];
	// TODO: remove duplicate
	protected currentSelectionIndizes: number[] = [];
	// TODO: remove duplicate
	protected alreadySortedIndex: number = 0;

	protected insertionIndex: number = 1;
	protected insertionValue: number = -11;

	constructor(data: number[]) {
		this.data = data;
		this.alreadySortedIndex = this.data.length - 1;
	}

	// TODO: remove duplicate
	getData(): number[] {
		return this.data;
	}

	// TODO: remove duplicate
	getSelectionIndizes(): number[] {
		return this.currentSelectionIndizes;
	}

	// TODO: remove duplicate
	setSelectionIndizes(selection: number[]): void {
		this.currentSelectionIndizes = selection;
	}

	// TODO: remove duplicate
	getGenerations(): Generation[] {
		return this.generations;
	}

	// TODO: remove duplicate
	setGenerations(generations: Generation[]): void {
		this.generations = generations;
	}

	initScript(): Generation {
		if (this.data.length === 0)
			throw Error('There is no data available!');

		this.currentSelectionIndizes = [0, 1];
		this.insertionValue = this.data[this.insertionIndex];
		const firstGeneration: Generation = {
			data: [...this.data],
			selectionIndizes: [...this.currentSelectionIndizes] 
		};
		this.generations.push(firstGeneration);
		return firstGeneration;
	}

	// TODO: remove duplicate
	nextGeneration(): Generation {
		if (this.data.length === 0)
			throw Error('There is no data available!');

		if (this.alreadySortedIndex <= 1 && this.currentSelectionIndizes.length === 0)
			return {
				data: this.data,
				selectionIndizes: []
			};


		if (this.currentSelectionIndizes.length === 0)
			return this.initScript();

		this.sortAlgorithm();

		const newGeneration: Generation = {
			data: [...this.data],
			selectionIndizes: [...this.currentSelectionIndizes] 
		};
		this.generations.push(newGeneration);
		return newGeneration;
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
		throw new Error('Method not implemented.');
	}
	// TODO: remove duplicate
	resetScript(data?: number[]): Generation {
		if (this.data.length === 0 && (!data || data.length === 0))
			throw Error('There is no data available!');

		if (this.generations.length === 0) {
			this.currentSelectionIndizes = [];
			// no generations, return current state
			return {
				data: data ? data : this.data,
				selectionIndizes: [] 
			};
		}
		const firstGeneration = this.generations[0];
		if (data) {
			firstGeneration.data = [...data];
		}
		firstGeneration.selectionIndizes = [];
		this.data = [...firstGeneration.data];
		this.alreadySortedIndex = this.data.length - 1;
		this.generations = [];
		this.currentSelectionIndizes = [];
		return firstGeneration;
	}
	finishScript(): Generation {
		throw new Error('Method not implemented.');
	}
    
}